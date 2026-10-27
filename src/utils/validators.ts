export const validateName = (name: string): boolean => {
    if (name.trim().length == 0) {
        return false
    }
    return /^[\p{L}\s]+$/u.test(name)
}

export const converterData = (data: string): Date => {
    const partesDataString: string[] = data.split("/");
    const parteStringtoNumber = [];

    for (let index: number = 0; index < 3; index++) {
        parteStringtoNumber[index] = Number(partesDataString[index])
    }

    return new Date(parteStringtoNumber[2], parteStringtoNumber[1] - 1, parteStringtoNumber[0])
}

export const calcularIdade = (dataNasc: Date): number => {
    const dateForComparison = new Date();
    let idade = dateForComparison.getFullYear() - dataNasc.getFullYear();

    if (dateForComparison.getMonth() < dataNasc.getMonth()) {
        idade -= 1;
        return idade
    }

    if (dateForComparison.getMonth() == dataNasc.getMonth()) {
        if (dateForComparison.getDate() < dataNasc.getDate()) {
            idade -= 1;
            return idade
        }
    }
    return idade
}

export const isDataNascValida = (data: Date): boolean => {
    const dateForComparison = new Date();
    const idade = calcularIdade(data)

    if (isNaN(data.getTime())) {
        return false
    }

    if (data > dateForComparison) {
        return false
    }

    if (idade > 100 || idade < 14) {
        return false
    }
    return true
}

export const validateRg = (rg: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(rg);
}

export const calcularDigitoVerificador = (cpf: string, quantidade: number): number => {
    let peso = quantidade + 1;
    let somatorio = 0;
    for (let index = 0; index < quantidade; index++) {
        somatorio += Number(cpf[index]) * peso;
        peso -= 1;
    }

    const resto = somatorio % 11;

    if (2 > resto) {
        return 0;
    }

    return 11 - resto;
}

export const validateCPF = (cpf: string): boolean => {
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
        return false
    }

    let numerosIguais = true;
    for (let index = 1; index < cpf.length; index++) {
        if (cpf[index] !== cpf[0]) {
            numerosIguais = false;
            break;
        }
    }
    if (numerosIguais === true) { return false }

    const indice1 = calcularDigitoVerificador(cpf, 9);
    const indice2 = calcularDigitoVerificador(cpf, 10);

    if (indice1 !== Number(cpf[9]) || indice2 !== Number(cpf[10])) {
        return false
    }
    return true
}

export const validatePhone = (phone: string): boolean => {
    if (!/^[1-9]{2}\d+$/.test(phone)) {
        return false;
    }

    if (phone.length === 10) {
        return phone[2] >= "2" && phone[2] <= "8";
    }

    if (phone.length === 11) {
        return phone[2] === "9";
    }

    return false;
}