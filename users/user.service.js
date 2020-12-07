const config = require('config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('helpers/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

/**
 * 
 * @param {object} credentials
 * authenticate the user
 * @returns object with user details and hash token 
 */

async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

/**
 * get all users
 */

async function getAll() {
    return await db.User.findAll();
}

/**
 * 
 * @param {string} id
 * find the user by its ID 
 */

async function getById(id) {
    return await getUser(id);
}

/**
 * 
 * @param {object} params | username | password
 * creates a user in the database with hash
 * throws error if the username is already taken 
 */

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw `Username ${params.username} is already taken`
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

/**
 * 
 * @param {string} id 
 * @param {object} params | username | password
 * updates the user
 */

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw `Username ${params.username} is already taken`;
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

/**
 * 
 * @param {string} id | userid
 * deletes the user from the database
 */

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}