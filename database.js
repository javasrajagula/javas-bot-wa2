import fs from "fs"
import path from "path"

const dbPath = path.resolve("./data/users.json")

function ensureDB() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    fs.writeFileSync(dbPath, "{}")
  }
}

export function read() {
  try {
    ensureDB()
    const raw = fs.readFileSync(dbPath, "utf-8")

    if (!raw.trim()) {
      fs.writeFileSync(dbPath, "{}")
      return {}
    }

    return JSON.parse(raw)
  } catch (err) {
    console.error("❌ Database rusak, reset otomatis")
    fs.writeFileSync(dbPath, "{}")
    return {}
  }
}

export function write(data) {
  ensureDB()
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export function getUsers() {
  return read()
}
