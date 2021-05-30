import './FinalScorePopup.sass';

import Control from '../../Control/Control';
import Popup from '../Popup';
import { GameStats } from '../../Game/Game';
import Anchor from '../../Button/Anchor';
import { ButtonTypes } from '../../Button/AnchorButton';

const MESSAGE = 'Congratulations! You successfully found all matches in 14 seconds.';

export default class FinalScorePopup extends Popup {
  message: Control;

  scoreButton: Anchor;

  constructor() {
    super('finalScore');

    this.message = new Control({ parentNode: this.popup.node, className: 'final-score__message' });

    this.scoreButton = new Anchor(
      this.popup.node,
      'final-score-popup__score-button',
      {
        value: 'Ok',
        href: '#records',
      },
      { type: ButtonTypes.filled },
      () => {
        this.hidePopup();
      },
    );
  }

  display = (score: GameStats): void => {
    const hours = Math.floor(score.seconds / 3600);
    const minutes = Math.floor((score.seconds % 3600) / 60);
    const seconds = score.seconds % 60;

    console.log(minutes);
    this.message.node.innerHTML = `Congratulations! You successfully found all matches in ${
      hours > 0 ? `${hours} h, ` : ''
    } ${minutes > 0 ? `${minutes} min, and ` : ''}  ${seconds} sec. You made a ${
      score.comparisons
    } comparisons and your final score is ${score.score}`;

    this.showPopup();
  };
}
