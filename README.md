# Rekkit

## Requirements
This application requires a few bits to be installed on your machine before being able to run and test...

The first and most important thing is that you need to have `node.js` installed on your machine in order to run it... If you do not, [visit here](https://nodejs.org/en/download/) to download `node.js`. Also because this front end was developed with the [Angular CLI](https://cli.angular.io/) it is definitely recommended to install it via terminal/command prompt `npm install -g angular-cli`.

Once both `node.js` and the `angular-cli` are installed you can download all application dependencies by just running in terminal/command prompt `npm install`

## SQL
This application is dependent on a SQL server to run. In the root directory there is a file called `config.sql` that you can import into any SQL database you want. That will configure the tables required for the application.

THIS DOES NOT CREATE THE DATABASE, ONLY THE TABLES YOU NEED!

## Server Environment Variables
In the root directory of the application you should find a file called `env.sample.sh` (rename it to `env.sh`). Modify the `HOST, USER, PASSWORD, DATABASE` of your SQL server as well as the `PORT` for your API server (defaults to port 3000 for development). Then just run `npm run env` to run the application for development.

Remember that you must set all of those values for deploying the application.

## Web Application Environment Variables
In the `src/environment/` directory you will find two files; `environment.prod.ts` and `environment.ts`. These are just to set root api endpoints for the web application in development. However you can add what ever else variables you want there. `environment.prod.ts` is for production while `environment.ts` is for development.

## Development
During the development process two "servers" are running on two different ports. [http://localhost:3000/](http://localhost:3000/) is running a production ready version of the web application as well as the API endpoints, while [http://localhost:4200/](http://localhost:4200/) is running a development version of the web application.

Use [http://localhost:4200/](http://localhost:4200/) for your development. The app will automatically reload if you change any of the source files.

## Commands

### Production Server
Run `npm run start` or `npm start` or `node ./app.js` will run a production version of the API/production server on [http://localhost:3000/](http://localhost:3000/).

### Development Server
Run `npm run dev` will run a development version of the web application on [http://localhost:4200/](http://localhost:4200/) and the API/production server on [http://localhost:3000/](http://localhost:3000/).

If you have set up the `env.sh` set up, you can run `npm run env` to set your Node/Server Environment Variables.

### Build
Run `npm run build` to build a production ready web application. The build artifacts will be stored in the `public/` directory.

### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). No tests are actually written.

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). No tests are actually written.
Before running the tests make sure you are serving the app via `npm run dev`.
