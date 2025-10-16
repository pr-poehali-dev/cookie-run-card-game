interface DeckDisplayProps {
  deckLength: number;
  isShuffling: boolean;
}

export const DeckDisplay = ({ deckLength, isShuffling }: DeckDisplayProps) => {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        <div className={`absolute -top-2 -left-2 w-80 h-[520px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl transform rotate-2 ${
          isShuffling ? 'animate-wiggle' : ''
        }`}></div>
        <div className={`absolute -top-4 -left-4 w-80 h-[520px] bg-gradient-to-br from-purple-700 to-pink-700 rounded-3xl transform rotate-1 ${
          isShuffling ? 'animate-wiggle' : ''
        }`}></div>
        <div className={`relative w-80 h-[520px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl border-8 border-purple-900 shadow-2xl flex items-center justify-center ${
          isShuffling ? 'animate-wiggle' : ''
        }`}>
          <div className="text-center">
            <div className="text-9xl mb-4 animate-pulse">🎴</div>
            <p className="text-2xl font-heading text-white drop-shadow-lg">Колода</p>
            <p className="text-lg text-purple-200 mt-2">Карт: {deckLength}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
