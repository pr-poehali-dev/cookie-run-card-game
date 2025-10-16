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
    <Card className={`p-3 border-4 border-purple-900 shadow-xl rounded-xl relative overflow-hidden w-32 h-48 sm:w-40 sm:h-60 flex flex-col mx-auto ${
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
          <p className="text-xs sm:text-sm font-heading mb-2 text-white drop-shadow-lg">Следующая</p>
          <div className="text-4xl sm:text-5xl mb-2 animate-bounce">❓</div>
          <h3 className="text-sm sm:text-base font-heading text-white drop-shadow-lg">Угадай!</h3>
        </div>
      ) : (
        <div className={showResult ? 'animate-bounce-in h-full flex flex-col' : 'h-full flex flex-col'}>
          <div className="absolute top-1 left-1">
            <div className="text-xs sm:text-sm font-heading text-purple-900 leading-none">{card?.value}</div>
            <div className="text-sm sm:text-base">{card?.emoji}</div>
          </div>
          <div className="absolute bottom-1 right-1 transform rotate-180">
            <div className="text-xs sm:text-sm font-heading text-purple-900 leading-none">{card?.value}</div>
            <div className="text-sm sm:text-base">{card?.emoji}</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {showResult && (
              <p className="text-xs sm:text-sm font-heading mb-1 text-purple-900">
                {isCorrect ? '✅' : '❌'}
              </p>
            )}
            <img 
              src={card?.image} 
              alt={card?.name}
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain mb-1"
            />
            <h3 className="text-[10px] sm:text-xs font-heading text-purple-900 uppercase tracking-wide text-center px-1">{card?.name}</h3>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl opacity-5 pointer-events-none">
            {card?.emoji}
          </div>
        </div>
      )}
    </Card>
  );
};