import { Card } from '@/components/ui/card';

interface ScoreBoardProps {
  score: number;
  streak: number;
  highScore: number;
}

export const ScoreBoard = ({ score, streak, highScore }: ScoreBoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-purple-500">
        <div className="text-center">
          <p className="text-sm text-purple-600 mb-2">Очки</p>
          <p className="text-4xl font-heading text-purple-900">{score}</p>
        </div>
      </Card>
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-pink-500">
        <div className="text-center">
          <p className="text-sm text-pink-600 mb-2">Серия</p>
          <p className="text-4xl font-heading text-pink-900">{streak} 🔥</p>
        </div>
      </Card>
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-4 border-yellow-500">
        <div className="text-center">
          <p className="text-sm text-yellow-600 mb-2">Рекорд</p>
          <p className="text-4xl font-heading text-yellow-900">{highScore}</p>
        </div>
      </Card>
    </div>
  );
};
