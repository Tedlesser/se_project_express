const errorHandler = (err, req, res, next) => {
    console.error(err); 

    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error"; 

    res.status(err.statusCode).send({ message: err.message });
    res.status(statusCode).send({
      message: statusCode === 500 ? "An error occurred on the server" : message,
    });
};

module.exports = {
    errorHandler,
};