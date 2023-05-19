import { Room, RoomAvailable } from "colyseus.js";
import { GAME_STATE } from "src/state";
import * as clientState from "src/aiNpc/lobby-scene/connection/state/client-state-spec";
import * as serverState from "src/aiNpc/lobby-scene/connection/state/server-state-spec";
import * as serverStateSpec from "src/aiNpc/lobby-scene/connection/state/server-state-spec";

import * as utils from "@dcl/ecs-scene-utils";
import { createEntityForSound, createEntitySound } from "src/utils/utilities";
import * as ui from "@dcl/ui-scene-utils";

import { CONFIG } from "src/config";

import { REGISTRY } from "src/registry";
import { Dialog, ButtonData } from "@dcl/npc-scene-utils";
import { ChatNext, ChatPart, streamedMsgs } from "src/aiNpc/npc/streamedMsgs";
import { showInputOverlay } from "src/aiNpc/npc/customNPCUI";
import { closeAllInteractions, createMessageObject, sendMsgToAI } from "src/aiNpc/npc/connectedUtils";

const canvas = ui.canvas

const debugText = new UIText(canvas)
debugText.fontSize = 8//15
debugText.width = 120
debugText.height = 30
debugText.hTextAlign = "right";
debugText.hAlign = "right"
debugText.vAlign = "bottom"
debugText.positionY = -20

function updateDebugText(player: serverStateSpec.PlayerState) {
  debugText.value =
    "currentCharacterId:" + JSON.stringify(player.remoteClientCache.currentCharacterId)
    + "\ncurrentSceneTrigger:" + JSON.stringify(player.remoteClientCache.currentSceneTrigger)
}

export async function onNpcRoomConnect(room: Room) {
  GAME_STATE.setGameRoom(room);

  GAME_STATE.setGameConnected("connected");

  onLevelConnect(room);
}

export function onDisconnect(room: Room, code?: number) {
  GAME_STATE.setGameConnected("disconnected");
}

function convertAndPlayAudio(packet: serverStateSpec.ChatPacket) {
  const sourceName = packet.routing.source.name
  const payloadId = packet.packetId.packetId
  const base64Audio = packet.audio.chunk
  log("convertAndPlayAudio", payloadId)

  executeTask(async () => {
    //base64 is too big, passing payloadId and server will look it up and convert it
    const soundClip = new AudioStream(CONFIG.COLYSEUS_HTTP_ENDPOINT + "/audio-base64-binary?payloadId=" + encodeURIComponent(payloadId))
    const AUDIO_VOLUME = 1
    const loop = false
    const soundEntity = createEntitySound("npcSound", soundClip, AUDIO_VOLUME, loop)
    REGISTRY.activeNPCSound.set(sourceName, soundEntity)
  })
}

function onLevelConnect(room: Room<clientState.NpcGameRoomState>) {
  REGISTRY.lobbyScene.onConnectHost(room)

  room.onMessage("grid", (data) => {
    //log("GRID DATA: " + JSON.parse(data.grid)[0][0].infectionLevel)
    // log("GRID CELL: " + JSON.parse(data.grid)[0][0].infectionLevel)
    //REGISTRY.lobbyScene.grid.updateColumns(JSON.parse(data.grid))
  })

  room.onMessage("inGameMsg", (data) => {
    log("room.msg.inGameMsg", data);
    if (data !== undefined && data.msg === undefined) {
      GAME_STATE.notifyInGameMsg(data);
      ui.displayAnnouncement(data, 8, Color4.White(), 60);
    } else {
      GAME_STATE.notifyInGameMsg(data.msg);
      ui.displayAnnouncement(data.msg, data.duration !== undefined ? data.duration : 8, Color4.White(), 60);
    }
  });

  let lastInteractionId = ""

  function createDialog(chatPart: ChatNext) {
    log("createDialog", "ENTRY", chatPart)
    //debugger    

    if (chatPart.text === undefined) {
      //if got here too late, order is messed up
      log("createDialog", "chatPart.end?", chatPart, "did not have text. waiting for more")
      //debugger
      streamedMsgs.waitingForMore = true
      return;
    }
    const dialog = chatPart.text.createNPCDialog()

    showInputOverlay(false)

    dialog.triggeredByNext = () => {
      const NO_LOOP = true
      REGISTRY.activeNPC.npc.playAnimation(REGISTRY.activeNPC.npcAnimations.TALK.name, NO_LOOP, REGISTRY.activeNPC.npcAnimations.TALK.duration)

      closeAllInteractions({ exclude: REGISTRY.activeNPC })
      utils.setTimeout(200, () => {
        if (!chatPart.endOfInteraction && !streamedMsgs.hasNextAudioNText()) {
          log("createDialog", "chatPart.end.hasNext?", chatPart, ". waiting for more")
          streamedMsgs.waitingForMore = true
          return;
        }
        const nextPart = streamedMsgs.next()
        if (nextPart.text) {
          const nextDialog = createDialog(nextPart)
          REGISTRY.activeNPC.talk([nextDialog]);
          if (true) {
            if (nextPart.audio && nextPart.audio.packet.audio.chunk) {
              log("onMessage.structuredMsg.audio", nextPart.audio);
              convertAndPlayAudio(nextPart.audio.packet)
            }
          }
        } else {
          const checkRes = streamedMsgs._next(false, chatPart.indexStart)
          if (!chatPart.endOfInteraction && checkRes.endOfInteraction) {
            log("createDialog", "chatPart.end.checkRes", "thought it was not end but it is after checking latest packets")
          }
          if (chatPart.endOfInteraction || checkRes.endOfInteraction) {
            log("createDialog", "chatPart.end", chatPart, "end of dialog", dialog)
            streamedMsgs.started = false
            streamedMsgs.waitingForMore = false

            REGISTRY.activeNPC.endOfRemoteInteractionStream()
          } else {
            streamedMsgs.waitingForMore = true
            log("createDialog", "chatPart.end?", chatPart, "not end of chat but end of values to display. waiting for more", dialog)
          }
        }
      })
    }

    log("createDialog", "RETURN", "chatPart", chatPart, "dialog", dialog)

    return dialog
  }

  room.state.players.onAdd = (player: clientState.PlayerState, sessionId: string) => {
    log("room.state.players.onAdd", player);

    player.listen("remoteClientCache", (remoteClientCache: clientState.InWorldConnectionClientCacheState) => {
      log("room.state.players.listen.remoteClientCache", remoteClientCache);
      updateDebugText(player)
    })

    player.remoteClientCache.onChange = (remoteClientCache: serverState.InWorldConnectionClientCacheState) => {
      log("room.state.players.onChange.remoteClientCache", remoteClientCache);
      updateDebugText(player)
    }
  }

  room.onMessage("structuredMsg", (msg: serverStateSpec.ChatPacket) => {
    log("onMessage.structuredMsg", msg);

    let newInteraction = false
    newInteraction = lastInteractionId !== msg.packetId.interactionId
    lastInteractionId = msg.packetId.interactionId

    const chatPart = new ChatPart(msg)
    streamedMsgs.add(chatPart)

    if (REGISTRY.activeNPC && (streamedMsgs.started == false || streamedMsgs.waitingForMore) && streamedMsgs.hasNextAudioNText()) {
      log("structuredMsg", "createDialog", "chatPart.start", chatPart)
      const nextPart = streamedMsgs.next()

      streamedMsgs.started = true
      streamedMsgs.waitingForMore = false
      const dialog = createDialog(nextPart)
      if (dialog) {
        REGISTRY.activeNPC.talk([dialog]);
      } else {
        log("structuredMsg", "createDialog", "no dialog to show,probably just a control msg", dialog, "chatPart", chatPart, "nextPart", nextPart)
      }

      if (true) {
        if (nextPart.audio && nextPart.audio.packet.audio.chunk) {
          log("onMessage.structuredMsg.audio", msg);
          convertAndPlayAudio(nextPart.audio.packet)
        }
      }
    } else {
      log("structuredMsg", "createDialog", "chatPart.onmsg", "started:", streamedMsgs.started, "waitingForMore:", streamedMsgs.waitingForMore, "hasNextAudioNText", streamedMsgs.hasNextAudioNText())
    }

  });

  room.onMessage("inGameMsg", (data: string | serverStateSpec.ShowMessage) => {
    log("room.msg.inGameMsg", data);

    if (typeof data === "string") {
      GAME_STATE.notifyInGameMsg(data);
      ui.displayAnnouncement(data, 8, Color4.White(), 60);
    } else {
      GAME_STATE.notifyInGameMsg(data.message);
      ui.displayAnnouncement(
        data.title + "\n" + data.message,
        data.duration !== undefined ? data.duration : 8, data.isError ? Color4.Red() : Color4.White(), 60
      );
    }
  });

  room.onMessage("showError", (data: serverStateSpec.ShowMessage) => {
    log("onMessage.showError", data);
    ui.displayAnnouncement(data.title + "\n" + data.message,
      data.duration !== undefined ? data.duration : 8, data.isError ? Color4.Red() : Color4.White(), 40);
    log("Received onMessage.showError");
  });

  room.onMessage("serverTime", (data) => {
    //log("onMessage.serverTime", data);
    //log("SERVERTIME: " + data.time)
    REGISTRY.serverTime = data.time
  })

  room.onMessage("grid", (data) => {
    //log("onMessage.grid", data);
    //log("GRID DATA: " + JSON.parse(data.grid)[0][0].infectionLevel)
    // log("GRID CELL: " + JSON.parse(data.grid)[0][0].infectionLevel)
    //REGISTRY.lobbyScene.grid.updateColumns(JSON.parse(data.grid)) 
  })

  room.onLeave(() => {
    log("Bye, bye!");
  });

  room.onLeave((code) => {
    log("onLeave, code =>", code);
  });
}