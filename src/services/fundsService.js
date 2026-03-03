const { v4: uuidv4 } = require('uuid');
const dynamoRepository = require('../repositories/dynamoRepository');
const notificationService = require('./notificationService');
const { FUNDS, TRANSACTION_TYPE, INITIAL_BALANCE } = require('../utils/constants');

class FundsService {
    constructor() {
        this.usersTable = process.env.DYNAMODB_TABLE_USERS || 'UsersTable';
        this.txTable = process.env.DYNAMODB_TABLE_TRANSACTIONS || 'TransactionsTable';
    }

    /**
     * Get all available funds
     */
    async getAllFunds() {
        return FUNDS;
    }

    /**
     * Get User data (and create if not exists for the demo)
     */
    async getUser(userId, userEmail = 'test@example.com', userPhone = '+573000000000', userPreference = 'EMAIL') {
        let user = await dynamoRepository.get(this.usersTable, { PK: `USER#${userId}`, SK: 'USER' });

        // Auto-init for test purpose if user doesn't exist
        if (!user) {
            user = {
                PK: `USER#${userId}`,
                SK: 'USER',
                balance: INITIAL_BALANCE,
                email: userEmail,
                phone: userPhone,
                notificationPreference: userPreference,
            };
            await dynamoRepository.put(this.usersTable, user);
        }
        return user;
    }

    /**
     * Subscribe to a fund
     */
    async subscribe(userId, fundId) {
        const fund = FUNDS.find(f => f.id === fundId);
        if (!fund) throw new Error('FUND_NOT_FOUND');

        const user = await this.getUser(userId);

        // Business Rule: Check balance
        if (user.balance < fund.minAmount) {
            const error = new Error(`No tiene saldo disponible para vincularse al fondo ${fund.name}`);
            error.code = 'INSUFFICIENT_BALANCE';
            throw error;
        }

        // Prepare updates
        const newBalance = user.balance - fund.minAmount;
        const txId = uuidv4();
        const timestamp = new Date().toISOString();

        // 1. Create Transaction item
        const transaction = {
            PK: `USER#${userId}`,
            SK: `TX#${timestamp}#${txId}`,
            transactionId: txId,
            fundId: fund.id,
            fundName: fund.name,
            type: TRANSACTION_TYPE.OPEN,
            amount: fund.minAmount,
            date: timestamp,
        };

        // Store Transaction
        await dynamoRepository.put(this.txTable, transaction);

        // 2. Update User balance
        await dynamoRepository.update(
            this.usersTable,
            { PK: `USER#${userId}`, SK: 'USER' },
            'SET balance = :balance',
            { ':balance': newBalance }
        );

        // 3. Notify user
        const notifyMsg = `Suscripcio n exitosa al fondo ${fund.name}. Valor vinculacio n: $${fund.minAmount}. Su nuevo saldo es $${newBalance}.`;
        await notificationService.notify(user.notificationPreference, user, notifyMsg);

        return { transactionId: txId, newBalance, fundName: fund.name };
    }

    /**
     * Cancel a fund
     */
    async cancel(userId, fundId) {
        const fund = FUNDS.find(f => f.id === fundId);
        if (!fund) throw new Error('FUND_NOT_FOUND');

        const user = await this.getUser(userId);

        // In a real scenario, check if the user is actually subscribed.
        // Assuming return of minimum vinculation value for the demo.
        const newBalance = user.balance + fund.minAmount;
        const txId = uuidv4();
        const timestamp = new Date().toISOString();

        const transaction = {
            PK: `USER#${userId}`,
            SK: `TX#${timestamp}#${txId}`,
            transactionId: txId,
            fundId: fund.id,
            fundName: fund.name,
            type: TRANSACTION_TYPE.CANCEL,
            amount: fund.minAmount,
            date: timestamp,
        };

        await dynamoRepository.put(this.txTable, transaction);
        await dynamoRepository.update(
            this.usersTable,
            { PK: `USER#${userId}`, SK: 'USER' },
            'SET balance = :balance',
            { ':balance': newBalance }
        );

        return { transactionId: txId, newBalance, fundName: fund.name };
    }

    /**
     * Get Transactions History
     */
    async getTransactions(userId) {
        const items = await dynamoRepository.query(
            this.txTable,
            'PK = :pk AND begins_with(SK, :sk)',
            { ':pk': `USER#${userId}`, ':sk': 'TX#' }
        );
        return items.sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending
    }
}

module.exports = new FundsService();
