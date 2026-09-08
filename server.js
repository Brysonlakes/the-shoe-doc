const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 🔥 REPLACE WITH YOUR SMTP CREDENTIALS
// =====================================================
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465;
const SMTP_SECURE = true;
const SMTP_USER = 'theshoedoc3@gmail.com';
const SMTP_PASSWORD = 'uuvcjafqebflddbg';
const SENDER_EMAIL = 'theshoedoc3@gmail.com';
const SENDER_NAME = 'THE SHOE DOC';
// =====================================================

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
});

// =====================================================
// ALL EMAIL TEMPLATES
// =====================================================
const TEMPLATES = {
    signup_confirmation: {
        subject: '✅ Welcome to THE SHOE DOC!',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Hi ${data.name}, 👋</h2>
                    <p>Welcome to THE SHOE DOC! Your account has been created successfully.</p>
                    <p style="margin-top:20px;">You can now log in and start booking our premium shoe cleaning services.</p>
                    <p style="margin-top:20px;">📍 <strong>Visit us at:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },

reward_update: {
    subject: '🎉 Points Reward Update – THE SHOE DOC',
    html: (data) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
            <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
            </div>
            <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                <h2>Points Update, ${data.name}! 🎉</h2>
                <p>You've earned points on your recent booking.</p>
                <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                    <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Points Earned</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">+${data.points_earned}</td></tr>
                    <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Total Points</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.total_points}</td></tr>
                    <tr><td style="padding:8px;"><strong>Points Value</strong></td><td style="padding:8px;">R${(data.total_points / 10 * 5).toFixed(2)} discount</td></tr>
                </table>
                <p style="margin-top:20px;">💡 <strong>10 points = R5 discount</strong> on your next booking!</p>
                <p>📍 <strong>Visit us at:</strong> 123 Oxford Street, East London, 5201</p>
                <p>📞 Contact us: 082-590-2968</p>
                <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
            </div>
        </div>
    `
},

    affiliate_confirmation: {
        subject: '🎉 Welcome to THE SHOE DOC Affiliate Program!',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Welcome to the Affiliate Program, ${data.name}! 🎉</h2>
                    <p>Your affiliate account has been approved! Start earning R20 per pair you refer.</p>
                    <div style="background:#f9f9f9;padding:16px;border-radius:10px;margin:20px 0;border-left:4px solid #D4AF37;">
                        <p style="margin:0;"><strong>Your Unique Affiliate Code:</strong></p>
                        <p style="margin:4px 0;font-size:1.5rem;font-weight:bold;color:#B8860B;letter-spacing:2px;">${data.affiliate_code}</p>
                    </div>
                    <p>Share this code with customers. When they book using your code, you earn!</p>
                    <p><strong>Commission:</strong> R20 per pair referred</p>
                    <p><strong>Minimum Payout:</strong> R200</p>
                    <p style="margin-top:20px;">📍 <strong>Visit your dashboard:</strong> <a href="https://brysonlakes.github.io/the-shoe-doc/affiliate-dashboard.html" style="color:#D4AF37;">Affiliate Dashboard</a></p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },


affiliate_earnings: {
    subject: '💰 New Affiliate Earnings Report',
    html: (data) => `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
            <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
            </div>
            <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                <h2>New Earnings Update, ${data.name}! 💰</h2>
                <p>You've earned commission from a new booking!</p>
                <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                    <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Commission Type</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.type || 'Direct Referral'}</td></tr>
                    <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Amount Earned</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">R${data.amount}</td></tr>
                    <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Total Balance</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">R${data.balance}</td></tr>
                    <tr><td style="padding:8px;"><strong>Referred Customer</strong></td><td style="padding:8px;">${data.customer}</td></tr>
                </table>
                <p style="margin-top:20px;">Keep sharing your affiliate code to earn more!</p>
                <p><strong>Your Affiliate Code:</strong> <span style="color:#B8860B;font-weight:bold;font-size:1.1rem;">${data.affiliate_code}</span></p>
                <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
            </div>
        </div>
    `
},


affiliate_payment: {
        subject: '💰 Affiliate Payment Confirmation',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Payment Confirmation, ${data.name}! 💰</h2>
                    <p>Your affiliate commission payment has been processed.</p>
                    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Amount Paid</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">R${data.amount}</td></tr>
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Remaining Balance</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">R${data.balance}</td></tr>
                        <tr><td style="padding:8px;"><strong>Reference</strong></td><td style="padding:8px;">${data.note || 'Affiliate commission payment'}</td></tr>
                    </table>
                    <p style="margin-top:20px;">The payment has been sent to your bank account.</p>
                    <p><strong>Your Affiliate Code:</strong> <span style="color:#B8860B;font-weight:bold;font-size:1.1rem;">${data.affiliate_code}</span></p>
                    <p style="margin-top:20px;">Keep sharing your code to earn more!</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },
    payment_confirmed: {
        subject: '✅ Payment Confirmed – THE SHOE DOC',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Payment Confirmed! 💳</h2>
                    <p>Dear ${data.customer},</p>
                    <p>Your payment of <strong>R${data.amount}</strong> for the <strong>${data.service}</strong> service has been confirmed.</p>
                    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Service</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.service}</td></tr>
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.date}</td></tr>
                        <tr><td style="padding:8px;"><strong>Time</strong></td><td style="padding:8px;">${data.time}</td></tr>
                    </table>
                    <p style="margin-top:20px;">📍 <strong>Visit us at:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },
    booking_confirmed: {
        subject: '📋 Booking Confirmed – THE SHOE DOC',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Booking Confirmed! 📋</h2>
                    <p>Dear ${data.customer},</p>
                    <p>Your booking for <strong>${data.service}</strong> has been confirmed.</p>
                    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Service</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.service}</td></tr>
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.date}</td></tr>
                        <tr><td style="padding:8px;"><strong>Time</strong></td><td style="padding:8px;">${data.time}</td></tr>
                    </table>
                    <p style="margin-top:20px;">📍 <strong>Visit us at:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <p style="margin-top:20px;">We look forward to serving you!</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },
    booking_completed: {
        subject: '✔️ Service Completed – THE SHOE DOC',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Service Completed! ✔️</h2>
                    <p>Dear ${data.customer},</p>
                    <p>Your <strong>${data.service}</strong> service has been completed successfully.</p>
                    <p style="margin-top:20px;">Your shoes are ready for collection at our shop.</p>
                    <p>📍 <strong>Visit us at:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <p style="margin-top:20px;">🔄 <strong>Ready for another clean?</strong> Book your next service today!</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },
    new_booking: {
        subject: '📦 New Booking Confirmed!',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>New Booking Confirmed! 📦</h2>
                    <p>Dear ${data.customer}, your booking has been confirmed.</p>
                    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Service</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.service}</td></tr>
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.date}</td></tr>
                        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Time</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${data.time}</td></tr>
                        <tr><td style="padding:8px;"><strong>Total</strong></td><td style="padding:8px;">R${data.total}</td></tr>
                    </table>
                    <p style="margin-top:20px;">📍 <strong>Visit us at:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },
    booking_ready: {
        subject: '👟 Your Shoes Are Ready for Delivery!',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Your Shoes Are Ready! 👟</h2>
                    <p>Dear ${data.customer}, your shoes have been cleaned and are ready for delivery.</p>
                    <p style="margin-top:20px;">📍 <strong>Pickup Address:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <p style="margin-top:20px;">Please bring your invoice when collecting.</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    },
    shoe_delivered: {
        subject: '✅ Your Shoes Have Been Delivered!',
        html: (data) => `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f4f4f4;border-radius:16px;">
                <div style="background:#0A0A0A;padding:20px;border-radius:16px 16px 0 0;text-align:center;border-bottom:4px solid #D4AF37;">
                    <h1 style="color:#D4AF37;font-family:Georgia,serif;font-size:1.8rem;">THE SHOE DOC</h1>
                </div>
                <div style="background:white;padding:30px 28px;border-radius:0 0 16px 16px;color:#222;">
                    <h2>Shoes Delivered Successfully! ✅</h2>
                    <p>Dear ${data.customer}, your shoes have been delivered.</p>
                    <p style="margin-top:20px;">We hope you love them! If you're happy with the service, please consider leaving a review.</p>
                    <p style="margin-top:20px;">🔄 <strong>Ready for another clean?</strong> Book your next service today!</p>
                    <p>📍 <strong>Visit us at:</strong> 40 st georges road, East London, 5201</p>
                    <p>📞 Contact us: 082-590-2968</p>
                    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:0.8rem;">&copy; 2026 THE SHOE DOC · East London, South Africa</div>
                </div>
            </div>
        `
    }
};

// =====================================================
// EMAIL SENDING ENDPOINT
// =====================================================
app.post('/send-email', async (req, res) => {
    const { to, template, data } = req.body;
    if (!to || !template || !data) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const templateData = TEMPLATES[template];
    if (!templateData) {
        return res.status(400).json({ success: false, error: 'Invalid template' });
    }
    try {
        const info = await transporter.sendMail({
            from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
            to: to,
            subject: templateData.subject,
            html: templateData.html(data)
        });
        console.log(`✅ Email sent to ${to} (${template})`);
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'THE SHOE DOC Email Server' });
});

// =====================================================
// START SERVER
// =====================================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Email server running on http://localhost:${PORT}`);
    console.log(`📧 Sending emails via ${SMTP_HOST}`);
});
