import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL)
 * @param value Valor a ser formatado
 * @returns String formatada no padrão de moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um CPF (11 dígitos) ou CNPJ (14 dígitos) com a máscara apropriada
 * @param value String contendo o CPF ou CNPJ sem formatação
 * @returns String formatada com a máscara de CPF ou CNPJ
 */
export function formatCpfCnpj(value: string): string {
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Verifica se é CPF (11 dígitos)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // Verifica se é CNPJ (14 dígitos)
  if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Se não for nem CPF nem CNPJ, retorna o valor original
  return value;
}

/**
 * Formata uma data para o formato dd-MM-yyyy
 * @param dateString String contendo a data a ser formatada
 * @returns String formatada no padrão dd-MM-yyyy
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
}
