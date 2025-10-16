import { shadowMilkImages } from './GameData';

interface ShadowMilkCharacterProps {
  mood: keyof typeof shadowMilkImages;
  dialogue: string;
  isShuffling: boolean;
  isDealingCard: boolean;
}

export const ShadowMilkCharacter = ({ 
  mood, 
  dialogue, 
  isShuffling, 
  isDealingCard 
}: ShadowMilkCharacterProps) => {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-30 w-screen h-[33vh] flex items-end justify-center pointer-events-none">
      <div className="relative flex flex-col items-center">
        <img 
          src={shadowMilkImages[mood]} 
          alt="Shadow Milk" 
          className={`w-full h-full max-w-[90vw] max-h-[33vh] object-contain drop-shadow-2xl transition-all duration-500 ${
            isShuffling ? 'animate-bounce' : ''
          } ${
            isDealingCard ? 'animate-pulse' : ''
          }`}
        />
        {dialogue && (
          <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-2 sm:border-3 border-purple-600 rounded-xl px-3 py-2 sm:px-4 sm:py-2 max-w-[280px] sm:max-w-sm shadow-xl animate-bounce-in pointer-events-auto">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] sm:border-l-[8px] sm:border-r-[8px] sm:border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
            <p className="text-xs sm:text-sm font-heading text-purple-900 text-center leading-tight">{dialogue}</p>
          </div>
        )}
      </div>
    </div>
  );
};