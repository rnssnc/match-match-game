import Control from '../../Control/Control';
import Screen from '../Screen';
import Headings from '../../Heading/Heading';

export default class GameScreen extends Screen {
  heading: Control;

  constructor(parentNode: HTMLElement, className: string) {
    super(parentNode, 'game-screen', className);

    this.heading = new Control({ parentNode: this.node, className: Headings.h2, content: 'Game' });
  }
}
