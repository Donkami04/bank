const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dotenv = require('dotenv');

dotenv.config();

/**
 * DynamoDB Repository Class
 * Handles basic CRUD operations for DynamoDB tables.
 */
class DynamoRepository {
    constructor() {
        this.client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    /**
     * Put an item into a table
     * @param {string} TableName 
     * @param {object} Item 
     */
    async put(TableName, Item) {
        const command = new PutCommand({ TableName, Item });
        return await this.docClient.send(command);
    }

    /**
     * Get an item by Key
     * @param {string} TableName 
     * @param {object} Key 
     */
    async get(TableName, Key) {
        const command = new GetCommand({ TableName, Key });
        const response = await this.docClient.send(command);
        return response.Item;
    }

    /**
     * Update an item attribute
     * @param {string} TableName 
     * @param {object} Key 
     * @param {string} UpdateExpression 
     * @param {object} ExpressionAttributeValues 
     * @param {string} ConditionExpression - Optional
     */
    async update(TableName, Key, UpdateExpression, ExpressionAttributeValues, ConditionExpression = null) {
        const command = new UpdateCommand({
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ConditionExpression,
            ReturnValues: 'ALL_NEW',
        });
        return await this.docClient.send(command);
    }

    /**
     * Query items using index or PK
     * @param {string} TableName 
     * @param {string} KeyConditionExpression 
     * @param {object} ExpressionAttributeValues 
     */
    async query(TableName, KeyConditionExpression, ExpressionAttributeValues) {
        const command = new QueryCommand({
            TableName,
            KeyConditionExpression,
            ExpressionAttributeValues,
        });
        const response = await this.docClient.send(command);
        return response.Items;
    }

    /**
     * Scan entire table
     * @param {string} TableName 
     */
    async scan(TableName) {
        const command = new ScanCommand({ TableName });
        const response = await this.docClient.send(command);
        return response.Items;
    }
}

module.exports = new DynamoRepository();
