import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

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
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'Первая победа', description: 'Угадайте карту правильно', icon: '🎯', unlocked: false },
    { id: '2', title: 'Серия 3', description: 'Угадайте 3 карты подряд', icon: '🔥', unlocked: false },
    { id: '3', title: 'Серия 5', description: 'Угадайте 5 карт подряд', icon: '⚡', unlocked: false },
    { id: '4', title: 'Серия 10', description: 'Угадайте 10 карт подряд', icon: '👑', unlocked: false },
    { id: '5', title: '100 очков', description: 'Наберите 100 очков', icon: '💯', unlocked: false },
    { id: '6', title: 'Встреча с Ванилью', description: 'Вытяните Pure Vanilla', icon: '🌸', unlocked: false },
    { id: '7', title: 'Встреча с Лилией', description: 'Вытяните White Lily', icon: '🌺', unlocked: false },
  ]);

  const { playSound, toggleBackgroundMusic, isMusicPlaying } = useAudio();

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(ach => 
      ach.id === id && !ach.unlocked ? { ...ach, unlocked: true } : ach
    ));
  };

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
        const newScore = score + 10;
        setScore(newScore);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newScore > highScore) {
          setHighScore(newScore);
        }

        unlockAchievement('1');
        if (newStreak === 3) unlockAchievement('2');
        if (newStreak === 5) unlockAchievement('3');
        if (newStreak === 10) unlockAchievement('4');
        if (newScore >= 100) unlockAchievement('5');
        
        if (nextCard.name === 'Pure Vanilla') {
          unlockAchievement('6');
          setShadowDialogue(shadowMilkDialogues.pureVanilla[Math.floor(Math.random() * shadowMilkDialogues.pureVanilla.length)]);
          setShadowMood('excited');
        } else if (nextCard.name === 'White Lily') {
          unlockAchievement('7');
          setShadowDialogue(shadowMilkDialogues.whiteLily[Math.floor(Math.random() * shadowMilkDialogues.whiteLily.length)]);
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

      <div className="relative z-10 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white mb-2 sm:mb-4 drop-shadow-2xl">
            🎭 Shadow Milk 🎴
          </h1>
          <p className="text-sm sm:text-xl text-purple-200">Угадай следующую карту!</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="game">Игра</TabsTrigger>
              <TabsTrigger value="characters">Персонажи</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="space-y-4 sm:space-y-6">
              <ScoreBoard score={score} streak={streak} highScore={highScore} />

              {!gameStarted ? (
                <StartScreen 
                  onStartGame={startGame}
                  onToggleMusic={toggleBackgroundMusic}
                  isMusicPlaying={isMusicPlaying}
                />
              ) : (
                <div className="space-y-4 sm:space-y-8">
                  <ShadowMilkCharacter 
                    mood={shadowMood}
                    dialogue={shadowDialogue}
                    isShuffling={isShuffling}
                    isDealingCard={isDealingCard}
                  />

                  <div className="relative pt-[35vh] sm:pt-48 pb-6 sm:pb-12">
                    <div className="hidden sm:block">
                      <DeckDisplay deckLength={deck.length} isShuffling={isShuffling} />
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-12 border-4 sm:border-8 border-purple-700 shadow-2xl">
                      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-8 items-center">
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
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 sm:border-4 border-gray-900 shadow-xl"
                    >
                      <Icon name="RotateCcw" className="mr-2" size={16} />
                      Новая Игра
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="characters" className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-heading text-white text-center mb-4">Персонажи</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {cookieCharacters.map((char) => (
                  <Card key={char.id} className="p-4 bg-white/90 backdrop-blur-sm border-2 border-purple-500">
                    <div className="text-center">
                      <img 
                        src={char.image} 
                        alt={char.name}
                        className="w-full h-32 object-contain mb-2"
                      />
                      <h3 className="text-sm font-heading text-purple-900 mb-1">{char.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{char.emoji}</span>
                        <span className="text-xl font-heading text-purple-700">{char.value}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-heading text-white text-center mb-4">Достижения</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <Card key={ach.id} className={`p-4 ${
                    ach.unlocked 
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-4 border-yellow-500' 
                      : 'bg-gray-100 border-2 border-gray-400 opacity-60'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{ach.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-heading text-gray-900">{ach.title}</h3>
                        <p className="text-sm text-gray-700">{ach.description}</p>
                      </div>
                      {ach.unlocked && <div className="text-2xl">✅</div>}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
