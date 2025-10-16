import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface CookieCard {
  id: number;
  name: string;
  value: number;
  emoji: string;
  image: string;
}

const cookieCharacters: CookieCard[] = [
  { id: 1, name: 'Pure Vanilla', value: 10, emoji: '🌸', image: 'https://cdn.poehali.dev/files/5c433d73-38b9-4dab-a72b-05d145a2655d.png' },
  { id: 2, name: 'Hollyberry', value: 8, emoji: '❤️', image: 'https://cdn.poehali.dev/files/1f50f05f-9fdf-4b1e-9cbf-a1ec9bd0e801.png' },
  { id: 3, name: 'Dark Cacao', value: 9, emoji: '⚔️', image: 'https://cdn.poehali.dev/files/08c35e14-e27e-4d3c-a8a2-02c1756643e0.png' },
  { id: 4, name: 'Golden Cheese', value: 7, emoji: '✨', image: 'https://cdn.poehali.dev/files/b9ea5964-f908-4b2f-a170-5a1714c727cb.png' },
  { id: 5, name: 'White Lily', value: 6, emoji: '🌺', image: 'https://cdn.poehali.dev/files/4a469a67-81c2-425a-8c6e-f1277af504f7.png' }
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
  pureVanilla: [
    'О, мой милый Силли-Ванилли! Давно не виделись!',
    'Силли-Ванилли! Какая встреча!',
    'Ванилька, Ванилька... Помнишь старые времена?'
  ],
  shuffle: [
    'Давайте перетасуем колоду~',
    'А теперь... магия!',
    'Время для трюка!'
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
  const [shadowMood, setShadowMood] = useState<keyof typeof shadowMilkImages>('neutral');
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDealingCard, setIsDealingCard] = useState(false);

  const playSound = (type: 'flip' | 'correct' | 'wrong' | 'start' | 'shuffle') => {
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
    } else if (type === 'start' || type === 'shuffle') {
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
    const shuffled = [...cookieCharacters, ...cookieCharacters, ...cookieCharacters].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    return shuffled;
  };

  const startGame = () => {
    playSound('start');
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
    }, 1500);
  };

  const makeGuess = (guess: 'higher' | 'lower') => {
    if (!currentCard || !nextCard || showResult) return;

    playSound('flip');
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

          {!gameStarted ? (
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
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl px-12 py-6 rounded-2xl border-4 border-purple-900 shadow-2xl transform hover:scale-105 transition-all"
              >
                <Icon name="Play" className="mr-3" size={32} />
                Начать Игру
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative">
                    <img 
                      src={shadowMilkImages[shadowMood]} 
                      alt="Shadow Milk" 
                      className={`w-64 h-64 object-contain drop-shadow-2xl transition-all duration-500 ${isShuffling ? 'animate-bounce' : ''} ${isDealingCard ? 'animate-pulse' : ''}`}
                    />
                    {shadowDialogue && (
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border-4 border-purple-600 rounded-2xl p-4 max-w-sm shadow-xl animate-bounce-in whitespace-nowrap">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                        <p className="text-lg font-heading text-purple-900 text-center">{shadowDialogue}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative pt-48 pb-12">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className={`absolute -top-2 -left-2 w-80 h-[520px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl transform rotate-2 ${isShuffling ? 'animate-wiggle' : ''}`}></div>
                    <div className={`absolute -top-4 -left-4 w-80 h-[520px] bg-gradient-to-br from-purple-700 to-pink-700 rounded-3xl transform rotate-1 ${isShuffling ? 'animate-wiggle' : ''}`}></div>
                    <div className={`relative w-80 h-[520px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl border-8 border-purple-900 shadow-2xl flex items-center justify-center ${isShuffling ? 'animate-wiggle' : ''}`}>
                      <div className="text-center">
                        <div className="text-9xl mb-4 animate-pulse">🎴</div>
                        <p className="text-2xl font-heading text-white drop-shadow-lg">Колода</p>
                        <p className="text-lg text-purple-200 mt-2">Карт: {deck.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-3xl p-12 border-8 border-purple-700 shadow-2xl">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <Card className={`p-6 bg-white border-8 border-purple-900 shadow-2xl rounded-2xl relative overflow-hidden w-80 h-[480px] flex flex-col mx-auto ${flipped && !showResult ? 'animate-flip' : ''}`}>
                      <div className="absolute top-3 left-3">
                        <div className="text-2xl font-heading text-purple-900 leading-none">{currentCard?.value}</div>
                        <div className="text-3xl">{currentCard?.emoji}</div>
                      </div>
                      <div className="absolute bottom-3 right-3 transform rotate-180">
                        <div className="text-2xl font-heading text-purple-900 leading-none">{currentCard?.value}</div>
                        <div className="text-3xl">{currentCard?.emoji}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <img 
                          src={currentCard?.image} 
                          alt={currentCard?.name}
                          className="w-56 h-56 object-contain mb-3"
                        />
                        <h3 className="text-xl font-heading text-purple-900 uppercase tracking-wide">{currentCard?.name}</h3>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5 pointer-events-none">
                        {currentCard?.emoji}
                      </div>
                    </Card>

                    <div className="flex flex-col items-center gap-6">
                      {!showResult ? (
                        <>
                          <Button
                            onClick={() => makeGuess('higher')}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl px-8 py-6 rounded-xl border-4 border-green-900 shadow-xl transform hover:scale-105 transition-all w-full"
                          >
                            <Icon name="ArrowUp" className="mr-2" size={28} />
                            Выше
                          </Button>
                          <div className="text-4xl">VS</div>
                          <Button
                            onClick={() => makeGuess('lower')}
                            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xl px-8 py-6 rounded-xl border-4 border-red-900 shadow-xl transform hover:scale-105 transition-all w-full"
                          >
                            <Icon name="ArrowDown" className="mr-2" size={28} />
                            Ниже
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={nextRound}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl px-8 py-6 rounded-xl border-4 border-blue-900 shadow-xl transform hover:scale-105 transition-all"
                        >
                          <Icon name="SkipForward" className="mr-2" size={28} />
                          Дальше
                        </Button>
                      )}
                    </div>

                    <Card className={`p-6 border-8 border-purple-900 shadow-2xl rounded-2xl relative overflow-hidden w-80 h-[480px] flex flex-col mx-auto ${flipped ? 'animate-flip-back' : ''} ${isDealingCard ? 'animate-deal-card' : ''} ${
                      !showResult 
                        ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500' 
                        : 'bg-white'
                    }`}>
                      {!showResult ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <p className="text-2xl font-heading mb-6 text-white drop-shadow-lg">Следующая карта</p>
                          <div className="text-9xl mb-6 animate-bounce">❓</div>
                          <h3 className="text-3xl font-heading text-white drop-shadow-lg">Угадай!</h3>
                        </div>
                      ) : (
                        <div className="animate-bounce-in h-full flex flex-col">
                          <div className="absolute top-3 left-3">
                            <div className="text-2xl font-heading text-purple-900 leading-none">{nextCard?.value}</div>
                            <div className="text-3xl">{nextCard?.emoji}</div>
                          </div>
                          <div className="absolute bottom-3 right-3 transform rotate-180">
                            <div className="text-2xl font-heading text-purple-900 leading-none">{nextCard?.value}</div>
                            <div className="text-3xl">{nextCard?.emoji}</div>
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <p className="text-2xl font-heading mb-4 text-purple-900">
                              {isCorrect ? '✅ Правильно!' : '❌ Неверно!'}
                            </p>
                            <img 
                              src={nextCard?.image} 
                              alt={nextCard?.name}
                              className="w-56 h-56 object-contain mb-3"
                            />
                            <h3 className="text-xl font-heading text-purple-900 uppercase tracking-wide">{nextCard?.name}</h3>
                          </div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5 pointer-events-none">
                            {nextCard?.emoji}
                          </div>
                        </div>
                      )}
                    </Card>
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
