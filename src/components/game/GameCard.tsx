import { Card } from '@/components/ui/card';
import { CookieCard } from './GameData';

interface GameCardProps {
  card: CookieCard | null;
  flipped?: boolean;
  isDealing?: boolean;
  isHidden?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
}

export const GameCard = ({ 
  card, 
  flipped = false, 
  isDealing = false, 
  isHidden = false,
  showResult = false,
  isCorrect = false
}: GameCardProps) => {
  return (
    <Card className={`p-6 border-8 border-purple-900 shadow-2xl rounded-2xl relative overflow-hidden w-80 h-[480px] flex flex-col mx-auto ${
      flipped && !isHidden ? 'animate-flip' : ''
    } ${
      flipped && isHidden ? 'animate-flip-back' : ''
    } ${
      isDealing ? 'animate-deal-card' : ''
    } ${
      isHidden && !showResult 
        ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500' 
        : 'bg-white'
    }`}>
      {isHidden && !showResult ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-2xl font-heading mb-6 text-white drop-shadow-lg">Следующая карта</p>
          <div className="text-9xl mb-6 animate-bounce">❓</div>
          <h3 className="text-3xl font-heading text-white drop-shadow-lg">Угадай!</h3>
        </div>
      ) : (
        <div className={showResult ? 'animate-bounce-in h-full flex flex-col' : 'h-full flex flex-col'}>
          <div className="absolute top-3 left-3">
            <div className="text-2xl font-heading text-purple-900 leading-none">{card?.value}</div>
            <div className="text-3xl">{card?.emoji}</div>
          </div>
          <div className="absolute bottom-3 right-3 transform rotate-180">
            <div className="text-2xl font-heading text-purple-900 leading-none">{card?.value}</div>
            <div className="text-3xl">{card?.emoji}</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {showResult && (
              <p className="text-2xl font-heading mb-4 text-purple-900">
                {isCorrect ? '✅ Правильно!' : '❌ Неверно!'}
              </p>
            )}
            <img 
              src={card?.image} 
              alt={card?.name}
              className="w-56 h-56 object-contain mb-3"
            />
            <h3 className="text-xl font-heading text-purple-900 uppercase tracking-wide">{card?.name}</h3>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5 pointer-events-none">
            {card?.emoji}
          </div>
        </div>
      )}
    </Card>
  );
};
