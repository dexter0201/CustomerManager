'use strict';

var db = require('../accessDB'),
    util = require('util');

// GET
exports.customer = function (req, res) {
    console.log('*** customer');

    db.getCustomer(req.params.id, function (err, customer) {
        if (err) {
            console.log('*** customer err');
            res.json({
                customer: customer
            });
        } else {
            console.log('*** customer ok');
            res.json(customer);
        }
    });
};

exports.addCustomer = function (req, res) {
    console.log('*** addCustomer');
    db.insertCustomer(req.body, function (err) {
        if (err) {
            console.log('*** addCustomer err');
            res.json(false);
        } else {
            console.log('*** addCustomer ok');
            res.json(req.body);
        }
    });
};

exports.editCustomer = function (req, res) {
    console.log('*** editCustomer');

    db.editCustomer(req.params.id, req.body, function (err) {
        if (err) {
            console.log('*** editCustomer err' + util.inspect(err));
            res.json({ 'status': false });
        } else {
            console.log('*** editCustomer ok');
            res.json({ 'status': true });
        }
    });
};

var getCustomerByFbId = function (fbId, callback) {
    db.getCustomerByFbId(fbId, function (err, customer) {
        if (err) {
            console.log('*** getCustomerByFbId err');
            callback(true, null);
        } else {
            console.log('*** getCustomerByFbId ok');
            callback(null, customer);
        }
    });
};

exports.addOrEditCustomer = function (req, res) {
    console.log('*** addOrEditCustomer');

    getCustomerByFbId(req.body.fbId, function (err, customer) {
        if (err) {
            db.insertCustomer(req.body, function (err) {
                if (err) {
                    console.log('*** addCustomer err');
                    res.json(false);
                } else {
                    console.log('*** addCustomer ok');
                    res.json(req.body);
                }
            });
        } else {
            db.editCustomer(customer.id, req.body, function (err) {
                if (err) {
                    console.log('*** editCustomer err' + util.inspect(err));
                    res.json({ 'status': false });
                } else {
                    console.log('*** editCustomer ok');
                    res.json({ 'status': true });
                }
            });
        }
    });
};

exports.deleteCustomer = function (req, res) {
    console.log('*** deleteCustomer');

    db.deleteCustomer(req.params.id, function (err) {
        if (err) {
            console.log('*** deleteCustomer err');
            res.json({ 'status': false });
        } else {
            console.log('*** deleteCustomer ok');
            res.json({ 'status': true });
        }
    });
};

// GET
exports.states = function (req, res) {
    console.log('*** states');
    db.getStates(function (err, states) {
        if (err) {
            console.log('*** states err');
            res.json({
                states: states
            });
        } else {
            console.log('*** states ok');
            res.json(states);
        }
    });
};

// GET
exports.cities = function (req, res) {
    console.log('*** cities');
    db.getCities(function (err, cities) {
        if (err) {
            console.log('*** cities err');
            res.json({
                cities: cities
            });
        } else {
            console.log('*** cities ok');
            res.json(cities);
        }
    });
};

exports.customers = function (req, res) {
    console.log('*** customers');
    var topVal = req.query.$top,
        skipVal = req.query.$skip,
        top = (isNaN(topVal)) ? 10 : parseInt(req.query.$top, 10),
        skip = (isNaN(skipVal)) ? 0 : parseInt(req.query.$skip, 10);

    db.getCustomers(skip, top, function (err, data) {
        res.setHeader('X-InlineCount', data.count);
        if (err) {
            console.log('*** customers err');
            res.json({
                customers: data.customers
            });
        } else {
            console.log('*** customers ok');
            res.json(data.customers);
        }
    });
};

exports.customersSummary = function (req, res) {
    console.log('*** customersSummary');
    var topVal = req.query.$top,
        skipVal = req.query.$skip,
        top = (isNaN(topVal)) ? 10 : parseInt(req.query.$top, 10),
        skip = (isNaN(skipVal)) ? 0 : parseInt(req.query.$skip, 10);

    db.getCustomersSummary(skip, top, function (err, summary) {
        res.setHeader('X-InlineCount', summary.count);
        if (err) {
            console.log('*** customersSummary err');
            res.json({
                customersSummary: summary.customersSummary
            });
        } else {
            console.log('*** customersSummary ok');
            res.json(summary.customersSummary);
        }
    });
};

exports.customersSummaryByType = function (req, res) {
    console.log('*** customersSummaryByType');
    var topVal = req.query.$top,
        skipVal = req.query.$skip,
        type = req.query.$type,
        top = (isNaN(topVal)) ? 10 : parseInt(req.query.$top, 10),
        skip = (isNaN(skipVal)) ? 0 : parseInt(req.query.$skip, 10);

    db.getCustomersSummaryByType(type, skip, top, function (err, summary) {
        res.setHeader('X-InlineCount', summary.count);

        if (err) {
            console.log('*** customersSummaryByType err');
            res.json({
                customersSummary: summary.customersSummary
            });
        } else {
            console.log('*** customersSummaryByType ok');
            res.json(summary.customersSummary);
        }
    });
};

exports.checkUnique = function (req, res) {
    console.log('*** checkUnique');

    var id = req.params.id,
        value = req.query.value,
        property = req.query.property;

    db.checkUnique(id, property, value, function (err, opStatus) {
        if (err) {
            console.log('*** checkUnique err');
            res.json({
                'status': false
            });
        } else {
            console.log('*** checkUnique ok');
            res.json(opStatus);
        }
    });
};

exports.checkFbCustomers = function (req, res) {
    console.log('*** checkFbCustomers');

    db.checkCustomersByFbIds(req.body.fbIds, function (err, customers) {
        if (err) {
            console.log('*** checkFbCustomers err');
            res.json({
                status: false
            });
        } else {
            console.log('*** checkFbCustomers ok');
            res.json(customers);
        }

    });
};

exports.login = function (req, res) {
    console.log('*** login');
    var userLogin = req.body.userLogin,
        userName = userLogin.userName,
        password = userLogin.password;

    //Simulate login
    res.json({ status: true });
};

exports.logout = function (req, res) {
    console.log('*** logout');

    //Simulate logout
    res.json({ status: true });
};
