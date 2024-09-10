//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
const express = require('express');
// const router = express.Router();
const sessionDataDefaults = require('./data/session-data-defaults');

router.get('/', (req, res) => {
    // Initialize session storage with defaults if not already set
    req.session.data = req.session.data || sessionDataDefaults;
    res.render('index', { data: req.session.data });
});

router.post('/page1', (req, res) => {
    const { returnMethod } = req.body;

    // If no return method is selected, show the error message
    if (!returnMethod) {
        req.session.data.returnMethod = ''; // Reset the return method.

        return res.render('page1', {
            data: req.session.data,
            errorMessage: {
                text: "Select how you would like to return",
                classes: "govuk-error-message"
            }
        });
    }

    // If selected, store it and proceed
    req.session.data.returnMethod = returnMethod;

    if (returnMethod === 'by courier') {
        return res.redirect('/page2');
    } else {
        return res.redirect('/page3');
    }
});



router.get('/page2', (req, res) => {
    res.render('page2', { data: req.session.data });
});

router.post('/page2', (req, res) => {
    const { addressLine1, addressLine2, townCity, postcode } = req.body;

    // Store courier address
    req.session.data.courierAddress = {
        addressLine1,
        addressLine2,
        townCity,
        postcode
    };

    res.redirect('/page4');
});

router.get('/page3', (req, res) => {
    res.render('page3', { data: req.session.data });
});

router.post('/page3', (req, res) => {
    const { office } = req.body;

    // Store in-person office choice
    req.session.data.inPersonOffice = office;

    res.redirect('/page4');
});

router.get('/page4', (req, res) => {
    res.render('page4', { data: req.session.data });
});

// Route to reset session data and redirect to home
router.get('/reset', (req, res) => {
    req.session.data = sessionDataDefaults;
    res.redirect('/');
});

module.exports = router;