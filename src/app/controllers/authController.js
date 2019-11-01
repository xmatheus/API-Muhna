/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const mailer = require('../../modules/mailer');

// const nodemailer = require('nodemailer');

const User = require('../models/User.js');

const authMiddleware = require('../middleware/auth');

const expiresIn = 3600 * 10;

function generateToken(params = {}) {
    return jwt.sign(params, process.env.secret, { expiresIn });
}

router.get('/default', async (req, res) => {
    try {
        if (await User.findOne({ email: process.env.email })) {
            return res.status(200).send({ 0: '0' });
        }

        await User.create({
            name: process.env.name,
            email: process.env.email,
            password: process.env.password,
            isAdmin: true,
        });
        return res.status(200).send({ 1: '1' });
    } catch (err) {
        return res.status(200).send({ 0: '1' });
    }
});

router.post('/register', authMiddleware, async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' });
        }
        // console.log(req.body);
        const user = await User.create(req.body);
        user.password = undefined;
        return res
            .status(200)
            .send({ user, token: generateToken({ id: user._id }) });
    } catch (err) {
        return res.status(400).send({ error: 'Registration fail' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ erro: 'User not found' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({ error: 'invalid password' });
    }
    user.password = undefined;

    res.status(200).send({
        user,
        token: generateToken({ id: user._id }),
        expiresIn,
    });
});

router.post('/verify', authMiddleware, async (req, res) => {
    res.status(200).send();
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ erro: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();

        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            $set: {
                passwordResetToken: token,
                passwordResetExpires: now,
            },
        });

        mailer.sendMail(
            {
                to: email,
                from: 'muhna@no-reply.muhna.com',
                template: 'auth/forgot_password',
                subject: 'MuHNA troca de senha',
                context: { token },
            },
            (err) => {
                if (err) {
                    console.log(err);
                    return res
                        .status(400)
                        .send({ error: 'Cannot send forgot_password email' });
                }

                return res.send();
            },
        );
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error on forgot password ' });
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email }).select(
            '+passwordResetToken passwordResetExpires',
        );

        if (!user) {
            return res.status(400).send({ erro: 'User not found' });
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token invalid' });
        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            return res
                .status(400)
                .send({ error: 'Token expired, generate a new token' });
        }

        user.password = password;
        user.passwordResetToken = '';
        user.passwordResetExpires = '';
        await user.save();

        res.send();
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'error on reset password' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    const userTemp = await User.find({ _id: req.userId });
    const { isAdmin } = userTemp[0];

    // console.log(isAdmin);
    if (!isAdmin) {
        return res.status(401).send({ error: 'Not permission' });
    }

    res.send({ users: await User.find() });
});

router.delete('/', authMiddleware, async (req, res) => {
    const userTemp = await User.find({ _id: req.userId });
    const { isAdmin } = userTemp[0];

    if (!isAdmin) {
        return res.status(401).send({ error: 'Not permission' });
    }

    const { userId } = req.query;

    const deletUser = await User.findById(userId);

    if (!deletUser) {
        return res.status(400).send({ error: 'user not found' });
    }

    await User.findByIdAndDelete(userId);

    res.send();
});

module.exports = (app) => app.use('/auth', router);
