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
    <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20">
      <div className="relative">
        <img 
          src={shadowMilkImages[mood]} 
          alt="Shadow Milk" 
          className={`w-64 h-64 object-contain drop-shadow-2xl transition-all duration-500 ${
            isShuffling ? 'animate-bounce' : ''
          } ${
            isDealingCard ? 'animate-pulse' : ''
          }`}
        />
        {dialogue && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-4 border-purple-600 rounded-2xl p-4 max-w-sm shadow-xl animate-bounce-in whitespace-nowrap">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
            <p className="text-lg font-heading text-purple-900 text-center">{dialogue}</p>
          </div>
        )}
      </div>
    </div>
  );
};
