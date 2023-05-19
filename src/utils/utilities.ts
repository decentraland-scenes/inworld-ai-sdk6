export function realDistance(pos1: Vector3, pos2: Vector3): number {
  if (!pos1) log("realDist pos1 is null")
  if (!pos2) log("realDist pos2 is null")
  const a = pos1.x - pos2.x
  const b = pos1.z - pos2.z
  return Math.sqrt(a * a + b * b)
}

export function notNull(obj: any): boolean {
  return obj !== null && obj !== undefined
}
export function isNull(obj: any): boolean {
  return obj === null || obj === undefined
}

/**
 * FIXME make synchronize https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
 * https://www.npmjs.com/package/mutexify
 * 
 * @param name - name of the wrapped promise - for debugging
 * @param proc - promise to be synchronized, prevent concurrent execution 
 * @returns 
 */
export const preventConcurrentExecution = <T>(name: string, proc: () => PromiseLike<T>) => {
  let inFlight: Promise<T> | false = false;

  return () => {
    if (!inFlight) {
      inFlight = (async () => {
        try {
          //  log("preventConcurrentExecution",name," start flight")
          return await proc();
        } finally {
          //log("preventConcurrentExecution",name,"  not in flight")
          inFlight = false;
        }
      })();
    } else {
      //log("preventConcurrentExecution",name," not in flight return same as before")
    }
    return inFlight;
  };
};

export function createEntityForSound(name: string) {
  const entSound = new Entity(name)
  entSound.addComponent(new Transform(
    {
      position: new Vector3(0, 0, 0)
    }
  ))
  const shape = new BoxShape()
  shape.withCollisions = false
  shape.isPointerBlocker = false

  engine.addEntity(entSound)
  entSound.setParent(Attachable.AVATAR)

  return entSound
}

export function createEntitySound(name: string, audioClip: AudioClip | AudioSource | AudioStream, volume?: number, loop?: boolean) {
  const entSound = createEntityForSound(name)

  //entSound.addComponent(shape)
  if (audioClip instanceof AudioClip) {
    entSound.addComponent(new AudioSource(audioClip))
    entSound.getComponent(AudioSource).volume = volume !== undefined ? volume : 0.5
    entSound.getComponent(AudioSource).loop = loop !== undefined && loop == true
  } else {
    entSound.addComponent(audioClip)
    entSound.getComponent(AudioStream).volume = volume !== undefined ? volume : 0.5
    //entSound.getComponent(AudioStream).loop = loop !== undefined && loop == true
  }

  return entSound
}