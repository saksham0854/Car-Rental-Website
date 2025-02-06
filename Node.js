const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating tokens

const app = express();
app.use(express.json());

// Simulate a user database (replace with real DB queries)
const users = [{ email: 'user@example.com', id: 1 }];

app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    // Check if the user exists
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ success: false, message: 'Email not found.' });
    }

    // Generate a token (in a real-world app, save this token to the database)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Generate a reset link (replace with actual frontend URL)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send email (using Nodemailer)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-password' // Replace with your email password
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please click the link below to reset your password: \n\n ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error sending email.' });
        }
        res.status(200).json({ success: true, message: 'Password reset email sent.' });
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
