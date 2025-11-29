import crypto from "crypto";

export function generarCUFE(datos) {
    const unique = crypto.randomUUID().replace(/-/g, ""); // 32 chars únicos

    const cadena =
        `${datos.numFac}${datos.fecFac}${datos.horFac}${datos.valFac}` +
        `${datos.codImp1}${datos.valImp1}${datos.codImp2}${datos.valImp2}` +
        `${datos.codImp3}${datos.valImp3}${datos.valTot}${datos.nitFE}` +
        `${datos.numAdq}${datos.clTec}${datos.tipoAmbiente}` +
        unique;

    return crypto.createHash("sha384").update(cadena).digest("hex").toUpperCase();
}
