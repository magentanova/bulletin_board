const PROJECT_NAME = 'bulletin_board'

// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x


const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const renderFile = require('ejs').renderFile
const cors = require('cors')

// Load Configuration
const appMiddleWare = require('./config/middleware.js')
const appSecrets = require('./config/secrets.js')
const appAuthentication = require('./config/auth.js')
const connectToDB = require('./config/db-setup.js').connectToDB

// Import Routers
let indexRouter = require('./routes/indexRouter.js')
let authRouter = require('./routes/authRouter.js')

// Load DB User Model (for appAuthentication configuration)
let User = require('./db/schemas/userSchema.js').User


// =========
// RUN APP
// =========
const app = express()
const PORT = process.env.PORT || 3000
app.set('port', PORT)

// =========
// VIEW ENGINE
// =========
app.set('views', './dist/views');
app.engine('html', renderFile)
app.set('view engine', 'html');

// =========
// DATABASE
// =========
connectToDB(PROJECT_NAME)

// =========
// APPLICATION MIDDLEWARE 
// =========
app.use( express.static( __dirname + '/dist/assets') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( cookieParser() );
app.use( session({secret: appSecrets.sessionSecret }) );
app.use( passport.initialize() );
app.use( passport.session() );
appAuthentication(User)
app.use( appMiddleWare.cookifyUser )
app.use( appMiddleWare.parseQuery )
// 
// =========
// ROUTERS
// =========

app.use( '/', indexRouter )
app.use( '/auth', authRouter )
//add all apiRouters as /api middleware
let apiDir = __dirname + '/routes/api'
let files = fs.readdirSync(apiDir)
var routers = files.map(file => require(`${apiDir}/${file}`) );
routers.forEach(function(router) {
	app.use ( '/api', router )
})

app.use(appMiddleWare.errorHandler);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors())

app.listen(PORT,function() {
  console.log('\n\n===== listening for requests on port ' + PORT + ' =====\n\n')
})
