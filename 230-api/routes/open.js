const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let config = require('../JWT/config');

router.post('/login', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({message: `Error - you must supply both email and password`});
        console.log(`Error on request body:`, JSON.stringify(req.body));
    } else {
        let password = req.body.password;
        req.db('users').where({email: req.body.email}).select('id', 'password')
            .then((rows) => {
                if(rows.length === 1) {
                    console.log(rows[0]);
                    let hash = rows[0].password;
                    if(bcrypt.compareSync(password, hash)){
                        console.log(`successful account login:`);
                        next();
                    }
                    else{
                        throw new Error("Incorrect password");
                    }
                }
                else{
                    throw new Error("User doesn't exist")
                }
            })
            .catch(error => {
                console.log(error);
                res.status(401).json({message: 'User credentials don\'t match any of our records'});
            })
        }
});

router.post('/login', (req, res) => {
    console.log('working');
    let token = jwt.sign({email: req.body.email},
        config.secret,
        { expiresIn: '6h' }
        );
    console.log(token);
    // return the JWT token for the future API calls
    res.status(200).json({token: token, token_type: "Bearer", expires_in: 21600, message: `successfully logged in!`});
});

router.post('/register', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({message: `Error - you must supply both email and password`});
        console.log(`Error on request body:`, JSON.stringify(req.body));
    } else {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);

        const credential = {
            "email":req.body.email,
            "password":hash };
        req.db('users').insert(credential)
            .then(_ => {
                res.status(201).json({ "Message": `Account successfully created!`});
                console.log(`successful account creation:`);
            })
            .catch(error => {
                res.status(400).json({ "Message": 'Error - User already exists'});
            })
    }
});


/* GET offences*/
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
            res.status(400).json({"Error" : true, "Message" : "Error in MySQL query"}) })
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
            res.status(400).json({"Error" : true, "Message" : "Error in MySQL query"}) })
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
            res.status(400).json({"Error" : true, "Message" : "Error in MySQL query"}) })
});

router.get('/genders', function(req, res) {
    req.db.from('offences').select("gender").groupBy('gender')
        .then((rows) => {
            let result = [];
            for (let x=0; x<rows.length; x++){
                result.push(rows[x].gender);
            }
            res.status(200).json({"genders" : result}) })
        .catch((err) => {
            console.log(err);
            res.status(400).json({"Error" : true, "Message" : "Error in MySQL query"}) })
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
            res.status(400).json({"Error" : true, "Message" : "Error in MySQL query"}) })
});



module.exports = router;
