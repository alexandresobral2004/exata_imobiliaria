import {
  maskCPF,
  maskCNPJ,
  maskCPFCNPJ,
  maskPhone,
  maskCEP,
  maskCurrency,
  formatCurrency,
} from '../masks'

describe('Masks', () => {
  describe('maskCPF', () => {
    it('should mask a valid CPF string', () => {
      expect(maskCPF('12345678901')).toBe('123.456.789-01')
    })

    it('should mask CPF with non-numeric characters', () => {
      expect(maskCPF('123.456.789-01')).toBe('123.456.789-01')
      expect(maskCPF('123abc456def789ghi01')).toBe('123.456.789-01')
    })

    it('should limit CPF to 11 digits', () => {
      expect(maskCPF('123456789012345')).toBe('123.456.789-01')
    })

    it('should handle empty string', () => {
      expect(maskCPF('')).toBe('')
    })
  })

  describe('maskCNPJ', () => {
    it('should mask a valid CNPJ string', () => {
      expect(maskCNPJ('12345678000190')).toBe('12.345.678/0001-90')
    })

    it('should mask CNPJ with non-numeric characters', () => {
      expect(maskCNPJ('12.345.678/0001-90')).toBe('12.345.678/0001-90')
    })

    it('should limit CNPJ to 14 digits', () => {
      expect(maskCNPJ('1234567800019012345')).toBe('12.345.678/0001-90')
    })

    it('should handle empty string', () => {
      expect(maskCNPJ('')).toBe('')
    })
  })

  describe('maskCPFCNPJ', () => {
    it('should apply CPF mask for 11 digits or less', () => {
      expect(maskCPFCNPJ('12345678901')).toBe('123.456.789-01')
      expect(maskCPFCNPJ('1234567890')).toBe('123.456.789-0')
    })

    it('should apply CNPJ mask for more than 11 digits', () => {
      expect(maskCPFCNPJ('12345678000190')).toBe('12.345.678/0001-90')
      expect(maskCPFCNPJ('123456780001901')).toBe('12.345.678/0001-90')
    })

    it('should handle empty string', () => {
      expect(maskCPFCNPJ('')).toBe('')
    })

    it('should handle partial input', () => {
      expect(maskCPFCNPJ('123')).toBe('123')
      expect(maskCPFCNPJ('12345678901234')).toBe('12.345.678/9012-34')
    })
  })

  describe('maskPhone', () => {
    it('should mask a valid phone string', () => {
      expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
    })

    it('should mask phone with non-numeric characters', () => {
      expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
    })

    it('should limit phone to 11 digits', () => {
      expect(maskPhone('1198765432123456')).toBe('(11) 98765-4321')
    })

    it('should handle empty string', () => {
      expect(maskPhone('')).toBe('')
    })
  })

  describe('maskCEP', () => {
    it('should mask a valid CEP string', () => {
      expect(maskCEP('01234567')).toBe('01234-567')
    })

    it('should mask CEP with non-numeric characters', () => {
      expect(maskCEP('01234-567')).toBe('01234-567')
    })

    it('should limit CEP to 8 digits', () => {
      expect(maskCEP('0123456789012')).toBe('01234-567')
    })

    it('should handle empty string', () => {
      expect(maskCEP('')).toBe('')
    })
  })

  describe('maskCurrency', () => {
    it('should mask currency correctly', () => {
      const result = maskCurrency('1234567')
      expect(result).toContain('12.345,67')
    })

    it('should handle empty string', () => {
      const result = maskCurrency('')
      expect(result).toContain('0,00')
    })

    it('should format small values correctly', () => {
      const result = maskCurrency('100')
      expect(result).toContain('1,00')
    })

    it('should handle values with non-numeric characters', () => {
      const result = maskCurrency('abc123def456')
      expect(result).toContain('1.234,56')
    })
  })

  describe('formatCurrency', () => {
    it('should format number to currency string', () => {
      const result = formatCurrency(1234.56)
      expect(result).toContain('1.234,56')
    })

    it('should format integer values', () => {
      const result = formatCurrency(1234)
      expect(result).toContain('1.234,00')
    })

    it('should format zero', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0,00')
    })

    it('should format large values', () => {
      const result = formatCurrency(1234567.89)
      expect(result).toContain('1.234.567,89')
    })
  })
})

