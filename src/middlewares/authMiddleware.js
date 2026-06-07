const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {

    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }
    // Token na thakle...
    if (!token) {
        return res.status(401).json({
            message: 'Not Authorized, No Token Found...'
        })
    }
    // Token thakle ...
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );
        req.user = decoded
        next()

    } catch (error) {
        console.log('Auth Token Middleware Server Error:... ', error)
        return res.status(401).json({
            message: 'Not Authorized, Token Failed...'
        })
    }
};

// Role based 
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: true,
                message: 'You do not have Permission...'
            })
        }
        next()
    }
};

module.exports = { protect, restrictTo }

// notes:
// protect e check token thik ase ki na...
// user role check korbe jodi admin thake tahole next() pathabe dashboard e otherwise, 403 error debe...
// rest operator ...roles use hoyeche karon - sometimes we need to give access to multiple roles like admin and vendor, [in some cases in routes, it will be easy to get all roles]

// let token একা লিখলে কোনো error না। এটা valid JavaScript। এখানে token variable declare করা হয়েছে, কিন্তু এখনো value দেওয়া হয়নি।  
// const reassign করা যায় না। এখানে let লাগবে।