require('dotenv').config()
console.log('dotenv file connected...');

const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes')
const dbConfig = require('./config/dbConfig');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { apiLimiter } = require('./middlewares/rateLimiter');


const app = express()

// middlewares 
app.use(express.json({ limit: '10kb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs) )

// Routes 
app.use('/api/v1/', apiLimiter)
app.use('/api/v1/auth', authRoutes)

// Database configaration...
dbConfig()

// server port 
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
    
});