import * as npc from '@dcl/npc-scene-utils'
import { getUserData, UserData } from '@decentraland/Identity'
import { NpcAnimationNameType, REGISTRY } from 'src/registry'
import { RESOURCES } from 'src/resources'
import { GAME_STATE } from 'src/state'
import { RemoteNpc } from './remoteNpc'
import { streamedMsgs } from './streamedMsgs'
import { closeAllInteractions } from './connectedUtils'
import { showInputOverlay } from './customNPCUI'

const ANIM_TIME_PADD = .2
const CART23_NPC_ANIMATIONS:NpcAnimationNameType = {
  IDLE: {name:"Idle",duration:-1},
  WALK: {name:"Walk",duration:-1},
  RUN: {name:"Run",duration:-1},
  WAVE: {name:"Wave",duration:2.46 + ANIM_TIME_PADD},
  HEART_WITH_HANDS: {name:"Heart_With_Hands",duration:1.76 + ANIM_TIME_PADD},
  COME_ON: {name:"Come_On",duration:1.96 + ANIM_TIME_PADD},
}

const JARVIS_NPC_ANIMATIONS:NpcAnimationNameType = {
  IDLE: {name:"Idle",duration:-1},
  WALK: {name:"Walk",duration:-1},
  TALK: {name:"Talk",duration:-1},
  RUN: {name:"Run",duration:-1},
  WAVE: {name:"Hello",duration:2.46 + ANIM_TIME_PADD},
}


const DOGE_NPC_ANIMATIONS:NpcAnimationNameType = {
  IDLE: {name:"Idle",duration:-1},
  WALK: {name:"Walk",duration:-1},
  TALK: {name:"Talk1",duration:5},
  THINKING: {name:"Thinking",duration:5},
  RUN: {name:"Run",duration:-1},
  WAVE: {name:"Wave",duration:4 + ANIM_TIME_PADD},
}


//REGISTRY.npcAnimations = NPC_ANIMATIONS

const TEST_BLUNT_BOBBY_ENABLED = false

//let myNPC:RemoteNpc
//let myNPCCheshireCat:RemoteNpc 
let doge:RemoteNpc 
let npcBluntBobby:RemoteNpc 
 

export function setupNPC(){
  log("setupNPC","ENTRY")
  
  const offsetpath = 2
  let dogePath: npc.FollowPathData = {
    path: [
      new Vector3(offsetpath,.24,offsetpath),
      new Vector3(offsetpath,.24,16-offsetpath),
      new Vector3(16-offsetpath,.24,16-offsetpath),
      new Vector3(16-offsetpath,.24,offsetpath)
    ],
    loop: true,
    // curve: true,
  }
  
  doge = new RemoteNpc(
    {resourceName:"workspaces/genesis_city/characters/doge"}
    ,new npc.NPC(
      { position: dogePath.path[0].clone(),scale: new Vector3(2, 2, 2) }, 
      'models/dogeNPC_anim4.glb',//'models/robots/marsha.glb',//'models/Placeholder_NPC_02.glb',
      () => {
        log('doge.NPC activated!')
        REGISTRY.activeNPC = doge
        
        closeAllInteractions({exclude:REGISTRY.activeNPC})
        

        doge.thinking([REGISTRY.askWaitingForResponse] )
      },
      { 
        idleAnim: DOGE_NPC_ANIMATIONS.IDLE.name,
        walkingAnim: DOGE_NPC_ANIMATIONS.WALK.name, 
        walkingSpeed: 1.5 ,
        faceUser: true,//continue to face user???
        portrait: 
          { 
            path: 'images/portraits/doge.png', height: 300, width: 300
            ,offsetX:-10,offsetY:0
            , section:{sourceHeight:256,sourceWidth:256} 
          },
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'WOW', 
        onlyETrigger: true,
        onlyClickTrigger: false,
        onlyExternalTrigger: false,
        reactDistance: 5, 
        continueOnWalkAway: true,
        dialogCustomTheme: RESOURCES.textures.dialogAtlas,
        onWalkAway: () => {
          log("NPC",doge.name,'on walked away')  
          const LOOP = false
          
          if(doge.npcAnimations.WALK) doge.npc.playAnimation(doge.npcAnimations.WALK.name, LOOP,doge.npcAnimations.WALK.duration)
          doge.npc.followPath()
          const NO_LOOP = true
          //if(doge.npcAnimations.WAVE) doge.npc.playAnimation(doge.npcAnimations.WAVE.name, NO_LOOP,doge.npcAnimations.WAVE.duration)
        }
      }
    ),
    {
      npcAnimations:DOGE_NPC_ANIMATIONS,
      thinking:{
        enabled:true,
        model: new GLTFShape('models/loading-icon.glb'),
        offsetX: 0,
        offsetY: 2 ,
        offsetZ: 0
      }
      ,onEndOfRemoteInteractionStream: ()=>{
        showInputOverlay(true)
      }
      ,onEndOfInteraction: ()=>{
        //showInputOverlay(true)
        const LOOP = false
        if(doge.npcAnimations.WALK) doge.npc.playAnimation(doge.npcAnimations.WALK.name, LOOP,doge.npcAnimations.WALK.duration)
        doge.npc.followPath()
      }
    }
    )
  doge.setName( "npc.doge")
  doge.npc.followPath(dogePath)
  //doge.showThinking(true)




  const dclGuide = new RemoteNpc(
    {resourceName:"workspaces/genesis_city/characters/dcl_guide"}
    ,new npc.NPC( 
      { position: new Vector3(6,1.5,6),scale: new Vector3(1,1,1) }, 
      'models/robots/marsha.glb',//'models/robots/marsha.glb',//'models/Placeholder_NPC_02.glb',
      () => { 
        log('dclGuide.NPC activated!')
        REGISTRY.activeNPC = dclGuide
        
        closeAllInteractions({exclude:REGISTRY.activeNPC})
        

        dclGuide.thinking([REGISTRY.askWaitingForResponse] )
      },
      { 
        idleAnim: DOGE_NPC_ANIMATIONS.IDLE.name,
        walkingAnim: DOGE_NPC_ANIMATIONS.WALK.name, 
        walkingSpeed: 1.5 ,
        faceUser: true,//continue to face user???
        portrait: 
          { 
            path: 'images/portraits/marsha.png', height: 300, width: 300
            ,offsetX:-10,offsetY:0
            , section:{sourceHeight:384,sourceWidth:384} 
          },
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'Talk', 
        onlyETrigger: true,
        onlyClickTrigger: false,
        onlyExternalTrigger: false,
        reactDistance: 5, 
        continueOnWalkAway: true,
        dialogCustomTheme: RESOURCES.textures.dialogAtlas,
        onWalkAway: () => {
          log("NPC",dclGuide.name,'on walked away')   
          const LOOP = false
          
          //if(doge.npcAnimations.WALK) doge.npc.playAnimation(doge.npcAnimations.WALK.name, LOOP,doge.npcAnimations.WALK.duration)
          //doge.npc.followPath()
          const NO_LOOP = true
          if(doge.npcAnimations.WAVE) dclGuide.npc.playAnimation(dclGuide.npcAnimations.WAVE.name, NO_LOOP,dclGuide.npcAnimations.WAVE.duration)
        }
      } 
    ), 
    {
      npcAnimations:DOGE_NPC_ANIMATIONS,
      thinking:{
        enabled:true,
        model: new GLTFShape('models/loading-icon.glb'),
        modelScale: new Vector3(4,4,4),
        modelOffset: new Vector3(0,1,0),
        offsetX: 0,
        offsetY: 1,
        offsetZ: 0,
        textScale: new Vector3(2,2,2),
        textOffset: new Vector3(0,-1,0)
      }
      ,onEndOfRemoteInteractionStream: ()=>{
        showInputOverlay(true)
      }
      ,onEndOfInteraction: ()=>{
        //showInputOverlay(true)
        
      }
    }
    )
    dclGuide.setName( "npc.dclGuide")
    
  //doge.npc.followPath(dogePath)

    /*
  const colliderBox = new BoxShape()
  colliderBox.isPointerBlocker = false; 
  const collider = new Entity();
  collider.addComponent(colliderBox);
  collider.addComponent(RESOURCES.materials.transparent)
  collider.addComponent(new Transform({
    position: new Vector3(0,1,0),
    scale: new Vector3(.5,2,.5)
  }))
  collider.setParent(myNPC.npc);*/
  //engine.addEntity(collider) 

  /*
  const hidePlayerModArea = new Entity();
  getUserData().then((user:UserData|null)=>{
    if(user !== null && CONFIG.NPC_HIDE_PLAYER_MODIFIER_ENABLED){
      hidePlayerModArea.addComponent( 
        new AvatarModifierArea({
          area: {
            //box:
            box: new Vector3(CONFIG.NPC_HIDE_PLAYER_WIDTH, 2, CONFIG.NPC_HIDE_PLAYER_WIDTH) //debug mode only hide when in car so can see player when walking around
          },
          excludeIds: [user.userId],
          modifiers: [AvatarModifiers.HIDE_AVATARS]
        })
      )
      hidePlayerModArea.addComponent(new Transform({
        position: new Vector3(0,1,0),
        scale: new Vector3(.5,2,.5)
      }))
      hidePlayerModArea.setParent(myNPC);
    }
  })
  */
  
  
  //engine.addEntity(collider)


  REGISTRY.allNPCs.push(doge)
  REGISTRY.allNPCs.push(dclGuide)
  
  if(npcBluntBobby) REGISTRY.allNPCs.push(npcBluntBobby)
   
  

  for(const p of REGISTRY.allNPCs){
    p.npc.dialog.text.hTextAlign = 'center'
  }

  log("setupNPC","RETURN")
}
/*
export let xmasTheme = new Texture('images/npcAtlas.png')

myNPC.dialog = new npc.DialogWindow(
  {
    path: 'images/elf_02.png',
    offsetX: 50,
    offsetY: 30,
    width: 256,
    height: 256,
    section: { sourceWidth: 256, sourceHeight: 256 },
  },
  false,
  undefined,
  xmasTheme
)
myNPC.dialog.panel.positionY = 20
myNPC.dialog.leftClickIcon.positionX = 340 - 40
myNPC.dialog.leftClickIcon.positionY = -80 + 40
myNPC.dialog.text.fontSize = 18
myNPC.dialog.text.color = Color4.Black()
*/