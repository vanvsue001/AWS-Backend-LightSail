const sql = require("./db.js");

// constructor
const Person = function(person) {

  this.first_name = person.first_name;
  this.last_name = person.last_name;
  this.address1 = person.address1;
  this.address2 = person.address2;
  this.notes = person.notes;
  this.city = person.city;
  this.state = person.state;
  this.zip = person.zip;
  this.phone = person.phone;
  this.team_id=person.team_id;
  this.email = person.email;
  this.password = person.password;
  this.user_name=person.user_name;
  this.license_level_id = 1; //person.license_level_id;
  this.person_type = person.person_type;
};


Person.read = async (personId) => {
  try{
    let result=await sql.query(`SELECT * FROM people WHERE id = ?`,[personId]);
    
    if (result.length==0){
      throw ({ kind: "not_found" });
    }
    return result[0];
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
 
};


Person.list = async (params,personType) => {
  try{
    return(await sql.query(getListSql(params,personType)));
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
  
};
Person.create = async (person) => {
  try{
    let result=await sql.query(
      `INSERT INTO people SET first_name = ?, last_name = ?, address1 = ?, address2 = ?,
            notes = ?, city = ?, state = ?, zip = ?,
            team_id = ?, email = ? , phone= ?, password = ?, 
            user_name = ?, license_level_id = ?, person_type = ?`,
      [ person.first_name,
        person.last_name,
        person.address1,
        person.address2,
        person.notes,
        person.city,
        person.state,
        person.zip,
        person.team_id,
        person.email,
        person.phone,
        person.password,
        person.user_name,
        person.license_level_id,
        person.person_type
        ]);
    
    return { id: result.insertId, ...person };
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
 
};

Person.update = async (id, person) => {
  try{
    let result=await sql.query(
      `UPDATE people SET first_name = ?, last_name = ?, address1 = ?, address2 = ?,
      notes = ?, city = ?, state = ?, zip = ?,
      team_id = ?, email = ? , phone= ?, password = ?, 
      user_name = ?, license_level_id = ?, person_type = ?
      WHERE id = ?`,
      [ person.first_name,
      person.last_name,
      person.address1,
      person.address2,
      person.notes,
      person.city,
      person.state,
      person.zip,
      person.team_id,
      person.email,
      person.phone,
      person.password,
      person.user_name,
      person.license_level_id,
      person.person_type,
      id
      ]);
    if (result.affectedRows == 0) {
      // not found Person with the id
      throw new Error({ kind: "not_found" });
    }
    console.log("updated person: ", { id: id, ...person });
    return { id: id, ...person };
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
}

Person.delete = async (id) => {
  try{
    let result=await sql.query("DELETE FROM people WHERE id = ?", [id]);
    if (result.affectedRows == 0) {
      // not found Person with the id
      throw new Error({ kind: "not_found" });
    }
    console.log("deleted person with id: ", id);
    return result;
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
};

Person.checkDuplicateEmail= async (email)=>{
  try{
    let result=await sql.query("select * from people where email = ?", [email]);
    if(result.length) 
      return Promise.reject("duplicate email");
    else 
      return Promise.resolve("all good");
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
}
function getListSql(params, person_type){
  let query = "SELECT p.id, CONCAT(p.first_name,' ', p.last_name) as full_name, t.name as team_name, p.phone, p.email ";
  
  query+= ` FROM people p
   JOIN teams t on p.team_id = t.id
   WHERE p.person_type = '${person_type}'`;
  
  if(params.filterCol){
    query+= ` AND  ${params.filterCol} like '%${params.filterStr}%'`;
  }
  if(params.sortCol){
    query+= ` Order By ${params.sortCol} ${params.sortDir=="asc"?"ASC":"DESC"}`;
  }
  if(params.limit){
    query+= ` Limit ${params.offset},${params.limit}`;
  }
  return query;
}

module.exports = Person;