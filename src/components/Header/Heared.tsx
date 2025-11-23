import './Header.css'
import type {FC} from "react";

interface Props {
  balance: number;
}

export const Header: FC<Props> = ({balance}) => {
  return (
    <header className="header">
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
        />
      </div>
      <div>
        <img
          className="logo"
          src='/src/assets/sun.png'
          alt='mode'
        />
      </div>
      <div>
        <img
          className="logo"
          src='/src/assets/music.png'
          alt='sound'
        />
      </div>
    </header>
  )
}