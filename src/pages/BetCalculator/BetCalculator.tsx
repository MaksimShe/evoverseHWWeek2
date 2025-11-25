import './BetCalculator.css'
import { useState } from "react";
import useSound from "use-sound";
import boopSfx from '../../assets/sounds/betCalcClick.mp3'
import { Input } from "../../components/atoms/Input.tsx";

import {useAppContext} from "../../hooks/UseAppContext.tsx";

interface BetRecord {
  value: number;
  coef: number;
  betType: number;
  win: string;
  date: string;
}

const BET_TYPES = [
  {
    id: 0,
    name: "Sport!",
    nameProp: "sport",
  },
  {
    id: 1,
    name: "Card games!",
    nameProp: "card_games",
  },
  {
    id: 2,
    name: "Slots!",
    nameProp: "slots",
  }
]

const TABLE_COL_TITLE = ['Bet Cash', 'Coef', 'Type', 'Win', 'Date'];

export const BetCalculator = () => {

  const [play] = useSound(boopSfx)
  const { hasSound } = useAppContext();
  const [value, setValue] = useState<number>(0);
  const [coef, setCoef] = useState<number>(0);
  const [betType, setBetType] = useState<number | null>(null);

  const [history, setHistory] = useState<BetRecord[]>(() => {
    const data = localStorage.getItem("bets");
    return data ? JSON.parse(data) : [];
  });

  const handleValueChange = (value: number) => {
    if (hasSound) play();
    setValue(value);
  };

  const handleCoefChange = (value: number) => {
    if (hasSound) play();
    setCoef(value);
  };

  const clearForm = () => {
    setBetType(null);
    setCoef(0);
    setValue(0)
  }


  const saveResult = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (coef > 0 && value > 0 && betType !== null) {
      const win = (value * coef).toFixed(2);
      const calc: BetRecord = {
        value,
        coef,
        betType,
        win,
        date: new Date().toISOString()
      };

      setHistory([...history, calc]);

      const oldData = JSON.parse(localStorage.getItem("bets") || "[]");
      const newData = [...oldData, calc];

      localStorage.setItem("bets", JSON.stringify(newData));
      clearForm();

    } else {
      alert("Please enter all fields");
    }
  };

  const clearHistory = () => {
    clearForm();
    setHistory([]);

    localStorage.removeItem("bets");
    if (hasSound) play();

  }

  const calculateMultiplier = () => {
    if (value === 0 || coef === 0) {
      return;
    } else if ((value * 2) > (value * coef)) {
      return 'low_result';
    } else if ((value * 5) > (value * coef)) {
      return 'medium_result';
    } else {
      return 'high_result';
    }
  }

  const calculateWin = () => {
    if (coef <= 0) {
      return 0;
    } else if (value <= 0) {
      return 0;
    } else {
      return (value * coef).toFixed(2);
    }
  }

  return (
    <main className="bet-calculator">
      <form className="bet-form" onSubmit={(e) => e.preventDefault()}>
        <Input
          type={'number'}
          value={value}
          handleValue={handleValueChange}
          placeholder={"Enter cash"}
        />
        <Input
          type={'number'}
          value={coef}
          handleValue={handleCoefChange}
          placeholder={"Enter coefficient"}
        />

        <fieldset className="bet-type">
          <legend>Select a type of bet:</legend>
          {
            BET_TYPES.map(radioBtn => (
              <div key={radioBtn.id}>
                <input
                  type='radio'
                  name='betType'
                  id={radioBtn.nameProp}
                  value={radioBtn.id}
                  checked={betType === radioBtn.id}
                  onChange={() => {
                    setBetType(radioBtn.id);
                    if (hasSound) play();
                  }} />
                <label htmlFor={radioBtn.nameProp}>{radioBtn.name}</label>
              </div>
            ))
          }
        </fieldset>

        <button
          className="button"
          type="submit"
          onClick={(event) => {
            saveResult(event);
            if (hasSound) play();
          }}
        >
          Save result
        </button>
        <button
          className="button"
          onClick={() => {
            clearHistory();
            if (hasSound) play();
        }}>
          Clear history
        </button>
    </form>
    <section className="bet-section-result">
      <div className={`bet-result ${calculateMultiplier()}`}>
        <span>{'You can win: '}</span>
        <span className='bet-win-sum'>{calculateWin()}</span>
      </div>
      <section className="bet-history">
        <h2>Bet history</h2>

        {history.length === 0 && <p>No saved bets yet.</p>}

        {history.length > 0 && (
          <table className="bet-history-table">
            <thead>
            <tr>
              {
                TABLE_COL_TITLE.map((title) => (
                  <th key={title}>{title}</th>
                ))
              }
            </tr>
            </thead>

            <tbody>
            {history.map((item) => (
              <tr key={item.date}>
                <td className='value_cell'>{item.value}</td>
                <td className='coef_cell'>{item.coef}</td>
                <td className='type_cell'>
                  {item.betType === 0
                    ? "Sport"
                    : item.betType === 1
                      ? "Slot"
                      : "Card game"}
                </td>
                <td className='win_cell'>{item.win}</td>
                <td className='date_cell'>{new Date(item.date).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
</main>
)
}