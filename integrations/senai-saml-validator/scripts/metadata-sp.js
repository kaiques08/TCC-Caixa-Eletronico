import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "../src/config.js";
import { generateSpMetadata } from "../src/metadata.js";

const config = loadConfig();
const destination = path.resolve("dist/finup-sp-metadata.xml");
await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, generateSpMetadata(config), { encoding: "utf8", mode: 0o600 });
process.stdout.write(`Metadata do SP criada em ${destination}\n`);
