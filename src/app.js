const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fundsService = require('./services/fundsService');
const { success } = require('./utils/responses');
const errorHandler = require('./middleware/errorHandler');

const app = express();
// TEST
// Security and Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Public Route: Register
app.post('/register', async (req, res, next) => {
    try {
        const { email, username, phone, notificationPreference } = req.body;
        if (!email || !username) {
            return res.status(400).json({ status: 'error', error: 'MISSING_FIELDS', message: 'Email y Nombre son obligatorios' });
        }

        // Generate a unique ID (simulating a Cognito Sub or internal ID)
        const userId = email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

        const data = await fundsService.getUser(userId, email, phone, notificationPreference);

        // Return user data + a mock "token" for the frontend to store
        return success(res, 201, {
            user: {
                id: userId,
                email: data.email,
                username: username,
                notificationPreference: data.notificationPreference,
            },
            token: `mock-jwt-token-for-${userId}` // Simulated JWT
        }, 'Registro exitoso');
    } catch (e) { next(e); }
});

// Auth Extraction Middleware (Lambda-Cognito simulated or from headers)
app.use((req, res, next) => {
    // 1. Skip auth for Health Check
    if (req.path === '/health') return next();

    // 2. Extract Authorization Header or User ID
    const authHeader = req.headers['authorization'];
    const testId = req.headers['x-user-id'];

    let authId = testId;

    // Simulate JWT validation
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        authId = token.replace('mock-jwt-token-for-', '');
    }

    if (!authId) {
        return res.status(401).json({ status: 'error', error: 'UNAUTHORIZED', message: 'Se requiere autenticación' });
    }

    req.user = { id: authId };
    next();
});

// Routes
app.get('/health', (req, res) => res.send('OK'));

// Get all Funds
app.get('/funds', async (req, res, next) => {
    try {
        const data = await fundsService.getAllFunds();
        return success(res, 200, data, 'List of available funds');
    } catch (e) { next(e); }
});

// Get My Balance
app.get('/balance', async (req, res, next) => {
    try {
        const data = await fundsService.getUser(req.user.id);
        return success(res, 200, { balance: data.balance }, 'User current balance');
    } catch (e) { next(e); }
});



// Subscribe to a fund
app.post('/funds/:id/subscribe', async (req, res, next) => {
    try {
        const data = await fundsService.subscribe(req.user.id, req.params.id);
        return success(res, 201, data, 'Suscripcio n exitosa');
    } catch (e) { next(e); }
});

// Cancel subscription
app.post('/funds/:id/cancel', async (req, res, next) => {
    try {
        const data = await fundsService.cancel(req.user.id, req.params.id);
        return success(res, 200, data, 'Cancelacio n exitosa');
    } catch (e) { next(e); }
});

// View transactions history
app.get('/transactions', async (req, res, next) => {
    try {
        const data = await fundsService.getTransactions(req.user.id);
        return success(res, 200, data, 'Historial de transacciones');
    } catch (e) { next(e); }
});

// Error handling initialization
app.use(errorHandler);

module.exports = app;
