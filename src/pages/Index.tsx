import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CookieCard {
  id: number;
  name: string;
  value: number;
  emoji: string;
  image: string;
}

const cookieCharacters: CookieCard[] = [
  { id: 1, name: 'GingerBrave Cookie', value: 5, emoji: '🍪', image: 'https://cdn.poehali.dev/files/a0d5b1e6-c725-40d2-bb21-0425549a98fc.png' },
  { id: 2, name: 'Strawberry Cookie', value: 3, emoji: '🍓', image: 'https://cdn.poehali.dev/files/74c21ac4-7f6d-47b2-9438-3b9407ea7694.png' },
  { id: 3, name: 'Ninja Cookie', value: 7, emoji: '🥷', image: 'https://cdn.poehali.dev/files/8a06d6df-f6ae-4202-a26f-4ae17869d4bd.png' },
  { id: 4, name: 'Wizard Cookie', value: 9, emoji: '🧙', image: 'https://cdn.poehali.dev/files/0596d764-5739-46ce-aba2-876fc07f8261.png' },
  { id: 5, name: 'Angel Cookie', value: 6, emoji: '👼', image: 'https://cdn.poehali.dev/files/27246455-da33-4436-901b-d02d369ed0ab.png' },
];

const shadowMilkImages = {
  neutral: 'https://cdn.poehali.dev/files/8ef4d7f8-aa72-4ca9-951f-b962175269d4.png',
  happy: 'https://cdn.poehali.dev/files/7b0428c9-2323-4a13-b18f-8327e43edc44.png',
  sad: 'https://cdn.poehali.dev/files/681e5ed6-60e2-4106-a85a-1dee91ce4e09.png',
  excited: 'https://cdn.poehali.dev/files/d955fe8a-fb09-4d3c-ac38-690ae03bf0c5.png',
  laughing: 'https://cdn.poehali.dev/files/aa031388-2674-430c-9dfb-8329d9bef8e3.png',
  crying: 'https://cdn.poehali.dev/files/05ac9a59-1ec7-4343-a7e7-b028de9d504a.png',
  evil: 'https://cdn.poehali.dev/files/28ed6cdf-d438-4f10-966e-b24ba765a8d1.png',
  smug: 'https://cdn.poehali.dev/files/887206e3-e955-4a4d-81f4-cd2336377b93.png',
  worried: 'https://cdn.poehali.dev/files/12988d79-82c4-40b7-ae21-8f269a1bc9a9.png',
  angry: 'https://cdn.poehali.dev/files/092068e9-194e-467b-a42c-6f936f45dc15.png'
};

const shadowMilkDialogues = {
  playerWins: [
    'Что?! Нет-нет-нет! Это нечестно!',
    'Ты просто повезло! Следующий раз ты не угадаешь!',
    'Гррр! Как ты посмел!',
    'Нет! Моя игра, мои правила!',
    'Хватит угадывать! Это же скучно!'
  ],
  playerLoses: [
    'Ха-ха-ха! Я же говорил!',
    'Ох как весело! Ты проиграл!',
    'Великолепно! Поражение - лучшее зрелище!',
    'Ты такой предсказуемый! Ха-ха!',
    'Ох, какой сладкий провал!'
  ],
  neutral: [
    'Ну же, давай, угадывай!',
    'Это будет интересно...',
    'Посмотрим, что ты выберешь!'
  ],
  streak3: [
    'Что?! Три подряд? Это случайность!',
    'Гррр! Ты начинаешь меня раздражать!',
    'Нет-нет-нет! Не может быть!'
  ],
  streak5: [
    'ХватиТ! ПЯТЬ ПОДРЯД?! ТЫ ЖУЛЬНИЧАЕШЬ!',
    'Я В ЯРОСТИ!!! КАК ТЫ ПОСМЕЛ?!',
    'НЕВОЗМОЖНО! Я НЕ ПОЗВОЛЮ ЭТОМУ ПРОДОЛЖАТЬСЯ!'
  ],
  streak10: [
    'ТЫ... ТЫ ПОБЕДИЛ МЕНЯ?! НЕТ! ЭТОГО НЕ МОЖЕТ БЫТЬ!!!',
    'ДЕСЯТЬ?! Я... я проиграл... ЭТО НЕВОЗМОЖНО!',
    'Ты... ты настоящий мастер... НО Я ВЕРНУСЬ!'
  ]
};

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

  const playSound = (type: 'flip' | 'correct' | 'wrong' | 'start') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'flip') {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'wrong') {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'start') {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const shuffleDeck = () => {
    const shuffled = [...cookieCharacters].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    return shuffled;
  };

  const startGame = () => {
    playSound('start');
    const newDeck = shuffleDeck();
    setCurrentCard(newDeck[0]);
    setNextCard(newDeck[1]);
    setScore(0);
    setStreak(0);
    setGameStarted(true);
    setShowResult(false);
    setFlipped(false);
    setShadowDialogue(shadowMilkDialogues.neutral[Math.floor(Math.random() * shadowMilkDialogues.neutral.length)]);
  };

  const makeGuess = (guess: 'higher' | 'lower') => {
    if (!currentCard || !nextCard || showResult) return;

    playSound('flip');
    setFlipped(true);
    
    setTimeout(() => {
      const correct = 
        (guess === 'higher' && nextCard.value >= currentCard.value) ||
        (guess === 'lower' && nextCard.value <= currentCard.value);

      setIsCorrect(correct);
      setShowResult(true);
      playSound(correct ? 'correct' : 'wrong');

      if (correct) {
        setScore(score + 10);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (score + 10 > highScore) {
          setHighScore(score + 10);
        }
        
        if (newStreak >= 10) {
          setShadowDialogue(shadowMilkDialogues.streak10[Math.floor(Math.random() * shadowMilkDialogues.streak10.length)]);
        } else if (newStreak >= 5) {
          setShadowDialogue(shadowMilkDialogues.streak5[Math.floor(Math.random() * shadowMilkDialogues.streak5.length)]);
        } else if (newStreak >= 3) {
          setShadowDialogue(shadowMilkDialogues.streak3[Math.floor(Math.random() * shadowMilkDialogues.streak3.length)]);
        } else {
          setShadowDialogue(shadowMilkDialogues.playerWins[Math.floor(Math.random() * shadowMilkDialogues.playerWins.length)]);
        }
      } else {
        setStreak(0);
        setShadowDialogue(shadowMilkDialogues.playerLoses[Math.floor(Math.random() * shadowMilkDialogues.playerLoses.length)]);
      }

      setTimeout(() => {
        const currentIndex = deck.findIndex(card => card.id === nextCard.id);
        if (currentIndex < deck.length - 1) {
          setCurrentCard(nextCard);
          setNextCard(deck[currentIndex + 1]);
        } else {
          const newDeck = shuffleDeck();
          setCurrentCard(newDeck[0]);
          setNextCard(newDeck[1]);
        }
        setShowResult(false);
        setFlipped(false);
      }, 2000);
    }, 600);
  };

  useEffect(() => {
    shuffleDeck();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cookie-purple via-cookie-pink to-cookie-gold p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8 animate-bounce-in">
          <h1 className="text-6xl md:text-8xl text-white font-heading drop-shadow-lg mb-2" style={{
            textShadow: '4px 4px 0px #1A1A2E, -2px -2px 0px rgba(255,255,255,0.5)',
            WebkitTextStroke: '3px #1A1A2E'
          }}>
            COOKIE RUN
          </h1>
          <p className="text-2xl md:text-3xl text-white font-heading drop-shadow-md" style={{
            textShadow: '2px 2px 0px #1A1A2E',
            WebkitTextStroke: '1px #1A1A2E'
          }}>
            CARD GAME
          </p>
        </header>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/90 backdrop-blur-sm p-2 rounded-2xl border-4 border-cookie-dark shadow-xl">
            <TabsTrigger value="game" className="rounded-xl font-heading text-lg data-[state=active]:bg-cookie-pink data-[state=active]:text-white">
              Игра
            </TabsTrigger>
            <TabsTrigger value="characters" className="rounded-xl font-heading text-lg data-[state=active]:bg-cookie-purple data-[state=active]:text-white">
              Персонажи
            </TabsTrigger>
            <TabsTrigger value="rules" className="rounded-xl font-heading text-lg data-[state=active]:bg-cookie-gold data-[state=active]:text-white">
              Правила
            </TabsTrigger>
            <TabsTrigger value="rating" className="rounded-xl font-heading text-lg data-[state=active]:bg-cookie-orange data-[state=active]:text-white">
              Рейтинг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="animate-slide-up">
            {!gameStarted ? (
              <Card className="p-12 text-center bg-white/95 backdrop-blur-sm border-4 border-cookie-dark shadow-2xl rounded-3xl animate-bounce-in">
                <img 
                  src={shadowMilkImages.neutral} 
                  alt="Shadow Milk Cookie" 
                  className="w-64 h-64 mx-auto mb-6 object-contain animate-wiggle"
                />
                <h2 className="text-4xl font-heading mb-4 text-cookie-dark">Добро пожаловать!</h2>
                <p className="text-xl mb-8 text-cookie-dark/80 font-semibold">Шедоу Милк приглашает тебя сыграть в "Больше-Меньше"</p>
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="text-2xl px-12 py-8 rounded-2xl font-heading bg-cookie-pink hover:bg-cookie-pink/90 text-white border-4 border-cookie-dark shadow-lg hover:scale-105 transition-transform"
                >
                  Начать игру! 🎮
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/95 backdrop-blur-sm p-6 rounded-2xl border-4 border-cookie-dark shadow-xl">
                  <div className="text-center">
                    <p className="text-sm font-heading text-cookie-dark/70">Очки</p>
                    <p className="text-4xl font-heading text-cookie-pink">{score}</p>
                  </div>
                  <div className="text-center relative">
                    <p className="text-sm font-heading text-cookie-dark/70">Серия</p>
                    <p className={`text-4xl font-heading ${streak >= 5 ? 'text-cookie-gold animate-bounce-in' : 'text-cookie-purple'}`}>
                      {streak} {streak >= 10 ? '🏆' : streak >= 5 ? '⚡' : streak >= 3 ? '🔥' : ''}
                    </p>
                    {streak >= 5 && (
                      <div className="absolute -top-2 -right-2 bg-cookie-gold text-white px-2 py-1 rounded-full text-xs font-heading animate-bounce-in">
                        {streak >= 10 ? 'МАСТЕР!' : 'ОГОНЬ!'}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-heading text-cookie-dark/70">Рекорд</p>
                    <p className="text-4xl font-heading text-cookie-gold">{highScore}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <Card className={`p-8 bg-white border-4 border-cookie-dark shadow-2xl rounded-3xl ${flipped && !showResult ? 'animate-flip' : ''}`}>
                    <div className="text-center">
                      <p className="text-xl font-heading mb-4 text-cookie-dark/70">Текущая карта</p>
                      <img 
                        src={currentCard?.image} 
                        alt={currentCard?.name}
                        className="w-48 h-48 mx-auto mb-4 object-contain"
                      />
                      <h3 className="text-2xl font-heading text-cookie-dark mb-2">{currentCard?.name}</h3>
                      <div className="inline-block bg-cookie-purple text-white px-6 py-3 rounded-xl text-3xl font-heading border-4 border-cookie-dark">
                        {currentCard?.value}
                      </div>
                    </div>
                  </Card>

                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img 
                        src={
                          showResult 
                            ? (isCorrect 
                                ? (streak >= 10 ? shadowMilkImages.crying : streak >= 5 ? shadowMilkImages.angry : streak >= 3 ? shadowMilkImages.worried : shadowMilkImages.sad)
                                : shadowMilkImages.laughing
                              )
                            : shadowMilkImages.neutral
                        }
                        alt="Shadow Milk"
                        className={`w-64 h-64 object-contain transition-all duration-500 ${
                          showResult 
                            ? isCorrect 
                              ? (streak >= 5 ? 'animate-shake scale-90' : 'animate-shake')
                              : 'animate-jump scale-110' 
                            : 'hover:scale-105'
                        }`}
                      />
                      {showResult && !isCorrect && (
                        <div className="absolute -top-4 -right-4">
                          <span className="text-5xl animate-bounce-in">😈</span>
                        </div>
                      )}
                      {showResult && isCorrect && streak >= 10 && (
                        <div className="absolute -top-4 -right-4">
                          <span className="text-5xl animate-bounce-in">💀</span>
                        </div>
                      )}
                      {showResult && isCorrect && streak >= 5 && streak < 10 && (
                        <div className="absolute -top-4 -right-4">
                          <span className="text-5xl animate-bounce-in">😱</span>
                        </div>
                      )}
                      {showResult && isCorrect && streak >= 3 && streak < 5 && (
                        <div className="absolute -top-4 -right-4">
                          <span className="text-5xl animate-bounce-in">😤</span>
                        </div>
                      )}
                      {showResult && isCorrect && streak < 3 && (
                        <div className="absolute -top-4 -right-4">
                          <span className="text-5xl animate-bounce-in">😠</span>
                        </div>
                      )}
                    </div>
                    {shadowDialogue && (
                      <div className="bg-white/95 backdrop-blur-sm border-4 border-cookie-dark rounded-2xl p-4 max-w-xs shadow-xl relative animate-bounce-in">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                        <p className="text-lg font-heading text-cookie-dark text-center">{shadowDialogue}</p>
                      </div>
                    )}
                  </div>

                  <Card className={`p-8 bg-gradient-to-br from-cookie-purple to-cookie-pink border-4 border-cookie-dark shadow-2xl rounded-3xl relative overflow-hidden ${flipped ? 'animate-flip-back' : ''}`}>
                    {!showResult ? (
                      <div className="text-center h-full flex flex-col justify-center">
                        <p className="text-xl font-heading mb-4 text-white drop-shadow-md">Следующая карта</p>
                        <div className="text-9xl mb-4">❓</div>
                        <h3 className="text-2xl font-heading text-white drop-shadow-md">Угадай!</h3>
                      </div>
                    ) : (
                      <div className="text-center animate-bounce-in">
                        <p className="text-xl font-heading mb-4 text-white drop-shadow-md">
                          {isCorrect ? '✅ Правильно!' : '❌ Неверно!'}
                        </p>
                        <img 
                          src={nextCard?.image} 
                          alt={nextCard?.name}
                          className="w-48 h-48 mx-auto mb-4 object-contain"
                        />
                        <h3 className="text-2xl font-heading text-white drop-shadow-md mb-2">{nextCard?.name}</h3>
                        <div className="inline-block bg-white text-cookie-dark px-6 py-3 rounded-xl text-3xl font-heading border-4 border-cookie-dark">
                          {nextCard?.value}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {!showResult && (
                  <div className="flex gap-4 justify-center animate-slide-up">
                    <Button
                      onClick={() => makeGuess('higher')}
                      size="lg"
                      className="text-2xl px-12 py-8 rounded-2xl font-heading bg-cookie-gold hover:bg-cookie-gold/90 text-cookie-dark border-4 border-cookie-dark shadow-lg hover:scale-105 transition-transform"
                    >
                      <Icon name="TrendingUp" className="mr-2" size={32} />
                      Больше
                    </Button>
                    <Button
                      onClick={() => makeGuess('lower')}
                      size="lg"
                      className="text-2xl px-12 py-8 rounded-2xl font-heading bg-cookie-orange hover:bg-cookie-orange/90 text-white border-4 border-cookie-dark shadow-lg hover:scale-105 transition-transform"
                    >
                      <Icon name="TrendingDown" className="mr-2" size={32} />
                      Меньше
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="animate-slide-up">
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-4 border-cookie-dark shadow-2xl rounded-3xl">
              <h2 className="text-4xl font-heading mb-6 text-cookie-dark text-center">Персонажи Cookie Run</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {cookieCharacters.map((char) => (
                  <Card key={char.id} className="p-4 text-center hover:scale-110 transition-transform border-2 border-cookie-purple bg-gradient-to-br from-white to-cookie-purple/10">
                    <img 
                      src={char.image} 
                      alt={char.name}
                      className="w-20 h-20 mx-auto mb-2 object-contain"
                    />
                    <p className="text-sm font-heading text-cookie-dark mb-1">{char.name}</p>
                    <div className="inline-block bg-cookie-pink text-white px-3 py-1 rounded-lg text-lg font-heading">
                      {char.value}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="animate-slide-up">
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-4 border-cookie-dark shadow-2xl rounded-3xl">
              <h2 className="text-4xl font-heading mb-6 text-cookie-dark text-center">Правила игры</h2>
              <div className="space-y-4 text-lg">
                <div className="flex gap-4 items-start bg-cookie-purple/10 p-4 rounded-xl border-2 border-cookie-purple">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h3 className="font-heading text-xl text-cookie-dark mb-2">Цель игры</h3>
                    <p className="text-cookie-dark/80">Угадай, будет ли следующая карта больше или меньше текущей по значению</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-cookie-gold/10 p-4 rounded-xl border-2 border-cookie-gold">
                  <div className="text-3xl">🎮</div>
                  <div>
                    <h3 className="font-heading text-xl text-cookie-dark mb-2">Как играть</h3>
                    <p className="text-cookie-dark/80">Шедоу Милк показывает карту персонажа. Выбери "Больше" или "Меньше" для следующей карты</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-cookie-pink/10 p-4 rounded-xl border-2 border-cookie-pink">
                  <div className="text-3xl">⭐</div>
                  <div>
                    <h3 className="font-heading text-xl text-cookie-dark mb-2">Очки</h3>
                    <p className="text-cookie-dark/80">За каждый правильный ответ получаешь 10 очков. Набирай серии правильных ответов!</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-cookie-orange/10 p-4 rounded-xl border-2 border-cookie-orange">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <h3 className="font-heading text-xl text-cookie-dark mb-2">Серия побед</h3>
                    <p className="text-cookie-dark/80">Непрерывная серия правильных ответов. При ошибке серия сбрасывается!</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rating" className="animate-slide-up">
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-4 border-cookie-dark shadow-2xl rounded-3xl">
              <h2 className="text-4xl font-heading mb-6 text-cookie-dark text-center">Твой рекорд</h2>
              <div className="text-center">
                <div className="text-8xl mb-4">🏆</div>
                <p className="text-6xl font-heading text-cookie-gold mb-4">{highScore}</p>
                <p className="text-xl text-cookie-dark/70">Лучший результат</p>
                <Progress value={(highScore / 200) * 100} className="mt-6 h-4" />
                <p className="text-sm text-cookie-dark/70 mt-2">До мастера: {Math.max(0, 200 - highScore)} очков</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;