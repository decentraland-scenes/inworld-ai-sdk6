export interface ClockState {
  serverTime: number
}

export interface PlayerNpcDataState extends ClockState {
  endTime: number
  enrollTime: number
  racePosition: number

  lastKnownServerTime: number
  lastKnownClientTime: number
}

export type NpcProxyStatus = "unknown" | "not-started" | "starting" | "started" | "ended"
export type PlayerConnectionStatus = "unknown" | "connected" | "reconnecting" | "disconnected" | "lost connection"

export interface PlayerState {
  id: string
  sessionId: string

  connStatus: PlayerConnectionStatus
  remoteClientCache: InWorldConnectionClientCacheState

  userData: PlayerUserDataState
  npcData: PlayerNpcDataState
}

export interface PlayerUserDataState {
  name: string
  userId: string
  ///snapshotFace128:string snapshots deprecated use AvatarTexture
}

export interface NpcState extends ClockState {
  id: string
  name: string
  status: NpcProxyStatus
  startTime: number
  timeLimit: number
  endTime: number
  endTimeActual: number
  maxLaps: number //move to track data or is max laps race data?
}

// //broadcast object instead of linking to state the level details
export interface LevelDataState {
  id: string
  name: string
  //status:RaceStatus

  //theme:Theme
  //FIXME cannot declare this
  trackFeatures: Map<any, ITrackFeatureState>//Map<any,TrackFeatureConstructorArgs>
  localTrackFeatures?: TrackFeatureConstructorArgs[] //for loading only, not for state sharing

  maxLaps: number //move to track data or is max laps race data?
  //trackPath:Vector3State[]
  //other track info?
}


export type TrackFeatureType = 'boost' | 'slow-down' | 'inert' | 'wall' | 'fresh-snow' | 'spawn-point' | 'ice-tile' | 'fireplace' | 'trench' | 'powerup'

export function getTrackFeatureType(str: string) {
  return str as TrackFeatureType
}

export interface TrackFeatureConstructorArgs {
  name: string
  //triggerSize?:Vector3
  //shape:TrackFeatureShape
  type: TrackFeatureType
  lastTouchTime?: number
  activateTime?: number
}
export interface TrackFeatureUpdate extends TrackFeatureConstructorArgs {

}

// //can we get rid of and replace with 'TrackFeatureConstructorArgs'?

export interface ITrackFeatureState extends ClockState {
  name: string
  //triggerSize?:Vector3
  //shape:TrackFeatureShape
  type: TrackFeatureType
  lastTouchTime?: number
  activateTime?: number
}

export interface TrackFeatureStateConstructorArgs extends ITrackFeatureState {
}

export interface NpcRoomDataOptions {
  levelId: string
  name?: string
  maxLaps?: number
  maxPlayers?: number
  minPlayers?: number
  customRoomId?: string
  timeLimit?: number
  waitTimeToStart?: number
}

export interface EnrollmentState extends ClockState {
  open: boolean
  startTime: number
  endTime: number
  maxPlayers: number
}

export interface NpcGameRoomState {
  players: Map<any, PlayerState>
  npcState: NpcState
  enrollment: EnrollmentState
  levelData: LevelDataState
}

export type ShowMessage = {
  title: string,
  message: string,
  duration: number,
  isError: boolean
}

/////IN WORLD

export enum ChatPacketType {
  UNKNOWN = 0,
  TEXT = 1,
  AUDIO = 2,
  CUSTOM = 3,
  EMOTION = 4,
  CONTROL = 5,
  TRIGGER = 99 //custom number, inworlds sdk calls it 'trigger' as string
}

export enum ChatControlType {
  UNKNOWN = 0,
  INTERACTION_END = 3
}

export enum EmotionStrengthCode {
  UNSPECIFIED = "UNSPECIFIED",
  WEAK = "WEAK",
  STRONG = "STRONG",
  NORMAL = "NORMAL"
}

export enum EmotionBehaviorCode {
  NEUTRAL = "NEUTRAL",
  DISGUST = "DISGUST",
  CONTEMPT = "CONTEMPT",
  BELLIGERENCE = "BELLIGERENCE",
  DOMINEERING = "DOMINEERING",
  CRITICISM = "CRITICISM",
  ANGER = "ANGER",
  TENSION = "TENSION",
  TENSE_HUMOR = "TENSE_HUMOR",
  DEFENSIVENESS = "DEFENSIVENESS",
  WHINING = "WHINING",
  SADNESS = "SADNESS",
  STONEWALLING = "STONEWALLING",
  INTEREST = "INTEREST",
  VALIDATION = "VALIDATION",
  AFFECTION = "AFFECTION",
  HUMOR = "HUMOR",
  SURPRISE = "SURPRISE",
  JOY = "JOY"
}

export namespace EmotionEvent {
  export type AsObject = {
    joy: number,
    fear: number,
    trust: number,
    surprise: number,
    behavior: EmotionEvent.SpaffCode,
    strength: EmotionEvent.Strength,
  }

  export enum SpaffCode {
    NEUTRAL = 0,
    DISGUST = 1,
    CONTEMPT = 2,
    BELLIGERENCE = 3,
    DOMINEERING = 4,
    CRITICISM = 5,
    ANGER = 6,
    TENSION = 7,
    TENSE_HUMOR = 8,
    DEFENSIVENESS = 9,
    WHINING = 10,
    SADNESS = 11,
    STONEWALLING = 12,
    INTEREST = 13,
    VALIDATION = 14,
    AFFECTION = 15,
    HUMOR = 16,
    SURPRISE = 17,
    JOY = 18,
  }

  export enum Strength {
    UNSPECIFIED = 0,
    WEAK = 1,
    STRONG = 2,
    NORMAL = 3,
  }
}

export interface ChatPacketProps {
  serverReceivedTime?: number
  audio?: AudioEvent;
  control?: ControlEvent;
  custom?: CustomEvent;
  emotions?: EmotionEvent;
  packetId: PacketId;
  routing: Routing;
  text?: TextEvent;
  date: string;
  type: ChatPacketType;
}

export interface PacketId {
  packetId: string;
  utteranceId: string;
  interactionId: string;
}

export interface EmotionEvent {
  behavior: EmotionBehaviorCode
  strength: EmotionStrengthCode;
}

export interface Routing {
  source: Actor;
  target: Actor;
}

export interface Actor {
  name: string;
  isPlayer: boolean;
  isCharacter: boolean;
  xId?: CharacterId
}

export interface TextEvent {
  text: string;
  final: boolean;
}

export interface CustomEvent {
  name: string;
}

export interface AudioEvent {
  chunk: string;
}

export interface ControlEvent {
  type: ChatControlType;
}

export interface IChatPacket {
  type: ChatPacketType;
  date: string;
  packetId: PacketId;
  routing: Routing;
  text: TextEvent;
  audio: AudioEvent;
  control: ControlEvent;
  custom: CustomEvent;
  emotions: EmotionEvent;
}
export class ChatPacket implements IChatPacket {
  serverReceivedTime: number
  createTime: number
  type: ChatPacketType;
  date: string;
  packetId: PacketId;
  routing: Routing;
  text: TextEvent;
  audio: AudioEvent;
  control: ControlEvent;
  custom: CustomEvent;
  emotions: EmotionEvent;
  constructor(props: ChatPacketProps) {
    this.serverReceivedTime = props.serverReceivedTime ? props.serverReceivedTime : Date.now() //BAD FOR CLIENT SIDE, RENAME instCreateTime??
    this.type = props.type
    this.date = props.date
    this.audio = props.audio
    this.packetId = props.packetId
    this.routing = props.routing
    this.text = props.text
    this.emotions = props.emotions
    this.control = props.control
    this.custom = props.custom
  }
  /*isText(): boolean;
  isAudio(): boolean;
  isControl(): boolean;
  isCustom(): boolean;
  isEmotion(): boolean;
  isInteractionEnd(): boolean;*/
}

/////IN WORLD custom

export class InWorldConnectionClientCacheState {
  currentCharacterId: CharacterId
  currentSceneTrigger: TriggerId
}

export interface ChatMessageProps extends ChatPacketProps {
}

export class ChatMessage implements IChatPacket {
  type: ChatPacketType;
  date: string;
  packetId: PacketId;
  routing: Routing;
  text: TextEvent;
  audio: AudioEvent;
  control: ControlEvent;
  custom: CustomEvent;
  emotions: EmotionEvent;
  constructor(props: ChatMessageProps) {
    this.type = props.type
    this.date = props.date
    this.audio = props.audio
    this.packetId = props.packetId
    this.routing = props.routing
    this.text = props.text
    this.emotions = props.emotions
    this.control = props.control
    this.custom = props.custom
  }
  /*isText(): boolean;
  isAudio(): boolean;
  isControl(): boolean;
  isCustom(): boolean;
  isEmotion(): boolean;
  isInteractionEnd(): boolean;*/
}

export type CharacterId = {
  resourceName: string
  confirmed?: boolean
  id?: string
}
export type TriggerId = {
  name: string
  confirmed?: boolean
}