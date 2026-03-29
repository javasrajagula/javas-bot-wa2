export function calculateAttack(skill, targetState) {
  let damage = skill.damage
  let log = []

  // 🎯 CRITICAL HIT
  let isCrit = Math.random() < (skill.critRate || 0)
  if (isCrit) {
    damage *= 2
    log.push("💥 CRITICAL HIT!")
  }

  // 🔥 STATUS EFFECT
  if (skill.effect) {
    targetState.effects.push({
      type: skill.effect,
      turn: skill.effectTurn || 2
    })
    log.push(`⚠️ ${skill.effect.toUpperCase()} terkena!`)
  }

  // 🔁 COMBO
  let hits = skill.combo || 1
  let totalDamage = damage * hits

  return {
    totalDamage,
    hits,
    log
  }
}
