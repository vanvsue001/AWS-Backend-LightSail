const Person = require("../models/person.model.js");
const util = require("./controller.util.js");
const {
  body,
  validationResult
} = require('express-validator');

let personType = 'player';

// Retrieve all Persons from the database.
exports.list = async (req, res) => {
  let params = util.getQueryParams(req);
  try {
    res.send(await Person.list(params, personType));
  } catch (ex) {
    throw (ex);
  }
};

// Find a single Person with a personId
exports.read = async (req, res) => {
  try {
    let result = await Person.read(req.params.personId);

    res.send(result);

  } catch (err) {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with id ${req.params.personId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Person with id " + req.params.personId
        });
      }
    }
  }
};

// Create a Person
exports.create = async (req, res) => {
  // Validate request
  if (!util.processValidation(req,res,validationResult))
    return;

  personType = util.setPersonTypeFromRequest(req); //grab person type from request url

  const person = util.personFromBody(req, personType);

  // Save Person in the database
  try {
    let result = await Person.create(person);
    res.status(201).send(result);
  } catch (err) {
    throw (err);
  }

};

// Update a Person identified by the personId in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!util.processValidation(req,res,validationResult))
    return;

  try {
    res.send(await Person.update(req.params.personId, util.personFromBody(req,personType)))
  } catch (err) {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with id ${req.params.personId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Person with id " + req.params.personId
        });
      }
    }
  }
};

// Delete a Person with the specified personId in the request
exports.delete = async (req, res) => {
  try {
    await Person.delete(req.params.personId);
    res.send({
      message: `Person was deleted successfully!`
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Person with id ${req.params.personId}.`
      });
    } else {
      res.status(500).send({
        message: "Could not delete Person with id " + req.params.personId
      });
    }
  }

};
/* Validation Rules */
exports.validate = (method) => {

  let rules = [
    body('email', 'Invalid email').not().isEmpty().isEmail().normalizeEmail(),
    body('phone', 'Invalid phone').not().isEmpty().isMobilePhone(),
    body('address1', 'address is required').not().isEmpty().trim().escape(),
    body('first_name', 'first_name cannot be empty').not().isEmpty().trim().escape(),
    body('last_name', 'last_name cannot be empty').not().isEmpty().trim().escape(),
    body('city', 'city cannot be empty').not().isEmpty().trim().escape(),
    body('state', 'state cannot be empty').not().isEmpty().trim().escape(),
    body('zip', 'zip cannot be empty or must have valid format').not().isEmpty().trim().escape().isPostalCode('any'),
    body('password', 'password cannot be empty').not().isEmpty().trim().escape(),
    body('team_id', 'team id cannot be empty').not().isEmpty()
  ]

  switch (method) {
    case 'updatePerson':
      return rules;
    case 'createPerson': {
      let createRules = [...rules];
      createRules.push(
        body('email').custom(async (email) => { //value is email address
          return await Person.checkDuplicateEmail(email); //return a promise, validator will wait until resolved
        }))
      return createRules;
    }
  }
};
