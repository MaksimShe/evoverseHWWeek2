import dayjs from "dayjs";
import type { History } from "../components/CrashGameComponents/CrashGameHistorySaver";

export const useSaveHistory = () => {

  const saveHistory = (
    mltp: number,
    status: History["status"],
    bet: number,
    maxMltp: number,
  ) => {

    const cashOut = status === "won" ? mltp * bet : -bet;

    const record: History = {
      bet: +bet.toFixed(2),
      multiplier: +mltp.toFixed(2),
      time: dayjs().format("MM-DD HH:mm:ss"),
      status,
      cashOut: +cashOut.toFixed(2),
      maxMltp: maxMltp,
    };

    const json = localStorage.getItem("crash_history");
    const history: History[] = json ? JSON.parse(json) : [];

    const updated = [record, ...history].slice(0, 7);

    localStorage.setItem("crash_history", JSON.stringify(updated));

    return record;
  };

  const getHistory = (): History[] => {
    const json = localStorage.getItem("crash_history");
    return json ? JSON.parse(json) : [];
  };

  return { saveHistory, getHistory };
};
