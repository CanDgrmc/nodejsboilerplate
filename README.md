# Node.js Boilerplate
- Api doc can be found in http://localhost:3000/v1/api-docs


----------------------------------------------------------------

⚠️ The token should be passed in request's `Authorization` header.

```
Authorization: Bearer <token>
```

## Prerequisites

You need to have `docker` and `docker-compose` installed on your computer to run the service

## Run locally

1. Clone this repository
1. Run from root dir
1. Configure `.env` file

```
docker-compose up -d
```

By default the auth service will start on port `3000` but you can configure
the default value by setting the `APP_PORT` in `.env`


To stop the application run

```
docker-compose down
```

## JWT Secret

To generate tokens in auth service you need to provide env variable
`JWT_SECRET` in `.env`. It should be a string value.



