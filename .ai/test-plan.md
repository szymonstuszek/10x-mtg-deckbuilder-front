# Test Plan for "MTG Deckbuilder Frontend" Project

## 1. Introduction and Testing Objectives

### 1.1. Introduction
This document presents the test plan for the "MTG Deckbuilder" frontend application. This application allows Magic: The Gathering players to browse cards, create, and manage their decks. The project is developed using Angular 19 with Angular Material, NgRx for state management, and Amazon Cognito for authentication. The backend is based on Spring Boot and communicates with the external magicthegathering.io API.

### 1.2. Testing Objectives
The main objectives of testing the project are:
*   To ensure high software quality and compliance with functional and non-functional requirements.
*   To detect and report bugs as early as possible in the development cycle.
*   To verify the correct operation of key functionalities such as deck building, card searching, user authentication, and management of saved decks.
*   To assess the usability, performance, and security of the application.
*   To ensure the stability of the application across different platforms and browsers.
*   To minimize the risk associated with deploying the application to the production environment.

## 2. Scope of Tests

### 2.1. Functionalities Covered by Tests:
*   **Authentication Module:**
    *   User login (valid and invalid credentials).
    *   Logout.
    *   Route protection (access to protected sections only for logged-in users).
    *   User session management.
    *   HTTP request interception to add tokens (AuthInterceptor).
*   **Deck Builder Module (`DeckBuilder`):**
    *   Searching for cards by various criteria (name, type, color, etc.).
    *   Filtering and sorting card search results.
    *   Displaying card details (including card image preview - `CardImagePopoverDirective`).
    *   Adding cards to the deck.
    *   Removing cards from the deck.
    *   Deck validation (e.g., minimum number of cards, copy limits).
    *   Displaying deck summary (e.g., mana curve, card count by type).
    *   Saving a new deck.
    *   Loading and editing an existing deck.
    *   State management using NgRx (actions, reducers, effects, selectors for `card-list` and `deck`).
*   **Deck Management Module (`Decks`):**
    *   Displaying the list of user's saved decks.
    *   Opening a deck for viewing/editing from the list.
    *   Deleting a deck (with a confirmation dialog).
    *   State management using NgRx (actions, reducers, effects, selectors for `decks`).
*   **Navigation and Routing:**
    *   Correct operation of links and redirections.
    *   Functionality of browser "back"/"forward" buttons.
*   **User Interface (UI):**
    *   Correct display of interface elements.
    *   Responsiveness on different screen sizes (desktop, tablet, mobile).
    *   Visual consistency.
    *   Functionality of Angular Material components.
*   **Error Handling:**
    *   Displaying error messages (e.g., validation errors, API errors).
    *   Correct application behavior in error situations.

### 2.2. Functionalities Excluded from Tests (if applicable):
*   Testing the internal logic of the external `magicthegathering.io` API.
*   Direct testing of AWS infrastructure (RDS, Cognito) – only the application's interactions with these services will be tested.
*   Testing the Spring Boot backend itself (we assume the backend has its own test plan; we focus on integration).

## 3. Types of Tests to be Performed

*   **Unit Tests:**
    *   Objective: To verify the correctness of individual components, services, pipes, directives, NgRx reducers, effects, and selectors in isolation.
    *   Tools: Karma, Jasmine, Angular Testing Utilities (`TestBed`).
    *   Scope: Mainly business logic of components, helper functions in services, logic of reducers and selectors. Mocking dependencies (services, APIs).
*   **Component Integration Tests:**
    *   Objective: To verify interactions between components (parent-child), correct data passing, and integration of a component with its HTML template and services.
    *   Tools: Karma, Jasmine, Angular Testing Utilities.
    *   Scope: Testing functional modules (e.g., `DeckBuilder`, `Decks`) as a whole, verifying data flow and events between related components and services. Mocking the backend.
*   **End-to-End (E2E) Tests:**
    *   Objective: To verify complete user flows in the application, simulating real user interactions with the graphical interface in a browser.
    *   Tools: Protractor (traditionally for Angular) or newer alternatives like Cypress, Playwright.
    *   Scope: Key user scenarios, e.g., registration, login, deck creation, card searching, saving a deck, browsing decks. These tests include interaction with a running (or HTTP-level mocked) backend.
*   **User Acceptance Tests (UAT):**
    *   Objective: Confirmation by stakeholders or end-users that the application meets their requirements and is ready for deployment.
    *   Scope: Performed manually based on defined business scenarios.
*   **Compatibility Tests:**
    *   Objective: To ensure that the application works correctly in different web browsers (e.g., Chrome, Firefox, Safari, Edge) and on different operating systems.
    *   Scope: Manual or automated (E2E) tests on selected configurations.
*   **Performance Tests:**
    *   Objective: To assess the application's responsiveness, load times, resource consumption, especially when handling large amounts of data (e.g., card lists, filtering).
    *   Tools: Browser developer tools, Lighthouse, possibly specialized load testing tools (if backend interaction is relevant).
    *   Scope: Main page load time, card search response time, interface smoothness.
*   **Security Tests:**
    *   Objective: To identify potential security vulnerabilities, especially in the context of authentication and authorization.
    *   Scope: Testing route protection, session management, vulnerability to basic attacks (e.g., XSS – if the application renders user-inputted data). Basic verification of Cognito integration.
*   **Usability Tests:**
    *   Objective: To assess the intuitiveness, ease of use, and overall user experience (UX).
    *   Scope: Evaluation of user flows, interface readability, navigation logic. Often conducted by observing users or collecting feedback.

## 4. Test Scenarios for Key Functionalities

Example test scenarios (high-level):

### 4.1. Authentication
*   **SCN_AUTH_001:** Successful login with valid credentials.
    *   Steps: 1. Open the login page. 2. Enter valid email and password. 3. Click "Login".
    *   Expected Result: The user is redirected to the main application dashboard.
*   **SCN_AUTH_002:** Failed login with invalid credentials.
    *   Steps: 1. Open the login page. 2. Enter invalid email or password. 3. Click "Login".
    *   Expected Result: A login error message is displayed.
*   **SCN_AUTH_003:** Access to a protected page without being logged in.
    *   Steps: 1. Try to directly access the URL of the `DeckBuilder` module without an active session.
    *   Expected Result: The user is redirected to the login page.
*   **SCN_AUTH_004:** Successful logout.
    *   Steps: 1. While logged in, click the "Logout" button.
    *   Expected Result: The user is logged out and redirected to the login page or a public home page.

### 4.2. Deck Building (`DeckBuilder`)
*   **SCN_DECKBUILD_001:** Search for cards by name.
    *   Steps: 1. Navigate to the `DeckBuilder` module. 2. In the search field, type part of an existing card's name. 3. Submit the search.
    *   Expected Result: A list of cards matching the criteria is displayed.
*   **SCN_DECKBUILD_002:** Add a card to the deck.
    *   Steps: 1. Search for a card. 2. Click the "Add to Deck" button for the selected card.
    *   Expected Result: The card is added to the deck list, and the deck summary is updated.
*   **SCN_DECKBUILD_003:** Remove a card from the deck.
    *   Steps: 1. In the deck view, click the "Remove" button for a selected card.
    *   Expected Result: The card is removed from the deck, and the deck summary is updated.
*   **SCN_DECKBUILD_004:** Save a new deck.
    *   Steps: 1. Add several cards to the deck. 2. Enter a name for the deck. 3. Click "Save Deck".
    *   Expected Result: The deck is saved, and the user receives a confirmation. The deck is visible in the list of saved decks.
*   **SCN_DECKBUILD_005:** Filter cards (e.g., by color).
    *   Steps: 1. In the `DeckBuilder` module, use the color filter (e.g., select "Blue").
    *   Expected Result: Only cards containing the selected color are displayed.

### 4.3. Deck Management (`Decks`)
*   **SCN_DECKS_001:** Display the list of saved decks.
    *   Steps: 1. Navigate to the `Decks` module.
    *   Expected Result: A list of decks saved by the user is displayed.
*   **SCN_DECKS_002:** Delete a deck from the list.
    *   Steps: 1. In the deck list, click "Delete" for a selected deck. 2. Confirm the operation in the dialog.
    *   Expected Result: The deck is removed from the list.

## 5. Test Environment

*   **Development Environment:** Local developer machines (for unit and early integration tests).
*   **Test Environment (Staging/QA):**
    *   Frontend: A dedicated instance of the Angular application deployed on a server (e.g., AWS Amplify, S3/CloudFront).
    *   Backend: A dedicated, stable instance of the Spring Boot backend connected to a test database (PostgreSQL on AWS RDS) and configured with a test Amazon Cognito environment.
    *   Test Data: A prepared set of data in the test database and mocks for the external `magicthegathering.io` API (if the backend doesn't have a stable mock of this API for the QA environment).
*   **Browsers:**
    *   Latest version of Google Chrome.
    *   Latest version of Mozilla Firefox.
    *   Latest version of Safari (on macOS).
    *   Latest version of Microsoft Edge (Chromium).
*   **Devices (for responsiveness and UAT testing):**
    *   Desktop (Windows, macOS).
    *   Tablets (iOS, Android – emulated or physical).
    *   Smartphones (iOS, Android – emulated or physical).

## 6. Testing Tools

*   **Unit and Component Integration Tests:**
    *   Framework: Jasmine
    *   Runner: Karma
    *   Helper Libraries: Angular Testing Utilities (`@angular/core/testing`, `@angular/platform-browser-dynamic/testing`)
    *   Mocking: Jasmine spies, possibly mocking libraries (e.g., `ngx-mock-something`)
*   **E2E Tests:**
    *   Cypress or Playwright (preferred for modernity and support)
*   **Test and Bug Management:**
    *   Jira (or other project management tools like Trello, Asana) for tracking test cases, progress, and reporting bugs.
    *   TestRail, Xray (for Jira), or Zephyr Scale (for Jira) – optionally, for more advanced test case management.
*   **CI/CD:**
    *   AWS services (e.g., AWS CodePipeline, AWS CodeBuild) for automated test execution.
    *   GitHub Actions (defined in `.github/workflows/node.js.yml` for running unit tests and linting).
*   **Performance Tests:**
    *   Google Lighthouse (built into Chrome DevTools).
    *   Browser developer tools (Performance/Profiler tab).
*   **Version Control:** Git, GitHub.

## 7. Test Schedule

The test schedule should be integrated with the project schedule and sprints (if Agile methodology is used).

*   **Unit Tests:** Conducted by developers continuously during the implementation of new features and refactoring. Should be part of the Definition of Done for each task.
*   **Integration Tests:** Conducted after integrating several components or modules, usually at the end of a sprint or before a new version release.
*   **E2E Tests:**
    *   Development of E2E scripts: Parallel to feature development.
    *   Execution: Regularly in the test environment, at least once per sprint and before each release.
*   **User Acceptance Tests (UAT):** Planned for the end of the development phase, before production deployment. Require preparation of the environment and test data, and stakeholder involvement.
*   **Regression Tests:** Conducted before each release to ensure that new changes have not broken existing functionalities. Include running key unit, integration, and E2E tests.
*   **Performance and Compatibility Tests:** Planned cyclically, especially before major releases or after introducing changes that might affect these aspects.

## 8. Test Acceptance Criteria

### 8.1. Entry Criteria (Start of Testing):
*   Available documentation (requirements, specifications).
*   The test environment is prepared and configured.
*   The code has been deployed to the test environment.
*   Unit tests for new features have been written and are passing.
*   Test data is available.

### 8.2. Exit Criteria (End of Testing):
*   All planned test cases have been executed.
*   A defined level of code coverage by tests has been achieved (e.g., 80% for unit tests).
*   All critical and high-priority bugs have been fixed and re-tested.
*   The number of open lower-priority bugs is acceptable to stakeholders.
*   Test results have been documented and accepted.
*   Successful completion of UAT.

## 9. Roles and Responsibilities in the Testing Process

*   **Developers:**
    *   Responsible for writing and executing unit tests.
    *   Fixing bugs reported by the QA team.
    *   Assisting in the creation of integration tests.
    *   Ensuring code quality (code reviews, linting).
*   **QA Engineer/Team:**
    *   Creating and maintaining the test plan.
    *   Designing and executing integration, E2E, system, and acceptance tests.
    *   Automating E2E tests.
    *   Reporting bugs and tracking their status.
    *   Preparing test reports.
    *   Verifying fixed bugs.
    *   Managing the test environment (in collaboration with DevOps/Admins).
*   **Product Owner / Business Stakeholders:**
    *   Providing requirements and acceptance criteria.
    *   Participating in User Acceptance Tests (UAT).
    *   Making decisions on bug-fixing priorities.
    *   Accepting test results.
*   **DevOps / System Administrators (if applicable):**
    *   Configuring and maintaining test environments.
    *   Integrating tests with the CI/CD process.

## 10. Bug Reporting Procedures

*   **Tool:** Jira (or other established tool).
*   **Bug Reporting Process:**
    1.  Check if the bug has not already been reported.
    2.  Create a new bug ticket, including:
        *   **Title:** A short, concise description of the problem.
        *   **Description:** A detailed description of the bug, including:
            *   Steps to reproduce (numbered, clear, and precise).
            *   Observed result.
            *   Expected result.
        *   **Environment:** Application version, browser (version), operating system, URL.
        *   **Priority:** (e.g., Critical, High, Medium, Low) - assessment of the bug's impact on the system.
        *   **Severity:** (e.g., Critical, Major, Minor, Cosmetic) - assessment of the bug's technical impact.
        *   **Attachments:** Screenshots, video recordings, console logs (if relevant).
        *   **Assignee:** To the appropriate developer or team.
*   **Bug Lifecycle:**
    *   `New/Open`: Bug reported.
    *   `In Progress/In Analysis`: Developer is analyzing the bug.
    *   `To Be Fixed/Reopened`: Bug accepted for fixing or reopened after failed verification.
    *   `Resolved/Fixed`: Developer has implemented a fix.
    *   `Pending Retest/Ready for QA`: Bug is awaiting verification by QA.
    *   `Closed`: Bug has been verified and fixed.
    *   `Rejected`: Bug is not considered a defect (e.g., works as specified, duplicate).
    *   `Deferred`: Bug fix is postponed.
*   **Test Reports:**
    *   Regular reports on test execution status.
    *   Summary of the number of found, fixed, and open bugs.
    *   Final test report after completion of the test cycle.
