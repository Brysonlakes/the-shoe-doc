
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// 🔥 RESEND API CONFIGURATION
// =====================================================
const RESEND_API_KEY = process.env.RESEND_API_KEY;
console.log('🔑 API Key loaded:', RESEND_API_KEY ? '✅ Yes' : '❌ No');
const SENDER_EMAIL = 'onboarding@resend.dev';  // Resend's test domain
const SENDER_NAME = 'THE SHOE DOC';
// =====================================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'THE SHOE DOC Email Server' });
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    const { to, template, data } = req.body;
    
    if (!to || !template) {
        return res.status(400).json({ error: 'Missing required fields: to, template' });
    }

    // ============================================================
    // EMAIL TEMPLATES
    // ============================================================
    const templates = {
        signup_confirmation: {
            subject: '✅ Booking Confirmed - THE SHOE DOC',
            html: `
                <h2>Hello ${data.name || 'Customer'},</h2>
                <p>Your booking has been <strong>confirmed</strong>!</p>
                <p><strong>Service:</strong> ${data.service || 'Shoe Cleaning'}</p>
                <p><strong>Date:</strong> ${data.date || 'N/A'}</p>
                <p><strong>Time:</strong> ${data.time || 'N/A'}</p>
                <p><strong>Total:</strong> R${data.total || '0'}</p>
                <br>
                <p>Thank you for choosing THE SHOE DOC!</p>
                <p>📍 123 Oxford Street, East London</p>
                <p>📞 082-590-2968</p>
            `
        },
        new_booking: {
            subject: '📦 New Booking Received - THE SHOE DOC',
            html: `
                <h2>New Booking Alert!</h2>
                <p><strong>Customer:</strong> ${data.customer || 'N/A'}</p>
                <p><strong>Service:</strong> ${data.service || 'N/A'}</p>
                <p><strong>Date:</strong> ${data.date || 'N/A'}</p>
                <p><strong>Time:</strong> ${data.time || 'N/A'}</p>
                <p><strong>Total:</strong> R${data.total || '0'}</p>
                <br>
                <p>Log in to the admin panel to manage this booking.</p>
            `
        },
        payment_confirmed: {
            subject: '💰 Payment Confirmed - THE SHOE DOC',
            html: `
                <h2>Hello ${data.customer || 'Customer'},</h2>
                <p>Your payment of <strong>R${data.amount || '0'}</strong> has been confirmed!</p>
                <p>Your booking for <strong>${data.service || 'Shoe Cleaning'}</strong> on <strong>${data.date || 'N/A'}</strong> is now confirmed.</p>
                <br>
                <p>Thank you for choosing THE SHOE DOC!</p>
            `
        },
        booking_confirmed: {
            subject: '✅ Booking Confirmed - THE SHOE DOC',
            html: `
                <h2>Hello ${data.customer || 'Customer'},</h2>
                <p>Your booking has been <strong>confirmed</strong>!</p>
                <p><strong>Service:</strong> ${data.service || 'Shoe Cleaning'}</p>
                <p><strong>Date:</strong> ${data.date || 'N/A'}</p>
                <p><strong>Time:</strong> ${data.time || 'N/A'}</p>
                <br>
                <p>Thank you for choosing THE SHOE DOC!</p>
            `
        },
        booking_completed: {
            subject: '✔️ Service Completed - THE SHOE DOC',
            html: `
                <h2>Hello ${data.customer || 'Customer'},</h2>
                <p>Your <strong>${data.service || 'Shoe Cleaning'}</strong> service has been <strong>completed</strong>!</p>
                <p>Your shoes are ready for pickup.</p>
                <br>
                <p>Thank you for choosing THE SHOE DOC!</p>
                <p>📍 123 Oxford Street, East London</p>
            `
        },
        booking_ready: {
            subject: '📦 Ready for Pickup - THE SHOE DOC',
            html: `
                <h2>Hello ${data.customer || 'Customer'},</h2>
                <p>Your shoes are <strong>ready for pickup</strong>!</p>
                <p>Come visit us at:</p>
                <p>📍 123 Oxford Street, East London</p>
                <p>📞 082-590-2968</p>
                <br>
                <p>Thank you for choosing THE SHOE DOC!</p>
            `
        },
        shoe_delivered: {
            subject: '📦 Shoes Delivered - THE SHOE DOC',
            html: `
                <h2>Hello ${data.customer || 'Customer'},</h2>
                <p>Your shoes have been <strong>delivered</strong>!</p>
                <p>Thank you for choosing THE SHOE DOC!</p>
                <br>
                <p>We hope to see you again soon!</p>
            `
        },
        affiliate_earnings: {
            subject: '💰 Affiliate Earnings - THE SHOE DOC',
            html: `
                <h2>Hello ${data.name || 'Affiliate'},</h2>
                <p>You've earned <strong>R${data.amount || '0'}</strong> from a referral!</p>
                <p><strong>Customer:</strong> ${data.customer || 'N/A'}</p>
                <p><strong>Type:</strong> ${data.type || 'Direct Referral'}</p>
                <p><strong>Current Balance:</strong> R${data.balance || '0'}</p>
                <br>
                <p>Keep sharing your affiliate code: <strong>${data.affiliate_code || 'N/A'}</strong></p>
                <p>Thank you for being part of THE SHOE DOC affiliate program!</p>
            `
        },
        affiliate_payment: {
            subject: '💰 Affiliate Payment - THE SHOE DOC',
            html: `
                <h2>Hello ${data.name || 'Affiliate'},</h2>
                <p>You've been paid <strong>R${data.amount || '0'}</strong>!</p>
                <p><strong>Note:</strong> ${data.note || 'Affiliate commission'}</p>
                <p><strong>New Balance:</strong> R${data.balance || '0'}</p>
                <br>
                <p>Thank you for being part of THE SHOE DOC affiliate program!</p>
            `
        },
        reward_update: {
            subject: '🏆 Reward Points Update - THE SHOE DOC',
            html: `
                <h2>Hello ${data.name || 'Customer'},</h2>
                <p>You've earned <strong>${data.points_earned || 0} reward points</strong>!</p>
                <p><strong>Total Points:</strong> ${data.total_points || 0}</p>
                <p>10 points = R5 discount on your next booking!</p>
                <br>
                <p>Thank you for choosing THE SHOE DOC!</p>
            `
        }
    };

    const templateData = templates[template];
    if (!templateData) {
        return res.status(400).json({ error: 'Invalid template' });
    }

    try {
        // ============================================================
        // SEND EMAIL VIA RESEND API
        // ============================================================
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
                to: [to],
                subject: templateData.subject,
                html: templateData.html
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log(`✅ Email sent to ${to} (${template})`);
            res.json({ success: true, message: result });
        } else {
            console.error('❌ Resend error:', result);
            res.status(response.status).json({ error: result });
        }
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Email server running on http://localhost:${PORT}`);
    console.log(`📧 Sending emails via Resend API`);
});
