const sql = require("./db.js");

// constructor
const Team = function(team) {
  //this.email = team.email;
  this.name = team.name;
  this.coach_id=team.coach_id;
  this.league_id=team.league_id;
  this.notes = team.notes;
  this.motto = team.motto;
};

Team.create = async (newTeam) => {
  try{
    let result=await sql.query("INSERT INTO teams SET name = ?, league_id = ?, coach_id = ?, notes = ?, motto = ?", 
    [newTeam.name, newTeam.league_id, newTeam.coach_id, newTeam.notes, newTeam.motto]);
    
    return { id: result.insertId, ...newTeam };
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
 
};
//kj:consolidate
Team.read = async (teamId) => {
  try{
    let result=await sql.query(`SELECT * FROM teams WHERE id = ?`,[teamId]);
    
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

Team.list = async (params) => {
  try{
    let result=await sql.query(Team.getListSql(params));
    
    return result;
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
  
};
Team.getListSql = (params)=>{
  let query = `select id, name, coachName, coachEmail, coachPhone, notes, motto
  from (SELECT t.id, t.name, CONCAT(p.first_name, ' ',p.last_name) as coachName, p.email as coachEmail, p.phone as coachPhone, t.notes, t.motto
  FROM teams t JOIN people p on p.id = t.coach_id) as x`;

  if(params.filterCol!=null){
    query+= ` WHERE  x.${params.filterCol} like '%${params.filterStr}%'`;
  }

  if(params.sortCol!=null){
    query+= ` Order By x.${params.sortCol}${params.sortDir=='dsc'?" DESC":" ASC"}`;
  }
  if(params.limit!=null){
    query+= ` Limit ${params.offset},${params.limit}`;
  }
  console.log(query);
  return query;
}
Team.update = async (id, team) => {
  try{
    let result=await sql.query("UPDATE teams SET name = ?, coach_id = ?, league_id = ?, notes = ?, motto = ? WHERE id = ?",
      [team.name, team.coach_id, team.league_id,team.notes, team.motto, id]);
    if (result.affectedRows == 0) {
      // not found Team with the id
      throw new Error({ kind: "not_found" });
    }

    console.log("updated team: ", { id: id, ...team });
    return { id: id, ...team };
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
}
  
Team.delete = async (id) => {
  try{
    let result=await sql.query("DELETE FROM teams WHERE id = ?", [id]);
    if (result.affectedRows == 0) {
      // not found Team with the id
      throw new Error({ kind: "not_found" });
    }

    console.log("deleted team with id: ", id);
    return result;
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
};
Team.checkDuplicateName= async (name)=>{
  try{
   
    let result=await sql.query("select * from teams where name = ?", [name]);
    if(result.length) 
      return Promise.reject("duplicate team name ");
    else 
      return Promise.resolve("all good");
  
  }
  catch(err){
    console.log("error: ", err);
    throw(err);
  }
  
}

module.exports = Team;