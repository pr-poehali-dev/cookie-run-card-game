import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameControlsProps {
  showResult: boolean;
  onGuessHigher: () => void;
  onGuessLower: () => void;
  onNextRound: () => void;
}

export const GameControls = ({ 
  showResult, 
  onGuessHigher, 
  onGuessLower, 
  onNextRound 
}: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      {!showResult ? (
        <>
          <Button
            onClick={onGuessHigher}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl px-8 py-6 rounded-xl border-4 border-green-900 shadow-xl transform hover:scale-105 transition-all w-full"
          >
            <Icon name="ArrowUp" className="mr-2" size={28} />
            Выше
          </Button>
          <div className="text-4xl">VS</div>
          <Button
            onClick={onGuessLower}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xl px-8 py-6 rounded-xl border-4 border-red-900 shadow-xl transform hover:scale-105 transition-all w-full"
          >
            <Icon name="ArrowDown" className="mr-2" size={28} />
            Ниже
          </Button>
        </>
      ) : (
        <Button
          onClick={onNextRound}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl px-8 py-6 rounded-xl border-4 border-blue-900 shadow-xl transform hover:scale-105 transition-all"
        >
          <Icon name="SkipForward" className="mr-2" size={28} />
          Дальше
        </Button>
      )}
    </div>
  );
};
