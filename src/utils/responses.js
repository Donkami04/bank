/**
 * Success Response Formatter
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response payload
 * @param {string} message - Optional message
 */
exports.success = (res, statusCode = 200, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

/**
 * Error Response Formatter
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error code/message
 * @param {string} message - Detailed message
 */
exports.error = (res, statusCode = 400, error = 'BAD_REQUEST', message = 'Something went wrong') => {
    return res.status(statusCode).json({
        status: 'error',
        error,
        message,
    });
};
