const Team = require("../models/team.model.js");
const util = require("./controller.util.js");
const { body,validationResult } = require('express-validator');

// Retrieve all Teams from the database.
exports.list = async (req, res) => {
  let params = util.getQueryParams(req);
  try{
    res.send(await Team.list(params));
  }
  catch(ex){
   throw(ex);
  }
};

// Find a single Team with a teamId
exports.read = async (req, res) => {
    try{
      let result=await Team.read(req.params.teamId);
     
      res.send(result);
    
    }
    catch(err){
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Team with id ${req.params.teamId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Team with id " + req.params.teamId
          });
        }
    }
  }
};
// Update a Team identified by the teamId in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!util.processValidation(req,res,validationResult))
    return;
  
 try {
  res.send(await Team.update(req.params.teamId, new Team(req.body)))
}
catch(err){
  if (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Team with id ${req.params.teamId}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Team with id " + req.params.teamId
      });
    }
  }
}
 
};
// Create and Save a new Team
exports.create = async (req, res) => {
  // Validate request
  if (!util.processValidation(req,res,validationResult))
    return;
 // Create a Team
 const team = new Team({
   name: req.body.name,
   coach_id: req.body.coach_id,
   league_id: 1, //req.body.league_id,
   notes: req.body.notes,
   motto: req.body.motto || ""
 });
 try{
    let result=await Team.create(team);
    res.status(201).send(result);
 }catch(err){
   throw(err);
 }
 
};

// Delete a Team with the specified teamId in the request
exports.delete = async (req, res) => {
  try{
    await Team.delete(req.params.teamId);
    res.send({ message: `Team was deleted successfully!` });
  }
  catch(err){
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Team with id ${req.params.teamId}.`
      });
    } else {
      res.status(500).send({
        message: "Could not delete Team with id " + req.params.teamId
      });
    }
  }
    
}

exports.validate = (method) => {
  let rules=[
    body('name','name cannot be empty').not().isEmpty().trim().escape(),
    body('coach_id','coach id cannot be empty').not().isEmpty(),
    body('league_id', 'league id cannot be empty').not().isEmpty(),
    body('notes').trim().escape(),   //just sanitize notes
    body('motto').trim().escape()   //just sanitize motto
  ]
  switch (method) {
    case 'updateTeam':
      return rules; 
    case 'createTeam': {
      let createRules=[...rules];
      createRules.push(
        body('name').custom(async (value) => { 
          return await Team.checkDuplicateName(value);//custom validation to check if team exists
      }))
     return createRules;
    }
  }
}

