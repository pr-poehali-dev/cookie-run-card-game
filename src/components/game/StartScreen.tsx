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
    <div className="text-center space-y-8">
      <div className="relative inline-block">
        <img 
          src={shadowMilkImages.neutral} 
          alt="Shadow Milk" 
          className="w-96 h-96 object-contain mx-auto drop-shadow-2xl"
        />
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-4 border-purple-600 rounded-2xl p-6 max-w-md shadow-2xl">
          <p className="text-2xl font-heading text-purple-900 text-center">
            Привет! Я Shadow Milk Cookie! Сыграем в карты? 🎭
          </p>
        </div>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <Button 
          onClick={onStartGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl px-12 py-6 rounded-2xl border-4 border-purple-900 shadow-2xl transform hover:scale-105 transition-all"
        >
          <Icon name="Play" className="mr-3" size={32} />
          Начать Игру
        </Button>
        <Button 
          onClick={onToggleMusic}
          className={`${
            isMusicPlaying 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700'
          } hover:opacity-90 text-white text-xl px-8 py-6 rounded-2xl border-4 border-gray-900 shadow-2xl transform hover:scale-105 transition-all`}
        >
          <Icon name={isMusicPlaying ? 'Volume2' : 'VolumeX'} size={28} />
        </Button>
      </div>
    </div>
  );
};
