import { loadJson } from "../helpers.js";

const { version } = await loadJson("package.json");

console.log(`Atelier v${version}`);
console.log(``);
console.log(`Create a config file by running:`);
console.log(`atelier init`);
console.log(`Start Atelier by running:`);
console.log(`atelier`);
