'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope'];

    var authFactory = function ($http, $rootScope) {
        var serviceBase = '/api/dataservice/',
            factory = {
                loginPath: '/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.login = function (email, password) {
            return $http.post(serviceBase + 'login', { userLogin: { userName: email, password: password } }).then(
                function (results) {
                    var loggedIn = results.data.status;;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.logout = function () {
            var _self = this;

            FB.logout(function (res) {
                $rootScope.$apply(function () {
                    $rootScope.user = _self.user = {};
                });
            });

            return $http.post(serviceBase + 'logout').then(
                function (results) {
                    var loggedIn = !results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        factory.watchAuthenticationStatusChange = function () {
            var _self = this;

            FB.Event.subscribe('auth.authResponseChange', function (res) {
                if (res.status === 'connected') {
                    /**
                     * The user is already logged,
                     * is possible retrieve his/her personal info
                     */
                    _self.getUserInfo();

                    /**
                     * This is also the point where you should create
                     * a session for the current user.
                     * For this purpose you can use the data inside the
                     * res.authResponse object
                     */
                } else {
                    /**
                     * The user is not logged to the app, or into Facebook:
                     * destrpoy the session on the server.
                     */
                }
            });
        };

        factory.getUserInfo = function () {
            var _self = this;

            FB.api('/me', function (res) {
                $rootScope.$apply(function () {
                    $rootScope.user = _self.user = res;
                });
            });
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
