/* eslint-disable */
import { readSSRData } from '../utils';

let valueToCheck = null;

describe('SSR', () => {
  it('Home page display', () => {
    cy.visit('/');
    cy.contains('h1', 'Home');
  });

  it('Call and inject onHttpRequest() data', () => {
    readSSRData(cy).then(data => {
      const { state } = data;
      valueToCheck = state.httpRequest;
      expect(state.httpRequest).to.be.equal('onHttpRequest');
    });
  });

  it('Display onHttpRequest data correctly', () => {
    cy.contains('#mounted', 'true');
    cy.contains('#value', valueToCheck);
  });

  it('Can display error with onHttpRequest action', () => {
    cy.visit('/on-http-request-error', { failOnStatusCode: false });
    cy.contains('h1', 'Error 500');
  });

  it('Call asyncData() and inject to component', () => {
    cy.visit('/async-data');
    readSSRData(cy).then(data => {
      const { components } = data;
      valueToCheck = components[0]['value'];
      expect(components[0]['value']).to.be.equal('asyncData');
    });
  });

  it('Display asyncData() data correctly', () => {
    cy.contains('#mounted', 'true');
    cy.contains('#value', valueToCheck);
  });

  it('Call asyncData() and inject to store', () => {
    cy.visit('/async-data-store');
    readSSRData(cy).then(data => {
      const { state } = data;
      valueToCheck = state.value;
      expect(state.value).to.be.equal('asyncDataStore');
    });
  });

  it('Display asyncData() store data correctly', () => {
    cy.contains('#mounted', 'true');
    cy.contains('#value', valueToCheck);
  });

  it('Error in asyncData() inject data to errorHandler', () => {
    cy.visit('/async-data-error', { failOnStatusCode: false });
    readSSRData(cy).then(data => {
      const { state } = data;
      expect(state.errorHandler.statusCode).to.be.equal(500);
    });
  });

  it('Display error page with statusCode', () => {
    cy.contains('h1', 'Error 500');
  });

  it('Redirect function', () => {
    cy.visit('/redirect');
    cy.contains('h1', 'Home');
  });

  it('404 error inject data to store', () => {
    cy.visit('/not-found', { failOnStatusCode: false });
    readSSRData(cy).then(data => {
      const { state } = data;
      expect(state.errorHandler.statusCode).to.be.equal(404);
    });
  });

  it('Display error page with statusCode 404', () => {
    cy.contains('h1', 'Error 404');
  });

  it('Call global middlewares', () => {
    cy.visit('/global-middleware');
    readSSRData(cy).then(data => {
      const { state } = data;
      valueToCheck = state.middleware;
      expect(state.middleware).to.be.equal('globalMiddleware');
    });
  });

  it('Display global middlewares data correctly', () => {
    cy.contains('#mounted', 'true');
    cy.contains('#value', valueToCheck);
  });

  it('Call route middlewares', () => {
    cy.visit('/route-middleware');
    readSSRData(cy).then(data => {
      const { state } = data;
      valueToCheck = state.middleware;
      expect(state.middleware).to.be.equal('routeMiddleware');
    });
  });

  it('Display route middlewares data correctly', () => {
    cy.contains('#mounted', 'true');
    cy.contains('#value', valueToCheck);
  });

  it('Middleware redirect', () => {
    cy.visit('/middleware-redirect');
    cy.contains('h1', 'Home');
  });

  it('Middleware error', () => {
    cy.visit('/middleware-error', { failOnStatusCode: false });
    readSSRData(cy).then(data => {
      const { state } = data;
      expect(state.errorHandler.statusCode).to.be.equal(500);
    });
  });

  it('Middleware error with helper', () => {
    cy.visit('/middleware-error-func', { failOnStatusCode: false });
    readSSRData(cy).then(data => {
      const { state } = data;
      expect(state.errorHandler.statusCode).to.be.equal(403);
    });
  });

  it('Nested routes asyncData()', () => {
    cy.visit('/nested');
    readSSRData(cy).then(data => {
      const { components } = data;
      expect(components[0]['value']).to.be.equal('parent');
      expect(components[1]['value']).to.be.equal('child');
    });
  });

  it('Nested routes with correct data displayed', () => {
    cy.contains('#mounted', 'true');
    cy.contains('#parent-value', 'parent');
    cy.contains('#value', 'child');
  });

  it('Nested routes middlewares', () => {
    readSSRData(cy).then(data => {
      const { state } = data;
      expect(state.parent).to.be.equal('parent');
      expect(state.middleware).to.be.equal('child');
    });
  });

  it('Nested routes with correct data displayed from middlewares', () => {
    cy.contains('#parent', 'parent');
    cy.contains('#middleware', 'child');
  });
});
