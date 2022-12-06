module.exports = function (app, passport, db) {

  // NORMAL ROUTES ===============================================================
  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('home.ejs');
  });

  // PROFILE SECTION =========================
  // app.get('/profile', isLoggedIn, function (req, res) {
  //   db.collection('mood').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('profile.ejs', {
  //       user: req.user.local,
  //       mood: result
  //     })
  //   })
  // });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // MOOD TRACKER ==============================
  app.get('/moodTracker', isLoggedIn, function (req, res) {
    res.render('moodTracker.ejs', {
      user: req.user.local
    })
  })

  // CHAT HOME PAGE ==============================
  app.get('/chatHome', isLoggedIn, function (req, res) {
    res.render('chatHome.ejs', {
      user: req.user.local
    })
  })

  // CHAT ==============================
  app.get('/chat', isLoggedIn, function (req, res) {
    res.render('chat.ejs', {
      user: req.user.local
    })
  })

  // PROGRESS PAGE ==============================
  app.get('/progress', isLoggedIn, function (req, res) {
    res.render('progress.ejs', {
      user: req.user.local
    })
  })

  // PROGRESS API ==============================
  app.get('/progressApi', isLoggedIn, function (req, res) {
    db.collection('mood').find({ userId: req.user._id }).toArray((err, result) => {
      if (err) return console.log(err)
      res.send(result)
    })
  });

  // LOGS ==============================
  app.get('/logs', isLoggedIn, function (req, res) {
    db.collection('mood').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('logs.ejs', {
        user: req.user.local,
        mood: result,
      })
    })
  });


  // message board routes ===============================================================

  app.post('/moodTracker', (req, res) => {
    db.collection('mood').save({ userId: req.user._id, email: req.user.local.email, date: req.body.date, time: req.body.time, hoursOfSleep: req.body.hoursOfSleep, currentMood: req.body.currentMood, triggers: req.body.triggers, symptoms: req.body.symptoms, copingSkills: req.body.copingSkills }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/progress')

    })
  })

  app.post("/startTherapy", isLoggedIn, (req, res) => {
    console.log('therapy', req.body)
    db.collection("therapySessions").insertOne(
      { client: req.user.local.email, therapyType: req.body.therapy, sessionDate: new Date().toLocaleTimeString() },
      res.redirect("/chat")
    );
  });

  app.get('/therapy', function (req, res) {
    res.render('chat.ejs', {
      user: req.user.local
    })
  })

  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/moodTracker', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    // successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }), function (req, res) {
    res.redirect('/moodTracker')
    console.log('signup')
  });

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
