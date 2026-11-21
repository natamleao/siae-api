export const sanitizeCpf = (cpf: string): string => {
    return cpf.replace(/[.-]/g, "")
}

export const sanitizeRg = (rg: string): string => {
    return rg.replace(/[.-]/g, "")
}

export const sanitizePhone = (phone: string): string => {
    return phone.replace(/[()-\s]/g, "") // \s é usada para caracteres em branco/espaços
}