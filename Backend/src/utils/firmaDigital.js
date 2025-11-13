import fs from "fs";
import path from "path";

const logoPath = path.resolve("./assets/logo-syspyme.png");
const firmaDigitalBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

export const getFirmaDigital = () => firmaDigitalBase64;
