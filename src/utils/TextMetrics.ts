import { TextStyle, TextMetrics } from "pixi.js"
type CharacterWidthCache = { [key: string]: number };
export type TextStyleWhiteSpace = "normal"|"pre"|"pre-line";
export const contextSettings = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: true
}
const defObj = {
  collapseNewlines(whiteSpace: TextStyleWhiteSpace): boolean {
    return (whiteSpace === "normal")
  },
  collapseSpaces(whiteSpace: TextStyleWhiteSpace): boolean {
    return (whiteSpace === "normal" || whiteSpace === "pre-line")
  },
  isNewline(char: string): boolean {
    if (typeof char !== "string") {
      return false
    }

    return TextMetrics._newlines.includes(char.charCodeAt(0))
  },
  addLine(line: string, newLine = true): string {
    line = defObj.trimRight(line)

    line = (newLine) ? `${line}\n` : line

    return line
  },
  trimRight(text: string): string {
    if (typeof text !== "string") {
      return ""
    }

    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i]

      if (!TextMetrics.isBreakingSpace(char)) {
        break
      }

      text = text.slice(0, -1)
    }

    return text
  },
  tokenize(text: string): string[] {
    const tokens: string[] = []
    let token = ""

    if (typeof text !== "string") {
      return tokens
    }

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]

      if (TextMetrics.isBreakingSpace(char, nextChar) || defObj.isNewline(char)) {
        if (token !== "") {
          tokens.push(token)
          token = ""
        }

        tokens.push(char)

        continue
      }

      token += char
    }

    if (token !== "") {
      tokens.push(token)
    }

    return tokens
  },
  getFromCache(key: string, letterSpacing: number, cache: CharacterWidthCache,
    context: CanvasRenderingContext2D): number {
    let width = cache[key]

    if (typeof width !== "number") {
      const spacing = ((key.length) * letterSpacing)

      width = context.measureText(key).width + spacing
      cache[key] = width
    }

    return width
  },
  wordWrap: function(
    text: string,
    style: TextStyle,
    canvas: HTMLCanvasElement
  ): string {
    const context = canvas.getContext("2d", contextSettings) as CanvasRenderingContext2D

    let width = 0
    let line = ""
    let lines = ""

    const cache: CharacterWidthCache = Object.create(null)
    const { letterSpacing, whiteSpace } = style

    // How to handle whitespaces
    const collapseSpaces = defObj.collapseSpaces(whiteSpace)
    const collapseNewlines = defObj.collapseNewlines(whiteSpace)

    // whether or not spaces may be added to the beginning of lines
    let canPrependSpaces = !collapseSpaces

    // There is letterSpacing after every char except the last one
    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
    // so for convenience the above needs to be compared to width + 1 extra letterSpace
    // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
    // ________________________________________________
    // And then the final space is simply no appended to each line
    const wordWrapWidth = style.wordWrapWidth + letterSpacing

    // break text into words, spaces and newline chars
    const tokens = defObj.tokenize(text)

    for (let i = 0; i < tokens.length; i++) {
      // get the word, space or newlineChar
      let token = tokens[i]

      // if word is a new line
      if (defObj.isNewline(token)) {
        // keep the new line
        if (!collapseNewlines) {
          lines += defObj.addLine(line)
          canPrependSpaces = !collapseSpaces
          line = ""
          width = 0
          continue
        }

        // if we should collapse new lines
        // we simply convert it into a space
        token = " "
      }

      // if we should collapse repeated whitespaces
      if (collapseSpaces) {
        // check both this and the last tokens for spaces
        const currIsBreakingSpace = TextMetrics.isBreakingSpace(token)
        const lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1])

        if (currIsBreakingSpace && lastIsBreakingSpace) {
          continue
        }
      }

      // get word width from cache if possible
      const tokenWidth = defObj.getFromCache(token, letterSpacing, cache, context)

      // word is longer than desired bounds
      if (tokenWidth > wordWrapWidth) {
        // if we are not already at the beginning of a line
        if (line !== "") {
          // start newlines for overflow words
          lines += defObj.addLine(line)
          line = ""
          width = 0
        }

        // break large word over multiple lines
        if (TextMetrics.canBreakWords(token, style.breakWords)) {
          // break word into characters
          const characters = TextMetrics.wordWrapSplit(token)

          // loop the characters
          for (let j = 0; j < characters.length; j++) {
            let char = characters[j]

            let k = 1
            // we are not at the end of the token

            while (characters[j + k]) {
              const nextChar = characters[j + k]
              const lastChar = char[char.length - 1]

              // should not split chars
              if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                // combine chars & move forward one
                char += nextChar
              } else {
                break
              }

              k++
            }

            j += char.length - 1

            const characterWidth = defObj.getFromCache(char, letterSpacing, cache, context)

            if (characterWidth + width > wordWrapWidth) {
              lines += defObj.addLine(line)
              canPrependSpaces = false
              line = ""
              width = 0
            }

            line += char
            width += characterWidth
          }
        } else {
          // if there are words in this line already
          // finish that line and start a new one
          if (line.length > 0) {
            lines += defObj.addLine(line)
            line = ""
            width = 0
          }

          const isLastToken = i === tokens.length - 1

          // give it its own line if it's not the end
          lines += defObj.addLine(token, !isLastToken)
          canPrependSpaces = false
          line = ""
          width = 0
        }
      } else {
        // word won't fit because of existing words
        // start a new line
        if (tokenWidth + width > wordWrapWidth) {
          // if its a space we don't want it
          canPrependSpaces = false

          // add a new line
          lines += defObj.addLine(line)

          // start a new line
          line = ""
          width = 0
        }

        // don't add spaces to the beginning of lines
        if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
          // add the word to the current line
          line += token

          // update width counter
          width += tokenWidth
        }
      }
    }

    lines += defObj.addLine(line, false)

    return lines
  }
}

export default defObj
