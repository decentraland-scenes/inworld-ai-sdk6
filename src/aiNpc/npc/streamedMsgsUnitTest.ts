import { ChatMessageProps, ChatPacket, EmotionBehaviorCode, EmotionStrengthCode } from "src/aiNpc/lobby-scene/connection/state/server-state-spec"
import { ChatNext, ChatPart, getControlTypeAsInt, getMessageTypeAsInt, StreamedMessages } from "./streamedMsgs"

const thingCollector_hiThere: ChatMessageProps[] = new Array()

//test as is
//test nothing
//test audio only (no text)
//test audio only, followed by with text
//test text only, followed by with audio new utterance
//test text only, followed by with audio same utterance
//test with text, missing audio but has next utteranceId
//test with no text/audio at all
//test where another player convo slips in here

/*
⚔️  Listening on ws://localhost:2567
**RAW** {"createTime":1684341131072,"type":2,"date":"2023-05-17T16:32:11.080Z","packetId":{"packetId":"0fa67bb7-2bc3-4a83-a161-e9fac43e6008","utteranceId":"f2ed623b-e702-42ae-a39c-3d13686b9556","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}}}
**RAW** {"createTime":1684341131074,"type":1,"date":"2023-05-17T16:32:11.007Z","packetId":{"packetId":"d05a8541-8c4e-4f40-a760-906b756cae6c","utteranceId":"f2ed623b-e702-42ae-a39c-3d13686b9556","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"text":{"text":"Hey there!","final":true}}
**RAW** {"createTime":1684341131075,"type":4,"date":"2023-05-17T16:32:11.081Z","packetId":{"packetId":"98801d33-eb60-4142-80b9-260f867d6047","utteranceId":"70d1f708-e99e-49f2-82d5-48955bac819c","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"","isPlayer":true,"isCharacter":false},"target":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true}},"emotions":{"behavior":"JOY","strength":"STRONG"}}
**RAW** {"createTime":1684341132196,"type":2,"date":"2023-05-17T16:32:12.105Z","packetId":{"packetId":"cf7cc753-3d47-458e-a5c6-2b698e431664","utteranceId":"74fe9e84-6a48-4f85-aeaf-43192abc91ea","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}}}
**RAW** {"createTime":1684341132197,"type":1,"date":"2023-05-17T16:32:12.036Z","packetId":{"packetId":"38d44df7-ddaf-4ef6-b445-a7269ede35ef","utteranceId":"74fe9e84-6a48-4f85-aeaf-43192abc91ea","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"text":{"text":" What brings you to the Genesis Plaza?","final":true}}
**RAW** {"createTime":1684341133171,"type":2,"date":"2023-05-17T16:32:13.108Z","packetId":{"packetId":"b80ee341-5f56-47de-a123-ab6627fbb335","utteranceId":"57c32b78-4983-4cc0-84dd-d15d52458dcb","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}}}
**RAW** {"createTime":1684341133192,"type":1,"date":"2023-05-17T16:32:13.015Z","packetId":{"packetId":"1060b9e1-696a-4c44-bc88-e55faf674f70","utteranceId":"57c32b78-4983-4cc0-84dd-d15d52458dcb","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"text":{"text":" I'm DOGE, the class clown here.","final":true}}
**RAW** {"createTime":1684341135600,"type":2,"date":"2023-05-17T16:32:15.221Z","packetId":{"packetId":"feb448e1-b3a4-4c94-a25c-907afddb1a1a","utteranceId":"cd74fc55-4d47-4ac0-bea7-84434a446438","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}}}
**RAW** {"createTime":1684341135600,"type":1,"date":"2023-05-17T16:32:15.121Z","packetId":{"packetId":"07fef324-8e6d-4605-a55b-c9506be47aec","utteranceId":"cd74fc55-4d47-4ac0-bea7-84434a446438","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"text":{"text":" Let's have some fun and explore the Decentraland universe together!","final":true}}
**RAW** {"createTime":1684341135601,"type":5,"date":"2023-05-17T16:32:15.143Z","packetId":{"packetId":"d8dd14ec-a60b-4a0d-b02a-36d82214ffae","utteranceId":"f26f14fe-1b84-46d6-a113-8a7c859bb110","interactionId":"fa3efd0c-c5d9-4874-af1e-68829f31c7fa"},"routing":{"source":{"name":"89def5b0-db7a-4d82-80a6-217f2fa34e86","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"control":{"type":3}}
**RAW** {"createTime":1684341152410,"type":2,"date":"2023-05-17T16:32:32.406Z","packetId":{"packetId":"fd8127cc-69ac-4529-b5fb-ba7f641fc54a","utteranceId":"c50de959-fb7c-4737-8110-0068b97afcb4","interactionId":"8e7e13ae-0b03-4025-a383-af622e439b1e"},"routing":{"source":{"name":"27379c02-81d4-4f45-965e-e81740f8e0b5","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}}}
**RAW** {"createTime":1684341152411,"type":4,"date":"2023-05-17T16:32:32.406Z","packetId":{"packetId":"859803b7-7c83-42e0-b620-2f76d9c0a95f","utteranceId":"9622ccb8-099d-495d-b6cb-f79dcfa9e71b","interactionId":"8e7e13ae-0b03-4025-a383-af622e439b1e"},"routing":{"source":{"name":"","isPlayer":true,"isCharacter":false},"target":{"name":"27379c02-81d4-4f45-965e-e81740f8e0b5","isPlayer":false,"isCharacter":true}},"emotions":{"behavior":"JOY","strength":"STRONG"}}
**RAW** {"createTime":1684341152412,"type":1,"date":"2023-05-17T16:32:32.329Z","packetId":{"packetId":"15ae6ce0-10ca-4de8-955f-15a35ff91707","utteranceId":"c50de959-fb7c-4737-8110-0068b97afcb4","interactionId":"8e7e13ae-0b03-4025-a383-af622e439b1e"},"routing":{"source":{"name":"27379c02-81d4-4f45-965e-e81740f8e0b5","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"text":{"text":"Woof woof!","final":true}}
**RAW** {"createTime":1684341155638,"type":2,"date":"2023-05-17T16:32:35.403Z","packetId":{"packetId":"18ae5671-b8d4-4fe1-903d-3c497d56d4c2","utteranceId":"78a58a4c-6f1c-4686-99a8-69aceb17c396","interactionId":"8e7e13ae-0b03-4025-a383-af622e439b1e"},"routing":{"source":{"name":"27379c02-81d4-4f45-965e-e81740f8e0b5","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}}}
**RAW** {"createTime":1684341155639,"type":1,"date":"2023-05-17T16:32:35.294Z","packetId":{"packetId":"cdea132c-8faa-46d7-afd7-b6c8088dcd33","utteranceId":"78a58a4c-6f1c-4686-99a8-69aceb17c396","interactionId":"8e7e13ae-0b03-4025-a383-af622e439b1e"},"routing":{"source":{"name":"27379c02-81d4-4f45-965e-e81740f8e0b5","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"text":{"text":" I don't know any songs, but I can do a silly dance for you!","final":true}}
**RAW** {"createTime":1684341155639,"type":5,"date":"2023-05-17T16:32:35.312Z","packetId":{"packetId":"c80882cb-b1d0-4d13-80bc-f8bfee768fd9","utteranceId":"66f95638-5e1d-4a67-a283-50e7ccb0cd85","interactionId":"8e7e13ae-0b03-4025-a383-af622e439b1e"},"routing":{"source":{"name":"27379c02-81d4-4f45-965e-e81740f8e0b5","isPlayer":false,"isCharacter":true},"target":{"name":"","isPlayer":true,"isCharacter":false}},"control":{"type":3}}
*/

thingCollector_hiThere.push({ "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } })
thingCollector_hiThere.push({ "packetId": { "packetId": "b06f124b-4b31-443d-995a-3c7950f4a879", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.882Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " Hey there!", "final": true } })
thingCollector_hiThere.push({ "packetId": { "packetId": "9db71832-3e51-4ef5-b5af-9d9f4348eb4b", "utteranceId": "051aa758-c23c-4eca-80fb-0fd868988ba8", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("EMOTION"), "emotions": { "behavior": EmotionBehaviorCode.JOY, "strength": EmotionStrengthCode.NORMAL } })
thingCollector_hiThere.push({ "packetId": { "packetId": "e386f5cb-75d4-420d-90ba-05651d113d1b", "utteranceId": "e8bbf1f4-bf18-4fbc-8161-8bea3310abf5", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.326Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } })
thingCollector_hiThere.push({ "packetId": { "packetId": "42a74017-c90f-45d2-9d3e-51a4f6830880", "utteranceId": "e8bbf1f4-bf18-4fbc-8161-8bea3310abf5", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.234Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " I'm the Scientist Assistant, known as 'Thing Collector'.", "final": true } })
thingCollector_hiThere.push({ "packetId": { "packetId": "8e133227-56b0-4bc0-9b2a-7ec365f236aa", "utteranceId": "d28f645e-1002-4d8c-ae5b-57d290ebbef3", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true } }, "date": "2023-03-09T19:49:20.326Z", "type": getMessageTypeAsInt("EMOTION"), "emotions": { "behavior": EmotionBehaviorCode.JOY, "strength": EmotionStrengthCode.NORMAL } })
thingCollector_hiThere.push({ "packetId": { "packetId": "a53ab109-44ed-4bae-9379-57b2c5d7bef6", "utteranceId": "096aa338-db93-415a-b230-3a1af7427d1d", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.545Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } })
thingCollector_hiThere.push({ "packetId": { "packetId": "08167de2-1900-4790-8dd4-9867b770f04a", "utteranceId": "096aa338-db93-415a-b230-3a1af7427d1d", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.461Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " It's nice to meet you!", "final": true } })
thingCollector_hiThere.push({ "packetId": { "packetId": "ffd25ba1-002f-4db1-b856-6a69e067bfb6", "utteranceId": "c8c4d7e4-d79d-4111-99be-1ab43b2ab6de", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true } }, "date": "2023-03-09T19:49:20.545Z", "type": getMessageTypeAsInt("EMOTION"), "emotions": { "behavior": EmotionBehaviorCode.JOY, "strength": EmotionStrengthCode.NORMAL } })
thingCollector_hiThere.push({ "packetId": { "packetId": "2641c983-b921-4403-93c9-f65015aa86a1", "utteranceId": "cff2adf6-852c-422c-a937-ed82e65639d6", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.482Z", "type": getMessageTypeAsInt("CONTROL"), "control": { "type": getControlTypeAsInt("INTERACTION_END") } });

//next message from diff character

const CLASSNAME = "unitTest"

let TOTAL_TESTS = 0
let TOTAL_PASS = 0

function logPass(testName: string, msg?: string, ...args: any[]) {
  log(CLASSNAME, testName, "UNIT.TEST.RESULT", "   PASSED :)", msg, ...args)
  TOTAL_PASS++
}
function logFail(testName: string, msg?: string, ...args: any[]) {
  log(CLASSNAME, testName, "UNIT.TEST.RESULT", "   FAILED!!!!!!! :X", msg, ...args)
}
function logDebug(testName: string, msg?: string, ...args: any[]) {
  log(CLASSNAME, testName, "DEBUG", msg, ...args)
}

type ExpectedMessageProps = {
  text: string
}

function addAll(streamedMsg: StreamedMessages, thingCollector_hiThere: ChatMessageProps[]) {
  for (const p of thingCollector_hiThere) {
    streamedMsg.add(new ChatPart(new ChatPacket(p)))
  }
}

function testForCountOf(METHOD_NAME: string, streamedMsg: StreamedMessages, count: number
  , opts: { mustBeText?: boolean, textRespExpected?: ExpectedMessageProps[], mustBeEmotion?: boolean }): { failed?: boolean, nextCounter: number } {
  let next: ChatNext
  let nextCounter = 0
  for (let x = 0; x < count; x++) {
    // debugger  
    if (streamedMsg.hasNextAudioNText()) {
      next = streamedMsg.next()
      logDebug(METHOD_NAME, "next", x, count, nextCounter, next)
      if (opts && opts.mustBeText && next.text === undefined) {
        logFail(METHOD_NAME, "expected to have next text!!!", nextCounter, next)
        return { failed: true, nextCounter: nextCounter }
      }
      if (opts && opts.mustBeEmotion && next.emotion === undefined) {
        logFail(METHOD_NAME, "expected to have next emotion!!!", nextCounter, next)
        return { failed: true, nextCounter: nextCounter }
      }

      if (opts && opts.textRespExpected) {
        if (next.text.packet.text.text.trim() !== opts.textRespExpected[nextCounter].text.trim()) {
          logFail(METHOD_NAME, "expected to text match", nextCounter, next, next.text.packet.text, "!= (expected) ->", opts.textRespExpected[nextCounter])
          return { failed: true, nextCounter: nextCounter }
        }
      }
      nextCounter++
    } else {
      logFail(METHOD_NAME, "expected to have next!!!", nextCounter)
      return { failed: true, nextCounter: nextCounter }
    }
  }
  return { failed: false, nextCounter: nextCounter }
}

function testSingleHappyPath(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testSingleHappyPath"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  const countOfResult = testForCountOf(METHOD_NAME, streamedMsg, 3, { mustBeText: true })
  if (countOfResult.failed) {
    return;
  }
  let nextCounter = countOfResult.nextCounter

  //expecting 3
  if (streamedMsg.hasNextAudioNText()) {
    next = streamedMsg.next()
    return logFail(METHOD_NAME, "expected to NOT have next!!!", next)
  } else {
    next = streamedMsg.next()
    logDebug(METHOD_NAME, "end of convo", nextCounter, next)
  }
  logPass(METHOD_NAME)
}

function testTextThenAudio(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testTextThenAudio"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  //expecting 1
  const countOfResult = testForCountOf(METHOD_NAME, streamedMsg, 1, { mustBeText: true })
  if (countOfResult.failed) {
    return;
  }

  logPass(METHOD_NAME)
}

function testTextThenAudioThenEmotion(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testTextThenAudioThenEmotion"
  TOTAL_TESTS++
  const streamedMsg = new StreamedMessages()

  logFail(METHOD_NAME, "IMPLEMENT ME")


  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  //expecting 1
  const countOfResult = testForCountOf(METHOD_NAME, streamedMsg, 1, { mustBeText: true, mustBeEmotion: true })
  if (countOfResult.failed) {
    return;
  }

  logPass(METHOD_NAME)
}

function testTextThenEmotionThenAudio(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testTextThenEmotionThenAudio"
  TOTAL_TESTS++
  const streamedMsg = new StreamedMessages()

  //logFail(METHOD_NAME,"IMPLEMENT ME")


  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  //expecting 1
  const countOfResult = testForCountOf(METHOD_NAME, streamedMsg, 1, { mustBeText: true, mustBeEmotion: true })
  if (countOfResult.failed) {
    return;
  }

  logPass(METHOD_NAME)
}

function testNothing(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testNothing"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  if (streamedMsg.hasNextAudioNText()) {
    next = streamedMsg.next()
    return logFail(METHOD_NAME, "expected to NOT have next!!!", next)
  } else {
    next = streamedMsg.next()
    logDebug(METHOD_NAME, "end of convo", nextCounter, next)
  }
  logPass(METHOD_NAME)
}

function testAudioOnly(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testAudioOnly"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  if (streamedMsg.hasNextAudioNText()) {
    next = streamedMsg.next()
    return logFail(METHOD_NAME, "expected to NOT have next!!!", next)
  } else {
    next = streamedMsg.next()
    logDebug(METHOD_NAME, "end of convo", nextCounter, next)
  }
  logPass(METHOD_NAME)
}

function testControlOnly(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testControlOnly"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  if (streamedMsg.hasNextAudioNText()) {
    next = streamedMsg.next()
    return logFail(METHOD_NAME, "expected to NOT have next!!!", next)
  } else {
    next = streamedMsg.next()
    logDebug(METHOD_NAME, "end of convo", nextCounter, next)
  }
  logPass(METHOD_NAME)
}

function testTextOnlyEndControl(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testTextOnlyEndControl"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  if (streamedMsg.hasNextAudioNText()) {
    next = streamedMsg.next()
    return logFail(METHOD_NAME, "expected to NOT have next!!!", next)
  } else {
    next = streamedMsg.next()
    logDebug(METHOD_NAME, "end of convo", nextCounter, next)
  }
  logPass(METHOD_NAME)
}

function testTextOnlyThenEndControl(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testTextOnlyThenEndControl"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  //expecting 3
  if (streamedMsg.hasNextAudioNText()) {
    next = streamedMsg.next()
    logDebug(METHOD_NAME, "next", nextCounter, next)
    nextCounter++
  } else {
    return logFail(METHOD_NAME, "expected to have next!!!")
  }

  logPass(METHOD_NAME)
}

function testTextOnlyAnotherUtteranceAudioText(thingCollector_hiThere: ChatMessageProps[]) {
  const METHOD_NAME = "testTextOnlyAnotherUtteranceAudioText"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  //expecting 2
  const countOfResult = testForCountOf(METHOD_NAME, streamedMsg, 2, { mustBeText: true })
  if (countOfResult.failed) {
    return;
  }

  logPass(METHOD_NAME)
}

function useCaseDidntPlayFirst2Text(thingCollector_hiThere: ChatMessageProps[], textRespExpected: ExpectedMessageProps[]) {
  const METHOD_NAME = "useCaseDidntPlayFirst2Text"
  const streamedMsg = new StreamedMessages()

  TOTAL_TESTS++

  addAll(streamedMsg, thingCollector_hiThere)
  let next: ChatNext

  let nextCounter = 0

  //expecting 2
  const countOfResult = testForCountOf(METHOD_NAME, streamedMsg, textRespExpected.length, { mustBeText: true, textRespExpected: textRespExpected })
  if (countOfResult.failed) {
    return;
  }

  logPass(METHOD_NAME)
}

log(CLASSNAME, "STARTING", "UNIT.TEST.RESULT")
log(CLASSNAME, "STARTING", "UNIT.TEST.RESULT..")
log(CLASSNAME, "STARTING", "UNIT.TEST.RESULT...")

if (true) {
  useCaseDidntPlayFirst2Text(
    [
      { "type": 2, "date": "2023-03-17T13:44:42.771Z", "packetId": { "packetId": "e775fc25-df1e-42bb-b04c-363d7e5b93b7", "utteranceId": "f0b036e8-48cd-41e4-a6a4-acd71525aa0a", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } } },
      { "type": 4, "date": "2023-03-17T13:44:42.772Z", "packetId": { "packetId": "6d1f764f-47e3-4f84-9236-2b9d5b87890c", "utteranceId": "9351176d-ccee-4e14-ac13-808a49decf9e", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true } }, "emotions": { "behavior": EmotionBehaviorCode.NEUTRAL, "strength": EmotionStrengthCode.STRONG } },
      { "type": 1, "date": "2023-03-17T13:44:42.711Z", "packetId": { "packetId": "1af0820e-7bfa-4dde-b3d0-81266eb521ae", "utteranceId": "f0b036e8-48cd-41e4-a6a4-acd71525aa0a", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "text": { "text": "Hello there, welcome to the lab!", "final": true } },
      { "type": 2, "date": "2023-03-17T13:44:43.212Z", "packetId": { "packetId": "82f7dac7-9df2-406c-a2fe-3a9aebb5a54f", "utteranceId": "c7ac00d4-a748-45cf-82be-6bc9ef9b1bb7", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } } },
      { "type": 4, "date": "2023-03-17T13:44:43.212Z", "packetId": { "packetId": "67af31ff-8269-4aa7-afb1-78a8d003ea02", "utteranceId": "211d398c-9a94-4a84-be5d-1bcf1309e66d", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true } }, "emotions": { "behavior": EmotionBehaviorCode.NEUTRAL, "strength": EmotionStrengthCode.STRONG } },
      { "type": 1, "date": "2023-03-17T13:44:43.096Z", "packetId": { "packetId": "1a1df7d6-87ad-409b-8719-276d79a2dbac", "utteranceId": "c7ac00d4-a748-45cf-82be-6bc9ef9b1bb7", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "text": { "text": " I am Core AI Test 23, but you can call me Jarvis.", "final": true } },
      { "type": 2, "date": "2023-03-17T13:44:43.364Z", "packetId": { "packetId": "e76462cd-fe92-4ef8-8b23-e39adb984b77", "utteranceId": "61fd66dd-176a-4177-99f5-767813325773", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } } },
      { "type": 1, "date": "2023-03-17T13:44:43.271Z", "packetId": { "packetId": "3e8dda16-cc4f-46f4-8c09-d13eecdb74c1", "utteranceId": "61fd66dd-176a-4177-99f5-767813325773", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "text": { "text": " How may I assist you today?", "final": true } },
      { "type": 4, "date": "2023-03-17T13:44:43.364Z", "packetId": { "packetId": "fb7e941a-c853-4662-b5d0-661c54ae646c", "utteranceId": "a6684ca8-f82d-4f59-9273-534d88f94d43", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true } }, "emotions": { "behavior": EmotionBehaviorCode.NEUTRAL, "strength": EmotionStrengthCode.STRONG } },
      { "type": 2, "date": "2023-03-17T13:44:43.802Z", "packetId": { "packetId": "270d589f-3871-4b4a-ac9c-7dcb91b7e502", "utteranceId": "65bfc619-b387-439a-9422-4d257220a0b1", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } } },
      { "type": 1, "date": "2023-03-17T13:44:43.702Z", "packetId": { "packetId": "f49d32c5-acdd-4b7e-b743-ab20670d962c", "utteranceId": "65bfc619-b387-439a-9422-4d257220a0b1", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "text": { "text": " Do you have any interesting science facts or perhaps...a Shard to share?", "final": true } },
      { "type": 4, "date": "2023-03-17T13:44:43.802Z", "packetId": { "packetId": "f14bae4d-d621-4d21-af3d-f4110c1ebc7e", "utteranceId": "7f33bd5b-2cbc-4131-86b5-8a47764dc6ad", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true } }, "emotions": { "behavior": EmotionBehaviorCode.NEUTRAL, "strength": EmotionStrengthCode.STRONG } },
      { "type": 5, "date": "2023-03-17T13:44:43.716Z", "packetId": { "packetId": "f0129b4c-12a6-43ea-b2bb-09ae82c08a0a", "utteranceId": "0fbe5d50-5111-4314-b43b-c40093f0daee", "interactionId": "b7834d90-220e-4162-bc02-110273d35cbc" }, "routing": { "source": { "name": "13c49c46-0141-4308-9808-1f830f23f20a", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "control": { "type": 3 } }
    ],
    [
      { text: "Hello there, welcome to the lab!" },
      { text: "I am Core AI Test 23, but you can call me Jarvis." },
      { text: "How may I assist you today?" },
      { text: "Do you have any interesting science facts or perhaps...a Shard to share?" }
    ]
  )
}
if (true) {
  testTextThenAudioThenEmotion(
    [
      { "packetId": { "packetId": "b06f124b-4b31-443d-995a-3c7950f4a879", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.882Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " Hey there!", "final": true } },
      { "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } },
      { "packetId": { "packetId": "9db71832-3e51-4ef5-b5af-9d9f4348eb4b", "utteranceId": "051aa758-c23c-4eca-80fb-0fd868988ba8", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("EMOTION"), "emotions": { "behavior": EmotionBehaviorCode.JOY, "strength": EmotionStrengthCode.NORMAL } }
    ])
}
if (true) {
  testTextOnlyAnotherUtteranceAudioText(
    [
      { "packetId": { "packetId": "b06f124b-4b31-443d-995a-3c7950f4a879", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.882Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " Hey there!", "final": true } },
      { "packetId": { "packetId": "e386f5cb-75d4-420d-90ba-05651d113d1b", "utteranceId": "e8bbf1f4-bf18-4fbc-8161-8bea3310abf5", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.326Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } },
      { "packetId": { "packetId": "42a74017-c90f-45d2-9d3e-51a4f6830880", "utteranceId": "e8bbf1f4-bf18-4fbc-8161-8bea3310abf5", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.234Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " I'm the Scientist Assistant, known as 'Thing Collector'.", "final": true } }
    ])


  //TODO add tests for "endOfInteraction" flag 
  //TODO add a test where END INTERACTION is from a different interactionId to help test getting a stream from 2 different NPCs, maybe add next(interactId) to filter when scanning?
  testSingleHappyPath(thingCollector_hiThere)
  testNothing([])
  testAudioOnly([{ "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } }])

  testTextThenAudio(
    [
      { "packetId": { "packetId": "b06f124b-4b31-443d-995a-3c7950f4a879", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.882Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " Hey there!", "final": true } },
      { "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } }
    ])
  testTextThenEmotionThenAudio(
    [
      { "packetId": { "packetId": "b06f124b-4b31-443d-995a-3c7950f4a879", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.882Z", "type": getMessageTypeAsInt("TEXT"), "text": { "text": " Hey there!", "final": true } },
      { "packetId": { "packetId": "9db71832-3e51-4ef5-b5af-9d9f4348eb4b", "utteranceId": "051aa758-c23c-4eca-80fb-0fd868988ba8", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "", "isPlayer": true, "isCharacter": false }, "target": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("EMOTION"), "emotions": { "behavior": EmotionBehaviorCode.JOY, "strength": EmotionStrengthCode.NORMAL } },
      { "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } }
    ])
  testTextOnlyEndControl(
    [
      { "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } },
      { "packetId": { "packetId": "2641c983-b921-4403-93c9-f65015aa86a1", "utteranceId": "cff2adf6-852c-422c-a937-ed82e65639d6", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.482Z", "type": getMessageTypeAsInt("CONTROL"), "control": { "type": getControlTypeAsInt("INTERACTION_END") } }]
  )
  testControlOnly([
    { "type": 5, "date": "2023-03-10T21:11:34.959Z", "packetId": { "packetId": "4352b5d3-292a-4de5-9d94-63c2928af162", "utteranceId": "fe7f4ac1-548c-46e1-b49e-31f0ebe13b02", "interactionId": "354c0214-5e78-4649-89b2-0bfb90fc679f" }, "routing": { "source": { "name": "f12bb175-ab7a-486f-a6e9-37a50e11d00b", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "control": { "type": 3 } }
  ])
  testTextOnlyThenEndControl(
    [
      { "packetId": { "packetId": "3545764d-cc57-4064-ad50-970abfbd6fbe", "utteranceId": "0c0cceba-955f-4c8d-a8c5-eb5027b8ec70", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:19.945Z", "type": getMessageTypeAsInt("AUDIO"), "audio": { "chunk": "truncated" } },
      { "packetId": { "packetId": "2641c983-b921-4403-93c9-f65015aa86a1", "utteranceId": "cff2adf6-852c-422c-a937-ed82e65639d6", "interactionId": "1822c207-d40c-4bba-983b-3c9ced7373a3" }, "routing": { "source": { "name": "097ce587-2fd3-450a-b22f-522f5c552499", "isPlayer": false, "isCharacter": true }, "target": { "name": "", "isPlayer": true, "isCharacter": false } }, "date": "2023-03-09T19:49:20.482Z", "type": getMessageTypeAsInt("CONTROL"), "control": { "type": getControlTypeAsInt("INTERACTION_END") } }]
  )
}
log(CLASSNAME, "ENDED", "UNIT.TEST.RESULT", "TOTAL_TESTS", TOTAL_TESTS, "TOTAL_PASS", TOTAL_PASS)