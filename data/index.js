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

const spinner = ora({ color: "yellow" });

const INPUT_FIELDS = {
  airport_id: "string",
  name: "string",
  city: "string",
  country: "string",
  iata: "string",
  icao: "string",
  latitude: "number",
  longitude: "number",
  altitude: "number",
  timezone: "string",
  dst: "string",
  tz: "string",
  type: "string",
  source: "string",
};

const INPUT_FIELD_NAMES = Object.keys(INPUT_FIELDS);

const SYNTH_PLACES =
  "Runway,Taxiway,Apron,Terminal Building,Control Tower,Hanger,Fire Station,Parking,Customs,Gift Shop,Restaurant,".split(
    ","
  );
const SYNTH_SUBPLACE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const SYNTH_NAMES = [];

SYNTH_PLACES.forEach((place) => {
  SYNTH_SUBPLACE.forEach((subplace) => {
    SYNTH_NAMES.push(`${place} - ${subplace}`);
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
  let spinnerMessage = "Processing...";
  let timeElapsedS = 0;
  const timer = setInterval(() => {
    timeElapsedS += 1;
    spinner.text = `${spinnerMessage} | ${timeElapsedS}s elapsed`;
  }, 1000);

  const timestamp = new Date().valueOf().toString();
  const dir = join(process.cwd(), "out", timestamp);

  try {
    const path = args[0];
    if (!path) throw new Error("Missing path argument");

    const doSynth = args[1] !== "no-synth";

    if (!existsSync(path)) {
      throw new Error(`Invalid path argument: ${path}`);
    }

    mkdirSync(dir, { recursive: true });

    const outputCsvPath = join(
      dir,
      doSynth ? "processed.csv" : "processed-no-synth.csv"
    );
    const outputJsonPath = join(
      dir,
      doSynth ? "processed.json" : "processed-no-synth.json"
    );
    const ws = createWriteStream(outputCsvPath, { encoding: "utf-8" });
    const rs = createReadStream(path, { encoding: "utf-8" });
    let count = 0;

    synthesizeData();

    function synthesizeData() {
      spinner.start();
      rs.pipe(
        csv({
          noheader: true,
          headers: INPUT_FIELD_NAMES,
          downstreamFormat: "line",
          eol: "\n",
          output: "json",
        }).subscribe(onNext, handleError, handleSynthCompleted)
      );

      function onNext(json) {
        count += 1;
        const csvLine = jsonToCsvLine(json) + "\n";
        ws.write(csvLine);

        if (doSynth) {
          const synthesized = generateSimilarRandomData(json, SYNTH_NAMES);
          const synthesizedCsvLines = synthesized.map(jsonToCsvLine);
          synthesizedCsvLines.forEach((line) => {
            count++;
            ws.write(line + "\n");
          });
        }
      }

      async function handleSynthCompleted() {
        ws.close();

        spinnerMessage = "Converting CSV to JSON...";
        await synthCsvToJson(outputCsvPath, outputJsonPath);

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
      }

      function handleError(error) {
        console.error(error);
        process.exit(1);
      }
    }
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

  INPUT_FIELD_NAMES.forEach((field, index) => {
    const val = json[field];

    if (INPUT_FIELDS[field] === "string") {
      line += `"${val}"`;
    } else {
      line += val;
    }

    if (index !== INPUT_FIELD_NAMES.length - 1) {
      line += ",";
    }
  });
  return line;
}

function synthCsvToJson(inputCsvPath, outputPath) {
  const rs = createReadStream(inputCsvPath, "utf-8");
  const ws = createWriteStream(outputPath, { flags: "w", encoding: "utf-8" });

  return new Promise((resolve, reject) => {
    rs.pipe(
      csv({
        noheader: true,
        headers: INPUT_FIELD_NAMES,
        downstreamFormat: "line",
        eol: "\n",
        output: "json",
      }).subscribe((json) => {
        withLatLngReplacedByGeoJson(json);
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
  if (isNaN(lon) || isNaN(lat))
    throw new Error(
      `Missing or invalid longitude and/or latitude: airport ${data["airport_id"]}`
    );

  const lonLat = { type: "Point", coordinates: [lon, lat] };
  data["lonLat"] = lonLat;

  delete data["longitude"];
  delete data["latitude"];
}
