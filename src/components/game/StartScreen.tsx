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
    <div className="text-center space-y-6 sm:space-y-10">
      <div className="relative inline-block">
        <img 
          src={shadowMilkImages.neutral} 
          alt="Shadow Milk" 
          className="w-72 h-72 sm:w-96 sm:h-96 object-contain mx-auto drop-shadow-2xl"
        />
        <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-2 border-purple-500 rounded-2xl px-4 py-3 max-w-[280px] sm:max-w-md shadow-xl">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
          <p className="text-sm sm:text-lg font-heading text-purple-900 text-center leading-tight">
            Привет! Я Shadow Milk Cookie! Сыграем в карты? 🎭
          </p>
        </div>
      </div>
      <div className="flex gap-3 sm:gap-4 justify-center items-center flex-wrap px-4 pt-6">
        <Button 
          onClick={onStartGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg sm:text-2xl px-10 sm:px-16 py-5 sm:py-8 rounded-2xl border-4 border-purple-300 shadow-2xl transform hover:scale-105 transition-all font-bold"
        >
          <Icon name="Play" className="mr-2 sm:mr-3" size={28} />
          Начать Игру
        </Button>
        <Button 
          onClick={onToggleMusic}
          className={`${
            isMusicPlaying 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700'
          } hover:opacity-90 text-white px-5 sm:px-8 py-5 sm:py-8 rounded-2xl border-4 border-gray-300 shadow-2xl transform hover:scale-105 transition-all`}
        >
          <Icon name={isMusicPlaying ? 'Volume2' : 'VolumeX'} size={28} />
        </Button>
      </div>
    </div>
  );
};