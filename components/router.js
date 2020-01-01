class Router {
  constructor() {
    this.routes = [];
    this.middleware = [];
  }

  addRoute(method, path, handler) {
    this.routes.push({ method, path, handler });
  }

  get(path, handler) {
    this.addRoute('GET', path, handler);
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  async handleRoutes(request, response, next) {
    let promise;
    const url = new URL(request.url, 'http://localhost/');
    this.routes.some((route) => {
      if (route.path instanceof RegExp) {
        const match = `${url.pathname}`.match(route.path);
        if (match) {
          promise = route.handler({ ...request, match }, response);
          return true;
        }
      } else if (route.path === url.pathname) {
        promise = route.handler(request, response);
        return true;
      }
      return false;
    });
    if (promise) {
      await promise;
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }
    next();
  }

  async handleRequest(request, response) {
    const middleware = [...this.middleware, this.handleRoutes.bind(this)];

    const next = async (result = true) => {
      if (result && middleware.length) {
        const nextMW = middleware.pop();
        await nextMW(request, response, next);
      }
    };
    next();
  }

  handle() {
    return (req, res) => this.handleRequest(req, res);
  }
}

module.exports = Router;
