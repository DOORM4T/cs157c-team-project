import { createReadStream } from 'fs'
import readline from "readline"

export function getFileSizeBytes(path) {
    return new Promise((resolve, reject) => {
        const lineByLine = readline.createInterface({ input: createReadStream(path) })
        let bytes = 0
        lineByLine.on("line", (line) => {
            bytes += line.length
        })

        lineByLine.on("close", () => {
            const sizes = {
                "B": bytes.toString(),
                "KB": (bytes / 1024).toFixed(2),
                "MB": (bytes / 1024 / 1024).toFixed(2),
                "GB": (bytes / 1024 / 1024 / 1024).toFixed(2),
            }

            return resolve(sizes)
        })

        lineByLine.on('error', reject)
    })
}
