## Description
The official server for our "Digitaler-Bücherschrank" app. Stay tuned for coming up things!
Based on NestJS 


## Installation

```bash
$ npm install
```

## Running the app

You need to have a .env file (in the project root) with the following structure:
```text
DB_CONN_STR=mongodb+srv:... // Connection string to the (mongodb) database 
API_KEY=0 // Access key for the isbn-db API
API_SECRET=test // Any random string used for generating JWT Tokens for authentication
```


Starting the server:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Support & Stay in touch

If you have any requests, please pm me on Discord: Flawn#6197 

## License

Our server is [AGPLv3 licensed](https://www.gnu.org/licenses/agpl-3.0.txt).

Big shoutout to the Polytechnische Gesellschaft which is sponsoring us!
