var jsonwebtoken = require('jsonwebtoken');
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/signup', async(req, res, next) => {
    const status = 201;

    try {
        const { username, password } = req.body;
        const exisitingUser = await User.findOne({ username });

        if(exisitingUser) throw new Error(`This username ${username} is already in use`);

        if(password.length > 7 || password.length === 0) {
            throw new Error(`Password must be at least 1 character and less than 8`);
        }

        const saltRounds = 10;
        const hashedPwd = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            username, 
            password: hashedPwd
        })

        //TODO: add the JWT stuff here
        const payload = { id: user._id }
        const options = { expiresIn: '1 day' }
        const token = jsonwebtoken.sign(payload, 'MYSECRETPASSCODE', options)

        res.json({ status, token});
    } catch(e) {
        console.error(e);   
        const error = new Error('Error in signing up');
        error.status = 400;
        next(error);
    }
});

module.exports = router;
