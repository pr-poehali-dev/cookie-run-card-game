import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { 
  CookieCard, 
  cookieCharacters, 
  shadowMilkImages, 
  shadowMilkDialogues 
} from '@/components/game/GameData';
import { useAudio } from '@/components/game/useAudio';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { StartScreen } from '@/components/game/StartScreen';
import { ShadowMilkCharacter } from '@/components/game/ShadowMilkCharacter';
import { DeckDisplay } from '@/components/game/DeckDisplay';
import { GameCard } from '@/components/game/GameCard';
import { GameControls } from '@/components/game/GameControls';

const Index = () => {
  const [deck, setDeck] = useState<CookieCard[]>([]);
  const [currentCard, setCurrentCard] = useState<CookieCard | null>(null);
  const [nextCard, setNextCard] = useState<CookieCard | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shadowDialogue, setShadowDialogue] = useState('');
  const [shadowMood, setShadowMood] = useState<keyof typeof shadowMilkImages>('neutral');
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDealingCard, setIsDealingCard] = useState(false);

  const { playSound, toggleBackgroundMusic, isMusicPlaying } = useAudio();

  const shuffleDeck = () => {
    const shuffled = [...cookieCharacters, ...cookieCharacters, ...cookieCharacters].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    return shuffled;
  };

  const startGame = () => {
    playSound('start');
    playSound('shuffle');
    setIsShuffling(true);
    setShadowMood('excited');
    setShadowDialogue(shadowMilkDialogues.shuffle[Math.floor(Math.random() * shadowMilkDialogues.shuffle.length)]);
    
    setTimeout(() => {
      const newDeck = shuffleDeck();
      setCurrentCard(newDeck[0]);
      setNextCard(newDeck[1]);
      setScore(0);
      setStreak(0);
      setGameStarted(true);
      setShowResult(false);
      setFlipped(false);
      setIsShuffling(false);
      setShadowMood('neutral');
      setShadowDialogue(shadowMilkDialogues.neutral[Math.floor(Math.random() * shadowMilkDialogues.neutral.length)]);
      playSound('deal');
    }, 1500);
  };

  const makeGuess = (guess: 'higher' | 'lower') => {
    if (!currentCard || !nextCard || showResult) return;

    playSound('flip');
    playSound('deal');
    setFlipped(true);
    setIsDealingCard(true);
    
    setTimeout(() => {
      const correct = 
        (guess === 'higher' && nextCard.value >= currentCard.value) ||
        (guess === 'lower' && nextCard.value <= currentCard.value);

      setIsCorrect(correct);
      setShowResult(true);
      setIsDealingCard(false);
      playSound(correct ? 'correct' : 'wrong');

      if (correct) {
        setScore(score + 10);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (score + 10 > highScore) {
          setHighScore(score + 10);
        }
        
        if (nextCard.name === 'Pure Vanilla') {
          setShadowDialogue(shadowMilkDialogues.pureVanilla[Math.floor(Math.random() * shadowMilkDialogues.pureVanilla.length)]);
          setShadowMood('excited');
        } else if (newStreak >= 10) {
          setShadowDialogue('ТЫ... ТЫ ПОБЕДИЛ МЕНЯ?! НЕТ! ЭТОГО НЕ МОЖЕТ БЫТЬ!!!');
          setShadowMood('angry');
        } else if (newStreak >= 5) {
          setShadowDialogue('ХватиТ! ПЯТЬ ПОДРЯД?! ТЫ ЖУЛЬНИЧАЕШЬ!');
          setShadowMood('worried');
        } else if (newStreak >= 3) {
          setShadowDialogue(shadowMilkDialogues.playerWins[Math.floor(Math.random() * shadowMilkDialogues.playerWins.length)]);
          setShadowMood('sad');
        } else {
          setShadowDialogue(shadowMilkDialogues.playerWins[Math.floor(Math.random() * shadowMilkDialogues.playerWins.length)]);
          setShadowMood('worried');
        }
      } else {
        setStreak(0);
        setShadowDialogue(shadowMilkDialogues.playerLoses[Math.floor(Math.random() * shadowMilkDialogues.playerLoses.length)]);
        setShadowMood('laughing');
      }
    }, 600);
  };

  const nextRound = () => {
    if (deck.length < 3) {
      const newDeck = shuffleDeck();
      setCurrentCard(newDeck[0]);
      setNextCard(newDeck[1]);
      setDeck(newDeck.slice(2));
    } else {
      setCurrentCard(nextCard);
      setNextCard(deck[0]);
      setDeck(deck.slice(1));
    }
    setShowResult(false);
    setFlipped(false);
    setShadowMood('neutral');
    setShadowDialogue(shadowMilkDialogues.neutral[Math.floor(Math.random() * shadowMilkDialogues.neutral.length)]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900"></div>
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-heading text-white mb-4 drop-shadow-2xl">
            🎭 Карточная Игра Shadow Milk 🎴
          </h1>
          <p className="text-xl text-purple-200">Угадай следующую карту!</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <ScoreBoard score={score} streak={streak} highScore={highScore} />

          {!gameStarted ? (
            <StartScreen 
              onStartGame={startGame}
              onToggleMusic={toggleBackgroundMusic}
              isMusicPlaying={isMusicPlaying}
            />
          ) : (
            <div className="space-y-8">
              <div className="relative">
                <ShadowMilkCharacter 
                  mood={shadowMood}
                  dialogue={shadowDialogue}
                  isShuffling={isShuffling}
                  isDealingCard={isDealingCard}
                />
              </div>

              <div className="relative pt-48 pb-12">
                <DeckDisplay deckLength={deck.length} isShuffling={isShuffling} />

                <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-3xl p-12 border-8 border-purple-700 shadow-2xl">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <GameCard 
                      card={currentCard}
                      flipped={flipped && !showResult}
                    />

                    <GameControls 
                      showResult={showResult}
                      onGuessHigher={() => makeGuess('higher')}
                      onGuessLower={() => makeGuess('lower')}
                      onNextRound={nextRound}
                    />

                    <GameCard 
                      card={nextCard}
                      flipped={flipped}
                      isDealing={isDealingCard}
                      isHidden={true}
                      showResult={showResult}
                      isCorrect={isCorrect}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-xl border-4 border-gray-900 shadow-xl"
                >
                  <Icon name="RotateCcw" className="mr-2" size={20} />
                  Новая Игра
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
