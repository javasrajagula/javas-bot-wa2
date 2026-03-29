export const skills = {
  // ===== SKILL LAMA (TETAP) =====
  slash: {
    mana: 10,
    damage: 15,
    cooldown: 1,
    desc: "Serangan cepat menggunakan senjata"
  },

  fireball: {
    mana: 25,
    damage: 30,
    cooldown: 2,
    desc: "Serangan api dengan damage besar"
  },

  heal: {
    mana: 20,
    heal: 25,
    cooldown: 2,
    desc: "Memulihkan HP diri sendiri"
  },

  // ===== SKILL BARU =====
  lightning: {
    mana: 30,
    damage: 40,
    cooldown: 3,
    desc: "Serangan petir, damage tinggi"
  },

  poison: {
    mana: 20,
    damage: 10,
    effect: {
      type: "dot",
      damage: 5,
      duration: 3
    },
    cooldown: 2,
    desc: "Racun musuh selama 3 turn"
  },

  shield: {
    mana: 15,
    shield: 20,
    cooldown: 2,
    desc: "Menambah perisai sementara"
  },

  rage: {
    mana: 10,
    buff: {
      damage: 10,
      duration: 2
    },
    cooldown: 3,
    desc: "Meningkatkan damage selama 2 turn"
  },

  lifesteal: {
    mana: 25,
    damage: 20,
    lifesteal: 0.5,
    cooldown: 2,
    desc: "Menyerap 50% damage jadi HP"
  },

  ultimate: {
    mana: 50,
    damage: 70,
    cooldown: 5,
    desc: "Skill pamungkas dengan damage sangat besar"
  }
}
