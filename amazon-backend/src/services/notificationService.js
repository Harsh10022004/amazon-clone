/**
 * Notification Service (BONUS FEATURE)
 * Mock email notification service for order confirmations
 */
class NotificationService {
  /**
   * Send order confirmation email (mock)
   * In production, integrate with SendGrid, AWS SES, etc.
   */
  static sendOrderConfirmation(email, orderId, totalAmount) {
    console.log('\n📧 ═══════════════════════════════════════════════════');
    console.log('   EMAIL NOTIFICATION (Mock)');
    console.log('═══════════════════════════════════════════════════');
    console.log(`To: ${email}`);
    console.log('Subject: Your Amazon Clone Order Confirmation');
    console.log('───────────────────────────────────────────────────');
    console.log('Dear Customer,');
    console.log('');
    console.log(`Your order #${orderId} has been confirmed!`);
    console.log(`Total Amount: $${totalAmount.toFixed(2)}`);
    console.log('');
    console.log('Thank you for shopping with us!');
    console.log('═══════════════════════════════════════════════════\n');
  }
}

module.exports = NotificationService;
