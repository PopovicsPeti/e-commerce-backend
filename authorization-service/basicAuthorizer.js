const { Buffer } = require('buffer');

module.exports.basicAuthorizer = async (event) => {
  if (!event.headers || !event.headers.Authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  const authHeader = event.headers.Authorization;
  const encodedCreds = authHeader.split(' ')[1];
  const buffer = Buffer.from(encodedCreds, 'base64');
  const [username, password] = buffer.toString('utf-8').split(':');

  if (process.env[username] && process.env[username] === password) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Authorized' }),
    };
  }

  return {
    data: event,
    statusCode: 403,
    body: JSON.stringify({ message: 'Forbidden' }),
  };
};
