const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

/**
 * Endpoint to the home page
 */
app.get('/', (req, res) => {
    res.send("<p>Please make a get request to /api/rates?base='base'&#38;currency='curr1, curr2'</p>")
});


/**
 * Endpoint to proxy requests
 */
app.get('/api/rates', (req, res) => {
    const { base, currency} = req.query;
    if(!base){
        return res.status(400).send({
            "error": "Please Pass in a parameter `base` as a query parameter to the API, base is the base currency agains which we wish to measure others against. e.g base=USD "
        })
    }
    if(!currency){
        return res.status(400).send({
            "error": "Please Pass in a parameter `currency` as a query parameter to the API, currency  parameter stands for the set of currencies whic we wish to measuere the base against. e.g currency='USD, GBP'"
        })
    }

    axios
    .get(`https://api.exchangeratesapi.io/latest?base=${base}&symbols=${currency}`)
    .then(({data})=>{
        const modifiedData = {...data, date: new Date() }
        res.send({results: modifiedData});
    })
    .catch((err)=>{
        res.status(500).send({
            "error": "There was an unknown error:", err
        })
    })
});

app.listen(port, () => {
    console.log("server started")
});