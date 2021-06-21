import './RecordsScreen.sass';

import Control from '../../Control/Control';
import Headings from '../../Heading/Heading';
import Screen from '../Screen';
import PlayerScore from '../../PlayerScore/PlayerScore';

import Database, { DatabaseRecord } from '../../Database/Database';
import Header from '../../Header/Header';

const RECORDS_TO_SHOW = 10;
const EMPTY_SCORES_MESSAGE = 'Users not found. Please register.';

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

  emptyMessage!: Control;

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

    this.database = options.database;

    this.records = [];

    this.getRecords().then((recordsData) => {
      if (recordsData.length > 0) {
        const sortedRecordsData = RecordScreen.sortRecords(recordsData);

        this.addRecords(sortedRecordsData, RECORDS_TO_SHOW);
      } else {
        this.emptyMessage = new Control({
          parentNode: this.node,
          className: 'empty-scores-message',
          content: EMPTY_SCORES_MESSAGE,
        });
      }
    });
  }

  private static sortRecords(records: DatabaseRecord[]): DatabaseRecord[] {
    return records.sort((recordA, recordB) => {
      if (recordA.score >= 0 && recordB.score >= 0) {
        return recordA.score - recordB.score > 0 ? -1 : 1;
      }
      return 0;
    });
  }

  getRecords(): Promise<DatabaseRecord[]> {
    return new Promise((resolve) => {
      this.database.readFiltered('email').then((records) => {
        resolve(records);
      });
    });
  }

  addRecords(records: DatabaseRecord[], count: number): void {
    records.forEach((record, index) => {
      if (index < count) this.addRecord(record);
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
