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

const floor = new Entity()
floor.addComponent(new BoxShape())
floor.addComponent(new Transform({
  position: new Vector3(16 / 2, .1, 16 / 2),
  scale: new Vector3(16, .1, 16)
}))
engine.addEntity(floor)

initRegistry()

//// AI NPC initial init
initConfig()
initDialogs()


//// AI NPC initial init
setupNPC()

REGISTRY.lobbyScene = new LobbyScene()

REGISTRY.lobbyScene.init()
//REGISTRY.lobbyScene.initArena(true), lazy load?


REGISTRY.onConnectActions = (room: Room<any>, eventName: string) => {
  //npcConn.onNpcRoomConnect(room)
  lobbyConn.onNpcRoomConnect(room)
}

//docs say will fire after 1 minute
onIdleStateChangedObservable.add(({ isIdle }) => {
  log("Idle State change: ", isIdle)
  if (isIdle) {
    //prevent too many connnections for AFKers, it will auto reconnect if u interact with something again
    REGISTRY.lobbyScene.disconnectHost()
  }
})


