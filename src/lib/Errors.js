const httpStatusCodes = {
  FORBIDDEN: 403,
  SERVICE_UNAVAILABLE: 503,
  UNPROCESSABLE: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const errors = {
  'monthly-free-usage-exceeded': {
    status: httpStatusCodes.UNPROCESSABLE,
    message: 'Please upgrade your plan',
  },
  'external-error': {
    status: httpStatusCodes.SERVICE_UNAVAILABLE,
    message: 'Service Unavailable',
  },
  'invalid-auth-credentials': {
    status: httpStatusCodes.FORBIDDEN,
    message: 'Auth failed',
  },
};

const handleError = (err) => {
  if (errors[err]) {
    const { status, message } = errors[err];
    return {
      status,
      body: {
        success: false,
        message,
      },
    };
  }
  return {
    status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    body: {
      success: false,
      message: 'internal error',
    },
  };
};

module.exports = {
  handleError,
};
