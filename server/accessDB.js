'use strict';

// Module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Customer = require('./models/customer'),
    State = require('./models/state'),
    // City = require('./models/city'),
    Type = require('./models/type'),
    util = require('util');

// connect to database
module.exports = {
    // Define class variable
    myEventID: null,

    // initialize DB
    startup: function (dbToUse) {
        mongoose.connect(dbToUse);
        // Check connection to mongoDB
        mongoose.connection.on('open', function () {
            console.log('We have connected to mongodb');
        });

    },

    // disconnect from database
    closeDB: function () {
        mongoose.disconnect();
    },

    // get all the customers
    getCustomers: function (skip, top, callback) {
        console.log('*** accessDB.getCustomers');
        Customer.count(function (err, custsCount) {
            var count = custsCount;
            console.log('Customers count: ' + count);

            Customer.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1 })
                /*
                //This stopped working (not sure if it's a mongo or mongoose change) so doing 2 queries now
                function (err, customers) {
                    console.log('Customers count: ' + customers.length);
                    count = customers.length;
                })*/
                .skip(skip)
                .limit(top)
                .exec(function (err, customers) {
                    callback(null, {
                        count: count,
                        customers: customers
                    });
                });

        });
    },

    // get the customer summary
    getCustomersSummary: function (skip, top, callback) {
        console.log('*** accessDB.getCustomersSummary');
        Customer.count(function (err, custsCount) {
            var count = custsCount;

            console.log('Customers count: ' + count);

            Customer.find(
                {},
                {
                    '_id': false,
                    'firstName': true,
                    'lastName': true,
                    'city': true,
                    'state': true,
                    'orderCount': true,
                    'gender': true,
                    'id': true,
                    'address': true,
                    'phone': true,
                    'type': true
                }
            )
            /*
            //This stopped working (not sure if it's a mongo or mongoose change) so doing 2 queries now
            function (err, customersSummary) {
                console.log('Customers Summary count: ' + customersSummary.length);
                count = customersSummary.length;
            })
            */
                .skip(skip)
                .limit(top)
                .populate('type')
                .exec(function (err, customersSummary) {
                    callback(null, {
                        count: count,
                        customersSummary: customersSummary
                    });
                });
        });
    },

    getCustomersSummaryByType: function (typeId, skip, top, callback) {
        console.log('*** accessDB.getCustomersSummaryByType');
        this.getType(typeId, function (err, type) {
            Customer.count({'type': type}, function (err, custsCount) {
                var count = custsCount;

                console.log('Customers count: ' + count);

                Customer.find({
                    'type': type
                }, {
                    '_id': false,
                    'orderCount': true,
                    'gender': true,
                    'id': true,
                    'address': true,
                    'phone': true,
                    'type': true,
                    'facebook': true
                })
                    .skip(skip)
                    .limit(top)
                    .populate('type')
                    .exec(function (err, customersSummary) {
                        callback(null, {
                            count: count,
                            customersSummary: customersSummary
                        });
                    });
            });
        });
    },

    // get a  customer
    getCustomer: function (id, callback) {
        console.log('*** accessDB.getCustomer');
        Customer.find({
            id: id
        }, {
        })
            .populate('type')
            .exec(function (err, customer) {
                callback(null, customer[0]);
            });
    },

    getCustomerByFbId: function (fbId, callback) {
        console.log('*** accessDB.getCustomerByFbId', fbId);
        Customer.find({
            'facebook.id': fbId
        })
            .populate('type')
            .exec(function (err, customer) {
                if (err || (customer && !customer.length)) {
                    callback(true, null);
                } else {
                    callback(null, customer[0]);
                }
            });
    },

    // insert a customer
    insertCustomer: function (req_body, callback) {
        console.log('*** accessDB.insertCustomer');

        this.getType(req_body.typeId, function (err, type) {
            var customer = new Customer();

            customer.firstName = req_body.firstName;
            customer.lastName = req_body.lastName;
            customer.phone = req_body.phone;
            customer.address = req_body.address;
            customer.type = type;
            customer.gender = req_body.gender;
            customer.email = req_body.email;
            customer.id = 1; // The id is calculated by the Mongoose pre 'save'.
            customer.facebook.id = req_body.fbId;
            customer.facebook.name = req_body.fbName;
            customer.facebook.link = req_body.fbLink;
            customer.facebook.avatar = req_body.fbAvatar;
            customer.facebook.relateInfo = req_body.fbRelateInfo;

            customer.save(function (err, customer) {
                if (err) { console.log('*** new customer save err: ' + err); return callback(err); }

                callback(null, customer.id);
            });
        });
    },

    editCustomer: function (id, req_body, callback) {
        console.log('*** accessDB.editCustomer');

        var that = this;

        Customer.findOne(
            {
                'id': id
            },
            {
                '_id': 1,
                'firstName': 1,
                'lastName': 1,
                'gender': 1,
                'id': 1,
                'phone': true,
                'avatar': true,
                'address': true,
                'facebook': true,
                'email': true
            },
            function (err, customer) {
                if (err) { return callback(err); }

                that.getType(req_body.typeId, function (err, type) {
                    customer.firstName = req_body.firstName || customer.firstName;
                    customer.lastName = req_body.lastName || customer.lastName;
                    customer.phone = req_body.phone || customer.phone;
                    customer.address = req_body.address || customer.address;
                    customer.type = type || customer.type;
                    customer.gender = req_body.gender || customer.gender;
                    customer.email = req_body.email || customer.email;
                    customer.facebook.name = req_body.fbName || customer.facebook.id;
                    customer.facebook.link = req_body.fbLink || customer.facebook.link;
                    customer.facebook.avatar = req_body.fbAvatar || customer.facebook.avatar;
                    customer.facebook.relateInfo = req_body.fbRelateInfo || customer.facebook.relateInfo;

                    customer.save(function (err) {
                        if (err) { console.log('*** accessDB.editCustomer err: ' + err); return callback(err); }

                        callback(null);
                    });
                });
            }
        );
    },

    // delete a customer
    deleteCustomer: function (id, callback) {
        console.log('*** accessDB.deleteCustomer');
        Customer.remove({ 'id': id }, function (err, customer) {
            callback(null);
        });
    },

    // get a  customer's email
    checkUnique: function (id, property, value, callback) {
        console.log('*** accessDB.checkUnique');
        console.log(id + ' ' + value);
        switch (property) {
        case 'email':
            Customer.findOne({ 'email': value, 'id': { $ne: id} })
                    .select('email')
                    .exec(function (err, customer) {
                    console.log(customer);
                    var status = (customer) ? false : true;
                    callback(null, {status: status});
                });
            break;
        }

    },

    checkCustomersByFbIds: function (fbIds, callback) {
        console.log('*** accessDB.checkCustomersByFbIds');
        Customer.find({
            'facebook.id': {
                $in: fbIds
            }
        }, function (err, customers) {
            callback(err, customers);
        });
    },

    // get all the cities
    /*getCities: function (callback) {
        console.log('*** accessDB.getCities');
        City.find({
            }, {
            }, {
                sort: {
                    name: 1
                }
            }, function (err, cities) {
                callback(null, cities);
            }
        );
    },

    // get a city
    getCity: function (cityId, callback) {
        console.log('*** accessDB.getCity');
        City.find({
            id: cityId
        }, {
        }, function (err, city) {
            callback(null, city);
        });
    },*/

    getType: function (typeId, callback) {
        console.log('*** accessDB.getType');
        Type.findOne({
            id: typeId
        }, {
        }, function (err, type) {
            callback(null, type);
        });
    }
};
