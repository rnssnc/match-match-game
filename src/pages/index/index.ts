import '../base/base';
import './index.sass';

import Header from '../../components/Header/Header';

import ScreenRouter from '../../components/ScreenRouter/ScreenRouter';
import AboutScreen from '../../components/Screen/AboutScreen/AboutScreen';
import GameScreen from '../../components/Screen/GameScreen/GameScreen';

interface IMatchMatchGame {
  header: Header;
}

const routes = [
  { Screen: AboutScreen, id: 'about' },
  { Screen: GameScreen, id: 'game' },
];

class Application implements IMatchMatchGame {
  header: Header;

  screenRouter: ScreenRouter;

  constructor() {
    this.header = new Header(document.body);
    this.screenRouter = new ScreenRouter({ parentNode: document.body, routes, startRouteId: 'about' });
  }
}

const app = new Application();
