const Person = require("../models/person.model.js");
exports.getQueryParams=(req)=>{
    let params={
      sortCol:null,
      sortDir:null,
      limit: null,
      offset:0,
      filterCol:null,
      filterStr:null,
      is_lookup:null
    };
    if("sortCol" in req.query){
      params['sortCol']=req.query.sortCol;
    }
    if("sortDir" in req.query){
      params['sortDir']=req.query.sortDir;
    }
    if("limit" in req.query){
      params['limit']=req.query.limit;
    }
    if("offset" in req.query){
      params['offset']=req.query.offset;
    }
    if("filterCol" in req.query){
      params['filterCol']=req.query.filterCol;
    }
    if("filterStr" in req.query){
      params['filterStr']=req.query.filterStr;
    }
   
    return params;
  }

  exports.setPersonTypeFromRequest=(req)=>{
  
    var re = /\/(\w+)\/?/;
    console.log(req.url);
    var result = re.exec(req.url);
    var urlPart = result[1];
    urlPart = (urlPart=="players"?"player":"coach");
    return urlPart;
    //console.log(`personType set to ${personType}`);
  }
  exports.processValidation = (req, res,validationResult) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
    if (!errors.isEmpty()) {
      res.status(422).json({
        errors: errors.array()
      });
      return false;
    }
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return false;
    }
    return true;
  }
  exports.personFromBody=(req, personType)=>{
    return new Person({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      notes: req.body.notes,
      email: req.body.email,
      phone: req.body.phone,
      team_id: req.body.team_id,
      password: req.body.password,
      user_name: req.body.user_name,
      license_level_id: req.body.license_level_id || 1,
      person_type: personType
    });
  }