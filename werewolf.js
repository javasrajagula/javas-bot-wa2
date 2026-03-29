// ===============================
// WEREWOLF GAME v2 - COMPLEX
// ===============================

let game = {
  started: false,
  phase: "idle", // idle | night | day | end
  players: [], // { id, role, alive }
  votes: {},
  nightAction: {},
  maxPlayers: 8,
  minPlayers: 5
}

const ROLES = ["wolf", "seer", "villager", "villager", "villager"]

export const ww = async (sock, msg, text) => {
  const jid = msg.key.remoteJid
  const user = msg.key.participant || jid

  // ===============================
  // START GAME
  // ===============================
  if (text === ".ww start") {
    if (game.started)
      return sock.sendMessage(jid, { text: "⚠️ Game sudah berjalan!" })

    game = {
      started: true,
      phase: "idle",
      players: [],
      votes: {},
      nightAction: {},
      maxPlayers: 8,
      minPlayers: 5
    }

    return sock.sendMessage(jid, {
      text:
        "🐺 *WEREWOLF DIMULAI*\n\n" +
        "• Min 5 pemain\n" +
        "• Max 8 pemain\n\n" +
        "Ketik *.ww join* untuk bergabung"
    })
  }

  // ===============================
  // JOIN
  // ===============================
  if (text === ".ww join") {
    if (!game.started)
      return sock.sendMessage(jid, { text: "❌ Game belum dimulai" })

    if (game.players.find(p => p.id === user))
      return sock.sendMessage(jid, { text: "⚠️ Kamu sudah join" })

    if (game.players.length >= game.maxPlayers)
      return sock.sendMessage(jid, { text: "❌ Slot penuh" })

    game.players.push({ id: user, role: null, alive: true })

    return sock.sendMessage(jid, {
      text: `👤 Player masuk (${game.players.length}/${game.maxPlayers})`
    })
  }

  // ===============================
  // ROLE DISTRIBUTION
  // ===============================
  if (text === ".ww role") {
    if (game.players.length < game.minPlayers)
      return sock.sendMessage(jid, { text: "❌ Pemain kurang (min 5)" })

    shuffle(ROLES)

    game.players.forEach((p, i) => {
      p.role = ROLES[i % ROLES.length]
      sock.sendMessage(p.id, {
        text: `🎭 *ROLE KAMU*: ${p.role.toUpperCase()}`
      })
    })

    game.phase = "night"

    return sock.sendMessage(jid, {
      text:
        "🌙 *MALAM HARI*\n" +
        "• Wolf: *.ww kill @user*\n" +
        "• Seer: *.ww cek @user*"
    })
  }

  // ===============================
  // NIGHT ACTION
  // ===============================
  if (game.phase === "night" && text.startsWith(".ww kill")) {
    const player = game.players.find(p => p.id === user && p.alive)
    if (!player || player.role !== "wolf") return

    const target = msg.message?.extendedTextMessage?.mentionedJid?.[0]
    if (!target) return

    game.nightAction.kill = target
    return sock.sendMessage(user, { text: "🐺 Target dipilih" })
  }

  if (game.phase === "night" && text.startsWith(".ww cek")) {
    const player = game.players.find(p => p.id === user && p.alive)
    if (!player || player.role !== "seer") return

    const targetId = msg.message?.extendedTextMessage?.mentionedJid?.[0]
    const target = game.players.find(p => p.id === targetId)

    if (!target) return

    return sock.sendMessage(user, {
      text: `🔮 Target adalah *${target.role.toUpperCase()}*`
    })
  }

  // ===============================
  // NEXT DAY
  // ===============================
  if (text === ".ww day" && game.phase === "night") {
    game.phase = "day"

    const victim = game.players.find(p => p.id === game.nightAction.kill)
    if (victim) victim.alive = false

    return sock.sendMessage(jid, {
      text:
        "☀️ *SIANG HARI*\n" +
        (victim
          ? `💀 ${victim.id.split("@")[0]} mati\n`
          : "Tidak ada korban\n") +
        "\nVoting: *.ww vote @user*"
    })
  }

  // ===============================
  // VOTING
  // ===============================
  if (game.phase === "day" && text.startsWith(".ww vote")) {
    const voter = game.players.find(p => p.id === user && p.alive)
    if (!voter) return

    const target = msg.message?.extendedTextMessage?.mentionedJid?.[0]
    if (!target) return

    game.votes[user] = target

    return sock.sendMessage(jid, {
      text: `🗳️ Vote diterima (${Object.keys(game.votes).length})`
    })
  }

  // ===============================
  // END DAY & CHECK WIN
  // ===============================
  if (text === ".ww end" && game.phase === "day") {
    const result = countVotes(game.votes)
    const eliminated = game.players.find(p => p.id === result)

    if (eliminated) eliminated.alive = false

    const aliveWolf = game.players.filter(p => p.role === "wolf" && p.alive)
    const aliveOther = game.players.filter(p => p.role !== "wolf" && p.alive)

    if (aliveWolf.length === 0) {
      game.phase = "end"
      return sock.sendMessage(jid, { text: "🎉 VILLAGER MENANG!" })
    }

    if (aliveWolf.length >= aliveOther.length) {
      game.phase = "end"
      return sock.sendMessage(jid, { text: "🐺 WEREWOLF MENANG!" })
    }

    game.votes = {}
    game.nightAction = {}
    game.phase = "night"

    return sock.sendMessage(jid, {
      text: "🌙 Malam kembali... Wolf & Seer beraksi"
    })
  }
}

// ===============================
// UTIL
// ===============================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function countVotes(votes) {
  const count = {}
  for (const v of Object.values(votes)) {
    count[v] = (count[v] || 0) + 1
  }
  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  )
}
