import Control from '../../Control/Control';
import Screen from '../Screen';
import Headings from '../../Heading/Heading';
import Steps, { Step } from '../../Steps/Steps';

import Board from '../../../assets/images/board.png';
import RegisterForm from '../../../assets/images/register-form.png';

import Database from '../../Database/Database';
import Header from '../../Header/Header';

const STEPS_PROPS: Array<Step> = [
  { content: 'Register new player in game', imagePath: Board },
  { content: 'Configure your game settings', imagePath: RegisterForm },
  {
    content: 'Start you new game! Remember card positions and match it before times up.',
    imagePath: RegisterForm,
  },
];

type Options = {
  parentNode: HTMLElement;
  className: string;
  database: Database;
  header: Header;
};

export default class AboutScreen extends Screen {
  heading: Control;

  steps: Control;

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

    this.heading = new Control({
      parentNode: this.node,
      tagName: 'h2',
      className: Headings.h2,
      content: 'How to play?',
    });

    this.steps = new Steps({
      parentNode: this.node,
      className: 'about-screen__instruction',
      steps: STEPS_PROPS,
    });
  }
}
