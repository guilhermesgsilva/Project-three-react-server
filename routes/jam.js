const router = require("express").Router();
const Jam = require("../models/Jam.model");
const Post = require("../models/Post.model");
const User = require("../models/User.model");


// CREATE JAM

router.post("/jams/create", async (req, res) => {
    const { jamCity, jamAddress, jamDate, jamStartTime, jamEndTime} = req.body;
    const jamCreator = await User.findById(req.session.currentUser._id);

    if (!jamCity || !jamAddress || !jamDate || !jamStartTime) {
        res.status(400).json({ message: "missing fields" });
        return;
    }

    try {
        const response = await Jam.create({
            jamCity,
            jamAddress,
            jamDate,
            jamStartTime,
            jamEndTime,
            jamCreator,
            jamAdmins: [jamCreator],
            jamUsers: [jamCreator],
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


// LIST JAMS

router.get("/jams", async (req, res) => {
    try {
      const response = await Jam.find();
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
});


// JAM DETAILS

router.get("/jams/:jamId", async (req, res) => {
    try {
      const response = await Jam.findById(req.params.jamId);
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
});


// UPDATE JAM DETAILS

router.put("/jams/:jamId/update-details", async (req, res) => {
    const { jamCity, jamAddress, jamDate, jamStartTime, jamEndTime, jamPicture, jamDescription} = req.body;
  
    if (!jamCity || !jamAddress || !jamDate || !jamStartTime) {
        res.status(400).json({ message: "missing fields" });
        return;
    }
  
    try {
      const response = await Jam.findByIdAndUpdate(
        req.params.jamId,
        {
            jamCity,
            jamAddress,
            jamDate,
            jamStartTime,
            jamEndTime,
            jamPicture,
            jamDescription,
        },
        { new: true }
      );
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
});


// ADD JAM ADMINS 

router.put("/jams/:jamId/update-admins/:userId", async (req, res) => {
    const jamId = req.params.jamId;
    const newJamAdmin = req.params.userId;
  
    try {
        const response = await Jam.findByIdAndUpdate(jamId, {
            $push: {
                jamAdmins: newJamAdmin,
            },
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


// DELETE JAM ADMINS




// UPDATE JAM USERS

router.put("/jams/:jamId/update-users", async (req, res) => {
    const jamId = req.params.jamId;
    const newJamUser = await User.findById(req.session.currentUser._id);
  
    try {
        const response = await Jam.findByIdAndUpdate(jamId, {
          $push: {
              jamUsers: newJamUser,
          },
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


// DELETE JAM

router.delete("/jams/:jamId/delete", async (req, res) => {
    try {
      await Jam.findByIdAndRemove(req.params.jamId);
      res
        .status(200)
        .json({ message: `User with id ${req.params.jamId} was deleted.` });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
});


// CREATE POST

router.put("/jams/:jamId/add-post", async (req, res) => {
    const jamId = req.params.jamId;
    const postUserCreator = await User.findById(req.session.currentUser._id);
    const { postText, postMedia } = req.body;
  
    try {
      const response = await Post.create({
        postUserCreator,
        postText,
        postMedia,
      });
      await Jam.findByIdAndUpdate(jamId, {
        $push: {
            jamPosts: response,
        },
      });
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
});


// DELETE POST


module.exports = router;