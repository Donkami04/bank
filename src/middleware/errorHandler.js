const { error } = require('../utils/responses');

/**
 * Universal Error Handler Middleware
 */
module.exports = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    if (err.code === 'INSUFFICIENT_BALANCE') {
        return error(res, 400, 'INSUFFICIENT_BALANCE', err.message);
    }

    if (err.message === 'FUND_NOT_FOUND') {
        return error(res, 404, 'FUND_NOT_FOUND', 'El fondo especificado no existe.');
    }

    // Final fallback
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    return error(res, 500, 'INTERNAL_SERVER_ERROR', message);
};

/**
 * Universal Error Handler Middleware
 */
module.exports = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    if (err.code === 'INSUFFICIENT_BALANCE') {
        return error(res, 400, 'INSUFFICIENT_BALANCE', err.message);
    }

    if (err.message === 'FUND_NOT_FOUND') {
        return error(res, 404, 'FUND_NOT_FOUND', 'El fondo especificado no existe.');
    }

    // Final fallback
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    return error(res, 500, 'INTERNAL_SERVER_ERROR', message);
};

/**
 * Universal Error Handler Middleware
 */
module.exports = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    if (err.code === 'INSUFFICIENT_BALANCE') {
        return error(res, 400, 'INSUFFICIENT_BALANCE', err.message);
    }

    if (err.message === 'FUND_NOT_FOUND') {
        return error(res, 404, 'FUND_NOT_FOUND', 'El fondo especificado no existe.');
    }

    // Final fallback
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    return error(res, 500, 'INTERNAL_SERVER_ERROR', message);
};
