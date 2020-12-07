const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('middleware/validate-request');
const authorize = require('middleware/authorize')
const userService = require('./user.service');

// application routes

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

/**
 * 
 * Following CRUD function take request body and pass them to their relative function in the user service file
 * to perform their related functions
 */

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * defines the authentication route schema and validates the request with defined schema 
 */

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * authenticates the user
 */

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * defines user registration schema and validates the request according to defined schema
 */

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * registers the user 
 */

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * gets all users
 */

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * gets the details of current user
 */

function getCurrent(req, res, next) {
    res.json(req.user);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * gets the user by its ID
 */

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * defines the user update schema and validates the request
 */

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * updates the user
 */

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next
 * deletes the user from the database
 */

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}