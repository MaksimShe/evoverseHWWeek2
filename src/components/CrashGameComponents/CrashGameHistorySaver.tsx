import cn from "classnames";
import {useSaveHistory} from "../../hooks/useSaveHistory.ts";

const tableTitles = ['Bet', 'Multiplier', 'Time', 'Cashout', 'Multiplier grows to'];

export type History = {
  bet: number,
  multiplier: number,
  time: string,
  status: 'won' | 'lost',
  cashOut: number,
  maxMltp: number,
}

export const CrashGameHistorySaver = () => {
  const { getHistory } = useSaveHistory();
  const prevBets = getHistory();

  return (
    <table className="crash-game-history">
      <thead>
      <tr>
        {tableTitles.map(title => <th key={title}>{title}</th>)}
      </tr>
      </thead>

      <tbody>
      {
        prevBets.length > 0 ? (
          prevBets.map((bet: History) => (
            <tr key={bet.time + '_' + bet.cashOut + '_' + bet.maxMltp}>
              <td className="crash-game-table-cash">{bet.bet}</td>
              <td className="crash-game-table-mltp">{bet.multiplier.toFixed(2)}</td>
              <td className="crash-game-table-date">{bet.time}</td>
              <td
                className={cn(
                  { 'crash-game-table-status-won': bet.status === 'won' },
                  { 'crash-game-table-status-lost': bet.status === 'lost' },
                )}
              >
                {bet.cashOut.toFixed(2)}
              </td>
              <td className="crash-game-table-max-mltp">{bet.maxMltp}</td>
            </tr>
          ))
        ) : (
          <tr className="crash-game-empty-table">
            <td colSpan={tableTitles.length}>No info...</td>
          </tr>
        )
      }
      </tbody>
    </table>
  );
};
