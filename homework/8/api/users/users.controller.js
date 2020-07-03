const UsersModel = require('./users.model');

exports.userCreate = async (req, res, next) => {
    try {
        const { email, password, repeatPassword, role } = req.body;

        if (password !== repeatPassword) {
            throw { message: 'Passwords do not match' }
        }

        const user = new UsersModel({ email, password, role });    
        await user.save();

        req.session.user = user;

        res.send({ message: 'User has been created', id: user.id });
    } catch (e) {
        next(e);
    }    
};