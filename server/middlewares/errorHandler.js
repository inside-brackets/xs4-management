import asyncHandler from "express-async-handler";

export const NotFound = asyncHandler((req, res, next) => {
  res.status(404);
  throw new Error(`Route ${req.url} doesn't exist`);
});

export const handlerErrors = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "prod" ? null : err.stack,
  });
  next();
};
