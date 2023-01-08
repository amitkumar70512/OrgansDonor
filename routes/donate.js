const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
let checkAuthenticated = require('./functions.js').checkAuthenticated;
let Users = require(path.join(__dirname, '../models/index.js')).users;
let Items = require(path.join(__dirname, '../models/index.js')).items;
let Categories = require(path.join(__dirname, '../models/index.js')).categories;
let Bids = require(path.join(__dirname, '../models/index.js')).bids;
//nodemailer
const nodemailer = require('nodemailer');

// router.get('/', checkAuthenticated, (req, res) => {
//   (async () => {
//     try {
//       let loggedInUser = await req.user;
//       let items = await Items.find({ status: 'true' }).sort({
//         _id: -1,
//       });
//       res.render('donate', { items, user: req.user, loggedInUser });
//     } catch (err) {
//       console.log(err);
//     }
//   })();
// });

router.get('/donate', checkAuthenticated, (req, res) => {
  (async () => {
    try {
      let categories = await Categories.find({});
      let additem = true;
      res.render('donate', {
        additem,
        categories,
        loggedInUser: await req.user,
      });
    } catch (err) {
      console.log(err);
    }
  })();
});
router.get('/donate/heart',(req,res)=>{
  res.redirect('/profile');
})
router.post('/donate/heart', checkAuthenticated, (req, res) => {
  (async () => {
    try {
      let loggedInUser = await req.user;
      const formidable = require('formidable');
      const form = formidable({ multiples: true });
      form.parse(req, (err, fields, files) => {

        (async () => {
          await Heart.create({
            organ_id: uuid(),
            patient_id: loggedInUser._id,
            patient_name: loggedInUser.name,
            age: fields.age,
            height: fields.height,
            weight: fields.weight,
            gender: fields.gender,
            BP: fields.BP,
            Blood_type: fields.Blood_type,
            heart_disease: fields.heart_disease,
            obesity: fields.obesity,
            diabetes: fields.diabetes,
            heart_abnormalities: fields.heart_abnormalities,
            inotropes: fields.inotropes
          });
          res.redirect('/profile');
        })();
      });
    } catch (err) {
      console.log(err);
    }
  })();
});


router.get('/profile/showbid/:id', checkAuthenticated, (req, res) => {
  (async () => {
    try {
      let param = req.params.id;
      let item = await Items.find({ _id: param });

      if (item.length > 0) {
        let bid = await Bids.find({ item_id: item[0]._id });
        if (bid.length > 0) {
          let user = await Users.find({ _id: bid[0].user_id });
          if (user.length > 0) {
            let showBid = true;
            res.render('profile', {
              user,
              item,
              bid,
              showBid,
              loggedInUser: req.user,
            });
          } else {
            res.end('page not found');
          }
        } else {
          res.end('page not found');
        }
      } else {
        res.end('page not found');
      }
    } catch (err) {
      console.log(err);
    }
  })();
});

// my profile page
router.get('/myprofile', checkAuthenticated, (req, res) => {
  (async () => {
    try {
      let loggedInUser = await req.user;
      let myprofile = true;
      res.render('myProfile', { myprofile, loggedInUser });
    } catch (err) {
      console.log(err);
    }
  })();
});

// show my items
router.get('/profile/myProduct', checkAuthenticated, (req, res) => {
  (async () => {
    try {
      let loggedInUser = await req.user;
      let myitems = true;
      let items = await Items.find({ user_id: loggedInUser._id });
      res.render('myProduct', { myitems, items, loggedInUser });
    } catch (err) {
      console.log(err);
    }
  })();
})

// send mail to admin for product rebid
router.post('/requestReBid', checkAuthenticated, (req, res) => {
  let p_id = req.body._id;
  let p_name = req.body.name;
  let price = req.body.price;
  let message = req.body.message;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'process.env.MAIL_NAME',
      pass: 'process.env.MAIL_PASS',
    },
  });

  let mailOptions = {
    from: '"' + p_name + '" <' + p_id + '>',
    to: 'process.env.SENT_MAIL',
    subject: 'Edit Product ' + p_name + '\nProduct id\n' + p_id,
    text: 'product name: ' + p_name+ '\n\nProduct price: ' + price + '\n\nMessage: ' + message ,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong');
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'Request sent successfully');
      res.redirect('/requestReBid/:id');
    }
  });
});

// get request rebid
router.get('/requestReBid/:id', checkAuthenticated, (req, res) => {
  Items.findById(req.params.id, (err, item) => {
    if (!err) {
      res.render('requestReBid', {
        data: item,
      });
    } else {
      res.redirect('/profile/myProduct');
    }
  });
});

// request credit
router.get('/requestCredit/:id', checkAuthenticated, (req, res) => {
  Users.findById(req.params.id, (err, user) => {
    if (!err) {
      res.render('requestCredit', {
        data: user,
      });
    } else {
      res.redirect('/myprofile');
    }
  });
})

// send mail to admin for credit request
router.post('/requestCredit', checkAuthenticated, (req, res) => {
  let id = req.body._id;
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_NAME,
      pass: process.env.MAIL_PASS,
    },
  });

  let mailOptions = {
    from: '"' + name + '" <' + email + '>',
    to: process.env.SENT_MAIL,
    subject: 'Credit Request from + ' + name,
    text: 'Name: ' + name + '\n\nId: ' + id + '\n\nEmail: ' + email + '\n\nReqested for: ' + message + ' credit',
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong');
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'Request sent successfully');
      res.redirect('/requestCredit/:id');
    }
  });
});

module.exports = router;
