import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "(11) 99999-9999",
  required = false,
  error,
  className,
  id
}) => {
  const [formattedValue, setFormattedValue] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  // Format phone number as user types
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Don't format if empty
    if (!digits) return '';
    
    // Format based on length
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else {
      // Limit to 11 digits (Brazilian format)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  // Validate phone number
  const validatePhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    
    if (!digits) {
      setIsValid(null);
      setValidationMessage('');
      return;
    }
    
    if (digits.length < 10) {
      setIsValid(false);
      setValidationMessage('Número muito curto. Inclua o código de área.');
      return;
    }
    
    if (digits.length === 10) {
      // Check if it's a valid landline (area code + 7-8 digits)
      const areaCode = digits.slice(0, 2);
      if (['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'].includes(areaCode)) {
        setIsValid(true);
        setValidationMessage('Telefone fixo válido');
      } else {
        setIsValid(false);
        setValidationMessage('Código de área inválido');
      }
      return;
    }
    
    if (digits.length === 11) {
      // Check if it's a valid mobile (area code + 9 + 8 digits)
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
      
      setIsValid(true);
      setValidationMessage('Celular válido');
      return;
    }
    
    if (digits.length > 11) {
      setIsValid(false);
      setValidationMessage('Número muito longo');
      return;
    }
  };

  // Update formatted value when value prop changes
  useEffect(() => {
    const formatted = formatPhoneNumber(value);
    setFormattedValue(formatted);
    validatePhoneNumber(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    
    setFormattedValue(formatted);
    
    // Extract only digits to pass to parent
    const digitsOnly = inputValue.replace(/\D/g, '');
    onChange(digitsOnly);
    
    validatePhoneNumber(digitsOnly);
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
      
      <div className="relative">
        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          value={formattedValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10",
            getValidationColor(),
            className
          )}
          maxLength={15} // (11) 99999-9999
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
          <p>• <strong>Celular:</strong> (11) 99999-9999 (11 dígitos)</p>
          <p>• <strong>Fixo:</strong> (11) 3333-4444 (10 dígitos)</p>
          <p>• Sempre inclua o código de área</p>
        </div>
      )}
    </div>
  );
};