import './App.css'

import { Routes, Route } from 'react-router-dom';
import {Header} from "./components/Header/Heared.tsx";
import {MainMenu} from "./pages/MainMenu/MainMenu.tsx";
import {BetCalculator} from "./pages/BetCalculator/BetCalculator.tsx";
import {CardFlipper} from "./pages/CardFlipper/CardFlipper.tsx";
import {CrashGame} from "./pages/CrashGame/CrashGame.tsx";
import {AccountLogin} from "./pages/AccountLogin/AccountLogin.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {CaseGame} from "./pages/CaseGame/CaseGame.tsx";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<AccountLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainMenu />} />
          <Route path="/bet-calculator" element={<BetCalculator />} />
          <Route path="/card-flipper" element={<CardFlipper />} />
          <Route path="/crash-game" element={<CrashGame />} />
          <Route path="/case-game" element={<CaseGame />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
