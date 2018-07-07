/* eslint-disable */

describe('SPA', () => {
  it('asyncData() is resolved', () => {
    cy.visit('/');
    cy.contains('async-data').click();
    cy.contains('#value', 'asyncData');
  });

  it('asyncData() for store is resolved', () => {
    cy.contains('async-data-store').click();
    cy.contains('#value', 'asyncDataStore');
  });

  it('asyncData() can display error page', () => {
    cy.contains('async-data-error').click();
    cy.contains('h1', 'Error 500');
  });

  it('$redirect() is called correctly', () => {
    cy.contains('redirect').click();
    cy.contains('h1', 'Home');
  });

  it('$error() is called correctly', () => {
    cy.visit('/error');
    cy.contains('action').click();
    cy.contains('h1', 'Error 403');
  });

  it('404 not found page is displayed', () => {
    cy.contains('not-found').click();
    cy.contains('h1', 'Error 404');
  });

  it('Global middleware is called', () => {
    cy.contains('global-middleware').click();
    cy.contains('#value', 'globalMiddleware');
  });

  it('Route middleware is called', () => {
    cy.contains('route-middleware').click();
    cy.contains('#value', 'routeMiddleware');
  });

  it('Middleware can redirect', () => {
    cy.contains('middleware-redirect').click();
    cy.contains('h1', 'Home');
  });

  it('Middleware can have an error', () => {
    cy.contains('middleware-error').click();
    cy.contains('h1', 'Error 500');
  });

  it('Middleware can have an error with helper', () => {
    cy.contains('middleware-error-func').click();
    cy.contains('h1', 'Error 403');
  });

  it('Nested routes asyncData()', () => {
    cy.contains('nested').click();
    cy.contains('#parent-value', 'parent');
    cy.contains('#value', 'child');
  });

  it('Nested routes middlewares', () => {
    cy.contains('#parent', 'parent');
    cy.contains('#middleware', 'child');
  });
});
