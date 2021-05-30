import Control from '../Control/Control';
import Database from '../Database/Database';
import Screen from '../Screen/Screen';
import FinalScorePopup from '../Popup/FinalScorePopup/FinalScorePopup';
import Header from '../Header/Header';

type Options = {
  parentNode: HTMLElement;
  routes: Array<{ Screen: typeof Screen; id: string }>;
  startRouteId: string;
  database: Database;
  header?: Header;
  finalScorePopup: FinalScorePopup;
};

export default class Router extends Control {
  currentRoute!: Screen;

  routes: Array<{ Screen: typeof Screen; id: string }>;

  loadedRoutes: Screen[];

  database: Database;

  header!: Header;

  finalScorePopup: FinalScorePopup;

  constructor(options: Options) {
    super({ parentNode: options.parentNode, tagName: 'main', className: 'router-root' });

    this.loadedRoutes = [];

    this.routes = options.routes;

    if (!window.location.hash || window.location.hash === '#') {
      options.routes.forEach((Route) => {
        if (options.startRouteId && options.startRouteId === Route.id) {
          window.location.hash = Route.id;
        }
      });
    }

    this.finalScorePopup = options.finalScorePopup;

    if (options.header) this.header = options.header;

    this.database = options.database;

    window.addEventListener('hashchange', this.showRoute);

    window.addEventListener('load', this.showRoute);
  }

  showRoute = (): void => {
    const hash = window.location.hash.slice(1).toLowerCase();

    const nextRoute = this.routes.find((route) => route.id === hash);
    if (nextRoute) {
      if (this.currentRoute) this.currentRoute.removeScreen();

      this.currentRoute = new nextRoute.Screen({
        parentNode: this.node,
        database: this.database,
        finalScorePopup: this.finalScorePopup,
        header: this.header,
      });

      this.currentRoute.showScreen();
    }

    this.setActiveNavItem(hash);
  };

  setActiveNavItem(hash: string): void {
    this.header.navigation.items.forEach((item) => {
      if (item.state.data?.href === `#${hash}`) item.node.classList.add('button--active');
      else item.node.classList.remove('button--active');
    });
  }
}
