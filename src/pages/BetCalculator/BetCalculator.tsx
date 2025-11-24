import './BetCalculator.css'
import {useEffect, useState} from "react";
import useSound from "use-sound";
import boopSfx from '../../assets/sounds/betCalcClick.mp3'

interface BetRecord {
  value: number;
  coef: number;
  betType: number;
  win: string;
  date: string;
}

export const BetCalculator = () => {

  const [play] = useSound(boopSfx)

  const [value, setValue] = useState<number>(0);
  const [coef, setCoef] = useState<number>(0);
  const [betType, setBetType] = useState<number | null>(null);

  const [history, setHistory] = useState<BetRecord[]>([]);

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
      setCoef(0);
      setValue(0);

    } else {
      alert("Please enter all fields");
    }
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bets") || "[]");
    setHistory(data);
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("bets");
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
    play();
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
      <form className="bet-form">
        <input
          type="number"
          className="bet-input"
          placeholder="Enter cash"
          value={value === 0 ? '' : value}
          onChange={(e) => setValue(+e.target.value)}
        />
        <input
          type="number"
          className="bet-input"
          placeholder="Enter coefficient"
          value={coef === 0 ? '' : coef}
          onChange={(e) => setCoef(+e.target.value)}
        />

        <fieldset className="bet-type">
          <legend>Select a type of bet:</legend>
          <div>
            <input type="radio" name="betType" id="sport" value="0" onClick={() => setBetType(0)} />
            <label htmlFor="sport">Sport</label>
          </div>
          <div>
            <input type="radio" name="betType" id="slot" value="1" onClick={() => setBetType(1)} />
            <label htmlFor="slot">Slot</label>
          </div>
          <div>
            <input type="radio" name="betType" id="cards" value="2" onClick={() => setBetType(2)} />
            <label htmlFor="cards">Card game</label>
          </div>
        </fieldset>

        <button
          className="button"
          type="submit"
          onClick={(event) => saveResult(event)}
        >
          Save result
        </button>
        <button
          className="button"
          onClick={() => clearHistory()}>
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
              <th>Cash</th>
              <th>Coef</th>
              <th>Type</th>
              <th>Win</th>
              <th>Date</th>
            </tr>
            </thead>

            <tbody>
            {history.map((item, i) => (
              <tr key={i}>
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