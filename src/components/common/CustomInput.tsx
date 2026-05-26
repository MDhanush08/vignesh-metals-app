import React from 'react';
import { IonLabel, IonIcon, IonInput } from '@ionic/react';

interface CustomInputProps {
  label: string;
  icon?: string;
  name: string;
  value: any;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  error?: string;
  onInput: (e: any, name: string) => void;
  className?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  name,
  value,
  type = 'text',
  placeholder,
  error,
  onInput,
  className = ''
}) => {
  return (
    <div className={`input-field-wrapper-premium ${className}`}>
      <IonLabel className="field-label-premium">{label}</IonLabel>
      <div className={`input-inner-premium ${error ? 'error' : ''} ${!icon ? 'no-icon' : ''}`}>
        {icon && <IonIcon icon={icon} />}
        <IonInput
          name={name}
          type={type}
          value={value}
          onIonInput={(e) => onInput(e, name)}
          placeholder={placeholder}
          mode="md"
        />
      </div>
      {error && <div className="error-message-premium">{error}</div>}
    </div>
  );
};

export default CustomInput;
