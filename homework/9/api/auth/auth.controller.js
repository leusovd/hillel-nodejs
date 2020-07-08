const { compareSync } = require('bcryptjs');
const UserModel = require('../users/users.model');

exports.authLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).lean().exec();

        if (!user) {
            throw { status: 404, message: 'User not found'};
        }

        if (!compareSync(password, user.password)) {
            throw { status: 404, message: 'User not found' };
        }

        req.session.user = user;

        res.json({_id: user._id, role: user.role });

    } catch (e) {
        next(e);
    }    
};

exports.authLogout = (req, res, next) => {
    if (!req.session) {
        res.json({ message: 'Currently there is no user session'});
    }

    req.session = null;

    res.json({ status: 'ok', message: 'User has been successfully logged out' });
}