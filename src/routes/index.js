const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const axios = require('axios')
const Validator = require('wallet-validator');
const router = express.Router();
require('dotenv').config()
router.use(cookieParser());

//router.get('/new', async (req, res) => {let priceAPI = await axios.get(`https://api.bogged.finance/v1/spot_prices?tokens=0x6421282c7f14670d738f4651311c5a1286e46484&chain=bsc&api_key=wkI2Pd5mbAWe8n3I3B6C`);let price= priceAPI.data.data['0x6421282c7f14670d738f4651311c5a1286e46484'];res.render('index', { price: price })})
router.get('', async (req, res) => {if(req.cookies.tmacRef){refVal=req.cookies.tmacRef}else{refVal=''};
    //const priceAPI = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TMAC', { headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_KEY, },});
    //let tmacPrice = (priceAPI.data.data.TMAC.quote.USD.price).toFixed(6);
    //let price = tmacPrice ? tmacPrice : '0.10';
    let price = '0.02';
    res.render('index', { price: price, refVal:refVal })
})
//router.get('/farming', async (req, res) => {if(req.cookies.tmacRef){refVal=req.cookies.tmacRef}else{refVal=''};res.render('farming',{refVal:refVal})})
//router.get('/staking', async (req, res) => {if(req.cookies.tmacRef){refVal=req.cookies.tmacRef}else{refVal=''};res.render('staking',{refVal:refVal})})
router.get('/faq', async (req, res) => {res.render('faq')})
router.get('/bridge', async (req, res) => {res.render('bridge')})
router.post('/swap', async (req, res) => {let post =req.body;const breej = require('breej');let sender=req.body.user;let amount = parseInt((req.body.amount) * 1000000);const Validator = require('wallet-validator');let valid = Validator.validate(req.body.wid_addr, 'ETH');
    breej.getAccount(sender, function (error, account) {
    	if (breej.privToPub(req.body.key) !== account.pub) { res.send({ error: true, message: 'Unable to validate user' }); 
      	} else if (amount > account.balance) { res.send({ error: true, message: 'Not enough balance' }); return false;
      	} else if (amount <  1000000) {res.send({ error: true, message: 'Min swap amount is 1 token' });  return false;
      	} else if (!valid) {res.send({ error: true, message: 'Not a valid BSC wallet address' });return false;
     	} else {
            res.send({ error: true, message: 'Bridge is disabled' }); return false;
            let wAmount = parseInt(amount);
            let newTx = { type: 203, data: { destaddr: req.body.wid_addr, network: 'BSC', amount: wAmount } };
            let signedTx = breej.sign(post.key, sender, newTx);
            breej.sendTransaction(signedTx, (error, result) => { if (error === null) { res.send({ error: false }); } else { res.send({ error: true, message: error['error'] }); } })}
    })
})
router.get('/referral', async (req, res) => {res.render('referral')})
router.get('/ref/:ref', async (req, res) => { 
    //console.log(req.params.ref);
    if(!req.cookies.tmacRef){ if(Validator.validate(req.params.ref, 'ETH')){ res.cookie('tmacRef', req.params.ref, { expires: new Date(Date.now() + 604800000)});refVal=req.params.ref;}}else if(req.cookies.tmacRef){refVal=req.cookies.tmacRef}else{refVal=''};
    //let priceAPI = await axios.get(`https://api.bogged.finance/v1/spot_prices?tokens=0x6421282c7f14670d738f4651311c5a1286e46484&chain=bsc&api_key=wkI2Pd5mbAWe8n3I3B6C`);
    //if(priceAPI){price= priceAPI.data.data['0x6421282c7f14670d738f4651311c5a1286e46484'];}else{price='0.10'}
    let price='0.10'
    res.render('index', { price: price, refVal:refVal }) })
router.get('/robots.txt', function (req, res) { res.type('text/plain'); res.send("User-agent: *\nDisallow:"); });
module.exports = router;