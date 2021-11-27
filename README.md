## Description
The official server for our "Digitaler-Bücherschrank" app. Stay tuned for coming up things!
Based on NestJS 


## Installation

```bash
$ npm install
```

## Running the app

You need to create a config.ts in src/ which has the following structure:
```typescript
export const Config = {
  "connection_string": "", // Connection string to the (mongodb) database 
  "api_key": "", // Access key for the isbn-db API
  "secret": "", // Any random string used for generating JWT Tokens for authentication
  "working_dir": "" // Directory of src/, needed for maintenance mode checks
};
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
