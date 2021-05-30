type CardTheme = {
  name: string;
  jsonPath: string;
};

export const CardsThemes: CardTheme[] = [
  { name: 'animals', jsonPath: '../../public/themes/animals.json' },
  { name: 'test', jsonPath: '' },
  { name: 'test1', jsonPath: '' },
];

type CardPattern = {
  name: string;
  srcPath: string;
};

export const CardsPatterns: CardPattern[] = [
  { name: 'cloud', srcPath: './images/cardFaces/pattern1.svg' },
];

export type TGameSettings = {
  fieldSize: { columns: number; rows: number };
  cardTheme: CardTheme;
  cardPattern: CardPattern;
};

export const DEFAULT_GAME_SETTINGS: TGameSettings = {
  fieldSize: { columns: 4, rows: 3 },
  cardTheme: CardsThemes[0],
  cardPattern: CardsPatterns[0],
};
