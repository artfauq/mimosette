# Documentation

## Getting started

### Prerequisites

[Node.js](https://nodejs.org/en/) and [Gulp](https://gulpjs.com/) are required to run the application.

- Visit [this page](https://nodejs.org/en/download/) for Node.js download instructions
- Once Node installed, open a terminal and run the following to install Gulp globally:

`$ npm i -g gulp`

### Getting the code

[Download](https://github.com/arthurfauq/skeleton/archive/master.zip) the boilerplate code or clone it with the following command:

`$ git clone https://github.com/arthurfauq/skeleton.git <project name>`

> Replace `<project name>` with the name of your application.

_OPTIONAL:_ reset the git repository with the following commands:

```
$ rm -rf .git
$ git init
```

### Installation

Navigate to the project's directory:

`$ cd <project name>`

Install the required dependencies:

`$ npm install`

### Development

Start a local development server with the following command:

`$ npm run start`

This will fire up a local web server at [`http://localhost:3000/`](http://localhost:3000) and watch for changes in your source files allowing the browser to reload automatically.

### Build

Compile the application sources to a production-ready `dist/` folder with:

`$ npm run build`

To preview the compiled application, run:

`$ npm run serve:dist`

### Deploy

If your application is available as a GitHub repository, it is possible to publish the compiled sources to [GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/).

To compile the project's sources and push it to a `gh-pages` branch, run:

`$ npm run deploy`

This command uses internally the `npm run build` command and the [gh-pages](https://www.npmjs.com/package/gh-pages) npm package.

## Structure

_Coming soon_
