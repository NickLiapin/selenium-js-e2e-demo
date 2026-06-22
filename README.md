# Selenium WebDriver E2E Demo (JavaScript) - Swag Labs

[![E2E Tests (Selenium)](https://github.com/NickLiapin/selenium-js-e2e-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/NickLiapin/selenium-js-e2e-demo/actions/workflows/ci.yml)
[![Selenium](https://img.shields.io/badge/Selenium-WebDriver-43B02A?logo=selenium&logoColor=white)](https://www.selenium.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-Node.js-F7DF1E?logo=javascript&logoColor=black)](https://nodejs.org)

A compact **end-to-end test automation framework** built with **Selenium WebDriver
+ JavaScript (Node.js)** and **Mocha**. It shows how I structure Selenium suites:
Page Object Model, a reusable driver factory, data-driven tests, explicit waits,
headless execution, and GitHub Actions CI.

Tests run against the public demo site **[Swag Labs](https://www.saucedemo.com)**
- so there is no private data - and cover login, the shopping cart, and a full
checkout flow.

> **About this demo.** This is a deliberately compact, self-contained example
> against a public practice site. Its job is to show *how* I structure automation
> - the patterns, the tooling, the CI - not to mirror the scale of production work.
> The suites I build for real products are considerably larger and more complex,
> and that work stays under NDA, so it is not published here. Read this as a clean
> reference of craft and tooling command, not as a ceiling.

## What this demonstrates

- **Page Object Model** - each page is a class exposing intention-revealing methods;
  tests never touch raw selectors. See [`pages/`](pages/).
- **Driver factory** - a single [`utils/driver.js`](utils/driver.js) builds a headless
  Chrome driver; Selenium Manager auto-resolves the matching chromedriver (no manual
  driver downloads).
- **Data-driven tests** - negative-login cases parameterised from [`data/users.js`](data/users.js).
- **Explicit waits** - `driver.wait(until...)` instead of brittle sleeps.
- **Mixed locator strategies** - CSS for stable `data-test` hooks, XPath where a
  relationship between elements is needed (see [`pages/CartPage.js`](pages/CartPage.js)).
- **CI** - every push / pull request runs the suite headless on GitHub Actions.

## Project structure

```
selenium-js-e2e-demo/
|-- pages/                 # Page Objects (Login, Inventory, Cart, Checkout)
|-- utils/driver.js        # Headless Chrome WebDriver factory
|-- data/users.js          # Test data (users, negative-login cases)
|-- test/                  # Mocha specs: login, cart, checkout
|-- .mocharc.json          # Mocha config
`-- .github/workflows/     # GitHub Actions CI pipeline
```

## Running locally

Requires Node.js 18+ and Google Chrome installed.

```bash
npm install
npm test                 # headless
HEADLESS=false npm test  # watch it run in a real browser
```

## Continuous Integration

On every push / pull request to `main`, GitHub Actions installs dependencies and
runs the full Mocha + Selenium suite headless against Swag Labs. The badge at the
top reflects the latest run.

The page objects use explicit waits and click-verification (never `sleep`) to stay
reliable. On top of that, the suite carries bounded **test-level retries** (Mocha
`retries`) so a rare incomplete page load from the *external* demo site is absorbed
by re-running that test with a fresh browser session - standard practice when an
E2E suite depends on a third-party environment.

## Tech

Selenium WebDriver, JavaScript (Node.js), Mocha, GitHub Actions

---

Built by **Nick Liapin** - Senior SDET / QA Automation Engineer. A companion to my
[Playwright E2E demo](https://github.com/NickLiapin/playwright-e2e-demo); this one
shows the same flows automated with Selenium WebDriver in JavaScript.
