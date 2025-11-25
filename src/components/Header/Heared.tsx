import './Header.css'
import type {FC} from "react";
import {NavLink} from "react-router-dom";
import useSound from "use-sound";
import headerSound from "../../assets/sounds/headerSound.wav";
import {useAppContext} from "../../hooks/UseAppContext.tsx";

interface Props {
  balance: number;
  addBonus: () => void;
}

export const Header: FC<Props> = ({ balance, addBonus }) => {
  const { isDarkMode, hasSound, toggleDarkMode, toggleSound } = useAppContext();
  const [play] = useSound(headerSound);

  const playSound = () => {
    if (hasSound) play();
  }


  return (
    <header className="header">
      <NavLink to={'/'} className='goHomeWalter' onClick={() => hasSound && play()}>
        <img
          className='img-home logo'
          src='/src/assets/home.png'
          alt='Go home'
        />
      </NavLink>
      <div className="wrapper">
        <div className='balance'>
          <span>{`${balance}`}</span>
          <img
            className="img-balance"
            src='/src/assets/balance.gif'
            alt='balance-box'
          />
        </div>
        <div>
          <img
            className="logo"
            src='/src/assets/gift-box.png'
            alt='gift'
            onClick={() => {
              addBonus();
              playSound();
            }}
          />
        </div>
        <div>
          <img
            className="logo"
            src={isDarkMode ? '/src/assets/sun.png' : '/src/assets/moon.png'}
            alt='mode'
            onClick={() => {
              toggleDarkMode();
              playSound();
            }}
          />
        </div>
        <div>
          <img
            className="logo"
            src={hasSound ? '/src/assets/music.png' : '/src/assets/no-music.png'}
            alt='sound'
            onClick={() => {
              toggleSound();
              playSound();
            }}
          />
        </div>
      </div>
    </header>
  )
}