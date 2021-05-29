import Control from '../Control/Control';
import Database from '../Database/Database';
import Screen from '../Screen/Screen';
import Anchor from '../Button/Anchor';
import FinalScorePopup from '../Popup/FinalScorePopup/FinalScorePopup';

type Options = {
  parentNode: HTMLElement;
  routes: Array<{ Screen: typeof Screen; id: string }>;
  startRouteId: string;
  database: Database;
  navigationItems?: Anchor[];
  finalScorePopup: FinalScorePopup;
};

export default class Router extends Control {
  currentRoute!: Screen;

  routes: Array<{ Screen: typeof Screen; id: string }>;

  loadedRoutes: Screen[];

  database: Database;

  navigationItems!: Anchor[];

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

    if (options.navigationItems) this.navigationItems = options.navigationItems;

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
      });

      this.currentRoute.showScreen();
    }

    this.setActiveNavItem(hash);
  };

  setActiveNavItem(hash: string): void {
    this.navigationItems.forEach((item) => {
      if (item.state.data?.href === `#${hash}`) item.node.classList.add('button--active');
      else item.node.classList.remove('button--active');
    });
  }
}
