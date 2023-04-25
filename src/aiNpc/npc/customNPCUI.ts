import { GAME_STATE } from "src/state";
import * as serverStateSpec from "src/aiNpc/lobby-scene/connection/state/server-state-spec";

import * as ui from "@dcl/ui-scene-utils";


import { REGISTRY } from "src/registry";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";

import { closeAllInteractions, createMessageObject, sendMsgToAI } from "./connectedUtils";
import { QuestionData } from "./remoteNpc";

const canvas = ui.canvas

const PROMPT_WIDTH = 550

const buttonsSyle = ui.ButtonStyles.RED
const askSomethingElse = new ui.CustomPrompt(ui.PromptStyles.DARKLARGE, PROMPT_WIDTH, 250)
askSomethingElse.hide()//immeidatly hide it
askSomethingElse.background.vAlign = 'bottom'
//askSomethingElse.closeIcon.visible = false
askSomethingElse.closeIcon.onClick = new OnPointerDown(()=>{
  showInputOverlay(false)
  REGISTRY.activeNPC?.goodbye()
})

   
const portait = askSomethingElse.addIcon('images/portraits/catguy.png',-PROMPT_WIDTH/2,0,200,200)
 
const ASK_BTN_FONT_SIZE = 16

//const ASK_BTN_WIDTH = 16

const QUESTION_LIST:QuestionData[] = [
  {displayQuestion:"Tell me about\nDecentraland",queryToAi:"Tell me about\nDecentraland"},
  {displayQuestion:"Sing me a song!",queryToAi:"Sing me a song!"},
  {displayQuestion:"What can I do here",queryToAi:"What can I do here?"},
  {displayQuestion:"Tell me a joke!",queryToAi:"Tell me a joke!"},
  {displayQuestion:"What is a wearable!",queryToAi:"What is a wearable!"},
  {displayQuestion:"What is an emote!",queryToAi:"What is an emote!"}
]
const askButtonsList:ui.CustomPromptButton[] = []
askSomethingElse.addText("Ask something else?", 0, 120, Color4.White(),20)

const commonQLbl = askSomethingElse.addText("Example Questions", 0, 90, Color4.White(),14)

askSomethingElse.addText("Powered by AI. Stay Safe. Do not share personally identifiable information.", 0, -95, Color4.White(),10)

askSomethingElse.addText("Or ask your own question below", 0, -20, Color4.White(),14)

const askButton1 = askSomethingElse.addButton("Q1", -100, 35, () => {
  sendMessageToAi("Q1")
}, buttonsSyle)


const askButton2 = askSomethingElse.addButton("Q2", 100, 35, () => {
  sendMessageToAi("Q2")
}, buttonsSyle)


const askButtonNext = askSomethingElse.addButton("more questions >>", 0, -10, () => {
  nextPageOfQuestions(1)
}, buttonsSyle)
/*
const askButtonPrev = askSomethingElse.addButton("<<", -100, 0, () => {
  nextPageOfQuestions(-1)
}, buttonsSyle)*/

const NEXT_BACK_WIDTH = 120//30
for(const b of [askButtonNext]){
  b.label.width = NEXT_BACK_WIDTH
  b.image.height = 20
  b.image.width = NEXT_BACK_WIDTH
  b.label.fontSize = 12
}

askButtonsList.push(askButton1)
askButtonsList.push(askButton2)

let counter = -1
function nextPageOfQuestions(dir:number){
  //debugger
  //counter+=dir
  
  for(const b of askButtonsList){
    counter+=dir
    if(counter >= QUESTION_LIST.length){
      counter = 0
    }
    if(counter < 0){
      counter = QUESTION_LIST.length-1
    }

    const q = QUESTION_LIST[counter] 
    b.label.fontSize = ASK_BTN_FONT_SIZE 
    b.label.value = q.displayQuestion
    b.image.onClick = new OnPointerDown(()=>{
      sendMessageToAi(q.queryToAi) 
    })
  }
}
nextPageOfQuestions(1) 
/*
askSomethingElse.addButton("Good Bye", -0, -20, () => {
  log("askSomethingElse.goodbye")
  showInputOverlay(false)
  REGISTRY.activeNPC?.goodbye()
  //REGISTRY.activeNPC.npc.followPath()
}, buttonsSyle)*/

//askSomethingElse.show()

export function showInputOverlay(val: boolean) {
  if (val) {
    //copy the portrait being used
    //wish had access to private data REGISTRY.activeNPC.npc.dialog.defaultPortrait to place more dynamically
    portait.image.positionX = -PROMPT_WIDTH/2 + 10//(REGISTRY.activeNPC.npc.dialog.portrait.width/2)
    if(REGISTRY.activeNPC){
      portait.image.source = REGISTRY.activeNPC.npc.dialog.portrait.source
      portait.image.width = REGISTRY.activeNPC.npc.dialog.portrait.width
      portait.image.height = REGISTRY.activeNPC.npc.dialog.portrait.height
      portait.image.sourceHeight = REGISTRY.activeNPC.npc.dialog.portrait.sourceHeight
      portait.image.sourceWidth = REGISTRY.activeNPC.npc.dialog.portrait.sourceWidth
      portait.image.sourceTop = REGISTRY.activeNPC.npc.dialog.portrait.sourceTop
      portait.image.sourceLeft = REGISTRY.activeNPC.npc.dialog.portrait.sourceLeft
    }

    askSomethingElse.show()
    //ad
    //askSomethingElse.closeIcon.visible = false
  } else {
    askSomethingElse.hide()
  }
}

function sendMessageToAi(message: string){
  log("sending ", message)
  //REGISTRY.activeNPC.dialog.closeDialogWindow()
  //close all other interactions to start the new one
  closeAllInteractions({exclude:REGISTRY.activeNPC})
  //utils.setTimeout(200,()=>{ 
  const chatMessage: serverStateSpec.ChatMessage = createMessageObject(message, undefined, GAME_STATE.gameRoom)
  sendMsgToAI(chatMessage)
  //} 
  textInput.value = ""
}


const INPUT_POS_Y = -80
const inputContainer = new UIContainerRect(askSomethingElse.background)
inputContainer.width = 320
inputContainer.height = 50
inputContainer.positionY = INPUT_POS_Y
inputContainer.hAlign = "center"
inputContainer.vAlign = "center"
inputContainer.color = Color4.White()
inputContainer.opacity = 1
inputContainer.visible = true

const placeHolder =   "Type your question HERE then hit enter..."
const custUiInputText = askSomethingElse.addTextBox(0,INPUT_POS_Y,placeHolder)
const textInput = custUiInputText.fillInBox
textInput.fontSize = 14
textInput.outlineColor = Color4.White()


textInput.onTextSubmit = new OnTextSubmit((x) => {
  const METHOD_NAME = "textInput.onTextSubmit"
  log(METHOD_NAME,"sending ", x)
  if(textInput.value === textInput.placeholder){
    log(METHOD_NAME,"value matches place holder skipping ", x)
    return;
  }
  if(textInput.value.trim().length === 0){
    log(METHOD_NAME,"value is empty skipping ", x)
    return;
  }
  //REGISTRY.activeNPC.dialog.closeDialogWindow()
  //REGISTRY.activeNPC.endInteraction()
  closeAllInteractions({exclude:REGISTRY.activeNPC})
  //REGISTRY.activeNPC.endInteraction()
  //utils.setTimeout(200,()=>{ 
  const chatMessage: serverStateSpec.ChatMessage = createMessageObject(x.text, undefined, GAME_STATE.gameRoom)
  sendMsgToAI(chatMessage)
  //} 
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
//sendButton.fontSize = 10
//sendButton.placeholder = "Write message here"
//textInput.placeholderColor = Color4.Gray()
sendButton.positionY = "10"
sendButton.isPointerBlocker = true



showInputOverlay(true)