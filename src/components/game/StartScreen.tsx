import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { shadowMilkImages } from './GameData';

interface StartScreenProps {
  onStartGame: () => void;
  onToggleMusic: () => void;
  isMusicPlaying: boolean;
}

export const StartScreen = ({ onStartGame, onToggleMusic, isMusicPlaying }: StartScreenProps) => {
  return (
    <div className="text-center space-y-4 sm:space-y-8 pt-[33vh]">
      <div className="relative inline-block">
        <img 
          src={shadowMilkImages.neutral} 
          alt="Shadow Milk" 
          className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto drop-shadow-2xl"
        />
        <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-2 sm:border-3 border-purple-600 rounded-xl px-3 py-2 sm:px-4 sm:py-3 max-w-[250px] sm:max-w-xs shadow-xl">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] sm:border-l-[8px] sm:border-r-[8px] sm:border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
          <p className="text-xs sm:text-sm font-heading text-purple-900 text-center leading-tight">
            Привет! Я Shadow Milk Cookie! Сыграем в карты? 🎭
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap px-4">
        <Button 
          onClick={onStartGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base sm:text-xl px-6 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-purple-900 shadow-2xl transform hover:scale-105 transition-all"
        >
          <Icon name="Play" className="mr-2" size={24} />
          Начать Игру
        </Button>
        <Button 
          onClick={onToggleMusic}
          className={`${
            isMusicPlaying 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700'
          } hover:opacity-90 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-gray-900 shadow-2xl transform hover:scale-105 transition-all`}
        >
          <Icon name={isMusicPlaying ? 'Volume2' : 'VolumeX'} size={24} />
        </Button>
      </div>
    </div>
  );
};