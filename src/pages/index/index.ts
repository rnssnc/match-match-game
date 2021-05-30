import '../base/base';
import './index.sass';

import Database from '../../components/Database/Database';

import Header from '../../components/Header/Header';

import ScreenRouter from '../../components/ScreenRouter/ScreenRouter';
import AboutScreen from '../../components/Screen/AboutScreen/AboutScreen';
import GameScreen from '../../components/Screen/GameScreen/GameScreen';
import RecordScreen from '../../components/Screen/RecordsScreen/RecordsScreen';
import SettingsScreen from '../../components/Screen/SettingsScreen/SettingsScreen';
import FinalScorePopup from '../../components/Popup/FinalScorePopup/FinalScorePopup';

interface IApplication {
  rootElement: HTMLElement;
  header: Header;
}

const routes = [
  { Screen: AboutScreen, id: 'about' },
  { Screen: RecordScreen, id: 'records' },
  { Screen: SettingsScreen, id: 'settings' },
  { Screen: GameScreen, id: 'game' },
];

class Application implements IApplication {
  header: Header;

  screenRouter: ScreenRouter;

  database: Database;

  readonly rootElement: HTMLElement;

  finalScorePopup: FinalScorePopup;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;

    this.database = new Database();
    this.database.init('rnssnc', 1);

    this.header = new Header(rootElement, this.database);

    this.finalScorePopup = new FinalScorePopup();

    this.screenRouter = new ScreenRouter({
      parentNode: rootElement,
      routes,
      startRouteId: 'about',
      database: this.database,
      header: this.header,
      finalScorePopup: this.finalScorePopup,
    });
  }
}

const app = new Application(document.body);
