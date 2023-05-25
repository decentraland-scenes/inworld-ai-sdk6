import { joinOrCreateRoomAsync } from "src/connection/connect-flow";
import { REGISTRY } from "src/registry";
import * as serverStateSpec from "src/aiNpc/lobby-scene/connection/state/server-state-spec";
import { Room } from "colyseus.js";
import * as clientState from "src/aiNpc/lobby-scene/connection/state/client-state-spec";

import { GAME_STATE } from "src/state";

import { streamedMsgs } from "../npc/streamedMsgs";
import { RemoteNpc } from "../npc/remoteNpc";
import { closeAllInteractions, createMessageObject, sendMsgToAI } from "../npc/connectedUtils";
import { disconnect } from "src/connection/connection";

export class LobbyScene {

  pendingConvoWithNPC: RemoteNpc
  pendingConvoActionWithNPC: () => void

  init() {
    const host = this
    for (const p of REGISTRY.allNPCs) {
      p.npc.onActivate = () => {
        log("NPC", p.name, "activated")

        this.pendingConvoWithNPC = undefined
        this.pendingConvoActionWithNPC = undefined
        REGISTRY.activeNPC = p

        closeAllInteractions({ exclude: REGISTRY.activeNPC })

        p.thinking([REGISTRY.askWaitingForResponse])

        streamedMsgs.reset()

        if (GAME_STATE.gameRoom && GAME_STATE.gameConnected === 'connected') {
          host.startConvoWith(p)
        } else {
          log("NPC", p.name, "GAME_STATE.gameConnected", GAME_STATE.gameConnected, "connect first")
          this.pendingConvoWithNPC = p
          host.initArena(false)
        }
      }
    }
  }

  startConvoWith(npc: RemoteNpc) {
    log("NPC", npc.name, "GAME_STATE.gameConnected", GAME_STATE.gameConnected, "sendMsgToAI")

    this.pendingConvoWithNPC = undefined
    this.pendingConvoActionWithNPC = undefined

    const randomMsgs = ["Hello!", "Greetings"]
    const msgText = randomMsgs[Math.floor(Math.random() * randomMsgs.length)]
    const chatMessage: serverStateSpec.ChatMessage = createMessageObject(msgText, { resourceName: npc.config.resourceName }, GAME_STATE.gameRoom)
    sendMsgToAI(chatMessage)
  }

  resetBattleArena() {
    const METHOD_NAME = "resetBattleArena"
    log(METHOD_NAME, "ENTRY")
  }

  initArena(force: boolean) {
    const METHOD_NAME = "initArena"
    log(METHOD_NAME, "ENTRY", force)

    this.resetBattleArena()

    const npcDataOptions: serverStateSpec.NpcRoomDataOptions = {
      levelId: "",
    }
    const connectOptions: any = {
      npcDataOptions: npcDataOptions,
    };

    connectOptions.playFabData = {
    };

    const roomName = "genesis_plaza"
    joinOrCreateRoomAsync(roomName, connectOptions)
  }

  onConnectHost(room: Room<clientState.NpcGameRoomState>) {
    GAME_STATE.gameRoom = room;

    if (this.pendingConvoWithNPC) {
      this.startConvoWith(this.pendingConvoWithNPC)
      this.pendingConvoWithNPC = undefined
    }
    if (this.pendingConvoActionWithNPC) {
      this.pendingConvoActionWithNPC()
    }
  }

  disconnectHost() {
    const METHOD_NAME = "endBattle"
    log(METHOD_NAME, "ENTRY")
    disconnect(true)
  }
}