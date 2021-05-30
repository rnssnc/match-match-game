import './RecordsScreen.sass';

import Control from '../../Control/Control';
import Headings from '../../Heading/Heading';
import Screen from '../Screen';
import PlayerScore from '../../PlayerScore/PlayerScore';

import Database, { DatabaseRecord } from '../../Database/Database';
import Header from '../../Header/Header';

type Options = {
  parentNode: HTMLElement;
  className: string;
  database: Database;
  header: Header;
};

export default class RecordScreen extends Screen {
  heading: Control;

  recordsWrapper: Control;

  records: Control[];

  constructor(options: Options) {
    super({
      parentNode: options.parentNode,
      id: 'record-screen',
      className: 'record-screen',
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
      content: 'Best players. Top 10 scores',
    });

    this.recordsWrapper = new Control({ parentNode: this.node, className: 'scores-wrapper' });

    this.records = [];

    options.database.readFiltered('email').then((records) => {
      records
        .sort((recordA, recordB) => {
          if (recordA.score >= 0 && recordB.score >= 0) {
            return recordA.score - recordB.score > 0 ? -1 : 1;
          }
          return 0;
        })
        .slice(0, 10)
        .map((record) => this.addRecord(record));
    });
  }

  addRecord(record: DatabaseRecord): void {
    this.records.push(
      new PlayerScore({
        parentNode: this.recordsWrapper.node,
        className: 'score-wrapper',
        email: record.email as string,
        name: record.name,
        score: record.score,
        avatar: record.avatar,
      }),
    );
  }
}
