module.exports = app => {
  const coaches = require("../controllers/person.controller.js");
   
   // Retrieve all Players
   app.get("/coaches", async (req, res)=>{
    try{
      await coaches.list(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });

  // Retrieve a single Player with playerId
  app.get("/coaches/:personId", async (req, res)=>{
    try{
      await coaches.read(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
  // Update a Player with playerId
  app.put("/coaches/:personId", coaches.validate('updatePerson'), async (req, res)=>{
    try{
      await coaches.update(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
  
  app.post("/coaches", coaches.validate('createPerson'),async (req, res)=>{
    try{
      await coaches.create(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
  // Delete a Player with playerId
  app.delete("/coaches/:personId", async (req, res)=>{
    try{
      await coaches.delete(req, res);
    }
    catch(err){
      res.send(err);
      console.log(err.message);
    }
    
  });
   
  };