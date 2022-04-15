import { createReadStream, createWriteStream, existsSync, mkdirSync, rmdirSync } from "fs"
import ora from 'ora'
import { join } from "path"
import readline from "readline"
import { getFileSizeBytes } from "./getFileSizeBytes.js"

const args = process.argv.slice(2)

const SPINNER_BASE_TEXT = "Processing..."
const spinner = ora({ text: SPINNER_BASE_TEXT, color: "yellow" })


const FIELDS = "airport_id,name,city,country,iata,icao,latitude,longitude,altitude,timezone,dst,tz,type,source".split(",")

const SYNTH_PLACES = "Runway,Taxiway,Apron,Terminal Building,Control Tower,Hanger,Fire Station,Parking".split(",")
const SYNTH_SUBPLACE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const SYNTH_SUBPLACE_2 = "SECTION 1,SECTION 2,SECTION 3".split(",")

const SYNTH_NAMES = []

SYNTH_PLACES.forEach(place => {
    SYNTH_SUBPLACE.forEach(subplace => {
        SYNTH_SUBPLACE_2.forEach(subplace2 => {
            SYNTH_NAMES.push(`${place} - ${subplace} - ${subplace2}`)
        })
    })
})

const ask = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

main()

function main() {
    const timestamp = new Date().valueOf().toString()
    const dir = join(process.cwd(), "out", timestamp)

    try {
        const path = args[0]
        if (!path) throw new Error("Missing path argument")

        if (!existsSync(path)) {
            throw new Error(`Invalid path argument: ${path}`)
        }

        mkdirSync(dir, { recursive: true })

        const outputFile = join(dir, "processed.csv")
        const ws = createWriteStream(outputFile, { encoding: "utf-8" })
        ws.write(FIELDS.join(",") + "\n")

        const lineByLine = readline.createInterface({ input: createReadStream(path) })

        let count = 0
        lineByLine.on('line', line => {
            count++
            const noQuotes = line.replace(/\"/g, "")
            const entries = noQuotes.split(",")

            const lineData = {}
            entries.forEach((entry, index) => {
                const field = FIELDS[index]
                lineData[field] = entry
            })

            ws.write(jsonToCsvLine(lineData) + "\n")

            const synthesized = generateSimilarRandomData(lineData, SYNTH_NAMES)
            const synthesizedCsvLines = synthesized.map(jsonToCsvLine)
            synthesizedCsvLines.forEach(line => {
                count++
                ws.write(line + "\n")
            })
        })


        lineByLine.on("close", async () => {
            ws.close()

            const sizes = await getFileSizeBytes(outputFile)
            console.log("\n:: SUCCESS ::")
            console.log(`:: RESULTS WRITTEN TO ${outputFile} ::`)
            console.log(`:: ESTIMATED SIZE ::`)
            console.table(Object.entries(sizes).map(([unit, value]) => ({ "Value": `${value} ${unit}` })))

            spinner.stop()

            ask.close()
            process.exit(0)
        })

        lineByLine.on('error', (error) => {
            throw error
        })


        spinner.start()
        setTimeout(() => {
            spinner.text = `${SPINNER_BASE_TEXT} (${count} lines written so far)`;
        }, 1000);

    } catch (error) {
        console.error("\n:: PROCESSING FAILED ::")
        console.error(error)

        if (existsSync(dir)) {
            rmdirSync(dir)
        }

        process.exit(1)
    }
}

function generateSimilarRandomData(lineData, toAppend = []) {
    const synthesizedData = []

    for (let i = 0; i < toAppend.length; i++) {
        const synthData = { ...lineData }
        synthData["airport_id"] = lineData["airport_id"] + i
        synthData["name"] = lineData["name"] + " - " + toAppend[i]
        synthData["type"] = toAppend[i]
        synthData["source"] = "synthesized"
        synthesizedData.push(synthData)
    }

    return synthesizedData
}

function jsonToCsvLine(json) {
    let csvLine = ""
    const values = Object.values(json)

    values.forEach((val, index) => {
        csvLine += val
        if (index !== values.length - 1) {
            csvLine += ","
        }
    })
    return csvLine
}