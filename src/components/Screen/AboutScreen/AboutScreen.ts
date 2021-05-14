import Control from '../../Control/Control';
import Screen from '../Screen';
import Headings from '../../Heading/Heading';
import Steps, { Step } from '../../Steps/Steps';

const STEPS_PROPS: Array<Step> = [
  { content: 'test', imagePath: '../../assets/images/board.png' },
  { content: 'test2', imagePath: '../../assets/images/register-form.png' },
];

export default class AboutScreen extends Screen {
  heading: Control;

  // steps: Step;

  constructor(parentNode: HTMLElement, className: string) {
    super(parentNode, 'about-screen', className);

    this.heading = new Control({
      parentNode: this.node,
      tagName: 'h2',
      className: Headings.h2,
      content: 'How to play?',
    });

    // this.steps = new Steps({ parentNode: this.node, className:
    // 'about-screen__steps-wrapper', steps });

    // this.step1.stepDescription = new Control({
    //   parentNode: this.node,
    //   className: 'about-screen__step-description',
    // });

    // this.step2 = new Control({ parentNode: this.node, className: 'about-screen__step-wrapper' });

    // this.step3 = new Control({ parentNode: this.node, className: 'about-screen__step-wrapper' });
  }
}
