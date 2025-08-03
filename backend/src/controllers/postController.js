const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');


exports.createPost = async (req, res) => {
 try {
  const user = await User.findById(req.user.id).select('-password');
  const profile = await Profile.findOne({ user: req.user.id });
  const { text } = req.body;
  let postData = { user: req.user.id, name: user.name, avatar: profile.avatar };

  if (text) {
   postData.text = text;
  }

  if (req.files && req.files.image) {
   const uploadedFile = req.files.image;
   const fileExtension = path.extname(uploadedFile.name);
   const fileName = `${uuidv4()}${fileExtension}`;
   
   const uploadDir = path.join(process.cwd(), 'uploads');
   if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
   }
   
   const uploadPath = path.join(uploadDir, fileName);

   uploadedFile.mv(uploadPath, async (err) => {
    if (err) {
     console.error('File move failed:', err);
     return res.status(500).send('Server Error during file move');
    }
    
    const fileUrl = `/uploads/${fileName}`;

    if (uploadedFile.mimetype.startsWith('video')) {
     postData.video = { url: fileUrl };
    } else {
     postData.image = { url: fileUrl };
    }

    const newPost = new Post(postData);
    const post = await newPost.save();
    return res.json(post);
   });
  } else {
   if (!postData.text) {
     return res.status(400).json({ msg: 'Post cannot be empty' });
   }
   const newPost = new Post(postData);
   const post = await newPost.save();
   return res.json(post);
  }

 } catch (err) {
  console.error('General server error:', err.message);
  res.status(500).send('Server Error');
 }
};


exports.getAllPosts = async (req, res) => {
 try {
  const posts = await Post.find()
   .sort({ createdAt: -1 })
   .populate('user', ['name']);
  
  const postsWithAvatars = await Promise.all(
   posts.map(async (post) => {
    if (!post.user) {
    
     return {
      ...post.toObject(),
      user: {
       name: 'Deleted User',
       avatar: 'https://www.gravatar.com/avatar?d=mp'
      }
     };
    }
    const profile = await Profile.findOne({ user: post.user._id });
    return {
     ...post.toObject(),
     user: {
      ...post.user.toObject(),
      avatar: profile ? profile.avatar : 'https://www.gravatar.com/avatar?d=mp'
     }
    };
   })
  );
  
  res.json(postsWithAvatars);

 } catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
 }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.deleteOne();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const likeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);
        
        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.unshift({ user: req.user.id });
            if (post.user.toString() !== req.user.id) {
                const newNotification = new Notification({
                    user: post.user,
                    sender: req.user.id,
                    type: 'like',
                    postId: post.id,
                });
                await newNotification.save();
            }
        }
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.addComment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name');
        const post = await Post.findById(req.params.id);
        
        const newComment = {
            text: req.body.text,
            user: req.user.id,
            name: user.name,
        };
        
        post.comments.unshift(newComment);

        if (post.user.toString() !== req.user.id) {
            const newNotification = new Notification({
                user: post.user,
                sender: req.user.id,
                type: 'comment',
                postId: post.id,
            });
            await newNotification.save();
        }
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        const comment = post.comments.find(c => c.id === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        post.comments = post.comments.filter(c => c.id !== req.params.comment_id);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ msg: 'Please provide a search query' });
        }
        
        const keyword = new RegExp(q, 'i');

        
        const users = await User.find({ name: keyword }).select('_id name');
        
        
        if (users.length === 0) {
            return res.json({ users: [], posts: [] });
        }

        
        const userIds = users.map(user => user._id);
        
        
        const userProfiles = await Profile.find({ user: { $in: userIds } })
                                          .populate('user', ['name']);
                                          
        
        const posts = await Post.find({ text: keyword })
                                .populate('user', ['name', 'avatar']); 
        
      
        res.json({ users: userProfiles, posts });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};