import { useCallback, useRef, useState, type FC } from 'react';

type Props = {
    onComplete?: (pin: string) => void;
};

export const PinInput: FC<Props> = ({ onComplete = () => {} }) => {
    const [values, setValues] = useState<string[]>(Array(4).fill(''));
    const inputsRef = useRef<HTMLInputElement[]>([]);

    const setInputRef = useCallback((el: HTMLInputElement | null, index: number) => {
        if (el) {
            inputsRef.current[index] = el;
        }
    }, []);

    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const newValues = [...values];
            newValues[index] = value;
            setValues(newValues);

            if (value && index < 3) {
                inputsRef.current[index + 1]?.focus();
            }

            if (newValues.every((v) => v !== '')) {
                onComplete(newValues.join(''));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className='relative flex justify-between w-full'>
            {values.map((value, i) => (
                <input
                    key={i}
                    ref={(el) => setInputRef(el, i)}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={value}
                    onChange={({ target }) => handleChange(target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className='size-12 text-center text-xl rounded-xl bg-gray-100 focus:border-blue-500 focus:outline-none'
                />
            ))}
        </div>
    );
};
