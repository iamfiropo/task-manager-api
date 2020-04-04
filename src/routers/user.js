const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/user');
const auth = require('../middleware/auth');
const { 
  sendWelcomeEmail,
  sendCancelationEmail 
} = require('../emails/account');
const router = express.Router();

router.post('/users', async(req, res) => {
  const user = new User(req.body);
  const { email, name } = user;

  try {
    const token = await user.generateAuthToken()
    await user.save();
    sendWelcomeEmail(email, name)
    res.status(201).send({user, token})
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    /**
     * THE FIRST METHOD OF DELETING USER'S PASSWORD AND TOKEN
      res.send({user: user.getPublicProfile(), token})
     */
    
    res.send({user, token})
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()

    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/users', auth, async (req, res) => {
  try {
    const user = await User.find({})
    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/users/me', auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (error) {
   res.status(500).send(error.message) 
  }
})

router.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {

    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true
    // })

    const user = await User.findById(id)

    if(!user) {
      return res.status(404).send()
    }

    updates.forEach(update => user[update] = req.body[update])
    await user.save()

    res.send(user)
  } catch (error) {
    res.status(400).send(error.message);
  }
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {

    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()

    res.send(req.user)
  } catch (error) {
    res.status(400).send(error.message);
  }
})

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if(!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.delete('/user/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name)
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message)
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer;
  await req.user.save();

  res.json()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();

  res.status(200).json()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user ||!user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
})

module.exports = router;