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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://cdn.poehali.dev/files/b5531064-c1e2-47ac-a400-d4afa81fcc16.jpg"
          alt="background"
          className="w-full h-full object-cover blur-md"
        />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-sm border-b-2 border-purple-500/30">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 bg-purple-900/60 rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-purple-400/30">
              <Icon name="Target" className="text-purple-300" size={16} />
              <span className="text-white font-bold text-xs sm:text-sm">{score}</span>
            </div>
            
            <div className="flex-1 max-w-md bg-white/90 rounded-full px-3 sm:px-6 py-1 sm:py-2 border-2 border-purple-300">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <Icon name="Coins" className="text-yellow-600" size={18} />
                <span className="text-purple-900 font-bold text-sm sm:text-xl">{score * 100}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 bg-indigo-900/60 rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-indigo-400/30">
              <Icon name="Zap" className="text-indigo-300" size={16} />
              <span className="text-white font-bold text-xs sm:text-sm">{streak}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-16 sm:pt-20">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-900/80 border border-purple-500/30">
              <TabsTrigger value="game" className="data-[state=active]:bg-purple-600">Игра</TabsTrigger>
              <TabsTrigger value="characters" className="data-[state=active]:bg-purple-600">Персонажи</TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">Достижения</TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="space-y-4 sm:space-y-6">

              {!gameStarted ? (
                <div className="min-h-[80vh] flex items-center justify-center">
                  <StartScreen 
                    onStartGame={startGame}
                    onToggleMusic={toggleBackgroundMusic}
                    isMusicPlaying={isMusicPlaying}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
                    <div className="relative">
                      <img 
                        src={shadowMilkImages[shadowMood]} 
                        alt="Shadow Milk" 
                        className={`w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl transition-all duration-500 ${
                          isShuffling ? 'animate-bounce' : ''
                        } ${
                          isDealingCard ? 'animate-pulse' : ''
                        }`}
                      />
                      {shadowDialogue && (
                        <div className="absolute -bottom-8 sm:-bottom-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-2 border-purple-500 rounded-2xl px-4 py-2 max-w-[250px] sm:max-w-sm shadow-xl pointer-events-auto">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
                          <p className="text-xs sm:text-sm font-heading text-purple-900 text-center leading-tight">{shadowDialogue}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-72 sm:pt-80 pb-6">
                    <div className="bg-gradient-to-b from-blue-900/40 to-blue-950/60 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border-2 border-blue-400/30 shadow-2xl">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center">
                        <div className="flex-shrink-0">
                          <GameCard 
                            card={currentCard}
                            flipped={flipped && !showResult}
                          />
                          <div className="text-center mt-2 text-white text-xs sm:text-sm font-bold">ROUND {Math.floor(score / 10) + 1}</div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => makeGuess('higher')}
                            disabled={showResult}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg sm:text-2xl px-8 sm:px-16 py-6 sm:py-8 rounded-2xl border-4 border-pink-300 shadow-2xl font-bold disabled:opacity-50 transform hover:scale-105 transition-all"
                          >
                            HIGH
                          </Button>
                          <Button
                            onClick={() => makeGuess('lower')}
                            disabled={showResult}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg sm:text-2xl px-8 sm:px-16 py-6 sm:py-8 rounded-2xl border-4 border-cyan-300 shadow-2xl font-bold disabled:opacity-50 transform hover:scale-105 transition-all"
                          >
                            LOW
                          </Button>
                          {showResult && (
                            <Button
                              onClick={nextRound}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base sm:text-xl px-6 sm:px-12 py-4 sm:py-6 rounded-2xl border-4 border-green-300 shadow-2xl font-bold transform hover:scale-105 transition-all"
                            >
                              <Icon name="ArrowRight" className="mr-2" size={20} />
                              Далее
                            </Button>
                          )}
                        </div>

                        <div className="flex-shrink-0 relative">
                          <GameCard 
                            card={nextCard}
                            flipped={flipped}
                            isDealing={isDealingCard}
                            isHidden={true}
                            showResult={showResult}
                            isCorrect={isCorrect}
                          />
                          <div className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-purple-300">
                            {deck.length}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <Button
                        onClick={startGame}
                        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-sm px-6 py-3 rounded-xl border-2 border-gray-600 shadow-xl"
                      >
                        <Icon name="RotateCcw" className="mr-2" size={16} />
                        Новая Игра
                      </Button>
                    </div>
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