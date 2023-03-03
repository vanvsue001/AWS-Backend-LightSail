module.exports = app => {
  const players = require("../controllers/person.controller.js");
   
   // Retrieve all Players
   app.get("/players", async (req, res)=>{
    try{
      await players.list(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });

  // Retrieve a single Player with playerId
  app.get("/players/:personId", async (req, res)=>{
    try{
      await players.read(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
  // Update a Player with playerId
  app.put("/players/:personId", players.validate('updatePerson'), async (req, res)=>{
    try{
      await players.update(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
  
  app.post("/players", players.validate('createPerson'),async (req, res)=>{
    try{
      await players.create(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
  // Delete a Player with playerId
  app.delete("/players/:personId", async (req, res)=>{
    try{
      await players.delete(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
   
  };