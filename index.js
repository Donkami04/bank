const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`BTG Pactual Funds API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
