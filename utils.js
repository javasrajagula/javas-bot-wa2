export function getSenderJid(msg) {
  if (msg.key.participant) return msg.key.participant
  return msg.key.remoteJid
}
