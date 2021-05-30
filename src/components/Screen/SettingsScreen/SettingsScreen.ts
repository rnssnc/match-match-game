import './SetingsScreen.sass';

import Control from '../../Control/Control';
import Screen from '../Screen';
import Database from '../../Database/Database';
import Headings from '../../Heading/Heading';
import SelectInput from '../../SelectInput/SelectInput';
import GameSettings from '../../GameSettings/GameSettings';
import { CARD_THEMES, FIELD_SIZES } from '../../GameSettings/DefaultGameSettingsContants';
import Header from '../../Header/Header';

type Options = {
  parentNode: HTMLElement;
  className: string;
  database: Database;
  header: Header;
};

export default class AboutScreen extends Screen {
  heading: Control;

  gameSetings: GameSettings;

  cardsThemeSelectInput: SelectInput;

  fieldSizeSelectInput: SelectInput;

  cardsThemeSelectCaption: Control;

  cardThemeSelectWrapper: Control;

  fieldSizeSelectWrapper: Control;

  fieldSizeSelectCaption: Control;

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      id: 'about-screen',
      className: 'about-screen',
      database: options.database,
      header: options.header,
    });

    if (this.database.currentUser) this.header.startGameButton.show();
    else this.header.startGameButton.hide();
    this.header.stopGameButton.hide();

    this.gameSetings = new GameSettings();

    this.heading = new Control({
      parentNode: this.node,
      tagName: 'h2',
      className: Headings.h2,
      content: 'Game settings',
    });

    const SELECTED_THEME_NAME = this.gameSetings.getSetting('cardTheme').name;
    let selectedThemeIndex = 0;
    const SELECT_THEME_OPTIONS = CARD_THEMES.map((theme, index) => {
      const { name } = theme;

      if (name === SELECTED_THEME_NAME) selectedThemeIndex = index;
      return { label: name, value: name };
    });

    this.cardThemeSelectWrapper = new Control({
      parentNode: this.node,
      className: '.card-back-select__wrapper',
    });

    this.cardsThemeSelectCaption = new Control({
      parentNode: this.cardThemeSelectWrapper.node,
      tagName: 'h3',
      className: `${Headings.h3} .card-back-select__caption`,
      content: 'Select card theme',
    });

    this.cardsThemeSelectInput = new SelectInput({
      className: 'card-back-select',
      parentNode: this.cardThemeSelectWrapper.node,
      inputOptions: SELECT_THEME_OPTIONS,
      startValue: selectedThemeIndex,
      optionChangeCallback: (newValue) => {
        const NEW_THEME = CARD_THEMES.find((theme) => theme.name === newValue);
        this.gameSetings.setSetting('cardTheme', NEW_THEME);
      },
    });

    const FIELD_SIZE = this.gameSetings.getSetting('fieldSize');

    let selectedFieldSizeIndex = 0;
    const FIELD_SIZE_OPTIONS = FIELD_SIZES.map((fieldSize, index) => {
      if (
        fieldSize.size.columns === FIELD_SIZE.size.columns &&
        fieldSize.size.rows === FIELD_SIZE.size.rows
      ) {
        selectedFieldSizeIndex = index;
      }

      return { label: fieldSize.name, value: fieldSize.name };
    });

    this.fieldSizeSelectWrapper = new Control({
      parentNode: this.node,
      className: '.field-size-select__wrapper',
    });

    this.fieldSizeSelectCaption = new Control({
      parentNode: this.fieldSizeSelectWrapper.node,
      tagName: 'h3',
      className: `${Headings.h3} .field-size-select__caption`,
      content: 'Select field size',
    });

    this.fieldSizeSelectInput = new SelectInput({
      className: 'field-size-select',
      parentNode: this.fieldSizeSelectWrapper.node,
      inputOptions: FIELD_SIZE_OPTIONS,
      startValue: selectedFieldSizeIndex,
      optionChangeCallback: (newValue) => {
        const NEW_FIELD_SIZE = FIELD_SIZES.find((size) => size.name === newValue);
        this.gameSetings.setSetting('fieldSize', NEW_FIELD_SIZE);
      },
    });
  }
}
