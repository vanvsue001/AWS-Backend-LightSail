
const sql = require("../models/db.js");
const lookup = require("../models/lookups.model.js");

module.exports = app => {
  
     // Retrieve a single lookup
     app.get("/lookups/:lookupTable", async (req, res)=>{
        try{
          if(req.params.lookupTable=="all")
            res.send(await lookup.getAllLookups());
          else
            res.send(await lookup.getLookup(req.params.lookupTable));
        }
        catch(err){
          res.send(err);
          console.log(err.message);
        }
      });
 
  };