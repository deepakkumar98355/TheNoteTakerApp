const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose =require('mongoose');

const app= express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);


// Map global Promise - get rid of warnings
mongoose.Promise=global.Promise;
//connect to mongoose
mongoose.connect('mongodb://Deepak_95:Deepak_9595@ds139970.mlab.com:39970/note_app',{
    useMongoClient:true
})
.then(() => console.log('MongoDb Connected..'))
.catch(err => console.log(err));


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//static Folder
app.use(express.static(path.join(__dirname,'public')));



//Method Override middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


  app.use(flash());

  //Global variable
  app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;  
    next();
  });


/*//middleware
app.use(function(req,res,next){
    console.log(Date.now());
    req.name='global log';
    next();
}); */

//index route
app.get('/',(req,res)=>{
    const title='Welcome to The Note Taker App';
//console.log(req.name);
res.render('index',{
    title:title
});
});

//About route
app.get('/about',(req,res)=>{
res.render('about');
});

app.use('/ideas',ideas);
app.use('/users',users);

const port= 5001;

app.listen(port,()=>{
    console.log(`server started on port ${port}`); //ES6 syntax
});