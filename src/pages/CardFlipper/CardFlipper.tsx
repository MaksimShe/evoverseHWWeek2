import './CardFlipper.css'

import bmw3Old from '../../images/cardFlipper/bmw3_old.jpg';
import bmw5Old from '../../images/cardFlipper/bmw5_old.jpg';
import bmw8Old from '../../images/cardFlipper/bmw8_old.jpg';
import bmw3New from '../../images/cardFlipper/bmw3_new.jpg';
import bmw5New from '../../images/cardFlipper/bmw5_new.jpg';
import bmw8New from '../../images/cardFlipper/bmw8_new.jpg';

import bmwSound from '../../assets/sounds/bmw-bong.mp3';
import useSound from "use-sound";
import { useAppContext } from "../../hooks/UseAppContext.tsx";


export const CardFlipper = () => {
  const cardImages = {
    frontSide: [bmw3Old, bmw5Old, bmw8Old],
    backSide: [bmw3New, bmw5New, bmw8New]
  };

  const { hasSound } = useAppContext()

  const [ playBMW ] = useSound(bmwSound);

  const baseValidation = () => {
    if (
      cardImages.frontSide.length !== cardImages.backSide.length
    ) {
      alert('Error!');
      return false;
    }
    return true;
  }

  baseValidation();

  const handleHoverOnCard = () => {
    if (hasSound) {
      playBMW();
    }
  }

  return (
    <main className="card-flipper-bg">

      <section className="cards">
        {cardImages.frontSide.map((img, i) => (
          <div className="card_container" key={img} onMouseEnter={handleHoverOnCard}>
            <div className="card_inner">
              <div className="card_front">
                <img src={img} alt="Front"/>
              </div>
              <div className="card_back">
                <img src={cardImages.backSide[i]} alt="Back"/>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}