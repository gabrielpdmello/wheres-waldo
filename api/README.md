# Where's Waldo REST API
This the backend for my Where's Waldo game. 

## Built With
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Passport.js with the JWT strategy
- jsonwebtoken
- CORS middleware

## How to run this API
1. Clone this repo and cd into API directory
```bash
git clone https://github.com/gabrielpdmello/wheres-waldo.git
cd wheres-waldo/api
```
2. Install dependencies
```bash
npm install
```
3. Create a PostgreSQL database
4. Copy the example environment file
```bash
cp .env.example .env
```
5. Update the environment variables
6. Run the Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```
7. Seed the database 
```bash
npx prisma db seed
```
8. Start the application
```bash
npm run start
```

## How to run the tests
First, setup the test environment:
1. Create a database for test
2. Update environment variable TEST_DATABASE_URL
3. Update environment variable NODE_ENV to "test"
4. Run the Prisma migrations on the test database
```bash
npx prisma migrate dev
npx prisma generate
```
5. Update environment variable NODE_ENV back to "dev"

After setup, run:
```bash
npm run test
```
