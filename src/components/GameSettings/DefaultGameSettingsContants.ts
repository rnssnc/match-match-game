type CardTheme = {
  name: string;
  jsonPath: string;
};

type FieldSize = {
  name: string;
  size: { columns: number; rows: number };
};

export const CARD_THEMES: CardTheme[] = [
  { name: 'animals', jsonPath: '../../public/themes/animals.json' },
  { name: 'cosmetic', jsonPath: '../../public/themes/cosmetic.json' },
  { name: 'nature', jsonPath: '../../public/themes/nature.json' },
  { name: 'origami', jsonPath: '../../public/themes/origami.json' },
];

export const FIELD_SIZES: FieldSize[] = [
  { name: '2x2', size: { columns: 2, rows: 2 } },
  { name: '4x4', size: { columns: 4, rows: 4 } },
  { name: '6x6', size: { columns: 6, rows: 6 } },
  { name: '8x8', size: { columns: 8, rows: 8 } },
];

type CardPattern = {
  name: string;
  srcPath: string;
};

export const CARD_PATTERNS: CardPattern[] = [
  { name: 'cloud', srcPath: './images/cardFaces/pattern1.svg' },
];

export type TGameSettings = {
  fieldSize: FieldSize;
  cardTheme: CardTheme;
  cardPattern: CardPattern;
};

export const DEFAULT_GAME_SETTINGS: TGameSettings = {
  fieldSize: FIELD_SIZES[0],
  cardTheme: CARD_THEMES[0],
  cardPattern: CARD_PATTERNS[0],
};
