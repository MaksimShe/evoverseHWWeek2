import './App.css'

import { Routes, Route } from 'react-router-dom';
import {Header} from "./components/Header/Heared.tsx";
import {MainMenu} from "./pages/MainMenu/MainMenu.tsx";
import {BetCalculator} from "./pages/BetCalculator/BetCalculator.tsx";
import {CardFlipper} from "./pages/CardFlipper/CardFlipper.tsx";
import * as React from "react";

function App() {

  const [balance, setBalance] = React.useState<number>(100);

  const add100Dollars = () => {
    setBalance((i) => i + 100);
  }

  return (
    <>
      <Header balance={ balance } addBonus={add100Dollars} />
      <Routes>
        <Route path="/" element={ <MainMenu /> } />
        <Route path="/bet-calculator" element={ <BetCalculator />} />
        <Route path="/card-flipper" element={ <CardFlipper />} />
      </Routes>
    </>
  )
}

export default App
