
import Main from '../../../src/core/main'
import './../../../src/behavior/index'
import GameData from './class/GameData'
import './less/main.less'
import genUtils from './utils/utils'

const m = new Main({})
window.testMain = m
window.MainStruct = Main
const gamedata = new GameData()
function clear() {
  gamedata.clear()
}
const box = genUtils.$('.bottom-content')
genUtils.$('[data-top-menu="opengamedata"]').on('click', function() {
  genUtils.$.post('http://127.0.0.1:10005/file', { methods: 'read', path: '/gameData/gameData.json' }, function(d:any) {
    clear()
    const json = JSON.parse(d)
    gamedata.setJson(json)
    gamedata.showHeader()
    gamedata.setShowType('botany')
    gamedata.setShowChild(0)
  })
})
