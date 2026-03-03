/**
 * Pre-defined Funds Metadata
 * As specified in the BTG Pactual assignment requirements.
 */
exports.FUNDS = [
    { id: '1', name: 'FPV_BTG_PACTUAL_RECAUDADORA', minAmount: 75000, category: 'FPV' },
    { id: '2', name: 'FPV_BTG_PACTUAL_ECOPETROL', minAmount: 125000, category: 'FPV' },
    { id: '3', name: 'DEUDAPRIVADA', minAmount: 50000, category: 'FIC' },
    { id: '4', name: 'FDO-ACCIONES', minAmount: 250000, category: 'FIC' },
    { id: '5', name: 'FPV_BTG_PACTUAL_DINAMICA', minAmount: 100000, category: 'FPV' },
];

/**
 * User Initial Settings
 */
exports.INITIAL_BALANCE = 500000;

/**
 * Notification Types
 */
exports.NOTIFICATION_PREFERENCE = {
    EMAIL: 'EMAIL',
    SMS: 'SMS',
};

/**
 * Transaction Types
 */
exports.TRANSACTION_TYPE = {
    OPEN: 'OPEN',
    CANCEL: 'CANCEL',
};
