# The Note Taker App

A sample mirror app to Evernote to take down notes for custom user with login and route protection using Node JS ,Express,MongoDB,Passport JS validation for middleware protection and handlebars JS .

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
step 1: npm install 
step 2: npm start

```
//Handle bar template

<script id="entry-template" type="text/x-handlebars-template">
  <div class="entry">
    <h1>{{title}}</h1>
    <div class="body">
      {{body}}
    </div>
  </div>
</script>

//Passport JS

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

## Built With

* https://www.npmjs.com/package/express
* https://www.npmjs.com/package/passport
* https://www.npmjs.com/package/mongoose
* https://handlebarsjs.com/


## Authors

* **Deepak Kumar** - *Initial work* - [deepakkumar98355](https://github.com/deepakkumar98355)


## Further Enhancement

* Soon will enhance with chat support using socket.io 

##Change Log V1.1

* Deployed on GCP https://hanthenotetaker.appspot.com/

