import { skills } from "./skills.js"

// ================= STORAGE =================
export const games = new Map()

const delay = ms => new Promise(res => setTimeout(res, ms))

// ================= ANIMATION =================
export async function battleAnimation(sock, jid, attacker, text) {
  const frames = [
    `⚔️ @${attacker.split("@")[0]} bersiap...`,
    `▰▱▱▱▱`,
    `▰▰▰▱▱`,
    text
  ]

  for (const f of frames) {
    await sock.sendMessage(jid, {
      text: f,
      mentions: [attacker]
    })
    await delay(600)
  }
}

// ================= CREATE GAME =================
export function createGame(jid, p1, p2) {
  games.set(jid, {
    player1: p1,
    player2: p2,
    turn: p1,

    hp: { [p1]: 120, [p2]: 120 },
    mana: { [p1]: 120, [p2]: 120 },

    shield: { [p1]: 0, [p2]: 0 },
    buffs: { [p1]: [], [p2]: [] },
    debuffs: { [p1]: [], [p2]: [] },
    cooldowns: { [p1]: {}, [p2]: {} }
  })
}

export const getGame = jid => games.get(jid)
export const endGame = jid => games.delete(jid)

// ================= TURN =================
export function nextTurn(jid) {
  const g = games.get(jid)
  if (!g) return

  g.turn = g.turn === g.player1 ? g.player2 : g.player1

  // regen mana
  g.mana[g.turn] = Math.min(150, g.mana[g.turn] + 15)

  // cooldown
  for (const k in g.cooldowns[g.turn]) {
    if (g.cooldowns[g.turn][k] > 0)
      g.cooldowns[g.turn][k]--
  }
}

// ================= APPLY SKILL =================
export function applySkill(jid, user, skillName) {
  const g = games.get(jid)
  if (!g) return { error: "Game belum dimulai" }

  if (g.turn !== user)
    return { error: "Bukan giliranmu" }

  const skill = skills[skillName]
  if (!skill) return { error: "Skill tidak ada" }

  const enemy = user === g.player1 ? g.player2 : g.player1

  const manaCost =
    skillName === "ultimate" ? 80 : skill.mana

  if (g.mana[user] < manaCost)
    return { error: "Mana tidak cukup" }

  if ((g.cooldowns[user][skillName] || 0) > 0)
    return { error: "Skill masih cooldown" }

  g.mana[user] -= manaCost
  g.cooldowns[user][skillName] = skill.cooldown

  let log = []

  if (skill.damage) {
    let dmg = skill.damage
    g.hp[enemy] -= dmg
    log.push(`💥 Damage ${dmg}`)
  }

  if (skill.heal) {
    g.hp[user] += skill.heal
    log.push(`❤️ Heal ${skill.heal}`)
  }

  if (skill.shield) {
    g.shield[user] += skill.shield
    log.push(`🛡️ Shield +${skill.shield}`)
  }

  nextTurn(jid)
  return { log }
}

// ================== PVP COMMAND (INI YANG HILANG) ==================
export async function pvpCommand(sock, msg, args) {
  const jid = msg.key.remoteJid
  const sender = msg.key.participant || msg.key.remoteJid
  const sub = args[0]

  // START
  if (sub === "start") {
    const target = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    if (!target) return "Tag lawan!"

    createGame(jid, sender, target)
    return "⚔️ PVP dimulai!"
  }

  // SKILL
  if (sub === "skill") {
    const skillName = args[1]
    const res = applySkill(jid, sender, skillName)

    if (res?.error) return `❌ ${res.error}`
    return res.log.join("\n")
  }

  // STATUS
  if (sub === "status") {
    const g = getGame(jid)
    if (!g) return "Belum ada game"

    return `
❤️ ${g.player1.split("@")[0]}: ${g.hp[g.player1]} | 🔮 ${g.mana[g.player1]}
❤️ ${g.player2.split("@")[0]}: ${g.hp[g.player2]} | 🔮 ${g.mana[g.player2]}
Giliran: @${g.turn.split("@")[0]}
`
  }

  // CANCEL
  if (sub === "cancel") {
    endGame(jid)
    return "❌ PVP dibatalkan"
  }
}

