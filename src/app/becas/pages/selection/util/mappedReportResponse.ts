export const mappedReportResponse = (res) => {
    return res.data.map((candidate) => ({
        codigo: candidate.CODIGO,
        documento: candidate.DOCUMENTO,
        nombre: candidate.APELLIDOS_Y_NOMBRES,
        promedio: candidate.PROMEDIO,
        correo: candidate.EMAIL_UFPS,
        telefono: candidate.CELULAR,
    }));
};
