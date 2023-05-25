import { GAME_STATE } from "src/state";
import * as serverStateSpec from "src/aiNpc/lobby-scene/connection/state/server-state-spec";

import * as ui from "@dcl/ui-scene-utils";

import { REGISTRY } from "src/registry";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";

import { closeAllInteractions, createMessageObject, sendMsgToAI } from "./connectedUtils";
import { QuestionData } from "./remoteNpc";

const PROMPT_WIDTH = 600

//make undefined for fall back default atlas
const ATLAS_STANDARD = false
const customAtlas = undefined
const CUSTOM_BLACK_BUTTON_SECTION = {
  sourceWidth: 680,
  sourceHeight: 62,
  sourceLeft: 0,
  sourceTop: 442
}
const CUSTOM_GOLD_BUTTON_SECTION = {
  sourceWidth: 232,
  sourceHeight: 42,
  sourceLeft: 0,
  sourceTop: 555
}
const CUSTOM_GRAY_BUTTON_SECTION = {
  sourceWidth: 232,
  sourceHeight: 42,
  sourceLeft: 0,
  sourceTop: 513
}
const buttonsSyle = ui.ButtonStyles.DARK

const askSomethingElse = new ui.CustomPrompt(ui.PromptStyles.DARKLARGE, PROMPT_WIDTH, 180)
askSomethingElse.hide()

askSomethingElse.background.vAlign = 'bottom'
askSomethingElse.closeIcon.onClick = new OnPointerDown(() => {
  log("askSomethingElse.closeIcon.onClick")
  showInputOverlay(false)
  REGISTRY.activeNPC?.goodbye()
})

const portait = askSomethingElse.addIcon('images/portraits/catguy.png', -PROMPT_WIDTH / 2, 0, 200, 200)

const ASK_BTN_FONT_SIZE = 12

const QUESTION_LIST: QuestionData[] = [
  { displayQuestion: "Sing me a song!", queryToAi: "Sing me a song!" },
  { displayQuestion: "Recite me a poem!", queryToAi: "Recite me a poem!" },
  { displayQuestion: "Tell me a joke!", queryToAi: "Tell me a joke!" },
  { displayQuestion: "Your Favorite music?", queryToAi: "What is your favorite music?" },
  { displayQuestion: "Do you have any pets?", queryToAi: "Do you have any pets?" },
  { displayQuestion: "What can I do here?", queryToAi: "What can I do here?" },
  { displayQuestion: "What is a wearable!", queryToAi: "What is a wearable!" },
  { displayQuestion: "What is an emote!", queryToAi: "What is an emote!" }
]
const askButtonsList: ui.CustomPromptButton[] = []
askSomethingElse.addText("Ask Me Anything!", 0, 75, Color4.White(), 16)


const INPUT_POS_Y = 27
const BUTTON_POS_Y = -15
const BUTTON_HEIGHT = 28
const BUTTON_WIDTH = 135
const BUTTON_OFFSET_Y = 5

const BUTTON_COLUMN_FULL_WIDTH = 180
const BUTTON_COLUMN_SPACING = BUTTON_COLUMN_FULL_WIDTH / 2
const BUTTON_OFFSET_X = 50
const BUTTON_ROWS_AMOUNT = 1
const INPUT_BOX_WIDTH = 412
const INPUT_BOX_HEIGHT = 30
const NEXT_BUTTON_HEIGHT = BUTTON_HEIGHT
const NEXT_BACK_WIDTH = BUTTON_WIDTH//120//30

askSomethingElse.addText(
  "Disclaimer: Beta. Power by a 3rd party AI. You may receive inaccurate information which is not \nendorsed by the Foundation or the Decentraland community.  Do not share personal information."
  , 0, -50, Color4.White(), 8
)

const askButton1 = askSomethingElse.addButton("Q1", BUTTON_COLUMN_SPACING * -1 - BUTTON_OFFSET_X, BUTTON_POS_Y, () => {
  sendMessageToAi("Q1")
}, buttonsSyle)

const askButton2 = askSomethingElse.addButton("Q2", 0, BUTTON_POS_Y, () => {
  sendMessageToAi("Q2")
}, buttonsSyle)

const askButton3 = BUTTON_ROWS_AMOUNT < 2 ? undefined : askSomethingElse.addButton("Q1", BUTTON_COLUMN_SPACING * -1 - BUTTON_OFFSET_X, BUTTON_POS_Y - BUTTON_HEIGHT - BUTTON_OFFSET_Y, () => {
  sendMessageToAi("Q1")
}, buttonsSyle)

const askButton4 = BUTTON_ROWS_AMOUNT < 2 ? undefined : askSomethingElse.addButton("Q2", BUTTON_COLUMN_SPACING + BUTTON_OFFSET_X, BUTTON_POS_Y - BUTTON_HEIGHT - BUTTON_OFFSET_Y, () => {
  sendMessageToAi("Q2")
}, buttonsSyle)

const askButtonNext = askSomethingElse.addButton("More Examples", BUTTON_COLUMN_SPACING + BUTTON_OFFSET_X, BUTTON_POS_Y, () => {
  nextPageOfQuestions(1)
}, buttonsSyle)

for (const b of [askButtonNext]) {
  b.label.width = NEXT_BACK_WIDTH
  b.image.height = NEXT_BUTTON_HEIGHT
  b.image.width = NEXT_BACK_WIDTH
  b.label.fontSize = 12

  if (customAtlas) {
    b.image.source = customAtlas
    if (ATLAS_STANDARD) {
      setSection(b.image, resources.buttons.squareGold)
    } else {
      setSection(b.image, CUSTOM_GRAY_BUTTON_SECTION)
    }
  }
}

askButtonsList.push(askButton1)
askButtonsList.push(askButton2)

if (BUTTON_ROWS_AMOUNT > 1) {
  askButtonsList.push(askButton3)
  askButtonsList.push(askButton4)
}

let currentQuestionIndex = -1
function nextPageOfQuestions(dir: number) {
  //debugger
  //counter+=dir
  let loopCnt = 0
  for (const b of askButtonsList) {
    currentQuestionIndex += dir
    if (currentQuestionIndex >= QUESTION_LIST.length) {
      currentQuestionIndex = 0
    }
    if (currentQuestionIndex < 0) {
      currentQuestionIndex = QUESTION_LIST.length - 1
    }

    const q = QUESTION_LIST[currentQuestionIndex]
    b.label.fontSize = ASK_BTN_FONT_SIZE
    b.label.value = q.displayQuestion
    b.image.height = BUTTON_HEIGHT
    b.image.width = BUTTON_WIDTH
    b.image.onClick = new OnPointerDown(() => {
      sendMessageToAi(q.queryToAi)
    })

    if (customAtlas) {
      b.image.source = customAtlas
      if (loopCnt === 0) {
        if (ATLAS_STANDARD) {
          setSection(b.image, resources.buttons.roundGold)
        } else {
          setSection(b.image, {
            sourceWidth: 232,
            sourceHeight: 40,
            sourceLeft: 0,
            sourceTop: 558
          })
        }
      }
      if (loopCnt === 1) {
        if (ATLAS_STANDARD) {
          setSection(b.image, resources.buttons.roundGold)
        } else {
          setSection(b.image, CUSTOM_GOLD_BUTTON_SECTION)
        }
      }
    }
    loopCnt++
  }
}

nextPageOfQuestions(1)

export function showInputOverlay(val: boolean) {
  if (val) {
    portait.image.positionX = -PROMPT_WIDTH / 2 + -20
    if (REGISTRY.activeNPC) {
      portait.image.source = REGISTRY.activeNPC.npc.dialog.portrait.source
      portait.image.width = REGISTRY.activeNPC.npc.dialog.portrait.width
      portait.image.height = REGISTRY.activeNPC.npc.dialog.portrait.height
      portait.image.sourceHeight = REGISTRY.activeNPC.npc.dialog.portrait.sourceHeight
      portait.image.sourceWidth = REGISTRY.activeNPC.npc.dialog.portrait.sourceWidth
      portait.image.sourceTop = REGISTRY.activeNPC.npc.dialog.portrait.sourceTop
      portait.image.sourceLeft = REGISTRY.activeNPC.npc.dialog.portrait.sourceLeft
    }

    const rndAmount = Math.floor(Math.random() * QUESTION_LIST.length)
    currentQuestionIndex = rndAmount
    nextPageOfQuestions(1)

    askSomethingElse.show()

  } else {
    askSomethingElse.hide()
  }
}

function sendMessageToAi(message: string) {
  log("sending ", message)
  closeAllInteractions({ exclude: REGISTRY.activeNPC })

  const doSend = () => {
    const chatMessage: serverStateSpec.ChatMessage = createMessageObject(message, undefined, GAME_STATE.gameRoom)
    sendMsgToAI(chatMessage)
  }
  if (GAME_STATE.gameRoom && GAME_STATE.gameConnected === 'connected') {
    doSend()
  } else {
    REGISTRY.lobbyScene.pendingConvoActionWithNPC = doSend
    REGISTRY.lobbyScene.initArena(false)
    return
  }

  textInput.value = ""
}

const inputContainer = new UIContainerRect(askSomethingElse.background)
inputContainer.width = INPUT_BOX_WIDTH + 6
inputContainer.height = INPUT_BOX_HEIGHT + 6
inputContainer.positionY = INPUT_POS_Y
inputContainer.hAlign = "center"
inputContainer.vAlign = "center"
if (!customAtlas || !CUSTOM_BLACK_BUTTON_SECTION) inputContainer.color = Color4.White()
inputContainer.opacity = 1
inputContainer.visible = true

if (customAtlas && CUSTOM_BLACK_BUTTON_SECTION) {
  const bginputContainer = new UIImage(inputContainer, customAtlas)
  bginputContainer.width = "100%"
  bginputContainer.height = "100%"
  setSection(bginputContainer,
    CUSTOM_BLACK_BUTTON_SECTION
  )
}

const placeHolder = "Type your question HERE then hit enter..."
const custUiInputText = askSomethingElse.addTextBox(0, INPUT_POS_Y, placeHolder)
const textInput = custUiInputText.fillInBox
textInput.width = INPUT_BOX_WIDTH
textInput.height = INPUT_BOX_HEIGHT
textInput.fontSize = 14
if (customAtlas && CUSTOM_BLACK_BUTTON_SECTION) textInput.focusedBackground = Color4.FromHexString("#FFFFFF00")

textInput.onTextSubmit = new OnTextSubmit((x) => {
  const METHOD_NAME = "textInput.onTextSubmit"
  log(METHOD_NAME, "sending ", x)
  if (textInput.value === textInput.placeholder) {
    log(METHOD_NAME, "value matches place holder skipping ", x)
    return;
  }
  if (textInput.value.trim().length === 0) {
    log(METHOD_NAME, "value is empty skipping ", x)
    return;
  }
  closeAllInteractions({ exclude: REGISTRY.activeNPC })
  sendMessageToAi(x.text)
  textInput.value = ""
})

const sendQuestion = new UIButton(askSomethingElse.background)
sendQuestion.text = "Ask!"
sendQuestion.positionX = 200
sendQuestion.positionY = 50
sendQuestion.width = 75
sendQuestion.height = 75
sendQuestion.background = Color4.White()


const sendButton = new UIImage(askSomethingElse.background, new Texture("images/DispenserAtlas.png"))
setSection(sendButton, resources.buttons.roundGold)
sendButton.width = "25"
sendButton.height = "25px"
sendButton.vAlign = "bottom"
sendButton.hAlign = "right"
sendButton.positionY = "10"
sendButton.isPointerBlocker = true