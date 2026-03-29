import sharp from "sharp"
import ffmpeg from "fluent-ffmpeg"
import { tmpdir } from "os"
import { join } from "path"
import { promises as fs } from "fs"
import { Sticker } from "wa-sticker-formatter"

/* ================= CONFIG ================= */

const PACK = "JAVAS BOT"
const AUTHOR = "© Javas"

/* ================= IMAGE → STICKER ================= */

export const imageToSticker = async (buffer) => {
  const img = await sharp(buffer)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer()

  const sticker = new Sticker(img, {
    pack: PACK,
    author: AUTHOR,
    quality: 100
  })

  return await sticker.toBuffer()
}

/* ================= IMAGE → HD ================= */

export const imageToHD = async (buffer, options = {}) => {
  const { scale = 2 } = options
  const img = sharp(buffer)
  const meta = await img.metadata()

  return img
    .resize(meta.width * scale, meta.height * scale, { fit: "inside" })
    .jpeg({ quality: 95 })
    .toBuffer()
}

/* ================= VIDEO → STICKER ================= */

export const videoToSticker = async (buffer) => {
  const tmpVideo = join(tmpdir(), `vid_${Date.now()}.mp4`)
  const tmpPng = join(tmpdir(), `frame_${Date.now()}.png`)

  await fs.writeFile(tmpVideo, buffer)

  await new Promise((resolve, reject) => {
    ffmpeg(tmpVideo)
      .on("end", resolve)
      .on("error", reject)
      .screenshots({
        count: 1,
        folder: tmpdir(),
        filename: tmpPng.split("/").pop(),
        size: "512x512"
      })
  })

  const img = await fs.readFile(tmpPng)
  await fs.unlink(tmpVideo)
  await fs.unlink(tmpPng)

  const sticker = new Sticker(img, {
    pack: PACK,
    author: AUTHOR,
    animated: true,
    quality: 100
  })

  return await sticker.toBuffer()
}

/* ================= IMAGE + TEXT ================= */

export const imageToStickerWithText = async (buffer, text = "") => {
  const size = 512
  const padding = 20
  const maxChars = 15

  const lines = []
  for (let i = 0; i < text.length; i += maxChars)
    lines.push(text.slice(i, i + maxChars))

  let fontSize = Math.max(24, Math.floor(60 / lines.length))

  let svg = `<svg width="${size}" height="${size}">
    <style>
      .t {
        fill: white;
        font-size: ${fontSize}px;
        font-weight: bold;
        font-family: Arial;
      }
    </style>`

  lines.forEach((line, i) => {
    const y = size - padding - (lines.length - 1 - i) * (fontSize + 6)
    svg += `<text x="50%" y="${y}" text-anchor="middle" class="t">${line}</text>`
  })

  svg += `</svg>`

  const img = await sharp(buffer)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .composite([{ input: Buffer.from(svg) }])
    .png()
    .toBuffer()

  const sticker = new Sticker(img, {
    pack: PACK,
    author: AUTHOR,
    quality: 100
  })

  return await sticker.toBuffer()
}
