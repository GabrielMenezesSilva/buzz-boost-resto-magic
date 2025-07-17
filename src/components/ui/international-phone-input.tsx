import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
  example: string;
  minLength: number;
  maxLength: number;
}

const countries: Country[] = [
  {
    code: 'BR',
    name: 'Brasil',
    dialCode: '+55',
    flag: '🇧🇷',
    format: '(##) #####-####',
    example: '(11) 99999-9999',
    minLength: 10,
    maxLength: 11
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    dialCode: '+1',
    flag: '🇺🇸',
    format: '(###) ###-####',
    example: '(555) 123-4567',
    minLength: 10,
    maxLength: 10
  },
  {
    code: 'CH',
    name: 'Suíça',
    dialCode: '+41',
    flag: '🇨🇭',
    format: '## ### ## ##',
    example: '79 123 45 67',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'DE',
    name: 'Alemanha',
    dialCode: '+49',
    flag: '🇩🇪',
    format: '### #######',
    example: '151 1234567',
    minLength: 10,
    maxLength: 11
  },
  {
    code: 'FR',
    name: 'França',
    dialCode: '+33',
    flag: '🇫🇷',
    format: '# ## ## ## ##',
    example: '6 12 34 56 78',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'IT',
    name: 'Itália',
    dialCode: '+39',
    flag: '🇮🇹',
    format: '### ### ####',
    example: '320 123 4567',
    minLength: 9,
    maxLength: 10
  },
  {
    code: 'ES',
    name: 'Espanha',
    dialCode: '+34',
    flag: '🇪🇸',
    format: '### ## ## ##',
    example: '612 34 56 78',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'PT',
    name: 'Portugal',
    dialCode: '+351',
    flag: '🇵🇹',
    format: '### ### ###',
    example: '912 345 678',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    dialCode: '+44',
    flag: '🇬🇧',
    format: '#### ######',
    example: '7911 123456',
    minLength: 10,
    maxLength: 10
  }
];

interface InternationalPhoneInputProps {
  value: string;
  onChange: (value: string, country: Country) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
  defaultCountry?: string;
}

export const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  error,
  className,
  id,
  defaultCountry = 'BR'
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === defaultCountry) || countries[0]
  );
  const [formattedValue, setFormattedValue] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  // Format phone number based on country pattern
  const formatPhoneNumber = (input: string, country: Country) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Don't format if empty
    if (!digits) return '';
    
    let formatted = '';
    let digitIndex = 0;
    
    for (let i = 0; i < country.format.length && digitIndex < digits.length; i++) {
      const char = country.format[i];
      if (char === '#') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += char;
      }
    }
    
    return formatted;
  };

  // Validate phone number based on country rules
  const validatePhoneNumber = (input: string, country: Country) => {
    const digits = input.replace(/\D/g, '');
    
    if (!digits) {
      setIsValid(null);
      setValidationMessage('');
      return;
    }
    
    if (digits.length < country.minLength) {
      setIsValid(false);
      setValidationMessage(`Número muito curto. Mínimo ${country.minLength} dígitos.`);
      return;
    }
    
    if (digits.length > country.maxLength) {
      setIsValid(false);
      setValidationMessage(`Número muito longo. Máximo ${country.maxLength} dígitos.`);
      return;
    }
    
    // Country-specific validations
    if (country.code === 'BR') {
      if (digits.length === 11) {
        const areaCode = digits.slice(0, 2);
        const firstDigit = digits[2];
        
        if (!['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'].includes(areaCode)) {
          setIsValid(false);
          setValidationMessage('Código de área inválido');
          return;
        }
        
        if (firstDigit !== '9') {
          setIsValid(false);
          setValidationMessage('Celular deve começar com 9 após o código de área');
          return;
        }
      } else if (digits.length === 10) {
        const areaCode = digits.slice(0, 2);
        if (!['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'].includes(areaCode)) {
          setIsValid(false);
          setValidationMessage('Código de área inválido');
          return;
        }
      }
    }
    
    if (digits.length >= country.minLength && digits.length <= country.maxLength) {
      setIsValid(true);
      setValidationMessage(`Número válido para ${country.name}`);
    }
  };

  // Update formatted value when value prop changes
  useEffect(() => {
    const formatted = formatPhoneNumber(value, selectedCountry);
    setFormattedValue(formatted);
    validatePhoneNumber(value, selectedCountry);
  }, [value, selectedCountry]);

  const handleCountryChange = (countryCode: string) => {
    const newCountry = countries.find(c => c.code === countryCode);
    if (newCountry) {
      setSelectedCountry(newCountry);
      // Reformat current value with new country pattern
      const digits = value.replace(/\D/g, '');
      const formatted = formatPhoneNumber(digits, newCountry);
      setFormattedValue(formatted);
      validatePhoneNumber(digits, newCountry);
      onChange(digits, newCountry);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue, selectedCountry);
    
    // Limit input to country's max length
    const digits = inputValue.replace(/\D/g, '');
    if (digits.length <= selectedCountry.maxLength) {
      setFormattedValue(formatted);
      onChange(digits, selectedCountry);
      validatePhoneNumber(digits, selectedCountry);
    }
  };

  const getValidationIcon = () => {
    if (isValid === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (isValid === false) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getValidationColor = () => {
    if (isValid === true) return 'border-green-500';
    if (isValid === false) return 'border-red-500';
    return '';
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {/* Country Selector */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">País</Label>
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
                <span className="text-muted-foreground">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-muted-foreground">{country.dialCode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Phone Input */}
      <div className="relative">
        <div className="absolute left-3 top-3 flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{selectedCountry.dialCode}</span>
        </div>
        <Input
          id={id}
          value={formattedValue}
          onChange={handleInputChange}
          placeholder={selectedCountry.example}
          className={cn(
            "pl-20 pr-10",
            getValidationColor(),
            className
          )}
        />
        <div className="absolute right-3 top-3">
          {getValidationIcon()}
        </div>
      </div>

      {/* Validation message */}
      {(validationMessage || error) && (
        <div className={cn(
          "text-sm flex items-center gap-1",
          isValid === true ? "text-green-600" : "text-red-600"
        )}>
          {isValid === true ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          {error || validationMessage}
        </div>
      )}

      {/* Helper text */}
      {!validationMessage && !error && (
        <div className="text-xs text-muted-foreground">
          <p>• <strong>Formato:</strong> {selectedCountry.example}</p>
          <p>• <strong>Dígitos:</strong> {selectedCountry.minLength}-{selectedCountry.maxLength}</p>
          <p>• O código do país ({selectedCountry.dialCode}) será adicionado automaticamente</p>
        </div>
      )}
    </div>
  );
};