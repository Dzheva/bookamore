import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Props {
  label: string;
  isValid: boolean;
}

export const ValidationRequirement: React.FC<Props> = ({ label, isValid }) => (
  <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
    {isValid ? <FaCheckCircle className="shrink-0" /> : <FaRegCircle className="shrink-0 opacity-50" />}
    <span className={isValid ? 'font-medium' : ''}>{label}</span>
  </div>
);