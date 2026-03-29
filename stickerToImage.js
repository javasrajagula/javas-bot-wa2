import sharp from "sharp"

/**
 * Konversi stiker (webp) menjadi gambar PNG
 * @param {Buffer} bufferStiker
 * @returns {Buffer} buffer PNG
 */
export const stickerToImage = async (bufferStiker) => {
  if (!bufferStiker) throw new Error("Buffer stiker kosong")

  return await sharp(bufferStiker)
    .png({ quality: 100 })
    .toBuffer()
}

/**
 * Konversi stiker (webp) menjadi JPG
 * @param {Buffer} bufferStiker
 * @returns {Buffer} buffer JPG
 */
export const stickerToJPG = async (bufferStiker) => {
  if (!bufferStiker) throw new Error("Buffer stiker kosong")

  return await sharp(bufferStiker)
    .jpeg({ quality: 95 })
    .toBuffer()
}
