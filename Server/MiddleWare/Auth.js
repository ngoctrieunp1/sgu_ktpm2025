const jwt = require('jsonwebtoken');
const  UserCollection = require('../models/UserModels'); // Replace with the actual path to your User model



const isAuthenticated =  async (req, res, next) => {
    try {
        const bearerToken = req.headers['authorization'];
        
        if (!bearerToken) {
            return res.status(401).send({ message: 'No token provided' });
        }

        const token = bearerToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!decoded || !decoded.sub) {
            return res.status(401).send({ message: 'Invalid token' });
        }

        const user = await UserCollection.findById(decoded.sub._id);
        
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = isAuthenticated;