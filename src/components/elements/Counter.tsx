import { useEffect, useRef, useState } from "react";
import "./Counter.css";
import {roundBalance} from "../../helper/roundBalance.ts";

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

  const toRef = useRef(growsTo);

  useEffect(() => {
    const accelerate = 0.000005;

    const animate = () => {
      if (finish) {
        handleWin(value);
        return;
      }

      const newValue = value + speedRef.current;
      setValue(newValue);

      speedRef.current += accelerate;

      if(autoStopValue) {
        if (newValue >= autoStopValue) {
          setValue(toRef.current!);
          handleWin(newValue);
        }
      }

      if (newValue < toRef.current!) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setValue(toRef.current!);
        handleLose(toRef.current!);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [finish, handleWin, handleLose, value]);

  return <div className="crash-game-counter">x{roundBalance(value)}</div>;
};
