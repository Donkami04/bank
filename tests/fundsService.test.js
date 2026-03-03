const fundsService = require('../src/services/fundsService');
const dynamoRepository = require('../src/repositories/dynamoRepository');
const notificationService = require('../src/services/notificationService');
const { FUNDS, INITIAL_BALANCE } = require('../src/utils/constants');

// Mock Dependencies
jest.mock('../src/repositories/dynamoRepository');
jest.mock('../src/services/notificationService');

describe('FundsService Unit Tests', () => {
    const userId = 'user-123';
    const mockUser = {
        PK: `USER#${userId}`,
        SK: 'USER',
        balance: INITIAL_BALANCE,
        email: 'test@example.com',
        phone: '+573000000000',
        notificationPreference: 'EMAIL',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return all available funds', async () => {
        const res = await fundsService.getAllFunds();
        expect(res).toEqual(FUNDS);
        expect(res.length).toBe(5);
    });

    test('should subscribe from a fund with sufficient balance', async () => {
        const fundId = '3'; // DEUDAPRIVADA (50.000)
        const fund = FUNDS.find(f => f.id === fundId);

        // Mock user retrieval
        dynamoRepository.get.mockResolvedValue(mockUser);
        dynamoRepository.put.mockResolvedValue({});
        dynamoRepository.update.mockResolvedValue({});
        notificationService.notify.mockResolvedValue({});

        const result = await fundsService.subscribe(userId, fundId);

        expect(result.fundName).toBe(fund.name);
        expect(result.newBalance).toBe(INITIAL_BALANCE - fund.minAmount);
        expect(dynamoRepository.put).toHaveBeenCalled();
        expect(dynamoRepository.update).toHaveBeenCalled();
        expect(notificationService.notify).toHaveBeenCalled();
    });

    test('should fail subscription with insufficient balance', async () => {
        const fundId = '4'; // FDO-ACCIONES (250.000)
        const poorUser = { ...mockUser, balance: 10000 };

        dynamoRepository.get.mockResolvedValue(poorUser);

        await expect(fundsService.subscribe(userId, fundId)).rejects.toThrow(
            `No tiene saldo disponible para vincularse al fondo FDO-ACCIONES`
        );
    });

    test('should cancel subscription and return balance', async () => {
        const fundId = '1'; // FPV_BTG_PACTUAL_RECAUDADORA (75.000)
        const userWithSub = { ...mockUser, balance: 425000 };

        dynamoRepository.get.mockResolvedValue(userWithSub);
        dynamoRepository.put.mockResolvedValue({});
        dynamoRepository.update.mockResolvedValue({});

        const result = await fundsService.cancel(userId, fundId);

        expect(result.newBalance).toBe(500000);
        expect(dynamoRepository.update).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Object),
            expect.any(String),
            { ':balance': 500000 }
        );
    });
});
