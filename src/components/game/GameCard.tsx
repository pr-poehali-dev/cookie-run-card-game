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
    <Card className={`p-2 border-4 border-purple-900 shadow-2xl rounded-lg relative overflow-hidden w-28 h-40 sm:w-36 sm:h-52 flex flex-col mx-auto ${
      flipped && !isHidden ? 'animate-flip' : ''
    } ${
      flipped && isHidden ? 'animate-flip-back' : ''
    } ${
      isDealing ? 'animate-deal-card' : ''
    } ${
      isHidden && !showResult 
        ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700' 
        : 'bg-white'
    }`} style={{
      backgroundImage: isHidden && !showResult ? 
        'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' : 
        'none'
    }}>
      {isHidden && !showResult ? (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-20 sm:w-20 sm:h-28 border-4 border-white/30 rounded-lg"></div>
          </div>
          <div className="text-3xl sm:text-4xl animate-pulse">🎴</div>
        </div>
      ) : (
        <div className={showResult ? 'animate-bounce-in h-full flex flex-col' : 'h-full flex flex-col'}>
          <div className="absolute top-0.5 left-0.5">
            <div className="text-xs sm:text-sm font-heading text-purple-900 leading-none font-bold">{card?.value}</div>
            <div className="text-xs sm:text-sm">{card?.emoji}</div>
          </div>
          <div className="absolute bottom-0.5 right-0.5 transform rotate-180">
            <div className="text-xs sm:text-sm font-heading text-purple-900 leading-none font-bold">{card?.value}</div>
            <div className="text-xs sm:text-sm">{card?.emoji}</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {showResult && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl z-10">
                {isCorrect ? '✅' : '❌'}
              </div>
            )}
            <img 
              src={card?.image} 
              alt={card?.name}
              className="w-16 h-16 sm:w-24 sm:h-24 object-contain mb-0.5"
            />
            <h3 className="text-[9px] sm:text-[10px] font-heading text-purple-900 uppercase tracking-tight text-center px-0.5 font-bold">{card?.name}</h3>
          </div>
        </div>
      )}
    </Card>
  );
};