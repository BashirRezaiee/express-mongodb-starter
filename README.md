# express-mongodb-starter
Starter project for express and mongodb with pre Auth, Logging, Routing and DB modules configured. 

## Installation 

1. Clone repo `git clone https://github.com/BashirRezaiee/express-mongodb-starter.git` and `cd` into 

2. Run on the console
`yarn install` or `npm install`

3. Add two system environment variables:  
    - `YourPrefix_jwt_key` with your secret value  
    - `YourPrefix_db_host` with the mongodb uri as the value 
  
4. Add your prefix to the `/config/custom-environment-variables.js` file.
    - Replace the `EDIT` on both key with your prefix to match the system env variables you added. 
    
5. If you have nodemon installed globaly, then run `nodemon` and the server will start in dev mode, otherwise run `yarn start` or `npm run start` to start the server. 
