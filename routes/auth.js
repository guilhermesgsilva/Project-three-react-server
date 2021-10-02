const router = require("express").Router();
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const bcrypt = require("bcryptjs");
const fileUpload = require("../config/cloudinary");


// SIGN UP

router.post("/signup", async (req, res) => {
  const { userName, userPassword } = req.body;

  // Check for username and password being filled out
  if (userName === "" || userPassword === "") {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  // Check for password strength - Regular Expression
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (passwordRegex.test(password) === false) {
  //   res.status(400).json({ message: "Password is too weak" });
  //   return;
  // }

  // Check if the user already exists
  const user = await User.findOne({ userName });
  if (user !== null) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  // Create the user in the database
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(userPassword, salt);
  try {
    const response = await User.create({
      userName,
      userPassword: hashedPassword,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// LIST USERS

router.get("/users", async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// USER DETAILS

router.get("/users/:userId", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// UPDATE USER

router.put("/users/:userId/update", async (req, res) => {
  const { userTitle, userPicture, userDescription } = req.body;
  try {
    const response = await User.findByIdAndUpdate(
      req.params.userId,
      {
        userTitle,
        userPicture,
        userDescription,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// DELETE USER

router.delete("/users/:userId/delete", async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.userId);
    res
      .status(200)
      .json({ message: `User with id ${req.params.userId} was deleted.` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// LOG IN

router.post("/login", async (req, res) => {
  const { userName, userPassword } = req.body;

  // Check for username and password being filled out
  if (userName === "" || userPassword === "") {
    res.status(400).json({ message: "missing fields" });
    return;
  }

  // Check if the user exists
  const user = await User.findOne({ userName });
  if (user === null) {
    res.status(401).json({ message: "invalid login" });
    return;
  }

  // Check if the passwords match
  if (bcrypt.compareSync(userPassword, user.userPassword)) {
    req.session.currentUser = user;
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: "invalid login" });
  }
});


// LOG OUT

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "User logged out" });
});


// IS LOGGED IN ?

router.get("/isloggedin", (req, res) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(200).json({});
  }
});


// CLOUDINARY

router.post("/upload", fileUpload.single("file"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// CREATE REVIEW

router.put("/users/:userId/add-review", async (req, res) => {
  const userId = req.params.userId;
  const reviewUserCreator = await User.findById(req.session.currentUser._id);
  const { reviewText } = req.body;

  try {
    const response = await Review.create({
      reviewUserCreator,
      reviewText,
    });
    await User.findByIdAndUpdate(userId, {
      $push: {
        userReviewsReceived: response,
      },
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// DELETE REVIEW

// PULL FROM USER REVIEWS ARRAY - not Working!

router.put("/users/:userId/delete-review/:reviewId", async (req, res) => {
  const userId = req.params.userId;
  const reviewId = req.params.reviewId;
  try {
    /*await Review.findByIdAndRemove(reviewId);*/
    await User.findByIdAndUpdate(userId, {
      $pull: {
        userReviewsReceived: {_id: reviewId} ,
      },    
    });
    res
      .status(200)
      .json({ message: `Review with id ${req.params.id} was deleted.` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE BY INDEX FROM USER REVIEWS ARRAY

// router.put("/users/:userId/delete-review/:reviewId", async (req, res) => {
//   const userId = req.params.userId;
//   const reviewId = req.params.reviewId;
//   try {
//     const user = await User.findById(userId);
//     const review = await Review.findById(reviewId)
//     const index = await user.userReviewsReceived.indexOf(review);
//     /*await Review.findByIdAndRemove(reviewId);*/
//     await User.findByIdAndUpdate(userId, {
//       $delete: {
//         userReviewsReceived: [index],
//       },    
//     });
//     res
//       .status(200)
//       .json({ message: `Review with id ${req.params.reviewId} was deleted.` });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// DELETE REVIEW FROM DB - doesn't delete object from array!

// router.put("/users/:userId/delete-review/:reviewId", async (req, res) => {
//   try {
//     await Review.findByIdAndRemove(req.params.reviewId);
//     res
//       .status(200)
//       .json({ message: `Review with id ${req.params.reviewId} was deleted.` });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

module.exports = router;