const rateLimit = require('express-rate-limit');
const { success } = require('zod');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 request per IP every 15 minutes
    message: {
        success: false,
        message: 'Too many Registration attemps, Please try again after 15 miutes...'
    },
    standardHeaders: true, // it will return Reg Rate Limit Info in Headers...
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 request per IP every 15 minutes
    message: {
        success: false,
        message: 'Too many Login attemps, Please try again after 15 miutes...'
    },
    standardHeaders: true, // it will return Reg Rate Limit Info in Headers...
    legacyHeaders: false,
});

const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 request per IP every 15 minutes
    message: {
        success: false,
        message: 'Too many Refresh Token attemps, Please try again after 15 miutes...'
    },
    standardHeaders: true, // it will return Reg Rate Limit Info in Headers...
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 request per IP every 15 minutes
    message: {
        success: false,
        message: 'Too many attemps, Please try again after 15 miutes...'
    },
    standardHeaders: true, // it will return Reg Rate Limit Info in Headers...
    legacyHeaders: false,
});

module.exports = {
    registerLimiter,
    loginLimiter,
    refreshTokenLimiter,
    apiLimiter,
}
