import csv from "csvtojson/v2/index.js";
import { Transform } from "stream";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  rmdirSync,
  rmSync,
} from "fs";
import ora from "ora";
import { join } from "path";
import readline from "readline";
import { getFileSizeBytes } from "./getFileSizeBytes.js";

const args = process.argv.slice(2);

const SPINNER_BASE_TEXT = "Processing...";
const spinner = ora({ text: SPINNER_BASE_TEXT, color: "yellow" });

const INPUT_FIELDS =
  "airport_id,name,city,country,iata,icao,latitude,longitude,altitude,timezone,dst,tz,type,source".split(
    ","
  );

const SYNTH_PLACES =
  "Runway,Taxiway,Apron,Terminal Building,Control Tower,Hanger,Fire Station,Parking".split(
    ","
  );
const SYNTH_SUBPLACE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SYNTH_SUBPLACE_2 = "SECTION 1,SECTION 2".split(",");

const SYNTH_NAMES = [];

SYNTH_PLACES.forEach((place) => {
  SYNTH_SUBPLACE.forEach((subplace) => {
    SYNTH_SUBPLACE_2.forEach((subplace2) => {
      SYNTH_NAMES.push(`${place} - ${subplace} - ${subplace2}`);
    });
  });
});

const ask = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Workaround for issue where csvtojson output JSON array has a trailing comma
// Source: https://github.com/Keyang/node-csvtojson/issues/321#issuecomment-501569219
let theFirstChunk = true;
const transform = new Transform({
  transform(chunk, encoding, callback) {
    let string = `,${chunk}`;

    if (theFirstChunk) {
      string = "[" + string.replace(/^\,\s*/, "");
      theFirstChunk = false;
    }

    callback(null, string);
  },

  // for the last chunk add ]
  flush(callback) {
    callback(null, "]");
  },
});

main();

function main() {
  let timeElapsedS = 0;
  const timer = setInterval(() => {
    timeElapsedS += 1;
  }, 1000);

  const timestamp = new Date().valueOf().toString();
  const dir = join(process.cwd(), "out", timestamp);

  try {
    const path = args[0];
    if (!path) throw new Error("Missing path argument");

    if (!existsSync(path)) {
      throw new Error(`Invalid path argument: ${path}`);
    }

    mkdirSync(dir, { recursive: true });

    const outputCsvPath = join(dir, "processed.csv");
    const outputJsonPath = join(dir, "processed.json");
    const ws = createWriteStream(outputCsvPath, { encoding: "utf-8" });

    const lineByLine = readline.createInterface({
      input: createReadStream(path),
    });

    let count = 0;
    lineByLine.on("line", (line) => {
      count++;
      const noQuotes = line.replace(/\"/g, "");
      const entries = noQuotes.split(",");

      const lineData = {};
      entries.forEach((entry, index) => {
        const field = INPUT_FIELDS[index];
        lineData[field] = entry;
      });

      ws.write(jsonToCsvLine(lineData) + "\n");

      const synthesized = generateSimilarRandomData(lineData, SYNTH_NAMES);
      const synthesizedCsvLines = synthesized.map(jsonToCsvLine);
      synthesizedCsvLines.forEach((line) => {
        count++;
        ws.write(line + "\n");
      });

      spinner.text = `${SPINNER_BASE_TEXT} | ${timeElapsedS}s elapsed | ${count} lines written so far`;
    });

    lineByLine.on("close", async () => {
      ws.close();

      spinner.text = `${SPINNER_BASE_TEXT} | ${timeElapsedS}s elapsed | converting csv to json`;

      const handleJsonRead = () => {
        spinner.text = `${SPINNER_BASE_TEXT} | ${timeElapsedS}s elapsed | converting csv to json`;
      };
      await synthCsvToJson(outputCsvPath, outputJsonPath, handleJsonRead);

      const sizes = await getFileSizeBytes(outputJsonPath);
      console.log("\n:: SUCCESS ::");
      console.log(`:: RESULTS WRITTEN TO ${outputJsonPath} ::`);
      console.log(`:: ESTIMATED SIZE ::`);
      console.table(
        Object.entries(sizes).map(([unit, value]) => ({
          Value: `${value} ${unit}`,
        }))
      );

      if (existsSync(outputCsvPath)) {
        rmSync(outputCsvPath);
      }

      clearInterval(timer);
      spinner.stop();

      ask.close();
      process.exit(0);
    });

    lineByLine.on("error", (error) => {
      throw error;
    });

    spinner.start();
  } catch (error) {
    console.error("\n:: PROCESSING FAILED ::");
    console.error(error);

    if (existsSync(dir)) {
      rmdirSync(dir);
    }

    process.exit(1);
  }
}

function generateSimilarRandomData(lineData, toAppend = []) {
  const synthesizedData = [];

  for (let i = 0; i < toAppend.length; i++) {
    const synthData = { ...lineData };
    synthData["airport_id"] = lineData["airport_id"] + "S" + i;
    synthData["name"] = lineData["name"] + " - " + toAppend[i];
    synthData["type"] = toAppend[i];
    synthData["source"] = "synthesized";

    synthesizedData.push(synthData);
  }

  return synthesizedData;
}

function jsonToCsvLine(json) {
  let line = "";
  const values = Object.values(json);

  values.forEach((val, index) => {
    line += val;
    if (index !== values.length - 1) {
      line += ",";
    }
  });
  return line;
}

function synthCsvToJson(inputCsvPath, outputPath, onNewLine) {
  return new Promise((resolve, reject) => {
    const rs = createReadStream(inputCsvPath, "utf-8");
    const ws = createWriteStream(outputPath, { flags: "w", encoding: "utf-8" });

    rs.pipe(
      csv({
        noheader: true,
        headers: INPUT_FIELDS,
        downstreamFormat: "line",
        delimiter: ",",
        eol: "\n",
        output: "json",
      }).subscribe((json) => {
        onNewLine && onNewLine(json);

        return new Promise((res) => {
          withLatLngReplacedByGeoJson(json);
          res();
        });
      })
    )
      .pipe(transform)
      .pipe(ws)
      .on("finish", resolve)
      .on("error", reject);
  });
}

function withLatLngReplacedByGeoJson(data) {
  const { longitude, latitude } = data;
  const lon = Number(longitude);
  const lat = Number(latitude);
  if (!lon || !lat)
    throw new Error(
      `Missing or invalid longitude and/or latitude: airport ${data["airport_id"]}`
    );

  const lonLat = { type: "Point", coordinates: [lon, lat] };
  data["lonLat"] = lonLat;

  delete data["longitude"];
  delete data["latitude"];
}
