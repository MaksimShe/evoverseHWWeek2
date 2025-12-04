import './CaseGame.css';
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { motion, useAnimation } from "framer-motion";
import { useAppContext } from "../../hooks/UseAppContext.tsx";
import clickSound from "../../assets/sounds/betCalcClick.mp3"
import useSound from "use-sound";

type CaseType = {
  name: string,
  icon: string,
  price: number,
  contain: string[][]
  containText: string[][]
}

type CaseItem = {
  emoji: string;
  rarity: string;
  text: string;
}

const CASES_TYPE: CaseType[] = [
  {
    name: 'Space Case',
    icon: '🚀',
    price: 75,
    contain: [
      ['⭐','🌙','☄','🛸','🌍'],
      ['🪐','🌌','🚀'],
      ['👽','🌟'],
      ['💫','🌠'],
      ['🔭'],
      ['🌞']
    ],
    containText: [
      ['Star', 'Moon', 'Comet', 'UFO', 'Earth'],
      ['Planet', 'Galaxy', 'Rocket'],
      ['Alien', 'Shining Star'],
      ['Sparkle', 'Shooting Star'],
      ['Telescope'],
      ['Sun']
    ]
  },
  {
    name: 'Sport Case',
    icon: '⚽',
    price: 60,
    contain: [
      ['⚽','🏀','🏈','⚾','🎾'],
      ['🏐','🏓','🥊'],
      ['🥇','🏆'],
      ['🎖','👑'],
      ['🏅'],
      ['⚡']
    ],
    containText: [
      ['Soccer', 'Basketball', 'Football', 'Baseball', 'Tennis'],
      ['Volleyball', 'Ping Pong', 'Boxing'],
      ['Gold Medal', 'Trophy'],
      ['Medal', 'Crown'],
      ['Medallion'],
      ['Lightning']
    ]
  },
  {
    name: 'Animal Case',
    icon: '🦁',
    price: 50,
    contain: [
      ['🐭','🐸','🐰','🐔','🐷'],
      ['🐼','🦊','🦝'],
      ['🦁','🐯'],
      ['🦄','🐉'],
      ['🦖'],
      ['👑']
    ],
    containText: [
      ['Mouse', 'Frog', 'Rabbit', 'Chicken', 'Pig'],
      ['Panda', 'Fox', 'Raccoon'],
      ['Lion', 'Tiger'],
      ['Unicorn', 'Dragon'],
      ['Dinosaur'],
      ['Crown']
    ]
  },
  {
    name: 'Food Case',
    icon: '🍕',
    price: 40,
    contain: [
      ['🍎','🍌','🍞','🥕','🥒'],
      ['🍕','🍔','🌮'],
      ['🍰','🍣'],
      ['🦞','🍾'],
      ['🎂'],
      ['💎']
    ],
    containText: [
      ['Apple', 'Banana', 'Bread', 'Carrot', 'Cucumber'],
      ['Pizza', 'Burger', 'Taco'],
      ['Cake', 'Sushi'],
      ['Lobster', 'Champagne'],
      ['Birthday Cake'],
      ['Diamond']
    ]
  }
];

const CHANGES_RARITY = [
  { category: 'Common', percent: 55 },
  { category: 'Uncommon', percent: 25 },
  { category: 'Rare', percent: 12 },
  { category: 'Epic', percent: 5 },
  { category: 'Legendary', percent: 2.5 },
  { category: 'Gold', percent: 0.5 },
];

const CHANGES_PATTERN = {
  common: 55,
  uncommon: 25,
  rare: 12,
  epic: 5,
  legendary: 2.5,
  gold: 0.5,
}

const PRICE_RARITY = {
  '0' : 15,
  '1' : 40,
  '2' : 80,
  '3' : 150,
  '4' : 250,
  '5' : 800,
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const CaseGame = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(0);
  const [animationItems, setAnimationItems] = useState<CaseItem[]>([]);
  const [isActiveGame, setIsActiveGame] = useState(false);
  const [hasOpen, setHasOpen] = useState(false);
  const controls = useAnimation();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const centerLineRef = useRef<HTMLDivElement | null>(null);
  const [playClick] = useSound(clickSound);

  const { addMoney, user, hasSound } = useAppContext()

  const findCenteredItem = (): CaseItem | null => {
    if (!trackRef.current || !centerLineRef.current) return null;

    const centerRect = centerLineRef.current.getBoundingClientRect();
    const cards = Array.from(trackRef.current.querySelectorAll('.case-game-roulette-card')) as HTMLElement[];
    const centerX = centerRect.x + centerRect.width / 2;

    let closestCard: HTMLElement | null = null;
    let closestDistance = Infinity;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(centerX - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    if (!closestCard) return null;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const index = Number(closestCard.dataset.index);
    return animationItems[index] || null;
  };

  const generateCaseEmojis = (caseType: CaseType): CaseItem[] => {
    const result: CaseItem[] = [];

    Object.entries(CHANGES_PATTERN).forEach(([, value], index) => {
      const count = Math.floor(value * 2);
      for (let i = 0; i < count; i++) {
        const emoji = caseType.contain[index][i % caseType.contain[index].length];
        const text = caseType.containText[index][i % caseType.containText[index].length];
        result.push({ emoji, rarity: index.toString(), text});
      }
    });

    return result.sort(() => Math.random() - 0.5).slice(0, 50);
  };

  const openCase = () => {
    setHasOpen(true);
    if (hasSound) playClick();
    addMoney(-CASES_TYPE[selectedCaseId].price);
    const newItems = generateCaseEmojis(CASES_TYPE[selectedCaseId]);
    setAnimationItems(newItems);
    setIsActiveGame(true);
  };

  const winItem = (caseItem: CaseItem | null) => {
    if (caseItem) {
      const price = PRICE_RARITY[caseItem.rarity as keyof typeof PRICE_RARITY];
      addMoney(price);
    }
  }

  const canBuyCase = (caseType: CaseType): boolean => {
    console.log(user?.balance)
    return !!(user?.balance && user?.balance > caseType.price);
  }

  useEffect(() => {
    if (animationItems.length && isActiveGame) {
      const randomDuration = getRandomInt(3, 5);

      controls.start({
        x: ["0%", `-${getRandomInt(300, 600)}%`],
        transition: {
          repeat: 0,
          ease: [0.25, 0, 0.25, 1],
          duration: randomDuration,
        },
      }).then(() => {
        winItem(findCenteredItem());
        setIsActiveGame(false);
      });
    }
  }, [animationItems, isActiveGame]);

  return (
    <main className="case-game-bg">
      <div className="case-game-main">
        <section className="case-game-cases">
          <h2 className="case-game-titles">Select a case</h2>
          <div className="case-game-cases-select">
            {CASES_TYPE.map((caseType, i) => (
              <div
                key={caseType.name}
                className={cn("case-game-case",
                  {
                    'case-opening': isActiveGame,
                    'active' : i === selectedCaseId
                  })}
                onClick={() => {
                  if (!isActiveGame) {
                    setAnimationItems([]);
                    setHasOpen(false)
                    setSelectedCaseId(i);
                    if (hasSound) playClick();
                  }
                }}
              >
                <p className="case-game-case-icon">{caseType.icon}</p>
                <h2 className="case-game-case-name">{caseType.name}</h2>
                <p className="case-game-case-price">{caseType.price}$</p>
              </div>
            ))}
          </div>
        </section>

        <section className="case-game-roulette">
          <div className="case-game-roulette-field">
            {!hasOpen ? (
                <p className="case-game-bg-text"> Select case and click `Open` to start</p>
              ) : (
                <div ref={centerLineRef} className="case-game-roulette-field-line"></div>
              )
            }
            <motion.div ref={trackRef} className="roulette-track" animate={controls}>
              {animationItems.map((item, idx) => (
                <div
                  key={`${idx} + ${item.emoji}`}
                  className={`case-game-roulette-card case-game-group-${item.rarity}`}
                  data-index={idx}
                >
                  <div className="roulette-item">{item.emoji}</div>
                  <p className="roulette-text">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <button
            className="case-game-roulette-btn"
            onClick={() => openCase()}
            disabled={isActiveGame || !canBuyCase(CASES_TYPE[selectedCaseId])}
          >
            {
              isActiveGame ? 'Opening...' : `Open ${CASES_TYPE[selectedCaseId].name} - $${CASES_TYPE[selectedCaseId].price}`
            }
          </button>
        </section>

        <section className="case-game-content">
          <h2 className="case-game-titles">Case Contents</h2>
          <div className="case-game-content-grid">
            {CASES_TYPE[selectedCaseId].contain.map((group, groupIdx) =>
              Array.from(group).map((emoji, idx) => (
                <p key={`${groupIdx}-${idx}`} className={`case-game-content-item case-game-group-${groupIdx}`}>
                  {emoji}
                </p>
              ))
            )}
          </div>
        </section>

        <section className="case-game-chances">
          <h2 className="case-game-titles">Rarity Guide</h2>
          <div className="case-game-chances-grid">
            {CHANGES_RARITY.map(chance => (
              <div key={chance.category} className="case-game-chances-row">
                <span className={`chance-dot ${chance.category.toLowerCase()}`}></span>
                <span className="case-game-chances-grid-category">{chance.category}</span>
                <span className="case-game-chances-grid-percent">({chance.percent}%)</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}