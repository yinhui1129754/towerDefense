import { ScrollBox } from "../ui/scrollbox"

export default {
  create(name:string) {
    const sb = new ScrollBox()
    sb.name = name
    sb.style.backgroundColor = "rgba(50,50,50,0.8)"
    sb.style.borderSize = 1
    sb.style.borderColor = "#ffffff"
    sb.style.borderShowInfoTop = false
    return sb
  },
  setPos(x:number, y:number, ex:any) {
    ex.x = x
    ex.y = y
  },
  setSize(w:number, h:number, ex:any) {
    ex.width = w
    ex.height = h
    this.update(ex)
  },
  update(ex:any) {

  }
}
