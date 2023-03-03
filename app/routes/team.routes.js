module.exports = app => {
    const teams = require("../controllers/team.controller.js");
  
    // Retrieve all Teams
    app.get("/teams", async (req, res)=>{
      try{
        await teams.list(req, res);
      }
      catch(err){
        res.send(err);
        console.log(err.message);
      }
      
    });
  
    // Retrieve a single Team with teamId
    app.get("/teams/:teamId", async (req, res)=>{
      try{
        await teams.read(req, res);
      }
      catch(err){
        res.send(err);
        console.log(err.message);
      }
      
    });
    // Update a Team with teamId
    app.put("/teams/:teamId", teams.validate('updateTeam'), async (req, res)=>{
      try{
        await teams.update(req, res);
      }
      catch(err){
        res.send(err);
        console.log(err.message);
      }
      
    });
    
    app.post("/teams", teams.validate('createTeam'),async (req, res)=>{
      try{
        await teams.create(req, res);
      }
      catch(err){
        res.send(err);
        console.log(err.message);
      }
      
    });
    // Delete a Team with teamId
    app.delete("/teams/:teamId", async (req, res)=>{
      try{
        await teams.delete(req, res);
      }
      catch(err){
        res.send(err);
        console.log(err.message);
      }
      
    });
     // Retrieve a single Team with teamId
     app.get("/teams/lookups/:lookupName", async (req, res)=>{
      try{
        await teams.lookup(req, res);
      }
      catch(err){
        res.send(err);
        console.log(err.message);
      }
      
    });
  
  };