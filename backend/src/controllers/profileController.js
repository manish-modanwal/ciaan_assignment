

const Profile = require('../models/Profile');
const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


exports.getMyProfile = async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.user.id })
         .populate('user', ['name', 'avatar'])
         .populate('following.user', ['name', 'avatar'])
         .populate('followers.user', ['name', 'avatar']);
      
      if (!profile) {
         return res.status(404).json({ msg: 'Profile not found' });
      }

      const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });

      res.json({ profile, posts });
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
};


exports.getUserProfile = async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.params.user_id })
         .populate('user', ['name', 'avatar'])
         .populate('following.user', ['name', 'avatar'])
         .populate('followers.user', ['name', 'avatar']);
      
      if (!profile) {
         return res.status(404).json({ msg: 'Profile not found' });
      }

      const posts = await Post.find({ user: req.params.user_id }).sort({ createdAt: -1 });

      res.json({ profile, posts });
   } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
         return res.status(404).json({ msg: 'Profile not found' });
      }
      res.status(500).send('Server Error');
   }
};


exports.updateMyProfile = async (req, res) => {
    const { name, bio } = req.body;
    
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.name = name || user.name;
        
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            profile = new Profile({ user: req.user.id, name: user.name });
        }

        profile.bio = bio || profile.bio;
        
        if (req.files && req.files.profilePicture) {
            const file = req.files.profilePicture;
            
            const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
                upload_preset: 'ml_default',
                folder: 'linkedin-clone/avatars',
            });
            
            
            profile.avatar = uploadResponse.secure_url;
            fs.unlinkSync(file.tempFilePath);
        }

        await user.save();
        await profile.save();
        
        const updatedProfile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])
            .populate('following.user', ['name', 'avatar'])
            .populate('followers.user', ['name', 'avatar']);
        
        console.log("Backend: Sending final updated profile:", updatedProfile);

        res.json(updatedProfile);
    } catch (err) {
        console.error("Backend Error:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.followUser = async (req, res) => {
   try {
      const myProfile = await Profile.findOne({ user: req.user.id });
      const otherProfile = await Profile.findOne({ user: req.params.id });

      if (!otherProfile) {
         return res.status(404).json({ msg: 'User not found' });
      }

      if (myProfile.following.some(follow => follow.user.toString() === req.params.id)) {
         return res.status(400).json({ msg: 'User already followed' });
      }
      
      myProfile.following.unshift({ user: req.params.id });
      await myProfile.save();

      otherProfile.followers.unshift({ user: req.user.id });
      await otherProfile.save();

      res.json({ msg: 'User followed', profile: myProfile });
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
};


exports.unfollowUser = async (req, res) => {
   try {
      const myProfile = await Profile.findOne({ user: req.user.id });
      const otherProfile = await Profile.findOne({ user: req.params.id });

      if (!otherProfile) {
         return res.status(404).json({ msg: 'User not found' });
      }
      
      if (!myProfile.following.some(follow => follow.user.toString() === req.params.id)) {
         return res.status(400).json({ msg: 'User not followed yet' });
      }

      myProfile.following = myProfile.following.filter(
         ({ user }) => user.toString() !== req.params.id
      );
      await myProfile.save();

      otherProfile.followers = otherProfile.followers.filter(
         ({ user }) => user.toString() !== req.user.id
      );
      await otherProfile.save();

      res.json({ msg: 'User unfollowed', profile: myProfile });
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
};