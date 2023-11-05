export function getBufferFromString (str: string): Buffer {
  return Buffer.from(str.replace(/ /g, ""), "hex")
}

export const fileMagic: Buffer = getBufferFromString(
  "B9 03 00 00 00 48 8D 05 9C 57 87 02 33 D2 66 90 66 89 50 F8 48 89 10 48 C7 40 08 01 00 00 00 48".replace(
    " ",
    "",
  ),
)

export const fileCheckTotalSize: number = 0x206f200

export const ResolutionWidthOffset_1: number = 0x100ca3
export const ResolutionHeightOffset_1: number = 0x100cad

export const ResolutionWidthOffset_2: number = 0x100cb7
export const ResolutionHeightOffset_2: number = 0x100cc1

export const ResolutionWidthOffset_3: number = 0x108808
export const ResolutionHeightOffset_3: number = 0x108812

export const ResolutionWidthOffset_4: number = 0x10881c
export const ResolutionHeightOffset_4: number = 0x108826

export const ResolutionWidthOffset_5: number = 0x108830
export const ResolutionHeightOffset_5: number = 0x10883a

export const ResolutionWidthOffset_6: number = 0x108d26
export const ResolutionHeightOffset_6: number = 0x108d30

export const ResolutionWidthOffset_7: number = 0x108d3a
export const ResolutionHeightOffset_7: number = 0x108d44

export const ResolutionWidthOffset_8: number = 0x2a5380
export const ResolutionHeightOffset_8: number = 0x2a5388

export const ResolutionWidthOffset_9: number = 0x2a552f
export const ResolutionHeightOffset_9: number = 0x2a5539

export const ResolutionWidthOffset_10: number = 0x6df280
export const ResolutionHeightOffset_10: number = 0x6df289

export const CharacterSelectTimeOffset_1 = { offset: 0x9d4751, count: 3 }
export const CharacterSelectTimeOffset_2 = { offset: 0x9d50c2, count: 3 }
export const CharacterSelectTimeOffset_3 = { offset: 0x9d947e, count: 3 }

export const InterfaceSelectTimeOffset_1 = { offset: 0x9da6e9, count: 3 }
export const InterfaceSelectTimeOffset_2 = { offset: 0x9da7fb, count: 3 }
export const InterfaceSelectTimeOffset_3 = { offset: 0x9403f7, count: 6 }
export const InterfaceSelectTimeOffset_4 = { offset: 0x9d1afd, count: 3 }
export const InterfaceSelectTimeOffset_5 = { offset: 0x978c37, count: 6 }

export const PlayingModeTimeOffset_1 = { offset: 0x789ce3, count: 6 }

//restore
export const CharacterSelectTimeOffsetRestore_1 = {
  offset: 0x9d4751,
  buffer: getBufferFromString("FF 47 0C"),
}
export const CharacterSelectTimeOffsetRestore_2 = {
  offset: 0x9d50c2,
  buffer: getBufferFromString("FF 43 0C"),
}
export const CharacterSelectTimeOffsetRestore_3 = {
  offset: 0x9d947e,
  buffer: getBufferFromString("FF 47 7C"),
}

export const InterfaceSelectTimeOffsetRestore_1 = {
  offset: 0x9da6e9,
  buffer: getBufferFromString("FF 47 0C"),
}
export const InterfaceSelectTimeOffsetRestore_2 = {
  offset: 0x9da7fb,
  buffer: getBufferFromString("FF 43 0C"),
}
export const InterfaceSelectTimeOffsetRestore_3 = {
  offset: 0x9403f7,
  buffer: getBufferFromString("FF 83 E4 07 00 00"),
}
export const InterfaceSelectTimeOffsetRestore_4 = {
  offset: 0x9d1afd,
  buffer: getBufferFromString("89 41 50"),
}
export const InterfaceSelectTimeOffsetRestore_5 = {
  offset: 0x978c37,
  buffer: getBufferFromString("FF 87 28 05 00 00"),
}

export const PlayingModeTimeOffsetRestore_1 = {
  offset: 0x789ce3,
  buffer: getBufferFromString("89 91 A4 04 00 00"),
}
