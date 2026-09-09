const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// 🔥 SUPABASE CONFIGURATION
// =====================================================
onst SUPABASE_URL = 'https://nvrsiiwkdsqgtsaokubn.supabase.co';  // ← YOUR URL
const SUPABASE_KEY = 'sb_publishable_yiBiiJvpawWZSw1pzVBPLg_gU3-JNJp';  // ← YOUR KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'THE SHOE DOC API' });
});

// ============================================================
// AFFILIATE ENDPOINTS
// ============================================================

// Get all affiliates
app.get('/api/affiliates', async (req, res) => {
    const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Register new affiliate
app.post('/api/affiliates/register', async (req, res) => {
    const { name, email, phone, password, bank_name, account_number, referral_code } = req.body;
    
    // Check if email exists
    const { data: existing, error: checkError } = await supabase
        .from('affiliates')
        .select('email')
        .eq('email', email)
        .single();
    
    if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Generate affiliate code
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const affiliateCode = prefix + random;
    
    // Check referral code
    let referredBy = null;
    if (referral_code) {
        const { data: referrer } = await supabase
            .from('affiliates')
            .select('id')
            .eq('affiliate_code', referral_code.toUpperCase())
            .single();
        if (referrer) referredBy = referrer.id;
    }
    
    // Insert new affiliate
    const { data, error } = await supabase
        .from('affiliates')
        .insert({
            id: Date.now(),
            name,
            email,
            phone,
            password,
            affiliate_code: affiliateCode,
            referred_by: referredBy,
            bank_name: bankName,
            account_number: accountNumber,
            status: 'active'
        })
        .select()
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    
    // If referred, add to downline
    if (referredBy) {
        const { data: referrer } = await supabase
            .from('affiliates')
            .select('downline')
            .eq('id', referredBy)
            .single();
        
        if (referrer) {
            const downline = referrer.downline || [];
            downline.push(data.id);
            await supabase
                .from('affiliates')
                .update({ downline })
                .eq('id', referredBy);
        }
    }
    
    res.json({ success: true, affiliate: data });
});

// Get affiliate by code
app.get('/api/affiliates/code/:code', async (req, res) => {
    const { code } = req.params;
    const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('affiliate_code', code.toUpperCase())
        .single();
    
    if (error) return res.status(404).json({ error: 'Affiliate not found' });
    res.json(data);
});

// ============================================================
// BOOKING ENDPOINTS
// ============================================================

// Create booking
app.post('/api/bookings', async (req, res) => {
    const booking = req.body;
    booking.id = Date.now();
    booking.created_at = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    
    // Update affiliate earnings if affiliate code exists
    if (booking.affiliate_code) {
        const { data: affiliate } = await supabase
            .from('affiliates')
            .select('*')
            .eq('affiliate_code', booking.affiliate_code)
            .single();
        
        if (affiliate) {
            const commission = (booking.total_pairs || 1) * 20;
            await supabase
                .from('affiliates')
                .update({
                    balance: (affiliate.balance || 0) + commission,
                    total_earned: (affiliate.total_earned || 0) + commission,
                    referrals: [...(affiliate.referrals || []), booking.customer]
                })
                .eq('id', affiliate.id);
        }
    }
    
    res.json({ success: true, booking: data });
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update booking status
app.put('/api/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', parseInt(id))
        .select()
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, booking: data });
});

// ============================================================
// CUSTOMER ENDPOINTS
// ============================================================

// Register customer
app.post('/api/customers/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    
    const { data, error } = await supabase
        .from('customers')
        .insert({ id: Date.now(), name, email, phone, password })
        .select()
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, customer: data });
});

// Get customer by email
app.get('/api/customers/:email', async (req, res) => {
    const { email } = req.params;
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();
    
    if (error) return res.status(404).json({ error: 'Customer not found' });
    res.json(data);
});

// ============================================================
// REWARDS ENDPOINTS
// ============================================================

// Get rewards by email
app.get('/api/rewards/:email', async (req, res) => {
    const { email } = req.params;
    const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('email', email)
        .single();
    
    if (error && error.code === 'PGRST116') {
        // Create default rewards for new user
        const { data: newData, error: insertError } = await supabase
            .from('rewards')
            .insert({ email, points: 0, total_earned: 0, used: 0 })
            .select()
            .single();
        
        if (insertError) return res.status(500).json({ error: insertError.message });
        return res.json(newData);
    }
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update rewards
app.post('/api/rewards/update', async (req, res) => {
    const { email, points_earned } = req.body;
    
    // Get current rewards
    const { data: current, error: fetchError } = await supabase
        .from('rewards')
        .select('*')
        .eq('email', email)
        .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
        return res.status(500).json({ error: fetchError.message });
    }
    
    if (!current) {
        // Create new
        const { data, error } = await supabase
            .from('rewards')
            .insert({ email, points: points_earned, total_earned: points_earned, used: 0 })
            .select()
            .single();
        
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    }
    
    // Update existing
    const { data, error } = await supabase
        .from('rewards')
        .update({
            points: (current.points || 0) + points_earned,
            total_earned: (current.total_earned || 0) + points_earned,
            updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: Supabase`);
});
