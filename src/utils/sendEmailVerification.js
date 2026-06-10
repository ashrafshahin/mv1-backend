const nodemailer = require('nodemailer');

// For create Transport...
const createTransport = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
};

// for sending email verification...
const sendMail = async (to, subject, html) => {
    try {
        const transporter = createTransport();

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            html: html,

        });

        console.log('Email sent check...', info.messageId);
        return {
            success: true,
            messageId: info.messageId,
        }

    } catch (error) {
        console.error('verification email send error:...', error);
        return {
            success: false,
            message: 'Failed to send email verification...'
        }
    }
};


// Vendor Approval Email...
const sendVendorApproveEmail = async (email, shopName) => {
    const html = `<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:40px 20px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08)"><tr><td align="center" style="padding:50px 50px 20px"><img src="{{logoUrl}}" alt="{{platformName}}" width="70" style="display:block;margin:auto"></td></tr><tr><td align="center" style="padding:0 50px"><h1 style="margin:0;color:#111827;font-size:32px;font-weight:700;line-height:1.3">Verify Your Vendor Account</h1><p style="margin:16px 0 0;color:#6b7280;font-size:16px;line-height:1.8">Complete your email verification to continue your vendor onboarding process.</p></td></tr><tr><td style="padding:40px 50px 0"><p style="margin:0;color:#6b7280;font-size:14px;letter-spacing:1px;text-transform:uppercase">Vendor Registration</p><h2 style="margin:12px 0 8px;color:#111827;font-size:28px;font-weight:700">Welcome, {{shopName}} </h2><p style="margin:0 0 30px;color:#6b7280;font-size:16px">{{email}}</p><p style="margin:0;color:#4b5563;font-size:16px;line-height:1.9">Thank you for registering as a vendor on<strong>{{platformName}}</strong>.</p><p style="color:#4b5563;font-size:16px;line-height:1.9;margin-top:16px">We are excited to welcome your business to our marketplace. Before you can list products and start selling, please verify your email address by clicking the button below.</p></td></tr><tr><td align="center" style="padding:40px 50px"><a href="{{verificationLink}}" style="background:#2563eb;color:#fff;text-decoration:none;padding:16px 38px;border-radius:10px;display:inline-block;font-size:16px;font-weight:600">Verify Email Address</a></td></tr><tr><td style="padding:0 50px 30px"><div style="background:#f8fafc;border-radius:14px;padding:24px"><h3 style="margin:0 0 18px;color:#111827;font-size:18px">What happens next?</h3><p style="margin:0 0 12px;color:#4b5563;line-height:1.8">✓ Verify your email address</p><p style="margin:0 0 12px;color:#4b5563;line-height:1.8">✓ Our team reviews your vendor application</p><p style="margin:0;color:#4b5563;line-height:1.8">✓ Start listing products and selling on {{platformName}}</p></div></td></tr><tr><td style="padding:0 50px 30px"><div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:10px;padding:18px"><p style="margin:0;color:#1e40af;font-size:14px;line-height:1.8">🔒 For security reasons, this verification link may expire after a limited time. If you did not create this vendor account, you may safely ignore this email.</p></div></td></tr><tr><td style="padding:0 50px 20px"><p style="margin:0 0 10px;color:#6b7280;font-size:14px">If the button above does not work, copy and paste the following link into your browser:</p><p style="margin:0;color:#2563eb;word-break:break-all;font-size:13px;line-height:1.8">{{verificationLink}}</p></td></tr><tr><td style="padding:30px 50px 40px"><p style="margin:0;color:#4b5563;font-size:16px;line-height:1.8">Best regards,</p><p style="margin:8px 0 0;color:#111827;font-size:16px;font-weight:600">The {{platformName}} Team</p></td></tr><tr><td align="center" style="background:#f9fafb;padding:30px;border-top:1px solid #e5e7eb"><p style="margin:0;color:#111827;font-size:15px;font-weight:600">{{platformName}}</p><p style="margin:12px 0 0;color:#6b7280;font-size:13px;line-height:1.8">This is an automated email regarding your vendor account registration. Please do not reply directly to this message.</p><p style="margin:20px 0 0;color:#9ca3af;font-size:12px;line-height:1.8">© 2026 {{platformName}}. All Rights Reserved.<br>All trademarks, logos, and brand names are the property of their respective owners.</p></td></tr></table></td></tr></table></body>`

    await sendMail(email, 'Vendor Approval Mail...', html);
};

// Vendor rejection Mail...
const sendVendorRejectionEmail = (email, shopName, rejectReason) => {
    const html = `<body style="margin:0;padding:0;background:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 20px;background:#f4f7fb"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:20px;overflow:hidden"><tr><td align="center" style="padding:50px 50px 20px"><img src="{{logoUrl}}" alt="{{platformName}}" width="70"></td></tr><tr><td align="center" style="padding:0 50px"><h1 style="margin:0;color:#111827;font-size:30px;font-weight:700">Vendor Application Update</h1><p style="margin:16px 0 0;color:#6b7280;font-size:16px;line-height:1.8">We have completed the review of your vendor application.</p></td></tr><tr><td style="padding:40px 50px 0"><p style="margin:0;color:#6b7280;font-size:14px;letter-spacing:1px;text-transform:uppercase">Vendor Application Review</p><h2 style="margin:12px 0 8px;color:#111827;font-size:28px;font-weight:700">Hello, {{shopName}}</h2><p style="margin:0 0 30px;color:#6b7280;font-size:16px">{{email}}</p><p style="color:#4b5563;font-size:16px;line-height:1.9">Thank you for your interest in becoming a vendor on<strong>{{platformName}}</strong>.</p><p style="color:#4b5563;font-size:16px;line-height:1.9">After careful review, we are unable to approve your vendor application at this time.</p></td></tr><tr><td style="padding:20px 50px"><div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:10px;padding:18px"><h3 style="margin:0 0 10px;color:#b91c1c;font-size:16px">Reason for Rejection</h3><p style="margin:0;color:#7f1d1d;line-height:1.8">{{rejectionReason}}</p></div></td></tr><tr><td style="padding:0 50px"><p style="color:#4b5563;font-size:16px;line-height:1.9">You may review the information provided in your application and submit a new application in the future if the issues mentioned above are resolved.</p></td></tr><tr><td style="padding:30px 50px 40px"><p style="margin:0;color:#4b5563;font-size:16px">Best regards,</p><p style="margin:8px 0 0;color:#111827;font-size:16px;font-weight:600">The {{platformName}} Team</p></td></tr><tr><td align="center" style="background:#f9fafb;padding:30px;border-top:1px solid #e5e7eb"><p style="margin:0;color:#111827;font-size:15px;font-weight:600">{{platformName}}</p><p style="margin:12px 0 0;color:#6b7280;font-size:13px;line-height:1.8">This is an automated message regarding your vendor application.</p><p style="margin:20px 0 0;color:#9ca3af;font-size:12px;line-height:1.8">© 2026 {{platformName}}. All Rights Reserved.</p></td></tr></table></td></tr></table></body>`

    await sendMail(email, 'Vendor Rejection Mail...', html);
};





