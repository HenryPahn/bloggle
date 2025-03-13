# bloggle
This is back-end of Bloggle app. 

## Commands
- Run Eslint to check code problems in JS file: 
```sh 
npm run lint
```

- Run server in 2 mode (normal and dev): 
```sh 
npm start 
npm run dev
```

- Debug by break point in Vscode: 
```sh 
npm run debug
```

> [!NOTE]
> If you are working on Window, scripts for dev and debug mode might not work. In this case, you need "cross-env" package. In your project terminal, run "npm i --save-dev cross-env". In package.json, please add "cross-env" to the front of dev and debug scripts. For example, `"dev": "cross-env LOG_LEVEL=debug nodemon ./src/index.js --watch src"`

- Run test: 
```sh 
npm run test 
```

- Watch test while debug: 
```sh 
npm run test:watch
```

- Run coverage to make sure overall above 80%: 
```sh 
npm run coverage
```
