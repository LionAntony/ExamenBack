
const boom = require('@hapi/boom');

function notFoundHandler(req, res) {
  const {
    output: { statusCode, payload }
  } = boom.notFound();
  console.log(boom.notFound())
  res.status(statusCode).json(payload);
}

module.exports = notFoundHandler;