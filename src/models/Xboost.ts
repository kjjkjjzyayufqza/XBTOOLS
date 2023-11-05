import * as finder from "@/finder/hashFinder"
import { FieldType } from "@/pages"
import { writeBinaryFile } from "@tauri-apps/api/fs"
import { message } from "antd"

export function Xboost (buffer: Buffer, option: FieldType): Promise<any> {
  // console.log(buffer,option)
  changeResolution(buffer, option.resolutionWidth, option.resolutionHeight)

  changeCharacterSelectTime(buffer, option.disableCharacterSelectTime)
  changeInterfaceSelectTime(buffer, option.disableInterfaceSelectTime)
  changePlayingModeTime(buffer, option.disablePlayingModelTime)

  return new Promise((resolve, reject) => {
    resolve(saveFileToPath(buffer, option.exeUrl))
  })
}

function changeResolution (buffer: Buffer, width: number, height: number) {
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_1)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_2)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_3)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_4)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_5)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_6)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_7)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_8)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_9)
  buffer.writeInt32LE(width, finder.ResolutionWidthOffset_10)

  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_1)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_2)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_3)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_4)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_5)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_6)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_7)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_8)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_9)
  buffer.writeInt32LE(height, finder.ResolutionHeightOffset_10)
}

function changeCharacterSelectTime (buffer: Buffer, option: boolean) {
  if (option) {
    const list = [
      finder.CharacterSelectTimeOffset_1,
      finder.CharacterSelectTimeOffset_2,
      finder.CharacterSelectTimeOffset_3,
    ]
    for (let i of list) {
      for (let bufferCount = 0; bufferCount < i.count; bufferCount++) {
        buffer.writeUInt8(0x90, i.offset + bufferCount)
      }
    }
  } else {
    const list = [
      finder.CharacterSelectTimeOffsetRestore_1,
      finder.CharacterSelectTimeOffsetRestore_2,
      finder.CharacterSelectTimeOffsetRestore_3,
    ]
    for (let i of list) {
      i.buffer.copy(buffer, i.offset)
    }
  }
}

function changeInterfaceSelectTime (buffer: Buffer, option: boolean) {
  if (option) {
    const list = [
      finder.InterfaceSelectTimeOffset_1,
      finder.InterfaceSelectTimeOffset_2,
      finder.InterfaceSelectTimeOffset_3,
      finder.InterfaceSelectTimeOffset_4,
      finder.InterfaceSelectTimeOffset_5,
    ]
    for (let i of list) {
      for (let bufferCount = 0; bufferCount < i.count; bufferCount++) {
        buffer.writeUInt8(0x90, i.offset + bufferCount)
      }
    }
  } else {
    const list = [
      finder.InterfaceSelectTimeOffsetRestore_1,
      finder.InterfaceSelectTimeOffsetRestore_2,
      finder.InterfaceSelectTimeOffsetRestore_3,
      finder.InterfaceSelectTimeOffsetRestore_4,
      finder.InterfaceSelectTimeOffsetRestore_5,
    ]
    for (let i of list) {
      i.buffer.copy(buffer, i.offset)
    }
  }
}

function changePlayingModeTime (buffer: Buffer, option: boolean) {
  if (option) {
    const list = [finder.PlayingModeTimeOffset_1]
    for (let i of list) {
      for (let bufferCount = 0; bufferCount < i.count; bufferCount++) {
        buffer.writeUInt8(0x90, i.offset + bufferCount)
      }
    }
  } else {
    const list = [finder.PlayingModeTimeOffsetRestore_1]
    for (let i of list) {
      i.buffer.copy(buffer, i.offset)
    }
  }
}

async function saveFileToPath (buffer: Buffer, url: string) {
  message.info("Staring Write File")
  await writeBinaryFile(url, buffer)
}
