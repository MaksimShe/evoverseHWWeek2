import './Header.css'
import {NavLink, useLocation} from "react-router-dom";
import useSound from "use-sound";
import headerSound from "../../assets/sounds/headerSound.wav";
import cashAddSound from "../../assets/sounds/cashAdd.mp3"
import {useAppContext} from "../../hooks/UseAppContext.tsx";

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
        location.pathname !== "/"

          ?

        <NavLink to={'/'} className='goHomeWalter' onClick={() => playSound(playHeaderMainSound)}>
          <img
            className='img-home logo'
            src='/src/assets/home.png'
            alt='Go home'
          />
        </NavLink>

          :

          <div className="goHomeWalter">

          </div>
      }
      <div className="wrapper">
        <div className="header-account">
          <NavLink to={'/login'}>
            {`${user?.username || user?.email || 'Login'}`}
          </NavLink>
        </div>
        <div className='balance'>
          <span>{`${user?.balance.toFixed(2)}`}</span>
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
            onClick={() => takeGift()}
          />
        </div>
        <div>
          <img
            className="logo"
            src={isDarkMode ? '/src/assets/sun.png' : '/src/assets/moon.png'}
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
            src='/src/assets/music.png'
            alt='sound'
            onClick={() => {
              toggleSound();
              playSound(playHeaderMainSound);
            }}
          />
        </div>
      </div>
    </header>
  )
}