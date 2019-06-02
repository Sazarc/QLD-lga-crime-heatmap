const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('../JWT/config');

router.post('/login', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.status(401).json({message: `invalid login - you need to supply both an email and password`});
        console.log(`Error on request body:`, JSON.stringify(req.body));
    } else {
        let password = req.body.password;
        req.db('users').where({email: req.body.email}).select('id', 'password')
            .then((rows) => {
                if(rows.length === 1) {
                    let hash = rows[0].password;
                    if(bcrypt.compareSync(password, hash)){
                        next();
                    }
                    else{
                        res.status(401).json({message: 'invalid login - bad password'});
                    }
                }
                else{
                    res.status(401).json({message: "oh no! It looks like that user doesn't exist..."});
                }
            })
            .catch(error => {
                console.log("Error on database query:", error);
                res.status(500).json({message: 'oh no! It looks like there was a database error while performing your search, give it another try...'});
            })
        }
});

router.post('/login', (req, res) => {
    let token = jwt.sign({email: req.body.email},
        config.secret,
        { expiresIn: '24h' }
        );
    // return the JWT token for the future API calls
    res.status(200).json({token: token, access_token: token, token_type: "Bearer", expires_in: 86400, message: `Successfully logged in!`});
});

router.post('/register', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({message: `error creating new user - you need to supply both an email and password`});
        console.log(`Error on register request body:`, JSON.stringify(req.body));
    } else {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);

        const credential = {
            "email":req.body.email,
            "password":hash };
        req.db('users').insert(credential)
            .then(_ => {
                res.status(201).json({ "message": `yay! you've successfully registered your user account :)`});
                console.log(`Successful account creation`);
            })
            .catch(error => {
                res.status(400).json({ "message": 'oops! It looks like that user already exists :('});
                console.log(`User already exists`);
            })
    }
});

/* GET requests*/
router.get('/offences', function(req, res) {
    req.db.from('offence_columns').select("pretty")
        .then((rows) => {
            let result = [];
            for (let x=0; x<rows.length; x++){
                result.push(rows[x].pretty);
            }
            res.status(200).json({"offences" : result}) })
        .catch((err) => {
            console.log(err);
            res.status(400).json({"Error" : true, "message" : "Error in MySQL query"}) })
});

router.get('/areas', function(req, res) {
    req.db.from('areas').select("*")
        .then((rows) => {
            let result = [];
            for (let x=0; x<rows.length; x++){
                result.push(rows[x].area);
            }
            res.status(200).json({"areas" : result}) })
        .catch((err) => {
            console.log(err);
            res.status(400).json({"Error" : true, "message" : "Error in MySQL query"}) })
});

router.get('/ages', function(req, res) {
    req.db.from('offences').select("age").groupBy('age')
        .then((rows) => {
            let result = [];
            for (let x=0; x<rows.length; x++){
                result.push(rows[x].age);
            }
            res.status(200).json({"ages" : result}) })
        .catch((err) => {
            console.log(err);
            res.status(400).json({"Error" : true, "message" : "Error in MySQL query"})
        })
});

router.get('/genders', function(req, res) {
    req.db.from('offences').select("gender").groupBy('gender')
        .then((rows) => {
            let result = [];
            for (let x=0; x<rows.length; x++){
                result.push(rows[x].gender);
            }
            res.status(200).json({"genders" : result})
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({"Error" : true, "message" : "Error in MySQL query"});
        })
});

router.get('/years', function(req, res) {
    req.db.from('offences').select("year").groupBy('year')
        .then((rows) => {
            let result = [];
            for (let x=0; x<rows.length; x++){
                result.push(rows[x].year);
            }
            res.status(200).json({"years" : result}) })
        .catch((err) => {
            console.log(err);
            res.status(400).json({"Error" : true, "message" : "Error in MySQL query"}) })
});

module.exports = router;
