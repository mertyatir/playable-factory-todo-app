import jwt from "jsonwebtoken";

function authenticate(req, res, next) {
  // Get the auth header value
  const authHeader = req.headers["authorization"];
  // Check if authHeader is not null
  if (authHeader) {
    // The auth header is in format: Bearer <token>
    const token = authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  } else {
    // If there is no authHeader, return an error
    return res.sendStatus(401);
  }
}

export default authenticate;
