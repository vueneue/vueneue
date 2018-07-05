/* eslint-disable */

describe('HTTP status codes', () => {
  before(() => {
    return cy.request(`/heapdump?name=${new Date().getTime()}_http-start`);
  });

  after(() => {
    return cy.request(`/heapdump?name=${new Date().getTime()}_http-end`);
  });

  it('200 on home', () => {
    cy.request('/').then(response => {
      expect(response.status).to.be.equal(200);
    });
  });

  it('404 on not found', () => {
    cy.request({
      url: '/not-found',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(404);
    });
  });

  it('500 on onHttpRequest error', () => {
    cy.request({
      url: '/on-http-request-error',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(500);
    });
  });

  it('500 on asyncData error', () => {
    cy.request({
      url: '/async-data-error',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(500);
    });
  });

  it('302 on redirect function', () => {
    cy.request({
      url: '/redirect',
      followRedirect: false,
    }).then(response => {
      expect(response.status).to.be.equal(302);
    });
  });

  it('500 on middleware error', () => {
    cy.request({
      url: '/middleware-error',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(500);
    });
  });

  it('403 on middleware error with helper', () => {
    cy.request({
      url: '/middleware-error-func',
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.be.equal(403);
    });
  });
});
