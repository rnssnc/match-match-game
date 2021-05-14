import Control from '../Control/Control';
import Screen from '../Screen/Screen';

type Options = {
  parentNode: HTMLElement;
  routes: Array<{ Screen: typeof Screen; id: string }>;
  startRouteId: string;
};

export default class Router extends Control {
  currentRoute!: Screen;

  routes: Array<{ Screen: typeof Screen; id: string }>;

  loadedRoutes: Screen[];

  constructor(options: Options) {
    super({ parentNode: options.parentNode, tagName: 'main', className: 'router-root' });

    this.loadedRoutes = [];

    this.routes = options.routes;
    // this.loadedRoutes.push(route);
    options.routes.forEach((Route) => {
      if (options.startRouteId && options.startRouteId === Route.id) {
        window.location.hash = Route.id;
      }
    });

    window.addEventListener('hashchange', this.showRoute);

    window.addEventListener('load', this.showRoute);
  }

  showRoute = (): void => {
    const hash = window.location.hash.slice(1).toLowerCase();

    const nextRoute = this.routes.find((route) => route.id === hash);
    if (nextRoute) {
      if (this.currentRoute) this.currentRoute.removeScreen();
      this.currentRoute = new nextRoute.Screen(this.node);

      this.currentRoute.showScreen();
    }
  };
}
