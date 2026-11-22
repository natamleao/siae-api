export const validatePassword = (password: string): boolean => {
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*\-_])[A-Za-z\d!@#$%&*_-]{8,16}$/;

    return regexSenha.test(password);
};
