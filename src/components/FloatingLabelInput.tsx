
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";

interface FloatingLabelInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  className?: string;
  readOnly?: boolean;
  rightElement?: React.ReactNode;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  className = "",
  readOnly = false,
  rightElement
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = () => {
    if (!value) setIsFocused(false);
  };

  const hasValue = value.length > 0;
  const showLabel = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className={`border rounded-md ${error ? 'border-red-500' : 'border-input'} relative bg-background`}>
        {showLabel && (
          <span 
            className={`absolute -top-2.5 left-2 px-1 text-xs transform bg-background
                      ${error ? 'text-red-500' : 'text-gray-500'}`}
          >
            {label}
          </span>
        )}
        <div className="flex items-center">
          <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={!showLabel ? label : ''}
            className={`border-0 focus:ring-0 ${error ? 'text-red-500' : ''}`}
            readOnly={readOnly}
          />
          {rightElement && (
            <div className="pr-3">{rightElement}</div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FloatingLabelInput;
