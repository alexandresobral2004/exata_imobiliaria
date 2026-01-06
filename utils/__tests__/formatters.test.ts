import {
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
  formatCurrency,
  parseCurrency,
  isValidCPF,
  isValidCNPJ,
} from '../formatters'

describe('Formatters', () => {
  describe('formatCPF', () => {
    it('should format a valid CPF string', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01')
    })

    it('should format a CPF with non-numeric characters', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
      expect(formatCPF('123abc456def789ghi01')).toBe('123.456.789-01')
    })

    it('should limit CPF to 11 digits', () => {
      expect(formatCPF('123456789012345')).toBe('123.456.789-01')
    })

    it('should handle empty string', () => {
      expect(formatCPF('')).toBe('')
    })

    it('should handle partial CPF input', () => {
      expect(formatCPF('123')).toBe('123')
      expect(formatCPF('1234')).toBe('123.4')
      expect(formatCPF('123456789')).toBe('123.456.789')
    })
  })

  describe('formatCNPJ', () => {
    it('should format a valid CNPJ string', () => {
      expect(formatCNPJ('12345678000190')).toBe('12.345.678/0001-90')
    })

    it('should format a CNPJ with non-numeric characters', () => {
      expect(formatCNPJ('12.345.678/0001-90')).toBe('12.345.678/0001-90')
      expect(formatCNPJ('12abc345def678ghi0001jkl90')).toBe('12.345.678/0001-90')
    })

    it('should limit CNPJ to 14 digits', () => {
      expect(formatCNPJ('1234567800019012345')).toBe('12.345.678/0001-90')
    })

    it('should handle empty string', () => {
      expect(formatCNPJ('')).toBe('')
    })

    it('should handle partial CNPJ input', () => {
      expect(formatCNPJ('12')).toBe('12')
      expect(formatCNPJ('123')).toBe('12.3')
      expect(formatCNPJ('12345678')).toBe('12.345.678')
    })
  })

  describe('formatPhone', () => {
    it('should format a valid phone string', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
    })

    it('should format a phone with non-numeric characters', () => {
      expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
      expect(formatPhone('11abc98765def4321')).toBe('(11) 98765-4321')
    })

    it('should limit phone to 11 digits', () => {
      expect(formatPhone('1198765432123456')).toBe('(11) 98765-4321')
    })

    it('should handle empty string', () => {
      expect(formatPhone('')).toBe('')
    })

    it('should handle partial phone input', () => {
      // formatPhone requires at least 3 digits to start formatting
      expect(formatPhone('11')).toBe('11') // Less than 3 digits, no formatting
      expect(formatPhone('119')).toBe('(11) 9') // 3 digits, starts formatting
      expect(formatPhone('11987')).toBe('(11) 987') // 5 digits
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321') // Full phone
    })
  })

  describe('formatCEP', () => {
    it('should format a valid CEP string', () => {
      expect(formatCEP('01234567')).toBe('01234-567')
    })

    it('should format a CEP with non-numeric characters', () => {
      expect(formatCEP('01234-567')).toBe('01234-567')
      expect(formatCEP('01234abc567')).toBe('01234-567')
    })

    it('should limit CEP to 8 digits', () => {
      expect(formatCEP('0123456789012')).toBe('01234-567')
    })

    it('should handle empty string', () => {
      expect(formatCEP('')).toBe('')
    })

    it('should handle partial CEP input', () => {
      expect(formatCEP('012')).toBe('012')
      expect(formatCEP('01234')).toBe('01234')
      expect(formatCEP('012345')).toBe('01234-5')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency string correctly', () => {
      const result = formatCurrency('1234567')
      expect(result).toContain('12.345,67')
    })

    it('should handle empty string', () => {
      const result = formatCurrency('')
      expect(result).toContain('0,00')
    })

    it('should format small values correctly', () => {
      const result = formatCurrency('100')
      expect(result).toContain('1,00')
    })
  })

  describe('parseCurrency', () => {
    it('should parse currency string to number', () => {
      expect(parseCurrency('R$ 1.234,56')).toBe(1234.56)
      expect(parseCurrency('R$ 1.234,56')).toBe(1234.56)
    })

    it('should handle values without thousands separator', () => {
      expect(parseCurrency('1234,56')).toBe(1234.56)
    })

    it('should handle integer values', () => {
      expect(parseCurrency('1234')).toBe(1234)
    })

    it('should handle empty string', () => {
      expect(parseCurrency('')).toBe(0)
    })
  })

  describe('isValidCPF', () => {
    it('should return true for valid CPF', () => {
      expect(isValidCPF('11144477735')).toBe(true)
      expect(isValidCPF('111.444.777-35')).toBe(true)
    })

    it('should return false for invalid CPF', () => {
      expect(isValidCPF('11111111111')).toBe(false)
      expect(isValidCPF('12345678901')).toBe(false)
      expect(isValidCPF('111.444.777-36')).toBe(false)
    })

    it('should return false for CPF with wrong length', () => {
      expect(isValidCPF('1234567890')).toBe(false) // 10 digits
      expect(isValidCPF('123456789012')).toBe(false) // 12 digits
    })

    it('should return false for CPF with all same digits', () => {
      expect(isValidCPF('11111111111')).toBe(false)
      expect(isValidCPF('22222222222')).toBe(false)
    })

    it('should handle empty string', () => {
      expect(isValidCPF('')).toBe(false)
    })
  })

  describe('isValidCNPJ', () => {
    it('should return true for valid CNPJ', () => {
      expect(isValidCNPJ('11222333000181')).toBe(true)
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true)
    })

    it('should return false for invalid CNPJ', () => {
      expect(isValidCNPJ('11111111111111')).toBe(false)
      expect(isValidCNPJ('12345678000190')).toBe(false)
      expect(isValidCNPJ('11.222.333/0001-82')).toBe(false)
    })

    it('should return false for CNPJ with wrong length', () => {
      expect(isValidCNPJ('1234567800019')).toBe(false) // 13 digits
      expect(isValidCNPJ('123456780001901')).toBe(false) // 15 digits
    })

    it('should return false for CNPJ with all same digits', () => {
      expect(isValidCNPJ('11111111111111')).toBe(false)
      expect(isValidCNPJ('22222222222222')).toBe(false)
    })

    it('should handle empty string', () => {
      expect(isValidCNPJ('')).toBe(false)
    })
  })
})

