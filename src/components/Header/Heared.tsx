import './Header.css'
import {NavLink, useLocation} from "react-router-dom";
import useSound from "use-sound";
import headerSound from "../../assets/sounds/headerSound.wav";
import cashAddSound from "../../assets/sounds/cashAdd.mp3"
import {useAppContext} from "../../hooks/UseAppContext.tsx";

import soundOnIcon from '../../assets/music.png';
import soundOffIcon from '../../assets/no-music.png';
import darkModeIcon from '../../assets/moon.png';
import dayModeIcon from '../../assets/sun.png';
import goHomeWalterIcon from '../../assets/home.png';
import giftIcon from '../../assets/gift-box.png';
import moneyIcon from '../../assets/balance.gif'

export const Header = () => {
  const { isDarkMode, hasSound, user, addMoney, toggleDarkMode, toggleSound } = useAppContext();
  const [playHeaderMainSound] = useSound(headerSound);
  const [playCashAddSound] = useSound(cashAddSound);
  const location = useLocation();

  const playSound = (sound: any) => {
    if (hasSound) sound();
  }

  const takeGift = () => {
    if (user) {
      addMoney(5);
      playSound(playCashAddSound);
    }
  }

  return (
    <header className="header">
      {
        (location.pathname !== "/" && location.pathname !== "/login")
          ?
        <NavLink to={'/'} className='goHomeWalter' onClick={() => playSound(playHeaderMainSound)}>
          <img
            className='img-home logo'
            src={goHomeWalterIcon}
            alt='Go home'
          />
        </NavLink>
          :
          <div className="goHomeWalter"></div>
      }
      <div className="wrapper">
        <div className="header-account">
          <NavLink to={'/login'}>
            {`${user?.username || user?.email || 'Login'}`}
          </NavLink>
        </div>
        <div className='balance'>
          { user &&
            <>
              <span>{`${user?.balance.toFixed(2)}`}</span>
              <img
                className="img-balance"
                src={moneyIcon}
                alt='balance-box'
              />
            </>
          }
        </div>
        <div>
          {user &&
            <img
              className="logo"
              src={giftIcon}
              alt='gift'
              onClick={() => takeGift()}
            />
          }
        </div>
        <div>
          <img
            className="logo"
            src={isDarkMode ? dayModeIcon : darkModeIcon}
            alt='mode'
            onClick={() => {
              toggleDarkMode();
              playSound(playHeaderMainSound);
            }}
          />
        </div>
        <div>
          <img
            className={`logo ${!hasSound ? 'sound-off' : 'sound-on'}`}
            src={!hasSound ? soundOffIcon : soundOnIcon}
            alt='sound'
            onClick={() => {
              toggleSound();
              playSound(playHeaderMainSound);
            }}
          />
        </div>
      </div>
      {window.innerWidth < 700 && (
        <div className="mobile-footer">
          {
            (location.pathname !== "/" && location.pathname !== "/login")
              &&
            <NavLink to="/" onClick={() => playSound(playHeaderMainSound)}>
              <img className="img-home logo" src={goHomeWalterIcon} alt="home" />
            </NavLink>
          }

          {user && (
            <div className="balance mobile">
              <span>{user.balance.toFixed(0)}</span>
              <img className="img-balance" src={moneyIcon} alt="balance" />
            </div>
          )}

          <div className="header-account mobile">
            <NavLink to="/login">
              {user?.username || user?.email || "Login"}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}