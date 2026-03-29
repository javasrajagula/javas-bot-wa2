import { createCanvas, loadImage, registerFont } from "canvas"

// OPTIONAL FONT
// registerFont("./fonts/SF-Pro-Display-Regular.ttf", { family: "SF Pro" })

export async function generateChatBubbleAvatar({
  text = "halo aku javas",
  name = "Javas",
  avatar = null // path / URL gambar avatar (opsional)
}) {
  /* ===== CANVAS ===== */
  const width = 1080
  const height = 1920
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  /* ===== BACKGROUND ===== */
  ctx.fillStyle = "#0b141a"
  ctx.fillRect(0, 0, width, height)

  ctx.globalAlpha = 0.15
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = i % 2 ? "#10332f" : "#0f2a26"
    ctx.fillRect(
      Math.random() * width,
      Math.random() * height,
      300,
      200
    )
  }
  ctx.globalAlpha = 1

  /* ===== STATUS BAR ===== */
  ctx.font = "32px Helvetica"
  ctx.fillStyle = "#ffffff"
  ctx.fillText("telkomsel  LTE", 40, 52)
  ctx.fillText("09.41", width / 2 - 32, 52)

  /* ===== AVATAR ===== */
  const avatarX = 60
  const avatarY = 300
  const avatarSize = 96

  ctx.save()
  ctx.beginPath()
  ctx.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2
  )
  ctx.closePath()
  ctx.clip()

  if (avatar) {
    const img = await loadImage(avatar)
    ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize)
  } else {
    // placeholder avatar
    ctx.fillStyle = "#2a2f32"
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize)

    ctx.fillStyle = "#ffffff"
    ctx.font = "40px Helvetica"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(
      name[0]?.toUpperCase() || "?",
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2
    )
  }
  ctx.restore()

  /* ===== NAME ===== */
  ctx.font = "32px Helvetica"
  ctx.fillStyle = "#aebac1"
  ctx.textAlign = "left"
  ctx.fillText(name, avatarX + avatarSize + 24, avatarY + 4)

  /* ===== CHAT BUBBLE ===== */
  ctx.font = "42px Helvetica"
  ctx.textBaseline = "top"
  ctx.textAlign = "left"

  const paddingX = 36
  const paddingY = 26
  const maxWidth = 720
  const lineHeight = 56

  const lines = wrapLines(ctx, text, maxWidth - paddingX * 2)

  const bubbleWidth =
    Math.max(...lines.map(l => ctx.measureText(l).width)) +
    paddingX * 2

  const bubbleHeight =
    lines.length * lineHeight + paddingY * 2

  const x = avatarX + avatarSize + 24
  const y = avatarY + 36
  const r = 36

  ctx.fillStyle = "#2a2f32"
  roundedRect(ctx, x, y, bubbleWidth, bubbleHeight, r)
  ctx.fill()

  // tail bubble
  ctx.beginPath()
  ctx.moveTo(x - 16, y + 46)
  ctx.lineTo(x + 8, y + 84)
  ctx.lineTo(x + 8, y + 20)
  ctx.closePath()
  ctx.fill()

  /* ===== TEXT ===== */
  ctx.fillStyle = "#ffffff"
  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      x + paddingX,
      y + paddingY + i * lineHeight
    )
  })

  /* ===== TIME ===== */
  ctx.font = "26px Helvetica"
  ctx.fillStyle = "#9aa0a6"
  ctx.fillText(
    "09.41",
    x + bubbleWidth - 80,
    y + bubbleHeight + 10
  )

  return canvas.toBuffer("image/png")
}

/* ===== HELPERS ===== */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(" ")
  const lines = []
  let line = ""

  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxWidth) {
      lines.push(line.trim())
      line = word + " "
    } else {
      line = test
    }
  }
  if (line) lines.push(line.trim())
  return lines
}
