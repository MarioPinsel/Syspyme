import fs from "fs";
import path from "path";
import crypto from "crypto";

const logoPath = path.resolve("./src/assets/logo-syspyme.png");
const imageBuffer = fs.readFileSync(logoPath);
const hash = crypto.createHash("sha256").update(imageBuffer).digest("hex");
export const getFirmaDigital = () => hash;
