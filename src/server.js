const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const winston = require('winston');
const swaggerDocumentV1 = require('./swagger-v1.json');
const routes = require('./routes');
const {
  MovieService,
  AuthService,
} = require('./services');
const {
  MovieRepository,
} = require('./db/repositories');
const {
  OmdbClient,
} = require('./clients');
const { Storage, Configuration: Config, Errors } = require('./lib');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const DB = require('./db/db');

require('dotenv').config();

const {
  JWT_SECRET,
  APP_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  OMDB_API_KEY,
  OMDB_API_BASEURL,
  APP_VERSION,
} = process.env;

const configs = {
  JWT_SECRET,
  APP_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  OMDB_API_KEY,
  OMDB_API_BASEURL,
  APP_VERSION,
};

Object.keys(configs).map((i) => {
  if (!configs[i]) {
    throw new Error(`Missing ${i} env var. Set it and restart the server`);
  }
  return i;
});

const Configuration = new Config(configs);
// logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'application' },
  transports: [
    new winston.transports.Console(),
  ],
});

const configureRepositories = (db) => {
  // create repositories
  // can be looped through the repository list
  const movieRepository = new MovieRepository(db);

  return {
    movieRepository,
  };
};

const configureServices = (repositories, clients) => {
  const services = {};
  const {
    movieRepository,
  } = repositories;
  const {
    omdbClient,
  } = clients;

  const movieServiceLogger = logger;
  movieServiceLogger.defaultMeta = 'movie-service';
  services.movieService = new MovieService({
    repositories: {
      movieRepository,
    },
    clients: {
      omdbClient,
    },
    logger: movieServiceLogger,
    config: Configuration,
  });

  const authServiceLogger = logger;
  authServiceLogger.defaultMeta = 'auth-service';
  services.authService = new AuthService({
    repositories: {},
    clients: {},
    logger: authServiceLogger,
    config: Configuration,
  });

  return services;
};

const run = async () => {
  const app = express();
  app.use(bodyParser.json());

  const options = {
    swaggerOptions: {
      validatorUrl: null,
    },
  };
  app.use(`/${APP_VERSION}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocumentV1, options));

  // get db instance
  const db = await new DB(DB_USER, DB_PASSWORD, DB_HOST, DB_NAME).getDB();

  // quick in-app cache to reduce api calls
  const storage = new Storage();

  // create repositories
  const repositories = configureRepositories(db);

  // create external api clients
  const omdbClient = new OmdbClient(OMDB_API_KEY, OMDB_API_BASEURL, storage);
  const clients = {
    omdbClient,
  };

  // create services
  const services = configureServices(repositories, clients);

  // handle errors
  app.use((error, _, res, __) => {
    logger.error(
      `Error processing request ${error}. See next message for details`,
    );
    logger.error(error);
    const {
      status,
      body,
    } = Errors.handleError(error.message);
    return res.status(status).json(body);
  });

  // generate routes
  Object.values(routes).forEach(({
    method,
    path,
    service,
    auth: shouldAuth,
  }) => {
    const [serviceName, func] = service.split('@');
    if (!services[serviceName]) {
      throw new Error(`service ${serviceName} not found`);
    }
    if (!services[serviceName][func]) {
      throw new Error(`method ${func} not found in ${serviceName}`);
    }

    if (shouldAuth) {
      app[method](`/${APP_VERSION}${path}`, AuthMiddleware, async (req, res, next) => {
        try {
          const response = await services[serviceName][func](req);
          res.json({
            success: true,
            data: response,
          });
        } catch (e) {
          next(e);
        }
      });
    } else {
      app[method](`/${APP_VERSION}${path}`, async (req, res, next) => {
        logger.info(req, `${method}: ${path}`);
        try {
          const response = await services[serviceName][func](req);
          res.json({
            success: true,
            data: response,
          });
        } catch (e) {
          next(e);
        }
      });
    }
  });

  app.listen(APP_PORT || 3000, () => {
    logger.info(`auth svc running at port ${APP_PORT || 3000}`);
  });
};

run().then();
