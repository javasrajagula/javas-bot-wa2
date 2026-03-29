export const games = new Map()

/**
 * Membuat game baru PVP
 * @param {string} jid - group / chat id
 * @param {string} p1 - player 1 jid
 * @param {string} p2 - player 2 jid
 */
export function createGame(jid, p1, p2) {
  games.set(jid, {
    // ===== PLAYER =====
    player1: p1,
    player2: p2,

    // ===== TURN =====
    turn: p1,

    // ===== STATUS DASAR (TETAP) =====
    hp: {
      [p1]: 100,
      [p2]: 100
    },
    mana: {
      [p1]: 50,
      [p2]: 50
    },

    // ===== TAMBAHAN (TIDAK MERUSAK LAMA) =====

    // Shield sementara
    shield: {
      [p1]: 0,
      [p2]: 0
    },

    // Buff (rage, dll)
    buffs: {
      [p1]: [],
      [p2]: []
    },

    // Debuff (poison, burn, dll)
    debuffs: {
      [p1]: [],
      [p2]: []
    },

    // Cooldown skill
    cooldowns: {
      [p1]: {},
      [p2]: {}
    },

    // Log game (opsional)
    log: []
  })
}

/**
 * Ambil data game
 * @param {string} jid
 */
export function getGame(jid) {
  return games.get(jid)
}

/**
 * Akhiri game
 * @param {string} jid
 */
export function endGame(jid) {
  games.delete(jid)
}

/**
 * Ganti giliran pemain
 * @param {string} jid
 */
export function nextTurn(jid) {
  const game = games.get(jid)
  if (!game) return

  game.turn =
    game.turn === game.player1
      ? game.player2
      : game.player1
}

/**
 * Reset shield setiap turn (opsional dipanggil)
 */
export function resetShield(jid) {
  const game = games.get(jid)
  if (!game) return

  game.shield[game.player1] = 0
  game.shield[game.player2] = 0
}
