import { Room } from "colyseus.js";
import { GAME_STATE } from "src/state";
import * as clientState from "src/aiNpc/lobby-scene/connection/state/client-state-spec";
import * as serverStateSpec from "src/aiNpc/lobby-scene/connection/state/server-state-spec";

import * as ui from "@dcl/ui-scene-utils";

import { REGISTRY } from "src/registry";

import { showInputOverlay } from "src/aiNpc/npc/customNPCUI";
import { RemoteNpc } from "./remoteNpc";

/**
 * NOTE endInteraction results in player going into STANDING state, need way to resume last action
 * @param ignore 
 */
export function closeAllInteractions(opts?: { exclude?: RemoteNpc, resumeLastActivity?: boolean }) {
  for (const p of REGISTRY.allNPCs) {
    if (opts?.exclude === undefined || p != opts.exclude) {
      log("closeAllInteractions ", p.name)
      p.endInteraction()
    } else {
      p.npc.dialog.closeDialogWindow()
    }
  }
}

export function sendMsgToAI(msg: serverStateSpec.ChatMessage) {
  if (msg === undefined || msg.text.text.trim().length === 0) {
    ui.displayAnnouncement("cannot send empty message")
    return
  }
  log("sendMsgToAI", msg)
  showInputOverlay(false)
  REGISTRY.activeNPC.thinking([REGISTRY.askWaitingForResponse])
  if (GAME_STATE.gameRoom) GAME_STATE.gameRoom.send("message", msg)
}

let lastCharacterId = undefined

export function createMessageObject(msgText: string, characterId: serverStateSpec.CharacterId, room: Room<clientState.NpcGameRoomState>) {
  const chatMessage: serverStateSpec.ChatMessage = new serverStateSpec.ChatMessage({
    date: new Date().toUTCString(),
    packetId: { interactionId: "", packetId: "", utteranceId: "" },
    type: serverStateSpec.ChatPacketType.TEXT,
    text: { text: msgText, final: true },
    routing:
    {
      source: { isCharacter: false, isPlayer: true, name: room.sessionId, xId: { resourceName: room.sessionId } }
      , target: { isCharacter: true, isPlayer: false, name: "", xId: characterId ? characterId : lastCharacterId }
    },
  })
  if (!characterId) {
    log("createMessageObject using lastCharacterId", lastCharacterId)
  }
  if (characterId) lastCharacterId = characterId
  return chatMessage
}