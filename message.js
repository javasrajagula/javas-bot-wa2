import { menu } from "../lib/menu.js"
import { levelUp, stats } from "../lib/level.js"
import { ww } from "../lib/werewolf.js"
import { generateIQC, generateBrat } from "../lib/generator.js"
import {
  imageToSticker,
  imageToHD,
  videoToSticker,
  imageToStickerWithText
} from "../lib/sticker.js"
import { stickerToImage } from "../lib/stickerToImage.js"
import { downloadMedia } from "../lib/downloader.js"
import { generateChatBubbleAvatar } from "../lib/chatBubbleAvatar.js"
import { ultimaAIv6 } from "../lib/ai.js"
import { pvpCommand } from "../lib/pvp/index.js"
import { rpsHandler } from "../lib/rps.js"
import { saveMessage } from "../lib/userStats.js"
import { saveGroupMessage } from "../lib/groupStats.js"
import { isOwner } from "../lib/owner.js"
import { downloadMediaMessage } from "@whiskeysockets/baileys"

export const handleMessage = async (sock, msg) => {
  try {
    const jid = msg.key.remoteJid
    const sender = msg.key.participant || jid
    const m = msg.message
    if (!m) return

    const body =
      m.conversation ||
      m.extendedTextMessage?.text ||
      m.imageMessage?.caption ||
      ""

    if (!body.startsWith(".")) return

    const args = body.trim().split(/\s+/)
    const command = args[0].toLowerCase()

    saveMessage(jid, sender, true)
    saveGroupMessage(jid)
    levelUp(jid)

    console.log("📩 CMD:", command)

    /* ===== MENU ===== */
    if (command === ".menu" || command === ".help")
      return sock.sendMessage(jid, { text: menu() })

    if (command === ".ping")
      return sock.sendMessage(jid, { text: "🏓 Pong! Bot aktif." })

    if (command === ".stats")
      return sock.sendMessage(jid, { text: stats(jid) })

    /* ===== STICKER ===== */
    if (command === ".sticker") {
      const q = m.extendedTextMessage?.contextInfo?.quotedMessage
      if (!q?.imageMessage)
        return sock.sendMessage(jid, { text: "❗ Reply gambar" })

      const buf = await downloadMediaMessage({ message: q }, "buffer")
      return sock.sendMessage(jid, { sticker: await imageToSticker(buf) })
    }

    if (command === ".vsticker") {
      const q = m.extendedTextMessage?.contextInfo?.quotedMessage
      if (!q?.videoMessage)
        return sock.sendMessage(jid, { text: "❗ Reply video" })

      const buf = await downloadMediaMessage({ message: q }, "buffer")
      return sock.sendMessage(jid, { sticker: await videoToSticker(buf) })
    }

    if (command === ".stickertext") {
      const q = m.extendedTextMessage?.contextInfo?.quotedMessage
      if (!q?.imageMessage)
        return sock.sendMessage(jid, { text: "❗ Reply gambar" })

      const buf = await downloadMediaMessage({ message: q }, "buffer")
      const txt = args.slice(1).join(" ")
      return sock.sendMessage(jid, {
        sticker: await imageToStickerWithText(buf, txt)
      })
    }

    if (command === ".toimg") {
      const q = m.extendedTextMessage?.contextInfo?.quotedMessage
      if (!q?.stickerMessage)
        return sock.sendMessage(jid, { text: "❗ Reply stiker" })

      const buf = await downloadMediaMessage({ message: q }, "buffer")
      return sock.sendMessage(jid, { image: await stickerToImage(buf) })
    }

    if (command === ".hd") {
      const q = m.extendedTextMessage?.contextInfo?.quotedMessage
      if (!q?.imageMessage)
        return sock.sendMessage(jid, { text: "❗ Reply gambar" })

      const buf = await downloadMediaMessage({ message: q }, "buffer")
      return sock.sendMessage(jid, { image: await imageToHD(buf) })
    }

    /* ===== DOWNLOADER ===== */
    if (command === ".tt" || command === ".ig") {
      if (!args[1])
        return sock.sendMessage(jid, { text: "❗ Masukkan URL" })

      await sock.sendMessage(jid, { text: "⏳ Mengunduh..." })
      const vid = await downloadMedia(args[1])

      return sock.sendMessage(jid, {
        video: vid,
        mimetype: "video/mp4",
        caption: "✅ No Watermark"
      })
    }

    /* ===== FUN ===== */
    if (command === ".iqc")
      return sock.sendMessage(jid, { sticker: await generateIQC() })

    if (command === ".brat") {
      const t = args.slice(1).join(" ") || "BRAT"
      return sock.sendMessage(jid, { sticker: await generateBrat(t) })
    }

    if (command === ".ww") return ww(sock, msg, body)

    /* ===== CHAT PORTRAIT (ONLY) ===== */
    if (command === ".chatp") {
      const raw = args.slice(1).join(" ")
      if (!raw)
        return sock.sendMessage(jid, {
          text: "❗ Contoh: .chatp Javas | halo aku javas"
        })

      let name, text
      if (raw.includes("|")) {
        ;[name, text] = raw.split("|").map(v => v.trim())
      } else {
        name = msg.pushName || "Kontak"
        text = raw
      }

      const img = await generateChatBubbleAvatar({ name, text })
      return sock.sendMessage(jid, { image: img })
    }

    /* ===== AI ===== */
    if (command === ".ai") {
      const t = args.slice(1).join(" ")
      return sock.sendMessage(jid, { text: await ultimaAIv6(t) })
    }

    /* ===== GAME ===== */
    if (command === ".pvp") {
      const res = await pvpCommand(sock, msg, args.slice(1))
      if (res) return sock.sendMessage(jid, { text: res })
    }

    if (command === ".rps")
      return rpsHandler(sock, msg, args.slice(1))

    /* ===== OWNER ===== */
    if (command === ".owner")
      return sock.sendMessage(jid, {
        text: isOwner(sender) ? "👑 Kamu OWNER" : "❌ Kamu bukan owner"
      })

    if (command === ".shutdown" && isOwner(sender)) {
      await sock.sendMessage(jid, { text: "🛑 Bot dimatikan" })
      process.exit(0)
    }

  } catch (err) {
    console.error("❌ ERROR:", err)
    return sock.sendMessage(
      msg.key.remoteJid,
      { text: "❌ Terjadi error." }
    )
  }
}
