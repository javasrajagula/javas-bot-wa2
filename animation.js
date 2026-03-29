export async function battleAnimation(sock, jid, attacker, text) {
  const frames = [
    `⚔️ @${attacker.split("@")[0]} bersiap...`,
    `▰▱▱▱▱`,
    `▰▰▰▱▱`,
    text
  ]

  for (const frame of frames) {
    await sock.sendMessage(jid, {
      text: frame,
      mentions: [attacker]
    })
    await delay(600)
  }
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}
