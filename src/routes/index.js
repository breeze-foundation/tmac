const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const axios = require('axios')
const Validator = require('wallet-validator');
const router = express.Router();


router.use(cookieParser());

router.get('', async (req, res) => {res.render('index')})
router.get('/farming', async (req, res) => {if(req.cookies.tmacRef){refVal=req.cookies.tmacRef}else{refVal=''};res.render('farming',{refVal:refVal})})
router.get('/staking', async (req, res) => {if(req.cookies.tmacRef){refVal=req.cookies.tmacRef}else{refVal=''};res.render('staking',{refVal:refVal})})
router.get('/faq', async (req, res) => {res.render('faq')})
router.get('/bridge', async (req, res) => {res.render('bridge')})
router.post('/swap', async (req, res) => {let post =req.body;const breej = require('breej');let sender=req.body.user;let amount = parseInt((req.body.amount) * 1000000);const Validator = require('wallet-validator');let valid = Validator.validate(req.body.wid_addr, 'ETH');
    breej.getAccount(sender, function (error, account) {
    	if (breej.privToPub(req.body.key) !== account.pub) { res.send({ error: true, message: 'Unable to validate user' }); 
      	} else if (amount > account.balance) { res.send({ error: true, message: 'Not enough balance' }); return false;
      	} else if (amount <  1000000) {res.send({ error: true, message: 'Min swap amount is 1 token' });  return false;
      	} else if (!valid) {res.send({ error: true, message: 'Not a valid BSC wallet address' });return false;
     	} else {let wAmount = parseInt((amount) * 0.99);let bAmount = parseInt((amount) * 0.01);
        let newTx = { type: 23, data: { destaddr: req.body.wid_addr, network: 'BSC', amount: wAmount } };let bnewTx = { type: 3, data: { receiver: 'null', amount: bAmount, memo: '' } };
        let signedTx = breej.sign(post.key, sender, newTx);let bsignedTx = breej.sign(post.key, sender, bnewTx);
        breej.sendTransaction(signedTx, (error, result) => { if (error === null) {breej.sendTransaction(bsignedTx, (error, result) => { }); res.send({ error: false }); } else { res.send({ error: true, message: error['error'] }); } })}
    })
})
router.get('/referral', async (req, res) => {res.render('referral')})
router.get('/ref/:ref', async (req, res) => { console.log(req.params.ref);if(!req.cookies.tmacRef){ if(Validator.validate(req.params.ref, 'ETH')){ res.cookie('tmacRef', req.params.ref, { expires: new Date(Date.now() + 604800000)});}}; res.render('index') })
router.get('/robots.txt', function (req, res) { res.type('text/plain'); res.send("User-agent: *\nDisallow:"); });
module.exports = router;