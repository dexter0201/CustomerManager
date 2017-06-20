require.config({
    baseUrl: 'app',
    urlArgs: 'v=1.0'
});

require(
    [
        'customersApp/animations/listAnimations',
        'app',
        'customersApp/directives/wcUnique',
        'customersApp/services/routeResolver',
        'customersApp/services/config',
        'customersApp/services/customersBreezeService',
        'customersApp/services/authService',
        'customersApp/services/customersService',
        'customersApp/services/facebookService',
        'customersApp/services/dataService',
        'customersApp/services/modalService',
        'customersApp/services/httpInterceptors',
        'customersApp/filters/nameCityStateFilter',
        'customersApp/filters/nameProductFilter',
        'customersApp/filters/highlightFilter',
        'customersApp/controllers/navbarController',
        'customersApp/controllers/orders/orderChildController',
        'customersApp/controllers/customers/customerModalController'
    ],
    function () {
        angular.bootstrap(document, ['customersApp']);
    });
