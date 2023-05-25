import { ColyseusCallbacksCollection, ColyseusCallbacksArray, ColyseusCallbacksMap, ColyseusCallbacksReferences } from "./client-colyseus-ext"
import * as serverStateSpec from "./server-state-spec"

export type PlayerMapState = ColyseusCallbacksMap<any, serverStateSpec.PlayerState> & Map<any, serverStateSpec.PlayerState> & {
}

export type InWorldConnectionClientCacheState = ColyseusCallbacksMap<any, serverStateSpec.InWorldConnectionClientCacheState> & Map<any, serverStateSpec.InWorldConnectionClientCacheState> & {
}

export type PlayerState = ColyseusCallbacksReferences<serverStateSpec.PlayerState> & serverStateSpec.PlayerState & {
    userData: PlayerUserDataState
    npcData: PlayerNpcRoomDataState
    remoteClientCache: InWorldConnectionClientCacheState
}

export type PlayerNpcRoomDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerNpcDataState> & serverStateSpec.PlayerNpcDataState & {
}

export type NpcState = ColyseusCallbacksReferences<serverStateSpec.NpcState> & serverStateSpec.NpcState & {
}

export type EnrollmentState = ColyseusCallbacksReferences<serverStateSpec.EnrollmentState> & serverStateSpec.EnrollmentState & {

}

export type PlayerUserDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerUserDataState> & serverStateSpec.PlayerUserDataState & {
}

export type ITrackFeatureState = ColyseusCallbacksReferences<serverStateSpec.ITrackFeatureState> & serverStateSpec.ITrackFeatureState & {
}

export type LevelDataState = ColyseusCallbacksReferences<serverStateSpec.LevelDataState> & serverStateSpec.LevelDataState & {
    trackFeatures?: ColyseusCallbacksMap<any, serverStateSpec.ITrackFeatureState> & Map<any, serverStateSpec.ITrackFeatureState>
}

export type NpcGameRoomState = ColyseusCallbacksReferences<serverStateSpec.NpcGameRoomState> & serverStateSpec.NpcGameRoomState & {
    players: PlayerMapState
    npcData: NpcState
    enrollment: EnrollmentState
    levelData: LevelDataState
}