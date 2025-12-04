import { NavLink } from "react-router-dom"
import './MainMenu.css'
import useSound from "use-sound";
import hoverSound from '../../assets/sounds/hoverSound.mp3'
import clickSound from '../../assets/sounds/clickMenu.mp3'
import { useAppContext } from "../../hooks/UseAppContext.tsx";

export const MainMenu = () => {
  const [playHover] = useSound(hoverSound);
  const [playClick] = useSound(clickSound);
  const { hasSound } = useAppContext();

  const links = [
    {
      linkTo: '/crash-game',
      name: 'Crash game',
    },
    {
      linkTo: '/card-flipper',
      name: 'Card Flipper',
    },
    {
      linkTo: '/bet-calculator',
      name: 'Bet Calculator',
    },
    {
      linkTo: '/case-game',
      name: 'Case Game',
    }
  ];

  return (
    <div className="main-menu">
      <ul className="main-menu-list">
        {links.map((link) => (
          <li key={link.linkTo} className="main-menu-item">
            <NavLink
              to={link.linkTo}
              className="main-menu-link"
              onClick={() => hasSound && playClick()}
              onMouseEnter={() => hasSound && playHover()}>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}