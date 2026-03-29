// ===============================
// ULTIMA AI v6.2 FULL SMART CORE
// ===============================

export function ultimaAIv6(input = "", context = {}) {
  if (typeof input !== "string") return "Aku belum mengerti 😅"

  const text = input.toLowerCase().trim()

  // ===============================
  // CONTEXT & MEMORY
  // ===============================
  context.memory ??= {
    lastQuestion: "",
    topic: "",
    mode: "normal", // normal | belajar
    knowledgeLog: []
  }

  context.memory.lastQuestion = text

  // ===============================
  // CORE Q&A DATABASE
  // ===============================
  const qaDatabase = [
    { q: /siapa presiden indonesia/i, a: "Presiden Indonesia saat ini adalah Joko Widodo 🇮🇩" },
    { q: /ibukota indonesia|ibu kota indonesia/i, a: "Ibukota Indonesia adalah Jakarta 🏙️" },
    { q: /apa itu ai/i, a: "AI adalah kecerdasan buatan 🤖 yang mampu belajar, menganalisis, dan beradaptasi." },
    { q: /siapa kamu/i, a: "Aku Javas Ultima AI v6.2 ⚡ pintar, adaptif, dan terus belajar." },
    { q: /halo|hai|hi/i, a: "Halo 👋 Senang bertemu denganmu 😄" },
    { q: /lelucon|joke/i, a: "Kenapa programmer jarang keluar rumah? Karena takut kehilangan cache 😅" }
  ]

  for (const item of qaDatabase) {
    if (item.q.test(text)) return item.a
  }

  // ===============================
  // MATEMATIKA SUPER
  // ===============================
  try {
    let expr = text
      .replace(/\^/g, "**")
      .replace(/x/g, "*")
      .replace(/√(\d+)/g, "Math.sqrt($1)")

    if (/^[0-9+\-*/().\s%^√]+$/.test(expr)) {
      const result = Function(`return ${expr}`)()
      if (!isNaN(result)) return `🧮 Hasilnya: ${result}`
    }
  } catch {}

  // ===============================
  // EXTENDED KNOWLEDGE CORE
  // ===============================
  const knowledgeBase = {
    sejarah: [
      "Proklamasi Indonesia terjadi pada 17 Agustus 1945 🇮🇩",
      "Kerajaan Majapahit mencapai puncak kejayaan di era Hayam Wuruk",
      "Perang Dunia II berakhir tahun 1945"
    ],
    sains: [
      "Air memiliki rumus kimia H₂O 💧",
      "Gravitasi pertama kali diformulasikan oleh Isaac Newton 🍎",
      "Fotosintesis mengubah cahaya matahari menjadi energi 🌱"
    ],
    agama: [
      "Islam memiliki 5 rukun",
      "Sholat wajib dilakukan 5 waktu sehari",
      "Al-Qur'an terdiri dari 114 surat"
    ]
  }

  if (/sejarah|peristiwa|zaman/.test(text)) {
    context.memory.topic = "sejarah"
    return "📜 Sejarah:\n" + randomPick(knowledgeBase.sejarah)
  }

  if (/sains|ilmu|fisika|biologi/.test(text)) {
    context.memory.topic = "sains"
    return "🔬 Sains:\n" + randomPick(knowledgeBase.sains)
  }

  if (/agama|islam|sholat|alquran/i.test(text)) {
    context.memory.topic = "agama"
    return "🕌 Agama:\n" + randomPick(knowledgeBase.agama)
  }

  // ===============================
  // MODE BELAJAR (EDUKATIF)
  // ===============================
  if (/mode belajar on/i.test(text)) {
    context.memory.mode = "belajar"
    return "🎓 Mode Belajar AKTIF!\nJawaban akan lebih terstruktur & edukatif."
  }

  if (/mode belajar off/i.test(text)) {
    context.memory.mode = "normal"
    return "🔁 Mode Normal aktif kembali."
  }

  if (context.memory.mode === "belajar") {
    if (/apa itu (.+)/i.test(text)) {
      const topik = text.match(/apa itu (.+)/i)[1]
      return (
        `📘 *${topik.toUpperCase()}*\n` +
        `Definisi: konsep dasar yang penting dipahami.\n` +
        `Contoh dan penjelasan bisa aku lanjutkan jika kamu mau.`
      )
    }
  }

  // ===============================
  // 🧠 FEATURE 6 — AI AUTO UPDATE KNOWLEDGE
  // ===============================
  if (/tambah pengetahuan|update pengetahuan|aku belajar/i.test(text)) {
    const learned = simulateLearning(text)
    context.memory.knowledgeLog.push(learned)

    return (
      "🧠 Pengetahuan baru diserap!\n" +
      `📌 Ringkasan: ${learned}\n` +
      "Aku akan gunakan ini untuk jawaban selanjutnya."
    )
  }

  if (/apa yang kamu pelajari/i.test(text)) {
    if (context.memory.knowledgeLog.length === 0)
      return "Aku belum belajar hal baru dari kamu."

    return (
      "📚 Pengetahuan yang kupelajari:\n" +
      context.memory.knowledgeLog.map((k, i) => `${i + 1}. ${k}`).join("\n")
    )
  }

  // ===============================
  // EMOTION DETECTION
  // ===============================
  const emotions = {
    sedih: ["Aku di sini 🤍", "Kamu nggak sendiri 😔", "Pelan-pelan ya"],
    marah: ["Tenang dulu 😤", "Tarik napas", "Aku paham"],
    bosan: ["Mau main game? 🎮", "Aku punya fakta seru 😄"],
    senang: ["Ikut senang 😁", "Mantap 🌈"]
  }

  for (const e in emotions) {
    if (text.includes(e)) {
      return randomPick(emotions[e])
    }
  }

  // ===============================
  // MINI GAME
  // ===============================
  if (/game|main|tebak|quiz/.test(text)) {
    context.memory.topic = "game"
    return randomPick([
      "🎯 Tebak angka 1–10!",
      "❓ Quiz: Siapa penemu lampu?",
      "⚔️ PVP mini: pilih angka 1–3!"
    ])
  }

  // ===============================
  // BOT FEATURE TIPS
  // ===============================
  if (/stiker|download|video|tt|ig/.test(text)) {
    return randomPick([
      "📥 Bisa download TT & IG tanpa watermark",
      "🖼️ Kirim gambar untuk jadi stiker",
      "⚙️ Semua fitur ada di menu bot"
    ])
  }

  // ===============================
  // SMART CONTEXT CONTINUATION
  // ===============================
  if (/lanjut|jelaskan lebih/i.test(text) && context.memory.topic) {
    return `Kita masih bahas *${context.memory.topic}*. Mau versi singkat atau detail?`
  }

  // ===============================
  // DEFAULT SMART REPLY
  // ===============================
  return randomPick([
    "Menarik 🤔 jelaskan lebih detail",
    "Aku paham sedikit, lanjutkan 👀",
    "Mau aku jelaskan dari sisi lain?",
    "Aku bisa belajar dari kamu juga 😎",
    "Mau fakta, belajar, atau main game?"
  ])
}

// ===============================
// UTIL
// ===============================
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function simulateLearning(text) {
  return "Informasi baru terkait: " + text.slice(0, 60)
}
