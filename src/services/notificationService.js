const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { NOTIFICATION_PREFERENCE } = require('../utils/constants');

/**
 * Notification Service Wrapper for SES and SNS.
 */
class NotificationService {
    constructor() {
        this.sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });
        this.snsClient = new SNSClient({ region: process.env.AWS_REGION || 'us-east-1' });
        this.senderEmail = process.env.SES_SENDER_EMAIL || 'no-reply@btgpactual.com';
    }

    /**
     * Send notification based on user preference
     * @param {string} userPreference - EMAIL or SMS
     * @param {object} userData - User details (email, phone)
     * @param {string} message - Content
     */
    async notify(userPreference, userData, message) {
        if (userPreference === NOTIFICATION_PREFERENCE.EMAIL) {
            await this.sendEmail(userData.email, 'Fund Subscription Update', message);
        } else if (userPreference === NOTIFICATION_PREFERENCE.SMS) {
            await this.sendSMS(userData.phone, message);
        }
    }

    /**
     * Email using Amazon SES
     * @param {string} to 
     * @param {string} subject 
     * @param {string} body 
     */
    async sendEmail(to, subject, body) {
        const params = {
            Destination: { ToAddresses: [to] },
            Message: {
                Body: { Text: { Data: body } },
                Subject: { Data: subject },
            },
            Source: this.senderEmail,
        };
        try {
            await this.sesClient.send(new SendEmailCommand(params));
        } catch (e) {
            console.warn('SES Notification Failed: ', e.message);
            // In a real scenario, logs and failover should be here.
        }
    }

    /**
     * SMS using Amazon SNS
     * @param {string} phoneNumber 
     * @param {string} message 
     */
    async sendSMS(phoneNumber, message) {
        const params = {
            Message: message,
            PhoneNumber: phoneNumber,
        };
        try {
            await this.snsClient.send(new PublishCommand(params));
        } catch (e) {
            console.warn('SNS Notification Failed: ', e.message);
        }
    }
}

module.exports = new NotificationService();
