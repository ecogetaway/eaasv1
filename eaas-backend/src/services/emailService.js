// Mock email service for demo purposes
class EmailService {
  async sendWelcomeEmail(user, subscription) {
    console.log(`📧 [MOCK] Sending welcome email to ${user.email}`);
    console.log(`   Subject: Welcome to Energy-as-a-Service!`);
    console.log(`   Content: Hello ${user.name}, your subscription to ${subscription.plan_type} is now active.`);
    return { success: true, message: 'Email sent (mock)' };
  }

  async sendBillEmail(user, bill) {
    console.log(`📧 [MOCK] Sending bill email to ${user.email}`);
    console.log(`   Subject: Your EaaS Bill - ${bill.bill_id.substring(0, 8)}`);
    console.log(`   Content: Your bill of ₹${bill.total_amount} is ready for payment.`);
    return { success: true, message: 'Email sent (mock)' };
  }

  async sendPaymentConfirmationEmail(user, payment) {
    console.log(`📧 [MOCK] Sending payment confirmation to ${user.email}`);
    console.log(`   Subject: Payment Received - ${payment.transaction_id}`);
    console.log(`   Content: Your payment of ₹${payment.amount} has been received.`);
    return { success: true, message: 'Email sent (mock)' };
  }

  async sendTicketUpdateEmail(user, ticket, update) {
    console.log(`📧 [MOCK] Sending ticket update to ${user.email}`);
    console.log(`   Subject: Update on Ticket #${ticket.ticket_id.substring(0, 8)}`);
    console.log(`   Content: ${update.message}`);
    return { success: true, message: 'Email sent (mock)' };
  }
}

export default new EmailService();

