'use strict';

define(['customersApp/services/routeResolver'], function () {

    var app = angular.module('customersApp', ['ngRoute', 'ngAnimate', 'routeResolverServices',
                                              'wc.directives', 'wc.animations', 'ui.bootstrap', 'breeze.angular', 'infinite-scroll']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder.
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/customers', route.resolve('Customers', 'customers/', 'vm'))
                .when('/customerorders/:customerId', route.resolve('CustomerOrders', 'customers/', 'vm', true))
                .when('/customeredit/:customerId', route.resolve('CustomerEdit', 'customers/', 'vm', true))
                .when('/orders', route.resolve('Orders', 'orders/', 'vm'))
                .when('/facebook', route.resolve('FacebookComments', 'facebooks/', 'vm', true))
                .when('/about', route.resolve('About', '', 'vm'))
                .when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
                .otherwise({ redirectTo: '/customers' });

    }]);

    app.run(['$rootScope', '$location', '$window', 'authService',
        function ($rootScope, $location, $window, authService) {

            //Client-side security. Server-side framework MUST add it's
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

            $rootScope.user = {};

            $window.fbAsyncInit = function () {
                // Executed when the SDK is loaded
                FB.init({
                    /**
                     * The app id of the web app
                     * To register a new app visit Facebook App Dashboard
                     * https://developers.facebook.com/apps/
                     */
                    appId: '402099460169195',//

                    /**
                     * Adding a Channel File improves the performance
                     * of the javascript SDK, by addressing issues with
                     * cross-domain communication in certain browsers.
                     */
                    channelUrl: 'app/channel.html',

                    /**
                     * Set if you want to check the authentication status
                     * at the start up of the app
                     */
                    status: true,

                    /**
                     * Enable cookies to allow the server to access
                     * the session
                     */
                    cookie: true,

                    /**
                     * Parse XFBML
                     */
                    xfbml: true,

                    /**
                     * Facebook API version
                     */
                    version: 'v2.9'
                });

                FB.AppEvents.logPageView();

                authService.watchAuthenticationStatusChange();
            };

            (function (d, id, script) {
                // Load the Facebook javascript SDK
                var js,
                    ref = d.getElementsByTagName(script)[0];

                if (d.getElementById(id)) {
                    return;
                }

                js = d.createElement(script);
                js.id = id;
                js.async = true;
                js.src = '//connect.facebook.net/en_US/sdk.js';

                ref.parentNode.insertBefore(js, ref);
            }(document, 'facebook-jssdk', 'script'));

    }]);

    return app;

});





