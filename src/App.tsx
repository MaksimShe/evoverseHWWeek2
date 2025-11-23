import './App.css'
import {Header} from "./components/Header/Heared.tsx";
import {Footer} from "./components/Footer/Footer.tsx";
import {MainMenu} from "./components/MainMenu/MainMenu.tsx";

function App() {

  return (
    <>
      <Header balance={11}/>
      <MainMenu />
      <Footer />
    </>
  )
}

export default App
