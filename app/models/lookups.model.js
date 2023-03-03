const sql = require("./db.js");

exports.getLookup=async (lookupType)=>{
    let query="";
    switch(lookupType){
        case 'coaches':
        query = "SELECT CONCAT(first_name, ' ', last_name) as label, id as value FROM people WHERE person_type='coach'";
        break;
        case 'teams':
        query = "SELECT name as label, id as value FROM teams";
        break;
        case 'license_levels':
        query = "SELECT description as label, value FROM license_levels";
        break;
    }
    try {
        return await sql.query(query)
    }
    catch(err){
        throw(err);
    }
}
exports.getAllLookups=async ()=>{
    try{
        let lookups={
            coaches: await exports.getLookup("coaches"),
            teams: await exports.getLookup("teams"),
            license_levels: await exports.getLookup("license_levels")
        }
        return lookups;
    }
    catch(err){
        throw(err);
    }
    
}