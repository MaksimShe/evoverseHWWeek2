import './App.css'

import { Routes, Route } from 'react-router-dom';
import {Header} from "./components/Header/Heared.tsx";
import {MainMenu} from "./pages/MainMenu/MainMenu.tsx";
import {BetCalculator} from "./pages/BetCalculator/BetCalculator.tsx";
import {CardFlipper} from "./pages/CardFlipper/CardFlipper.tsx";

function App() {

  return (
    <>
      <Header balance={113}/>
      <Routes>
        <Route path="/" element={ <MainMenu /> } />
        <Route path="/bet-calculator" element={ <BetCalculator />} />
        <Route path="/card-flipper" element={ <CardFlipper />} />
      </Routes>
    </>
  )
}

export default App
