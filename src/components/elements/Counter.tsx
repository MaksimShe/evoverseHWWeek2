import { useEffect, useRef, useState } from 'react';
import './Counter.css';
import { roundBalance } from '../../helper/roundBalance.ts';

interface CounterProps {
  finish?: boolean;
  growsTo: number;
  autoStopValue?: number | null;
  handleWin: (value: number) => void;
  handleLose: (value: number) => void;
}

export const Counter = ({
  finish = false,
  growsTo,
  autoStopValue = null,
  handleWin,
  handleLose,
}: CounterProps) => {
  const [value, setValue] = useState(1);

  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(0.002);
  const valueRef = useRef(1); // ✅ Track current value with ref
  const toRef = useRef(growsTo);

  useEffect(() => {
    // Reset refs when component mounts/counter key changes
    valueRef.current = 1;
    speedRef.current = 0.002;
    toRef.current = growsTo;
  }, [growsTo]);

  useEffect(() => {
    const accelerate = 0.000005;

    const animate = () => {
      if (finish) {
        handleWin(valueRef.current); // ✅ Use ref value
        return;
      }

      const newValue = valueRef.current + speedRef.current; // ✅ Read from ref
      valueRef.current = newValue; // ✅ Update ref
      setValue(newValue); // ✅ Update state for display

      speedRef.current += accelerate;

      if (autoStopValue) {
        if (newValue >= autoStopValue) {
          valueRef.current = autoStopValue;
          setValue(autoStopValue);
          handleWin(autoStopValue);
          return; // ✅ Stop animation
        }
      }

      if (newValue < toRef.current!) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        valueRef.current = toRef.current!;
        setValue(toRef.current!);
        handleLose(toRef.current!);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finish, handleWin, handleLose, autoStopValue]);

  return <div className="crash-game-counter">x{roundBalance(value)}</div>;
};
