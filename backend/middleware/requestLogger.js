// requestLogger.js
// Custom middleware that logs every request with method, path, status, and response time.
// Applied globally in server.js using app.use()

function requestLogger(req, res, next) {
  const startTime = Date.now(); // record when request started

  // res.on('finish') fires AFTER the response has been sent
  // This lets us capture the final status code
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${req.method}] ${req.path} ${res.statusCode} ${duration}ms`
    );
  });

  next(); // pass control to the next middleware/route
}

module.exports = requestLogger;
