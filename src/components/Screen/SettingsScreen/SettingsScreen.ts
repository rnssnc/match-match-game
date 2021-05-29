import Control from '../../Control/Control';
import Screen from '../Screen';
import Database from '../../Database/Database';
import Headings from '../../Heading/Heading';

type Options = {
  parentNode: HTMLElement;
  className: string;
  database: Database;
};

export default class AboutScreen extends Screen {
  heading: Control;

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      id: 'about-screen',
      className: 'about-screen',
      database: options.database,
    });

    this.heading = new Control({
      parentNode: this.node,
      tagName: 'h2',
      className: Headings.h2,
      content: 'Game settings',
    });
  }
}
