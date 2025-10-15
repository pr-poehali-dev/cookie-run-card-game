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
  { id: 1, name: 'GingerBrave', value: 5, emoji: '🍪', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/8fc3c5e5-a674-4a6b-a4f8-251eb841a2b3.jpg' },
  { id: 2, name: 'Strawberry Cookie', value: 3, emoji: '🍓', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/0e1fedb3-8c82-4a62-9e24-0c783a846cfa.jpg' },
  { id: 3, name: 'Wizard Cookie', value: 7, emoji: '🧙', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/41f3c613-9e9d-4192-a80c-8c8662287ae3.jpg' },
  { id: 4, name: 'Dark Choco Cookie', value: 9, emoji: '🍫', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/fd1f33d7-2cc7-4e81-ac83-36f771cf79d9.jpg' },
  { id: 5, name: 'Mint Choco Cookie', value: 6, emoji: '🌿', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 6, name: 'Espresso Cookie', value: 8, emoji: '☕', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 7, name: 'Latte Cookie', value: 4, emoji: '🥛', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 8, name: 'Almond Cookie', value: 10, emoji: '🌰', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 9, name: 'Blackberry Cookie', value: 7, emoji: '🫐', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 10, name: 'Moon Rabbit Cookie', value: 2, emoji: '🐰', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 11, name: 'Pure Vanilla Cookie', value: 10, emoji: '✨', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 12, name: 'Hollyberry Cookie', value: 9, emoji: '🛡️', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 13, name: 'Sea Fairy Cookie', value: 8, emoji: '🧜', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
  { id: 14, name: 'Frost Queen Cookie', value: 10, emoji: '❄️', image: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/cebe6dd9-2381-41b0-a3ad-b947dbe884e1.jpg' },
];

const shadowMilkImages = {
  neutral: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/eba96e9a-0b67-4f27-be99-f1fc18932730.jpg',
  happy: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/48693906-1d43-494b-b32d-65ebea4ab966.jpg',
  sad: 'https://cdn.poehali.dev/projects/c8cdd174-fdfc-4a4d-a675-3cf2fc31d870/files/1cd1973b-7706-48f4-b7c0-f7c266f3234a.jpg'
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
        setStreak(streak + 1);
        if (score + 10 > highScore) {
          setHighScore(score + 10);
        }
      } else {
        setStreak(0);
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
                  <div className="text-center">
                    <p className="text-sm font-heading text-cookie-dark/70">Серия</p>
                    <p className="text-4xl font-heading text-cookie-purple">{streak} 🔥</p>
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

                  <div className="flex justify-center">
                    <img 
                      src={showResult ? (isCorrect ? shadowMilkImages.happy : shadowMilkImages.sad) : shadowMilkImages.neutral}
                      alt="Shadow Milk"
                      className="w-56 h-56 object-contain transition-all duration-500"
                    />
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