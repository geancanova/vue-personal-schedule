export function testCpf(cpf) {
  let sum = 0;
  let rest = 0;

  const { cpfValid, isValid } = validFormatCPF(cpf);

  if (!isValid) return false;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfValid[i - 1]) * (11 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;

  if (rest != parseInt(cpfValid[9])) return false;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfValid[i - 1]) * (12 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;

  if (rest != parseInt(cpfValid[10])) return false;

  return true;
}

const validFormatCPF = cpf => {
  const regexValidCPF = /^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/;

  if (!cpf.match(regexValidCPF)) {
    return {
      cpfValid: cpf,
      isValid: false,
    };
  }

  // Remove pontos e traços do CPF
  cpf = cpf.replace('-', '').replace(/\./g, '');

  // Verifica se o CPF possui números repetidos (ex: 111.111.111-11)
  if (cpf.match(/^(\d)\1{10}/g)) {
    return {
      cpfValid: cpf,
      isValid: false,
    };
  }

  return { cpfValid: cpf, isValid: true };
};
