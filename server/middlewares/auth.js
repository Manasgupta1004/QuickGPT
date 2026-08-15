import jwt from 'jsonwebtoken'
import User from '../models/user.js';


export const protect = async (req, res, next) => {
    // let authHearder = req.headers.authorization
    let token = req.headers.authorization
    try {
        // const token = authHearder.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const userId = decoded.id  // _id

        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'unAuthorized user no found' })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ success: false, error, message: 'middlwares' })
    }
}