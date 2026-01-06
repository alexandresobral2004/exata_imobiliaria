export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCPFCNPJ = (value: string) => {
  const cleanValue = value.replace(/\D/g, '');
  
  // Se tem até 11 dígitos, aplica máscara de CPF
  if (cleanValue.length <= 11) {
    return maskCPF(value);
  }
  
  // Se tem mais de 11 dígitos, aplica máscara de CNPJ
  return maskCNPJ(value);
};

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const maskCurrency = (value: string) => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  // Divide por 100 para ter os centavos
  const numberValue = Number(cleanValue) / 100;
  // Formata para BRL
  return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};

export const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
