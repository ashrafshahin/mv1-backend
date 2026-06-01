const express = require('express');
const router = express.Router()

const { registerController, loginController, refreshTokenController } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/verifyEmail');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { validate } = require('../models/userSchema');
const { registrationSchemaValidation, loginSchemaValidation } = require('../validations/auth.validation');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user (Customer or Vendor)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 5
 *                 pattern: '^.{5,}$'
 *                 example: "Your Name"
 *                 description: Name must be at least 5 characters long
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^\\S+@\\S+\\.\\S+$'
 *                 example: "shahinmail@gmail.com"
 *                 description: Please enter a valid email. Email must be unique
 *
 *               phone:
 *                 type: string
 *                 example: "01789222000"
 *                 description: Optional phone number
 *
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$'
 *                 example: "Pass@123"
 *                 description: Password must contain at least one letter and one number
 *
 *               role:
 *                 type: string
 *                 enum: [customer, vendor]
 *                 example: "customer"
 *                 description: User role
 *
 *     responses:
 *       201:
 *         description: User registration successful
 *
 *       400:
 *         description: Bad Request
 *
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^\\S+@\\S+\\.\\S+$'
 *                 example: "shahinmail@gmail.com"
 *                 description: Please enter a valid email
 *
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$'
 *                 example: "Pass@123"
 *                 description: Password must contain at least one letter and one number
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid email or password
 *
 *       500:
 *         description: Server Error
 */


/**
 * @swagger
 * /api/v1/auth/refresh-token/{token}:
 *   post:
 *     summary: Generate new access token using refresh token
 *     tags: [Auth]
 *
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *         description: Valid JWT refresh token
 *
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *
 *       401:
 *         description: Invalid or expired refresh token
 *
 *       500:
 *         description: Server Error
 */


/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify user email address
 *     tags: [Auth]
 *
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: "eyJhbGciOiJIUzI1Ni..."
 *         description: Email verification token
 *
 *     responses:
 *       200:
 *         description: Email verified successfully
 *
 *       400:
 *         description: Invalid verification token
 *
 *       500:
 *         description: Server Error
 */

router.post('/register',validate(registrationSchemaValidation), registerController);
router.post('/login',validate(loginSchemaValidation), loginController);
router.post('/refresh-token/:token', refreshTokenController);

router.get('/verify-email', verifyEmail);

router.get('/admin/dashboard', protect, restrictTo('admin'))


module.exports = router;


// router.post - deye korte hobe...