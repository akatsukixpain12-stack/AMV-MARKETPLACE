"""
Email Notification Service
"""
from flask_mail import Mail, Message as EmailMessage
import os
from datetime import datetime

class EmailService:
    def __init__(self, app):
        # Configure Flask-Mail
        app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
        app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
        app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
        app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', '')
        app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
        app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@vortex.com')
        
        self.mail = Mail(app)
        self.app = app
    
    def send_order_notification_to_seller(self, seller_email, seller_name, order_data):
        """Send email to seller when they receive a new order"""
        try:
            msg = EmailMessage(
                subject=f"🎉 New Order Received - ₹{order_data['amount']}",
                recipients=[seller_email],
                html=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                        .order-details {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                        .detail-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
                        .button {{ display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                        .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 New Order Received!</h1>
                            <p>You have a new order on Vortex Marketplace</p>
                        </div>
                        <div class="content">
                            <p>Hi {seller_name},</p>
                            <p>Great news! You've received a new order for your gig.</p>
                            
                            <div class="order-details">
                                <h3>Order Details</h3>
                                <div class="detail-row">
                                    <span><strong>Gig:</strong></span>
                                    <span>{order_data['gig_title']}</span>
                                </div>
                                <div class="detail-row">
                                    <span><strong>Buyer:</strong></span>
                                    <span>{order_data['buyer_name']}</span>
                                </div>
                                <div class="detail-row">
                                    <span><strong>Amount:</strong></span>
                                    <span style="color: #10b981; font-weight: bold;">₹{order_data['amount']}</span>
                                </div>
                                <div class="detail-row">
                                    <span><strong>Delivery Time:</strong></span>
                                    <span>{order_data['delivery_days']} days</span>
                                </div>
                                <div class="detail-row">
                                    <span><strong>Order Date:</strong></span>
                                    <span>{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</span>
                                </div>
                            </div>
                            
                            {f'<p><strong>Buyer Message:</strong><br>{order_data.get("buyer_message", "No message")}</p>' if order_data.get('buyer_message') else ''}
                            
                            <p><strong>Next Steps:</strong></p>
                            <ol>
                                <li>Review the order requirements</li>
                                <li>Start working on the delivery</li>
                                <li>Communicate with the buyer if needed</li>
                                <li>Submit your delivery before the deadline</li>
                            </ol>
                            
                            <center>
                                <a href="http://localhost:3000/orders/{order_data['order_id']}" class="button">
                                    View Order Details
                                </a>
                            </center>
                            
                            <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                                💰 <strong>Payment Info:</strong> The buyer's payment (₹{order_data['amount']}) is held in escrow. You'll receive ₹{order_data['amount'] * 0.85:.2f} (after 15% platform fee) once the buyer confirms delivery.
                            </p>
                        </div>
                        <div class="footer">
                            <p>© 2026 Vortex Marketplace. All rights reserved.</p>
                            <p>This is an automated notification. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            )
            
            with self.app.app_context():
                self.mail.send(msg)
            
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            return False
    
    def send_delivery_notification_to_buyer(self, buyer_email, buyer_name, order_data):
        """Notify buyer when seller delivers"""
        try:
            msg = EmailMessage(
                subject=f"✅ Order Delivered - {order_data['gig_title']}",
                recipients=[buyer_email],
                html=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                        .button {{ display: inline-block; padding: 15px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Your Order is Ready!</h1>
                        </div>
                        <div class="content">
                            <p>Hi {buyer_name},</p>
                            <p>Good news! The seller has delivered your order.</p>
                            <p><strong>Gig:</strong> {order_data['gig_title']}</p>
                            <p><strong>AI Quality Score:</strong> {order_data.get('quality_score', 'N/A')}/10</p>
                            
                            <center>
                                <a href="http://localhost:3000/orders/{order_data['order_id']}" class="button">
                                    Review Delivery
                                </a>
                            </center>
                            
                            <p>Please review the delivery and confirm if you're satisfied. If you need revisions, you can request them through the order page.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            )
            
            with self.app.app_context():
                self.mail.send(msg)
            
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            return False
    
    def send_payment_released_notification(self, seller_email, seller_name, amount, order_data):
        """Notify seller when payment is released"""
        try:
            msg = EmailMessage(
                subject=f"💰 Payment Released - ₹{amount}",
                recipients=[seller_email],
                html=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                        .amount {{ font-size: 36px; color: #10b981; font-weight: bold; text-align: center; margin: 20px 0; }}
                        .button {{ display: inline-block; padding: 15px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>💰 Payment Released!</h1>
                        </div>
                        <div class="content">
                            <p>Hi {seller_name},</p>
                            <p>Congratulations! Your payment has been released.</p>
                            
                            <div class="amount">₹{amount}</div>
                            
                            <p><strong>Order:</strong> {order_data['gig_title']}</p>
                            <p>The funds are now available in your wallet. You can withdraw them anytime to your UPI or bank account.</p>
                            
                            <center>
                                <a href="http://localhost:3000/wallet" class="button">
                                    Go to Wallet
                                </a>
                            </center>
                        </div>
                    </div>
                </body>
                </html>
                """
            )
            
            with self.app.app_context():
                self.mail.send(msg)
            
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            return False
    
    def send_withdrawal_confirmation(self, seller_email, seller_name, withdrawal_data):
        """Confirm withdrawal request"""
        try:
            msg = EmailMessage(
                subject=f"Withdrawal Request Received - ₹{withdrawal_data['amount']}",
                recipients=[seller_email],
                html=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Withdrawal Request Received</h1>
                        </div>
                        <div class="content">
                            <p>Hi {seller_name},</p>
                            <p>We've received your withdrawal request.</p>
                            <p><strong>Amount:</strong> ₹{withdrawal_data['amount']}</p>
                            <p><strong>Method:</strong> {withdrawal_data['method'].upper()}</p>
                            <p><strong>Status:</strong> Processing</p>
                            <p>Your funds will be transferred within 1-3 business days.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
            )
            
            with self.app.app_context():
                self.mail.send(msg)
            
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            return False

# Global instance
email_service = None

def init_email_service(app):
    global email_service
    email_service = EmailService(app)
    return email_service
