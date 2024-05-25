var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');
const posts = require('./posts');
const fs = require('fs');
const path = require('path');

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

// ---------------------Upload-------------------------
router.post('/upload', isLoggedIn, upload.single('file'), async function (req, res, next) {
  if (!req.file) {
    return res.status(400).send('Please upload a file');
  }
  // const user
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id
  })

  user.posts.push(post._id)
  await user.save();
  res.redirect('/profile')
});


// --------------------Login--------------------
router.get('/login', function (req, res, next) {
  // if (err) { redirect:"/login"}
  res.render('login', { error: req.flash('error') });
  console.log(req.flash('error',));
});

// -------------Feed----------------------
router.get('/feed', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('feed', { user: user })
})

// ----------------------------Profile----------------------
router.get('/profile', isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
    const posts = await postModel.countDocuments();

    // Render the profile page
    res.render("profile", { user: user, posts: posts });
  } catch (error) {
    // Handle any errors that occur during fetching or rendering
    console.error('Error rendering profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// const fs = require('fs').promises;
// const path = require('path');

router.post('/profile', isLoggedIn, async function (req, res, next) {
  const { postId, newCaption, action } = req.body;

  try {
    if (action === 'update') {
      // Update the caption in the post model
      await posts.findByIdAndUpdate(postId, { postText: newCaption });
    } else if (action === 'delete') {
      // Find the post to get the image path
      await posts.findByIdAndDelete(postId);
    }
    // Fetch the updated user data again after updating or deleting the post
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");

    // Render the profile page with updated data
    res.render("profile", { user: user });
  } catch (error) {
    // Handle any errors that occur during updating or rendering
    console.error('Error updating caption or rendering profile:', error);
    res.status(500).send('Internal Server Error');
  }
});



// ----------------------Edit-Profile----------------------
router.get('/editprofile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })  
  res.render('editprofile', { user: user });
})


router.post('/editprofile', isLoggedIn, async function (req, res, next) {
  const { username, email, fullName, bio } = req.body;
  const currentUsername = req.session.passport.user;

  try {
    // Check if the new username is already taken by another user
    const existingUser = await userModel.findOne({ username });
    if (existingUser && existingUser.username !== currentUsername) {
      return res.status(400).send('Username is already taken. Please choose another one.');
    }

    // Update the user information
    await userModel.findOneAndUpdate(
      { username: currentUsername },
      { username, email, fullName, bio }
    );

    // Update the session with the new username
    req.session.passport.user = username;

    // Redirect to the profile page with updated information
    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});


// -----------------------User-Register------------------------------
router.post('/register', function (req, res) {
  const { username, email, fullName, password } = req.body;
  if (!username || !email || !fullName || !password) {
    return res.status(400).send('Please fill all the details');
  }
  const userData = new userModel({ username, email, fullName });

  //redirecting  to the login page after successful registration
  userModel.register(userData, password, function (err) {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).send("Registration failed. Please try again later.");
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/feed');
    })
  })
})


// ---------------------------------Login--------------------------------
router.post('/login', passport.authenticate("local", {
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) { })

// -------------------------LogOut--------------------------------
router.get('/logout', function (req, res) {
  req.logOut(function (err) {
    if (err) { return next(err); }
    res.redirect('/login')
  })
})


// -----------login checker--------------------------------
function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
module.exports = router;
