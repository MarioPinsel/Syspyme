import crypto from "crypto";

export function generarCUFE(datos) {
    const {
        numFac,
        fecFac,
        horFac,
        valFac,
        codImp1,
        valImp1,
        codImp2,
        valImp2,
        codImp3,
        valImp3,
        valTot,
        nitFE,
        numAdq,
        clTec,
        tipoAmbiente
    } = datos;

    const cadena = `${numFac}${fecFac}${horFac}${valFac}${codImp1}${valImp1}${codImp2}${valImp2}${codImp3}${valImp3}${valTot}${nitFE}${numAdq}${clTec}${tipoAmbiente}`;

    const cufe = crypto.createHash("sha384").update(cadena).digest("hex").toUpperCase();
    return cufe;
}
