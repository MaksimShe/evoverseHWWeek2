import { NavLink } from "react-router-dom"
import './MainMenu.css'
import useSound from "use-sound";
import boopSfx from '../../assets/sounds/hoverSound.mp3'

export const MainMenu = () => {
  const [play] = useSound(boopSfx);

  const links = [
    {
      linkTo: '/slot-machine',
      name: 'Slot Machine',
    },
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
              onMouseEnter={() => play()}>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}