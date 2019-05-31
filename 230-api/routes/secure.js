const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../JWT/config');

router.get('/', (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Authorization token has expired and/or is invalid'
                });
            }
            else {
                console.log(decoded);
                req.db.from('users').select('*').where({email: decoded.email})
                    .then((rows) => {
                    if(rows.length === 1){
                        next();
                    }
                    else{
                        return res.status(401).json({
                            message: 'Authorization token is invalid'
                        });
                    }
                });
            }
        });
    }
    else {
        return res.status(401).json({
            message: 'Authorization token not supplied in header'
        });
    }

});

router.get('/', (req, res) => {
    // REMOVE / at end of param .replace(new RegExp('\/$'), '')
    req.db.from('offence_columns').select("*").where({pretty: decodeURI(req.query.offence)})
        .then((rows) => {
            let query = {};
            let offence = rows[0].column;
            query.offence = rows[0].pretty;
    // Subquery template "(id IN (SELECT id FROM offences WHERE area IN (id=id)))"
            let subquery = [];

            if(req.query.area !== undefined){
                let area = req.query.area.replace(new RegExp('\/$'), '');
                query.area = area;
                let areas = area.split(',');
                let temp = '(id IN (SELECT id FROM offences WHERE area IN (';
                for(let x=0; x<areas.length; x++){
                    temp += "'"+areas[x]+"'"+ ',';
                }
                temp = temp.replace(new RegExp(',$'), '');
                temp += ')))';
                subquery.push(temp);
            }
            if(req.query.age !== undefined){
                let age = req.query.age.replace(new RegExp('\/$'), '');
                query.age = age;
                let ages = age.split(',');
                let temp = '(id IN (SELECT id FROM offences WHERE age IN (';
                for(let x=0; x<ages.length; x++){
                    temp += "'"+ages[x]+"'"+ ',';
                }
                temp = temp.replace(new RegExp(',$'), '');
                temp += ')))';
                subquery.push(temp);
            }
            if(req.query.gender !== undefined){
                let gender = req.query.gender.replace(new RegExp('\/$'), '');
                query.gender = gender;
                let genders = gender.split(',');
                let temp = '(id IN (SELECT id FROM offences WHERE gender IN (';
                for(let x=0; x<genders.length; x++){
                    temp += "'"+genders[x]+"'"+ ',';
                }
                temp = temp.replace(new RegExp(',$'), '');
                temp += ')))';
                subquery.push(temp);
            }
            if(req.query.year !== undefined){
                let year = req.query.year.replace(new RegExp('\/$'), '');
                query.year = year;

                let temp = '(id IN (SELECT id FROM offences WHERE year IN (';
                temp += year;
                temp += ')))';
                subquery.push(temp);
            }
            if(req.query.month !== undefined){
                let month = req.query.month.replace(new RegExp('\/$'), '');
                query.month = month;

                let temp = '(id IN (SELECT id FROM offences WHERE month IN (';
                temp += month;
                temp += ')))';
                subquery.push(temp);
            }

            let filter = '';
            for(let x=0; x<subquery.length; x++){
                if(x === subquery.length - 1){
                    filter += subquery[x];
                }
                else{
                    filter += subquery[x] + ' AND';
                }
            }
            if(filter === ''){
                filter = 'id=id';
            }

            req.db.from('offences')
                    .select("offences.area", 'lat', 'lng')
                    .sum({value: offence}).groupBy('area', 'lat', 'lng')
                    .innerJoin('areas', 'offences.area', 'areas.area')
                    .whereRaw(filter)
                .then((rows) => {
                    let result = [];
                    for (let x=0; x<rows.length; x++){
                        result.push({LGA: rows[x].area, total: rows[x].value, lat: rows[x].lat, lng: rows[x].lng});
                    }
                    res.status(200).json({"query": query,"result" : result})
                }).catch((err) => {
                    console.log(err);
                    res.status(400).json({Message : "Error present in parameters"})
            })

            //res.json({"offences" : result})
        })
    .catch((err) => {
        console.log(err);
        res.status(400).json({message : "You must present a valid offence to search"})
    });
});

module.exports = router;