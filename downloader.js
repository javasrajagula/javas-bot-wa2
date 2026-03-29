import fetch from "node-fetch"

const headers = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

export const downloadMedia = async (url) => {
  const apis = [
    // ✅ API 1 — TikWM (PALING STABIL)
    async () => {
      const res = await fetch(
        "https://api.tikwm.com/api/?url=" + encodeURIComponent(url),
        { headers }
      )
      const json = await res.json()
      return json?.data?.play || null
    },

    // ✅ API 2 — TikWM no watermark
    async () => {
      const res = await fetch(
        "https://api.tikwm.com/api/?url=" +
          encodeURIComponent(url) +
          "&hd=1",
        { headers }
      )
      const json = await res.json()
      return json?.data?.play || null
    }
  ]

  let videoUrl = null

  for (const api of apis) {
    try {
      const result = await api()
      if (result && result.startsWith("http")) {
        videoUrl = result
        break
      }
    } catch (e) {
      console.log("⚠️ API gagal, coba next...")
    }
  }

  if (!videoUrl) {
    throw new Error("Semua API downloader gagal (TikTok)")
  }

  const videoRes = await fetch(videoUrl, { headers })
  if (!videoRes.ok) throw new Error("Gagal fetch video")

  const buffer = await videoRes.arrayBuffer()
  return Buffer.from(buffer)
}
