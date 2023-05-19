import { Dialog } from '@dcl/npc-scene-utils'
import { REGISTRY } from "src/registry";

const askWaitingForResponse: Dialog = {
  name: "waiting-for-response",
  text: "...",
  //offsetX: 60,
  isQuestion: false,
  skipable: false,
  isEndOfDialog: true
}

export function initDialogs() {
  REGISTRY.askWaitingForResponse = askWaitingForResponse
}