import { createCanvas } from "canvas"
import sharp from "sharp"

/* ================= SMART WRAP ================= */
const wrapText = (ctx, text, maxWidth, fontSize) => {
  ctx.font = `bold ${fontSize}px Arial`
  const words = text.trim().split(/\s+/)
  const lines = []
  let line = ""

  for (const word of words) {
    const test = line ? line + " " + word : word
    if (ctx.measureText(test).width <= maxWidth) {
      line = test
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

/* ================= AUTO FONT RESIZE ================= */
const autoFont = (ctx, text, maxW, maxH) => {
  let size = 220
  const minSize = 28
  const lineGap = 1.1

  while (size >= minSize) {
    const lines = wrapText(ctx, text, maxW, size)
    const height = lines.length * size * lineGap

    const tooWide = lines.some(
      l => ctx.measureText(l).width > maxW
    )

    if (!tooWide && height <= maxH) {
      return {
        size,
        lines,
        lineHeight: size * lineGap
      }
    }
    size -= 3
  }

  return {
    size: minSize,
    lines: wrapText(ctx, text, maxW, minSize),
    lineHeight: minSize * lineGap
  }
}

/* ================= BRAT GENERATOR ================= */
export const generateBrat = async (
  text = "brat and it's the same but there's more songs so it's not"
) => {
  const size = 512
  const pad = 28

  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")

  /* background */
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, size, size)

  /* text */
  ctx.fillStyle = "#000000"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"

  const { size: fontSize, lines, lineHeight } =
    autoFont(ctx, text, size - pad * 2, size - pad * 2)

  ctx.font = `bold ${fontSize}px Arial`

  let y = pad
  for (const line of lines) {
    ctx.fillText(line, pad, y)
    y += lineHeight
  }

  return sharp(canvas.toBuffer())
    .webp({ quality: 100 })
    .toBuffer()
}

/* ================= IQC ================= */
export const generateIQC = async () => {
  const list = [
    "IQ 78",
    "IQ 120",
    "IQ ERROR",
    "IQ 999",
    "TERLALU PINTAR"
  ]
  return generateBrat(
    list[Math.floor(Math.random() * list.length)]
  )
}
