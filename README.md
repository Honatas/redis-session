# Using Redis as a Session Server on a NestJS application

This repo is an example implementation of how to achieve user session control via Cookies (no JWT) using Redis as a central session storage. This application is built in [Typescript](https://www.typescriptlang.org) using [Nest](https://nestjs.com) and [Prisma](https://www.prisma.io).  

This has been made as a Proof of Concept (PoC) to back up this article I've wrote a while ago: [A different approach to User Sessions in Microservices using Redis](https://dev.to/honatas/a-different-approach-to-user-sessions-in-microservices-5bpi). Reading is recommended if you want to understand the motivation behind this implementation.  

## Setup

In order to run this app, you will need to make available:

* PostgreSQL version 14;
* Redis version 7.

You can use Docker to get those running on your machine. You can use all the default ports and user/password combinations.  

## Usage

You will need to install NodeJs to be able to run this app. Go to the directory where you have cloned this repository, then run **npm install** to download the dependencies. After that, run **npm run start:dev** to start the development server.  

You will need a REST client to make calls to the endpoints, I recommend using [Insomnia](https://insomnia.rest).  

After you successfully run the app, the API documentation will be available at http://localhost:3000/swagger .

## PoC

In order to test the functionality of this app, you can execute these requests in order and see what happens:

1. Call **POST /user/assign** to verify that the method is protected (returns 401)

2. Call **POST /user** to create a user (returns 200);

3. Call **POST /user/login** to login with the user you have created (returns 200)
You will see that the method returns a SetCookie header. This cookie's value is the Redis record key. The session is already on Redis.

4. Call **POST /user/assign** again. This time the system knows who you are but does not allows you access. (returns 403)

5. Discard your previous cookie, then call **POST /user/login** with the following payload to login as superuser. (returns 200)
```json
{
  "username": "admin",
  "password": "admin"
}
```
Now you can do whatever you want on the endpoints, including assigning permissions to the user you have created.

## Disclaimer

**WARNING**: This is not production level code. There are a lot of stuff missing, like correct parameterization of values per environment, tests, containerization, etc etc etc. This just proves that it is possible to control user sessions without JWT.  

Also, this can scale up horizontally. You can have many instances of this app running, using single instances for Postgres and Redis.
