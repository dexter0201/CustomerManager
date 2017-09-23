var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    errorhandler = require('errorhandler'),
    csrf = require('csurf'),
    routes = require('./server/routes'),
    api = require('./server/routes/api'),
    DB = require('./server/accessDB'),
    protectJSON = require('./server/lib/protectJSON'),
    app = express();

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(session({
    secret: 'customermanagerstandard',
    saveUninitialized: true,
    resave: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(errorhandler());
app.use(protectJSON);
app.use(csrf());

app.use(function (req, res, next) {
    var csrf = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrf);
    res.locals._csrf = csrf;
    next();
})

process.on('uncaughtException', function (err) {
    if (err) console.log(err, err.stack);
});

//Local Connection
var conn = 'mongodb://localhost/customermanager';
var db = new DB.startup(conn);

// Routes
app.get('/', routes.index);

// JSON API
var baseUrl = '/api/dataservice/',
    fbPrefix = 'fb/'

app.get(baseUrl + 'Customers', api.customers);
//app.get(baseUrl + fbPrefix + 'CheckCustomers', api.checkFbCustomers);
app.get(baseUrl + 'Customer/:id', api.customer);
app.get(baseUrl + 'CustomersSummary', api.customersSummary);
app.get(baseUrl + 'CustomersSummaryByType', api.customersSummaryByType);
app.get(baseUrl + 'CustomerById/:id', api.customer);

app.post(baseUrl + 'PostCustomer', api.addCustomer);
app.post(baseUrl + 'AddOrEditCustomer', api.addOrEditCustomer);
app.put(baseUrl + 'PutCustomer/:id', api.editCustomer);
app.delete(baseUrl + 'DeleteCustomer/:id', api.deleteCustomer);

app.get(baseUrl + 'States', api.states);
app.get(baseUrl + 'Cities', api.cities);


app.get(baseUrl + 'CheckUnique/:id', api.checkUnique);

app.post(baseUrl + 'Login', api.login);
app.post(baseUrl + 'Logout', api.logout);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function () {
    console.log("CustMgr Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
