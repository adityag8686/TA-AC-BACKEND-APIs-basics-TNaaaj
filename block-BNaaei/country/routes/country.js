var express = require('express');
var router = express.Router();

var Country = require("../models/country");
var State = require("../models/states");


//create a country
router.post("/", async (req, res) => {
    try {
        var country = await Country.create(req.body);
        res.status(202).json(country);
    } catch (err) {
        res.json(err);
    }
});

//  countries in ascending order
router.get("/ascending", async (req, res) => {
    try {
        var countryAsc = await Country.aggregate([{ $sort: { name: 1 } }]);
        res.status(202).json(countryAsc);
    } catch (err) {
        res.json(err);
    }
});

//  countries in descending order
router.get("/ascending", async (req, res) => {
    try {
        var countryDes = await Country.aggregate([{ $sort: { name: -1 } }]);
        res.status(202).json(countryDes);
    } catch (err) {
        res.json(err);
    }
});

// update

router.put("/edit/:id", async (req, res) => {
    try {
        var id = req.params.id;
        var updateCountry = await Country.findByIdAndUpdate(id, req.body, {
        new: true,
        });
        res.status(202).json(updatecountry);
    } catch (err) {
        res.json(err);
    }
});


router.put("/delete/:id", async (req, res) => {
    try {
        var id = req.params.id;
        var deleteCountry = await Country.findByIdAndDelete(id);
        res.status(202).json(deleteCountry);
    } catch (err) {
        res.json(err);
    }
});

// add a state
router.post("/state", async (req, res) => {
    try {
        var countryname = req.body.countryname;
        var country = await Country.findOne({ name: countryname });
        req.body.country = country._id;
        var state = await State.create(req.body);
        var updatecountry = await Country.findByIdAndUpdate(
        country._id,
        {
            $push: { states: state._id },
        },
        { new: true }
        );
        res.status(202).json(state);
    } catch (err) {
        res.json(err);
    }
});

// list all states for a country in ascending/descending order
router.get("/:countryname/states/ascending", async (req, res) => {
    try {
        let countryname = req.params.countryname;
        let statesAscending = await State.aggregate([
        { $match: { countryname: countryname } },
        { $sort: { name: 1 } },
        ]);
        res.status(202).json(statesAscending);
    } catch (err) {
        res.json(err);
    }
});
// list all states in an ascending order of their population
router.get("/:countryname/states/decending", async (req, res) => {
    try {
        let countryname = req.params.countryname;
        let statesDecending = await State.aggregate([
            { $match: { countryname: countryname } },
            { $sort: { name: -1 } },
        ]);
        res.status(202).json(statesDecending);
    } catch (err) {
        res.json(err);
    }
});

// countries based on religions.
router.get("/religions", async (req, res) => {
    try {
        let allcountry = await Country.aggregate([
            { $group: { _id: "$ethinicity" } },
        ]);
        res.status(202).json(allcountry);
    } catch (err) {
        res.json(err);
    }
});
  // list countries based on continent.
router.get("/continents", async (req, res) => {
    try {
        let allcoutry = await Country.aggregate([
            { $group: { _id: "$continent" } },
        ]);
        res.status(202).json(allcoutry);
    } catch (err) {
        res.json(err);
    }
});
// list countries based on population.
router.get("/population", async (req, res) => {
    try {
        let allcountry = await Country.aggregate([
            { $group: { _id: "$populations" } },
        ]);
        res.status(202).json(allcountry);
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;