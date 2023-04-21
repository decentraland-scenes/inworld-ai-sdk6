import { setupNPC } from 'src/aiNpc/npc/npcSetup'
import { REGISTRY, initRegistry } from './registry'
import { Room } from 'colyseus.js'
import * as lobbyConn from 'src/aiNpc/lobby-scene/connection/onConnect';
import { LobbyScene } from 'src/aiNpc/lobby-scene/lobbyScene'
import { CONFIG, initConfig } from './config'
import { initDialogs } from 'src/aiNpc/npc/npcDialog'


//////// LOG PLAYER POSITION

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, true, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
  // if(e.hit){
  //   console.log(
  //     'ENT: ',  engine.entities[e.hit.entityId],
  //     'POS:', engine.entities[e.hit.entityId].getComponent(Transform)
  //   )
  // }
})


initRegistry()

//// AI NPC initial init
initConfig()
initDialogs()


    //// AI NPC initial init
    setupNPC()

    REGISTRY.lobbyScene = new LobbyScene()

    REGISTRY.lobbyScene.init()
    REGISTRY.lobbyScene.initArena(true)
  
  
    REGISTRY.onConnectActions = (room: Room<any>, eventName: string) => {
      //npcConn.onNpcRoomConnect(room)
      lobbyConn.onNpcRoomConnect(room)
    }
    