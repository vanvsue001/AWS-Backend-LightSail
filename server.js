const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
var corsOptions = {
  origin: '*'
}
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ken's API!" });
});

require("./app/routes/team.routes.js")(app); 
require("./app/routes/lookup.routes.js")(app); 
 require("./app/routes/player.routes.js")(app); 
 require("./app/routes/coach.routes.js")(app); 
// require("./app/routes/leagues.routes.js")(app);
// require("./app/routes/licenses.routes.js")(app);

// set port, listen for requests
app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});