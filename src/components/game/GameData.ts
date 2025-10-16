export interface CookieCard {
  id: number;
  name: string;
  value: number;
  emoji: string;
  image: string;
}

export const cookieCharacters: CookieCard[] = [
  { id: 1, name: 'White Lily', value: 10, emoji: '🌺', image: 'https://cdn.poehali.dev/files/5c433d73-38b9-4dab-a72b-05d145a2655d.png' },
  { id: 2, name: 'Hollyberry', value: 8, emoji: '❤️', image: 'https://cdn.poehali.dev/files/1f50f05f-9fdf-4b1e-9cbf-a1ec9bd0e801.png' },
  { id: 3, name: 'Dark Cacao', value: 9, emoji: '⚔️', image: 'https://cdn.poehali.dev/files/08c35e14-e27e-4d3c-a8a2-02c1756643e0.png' },
  { id: 4, name: 'Golden Cheese', value: 7, emoji: '✨', image: 'https://cdn.poehali.dev/files/b9ea5964-f908-4b2f-a170-5a1714c727cb.png' },
  { id: 5, name: 'Pure Vanilla', value: 6, emoji: '🌸', image: 'https://cdn.poehali.dev/files/4a469a67-81c2-425a-8c6e-f1277af504f7.png' }
];

export const shadowMilkImages = {
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

export const shadowMilkDialogues = {
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
  whiteLily: [
    'О, Белая Лилия... Какая неожиданность!',
    'Лилия... Мы снова встретились.',
    'Белая Лилия! Какая редкая гостья!'
  ],
  shuffle: [
    'Давайте перетасуем колоду~',
    'А теперь... магия!',
    'Время для трюка!'
  ]
};