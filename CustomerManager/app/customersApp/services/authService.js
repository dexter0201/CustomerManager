'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', '$q'];

    var authFactory = function ($http, $rootScope, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {
                loginPath: '/login',
                user: {
                    isAuthenticated: false,
                    isLoggedFB: false,
                    id: null,
                    name: null,
                    avatar: null,
                    profileLink: null,
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

        factory.loginWithFB = function () {
            var defer = $q.defer();

            FB.login(function (res) {
                fbAuthResponseChange(res);

                if (res.status === 'connected') {
                    defer.resolve(true);
                } else {
                    defer.reslove(false);
                }
            }, {scope: 'public_profile,email,user_videos,user_posts,read_mailbox'});

            return defer.promise;
        };

        factory.logout = function () {
            var _self = this;

            if (factory.user.isLoggedFB) {
                FB.logout(function (res) {
                    $rootScope.$apply(function () {
                        $rootScope.user = _self.user = {};
                    });
                    factory.user.isLoggedFB = false;
                    factory.user.id = null;
                });

                changeAuth(false);
            }

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
                fbAuthResponseChange(res);
            });
        };

        factory.getUserInfo = function () {
            if (!factory.user.isLoggedFB) {
                FB.api('/me', {
                    fields: 'link,name,picture'
                }, function (res) {
                    factory.user.name = res.name;
                    factory.user.profileLink = res.link;
                    factory.user.avatar = res.picture.data.url;
                });
            }
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        function fbAuthResponseChange(res) {
            if (res.status === 'connected') {
                /**
                 * The user is already logged,
                 * is possible retrieve his/her personal info
                 */
                factory.getUserInfo();

                /**
                 * This is also the point where you should create
                 * a session for the current user.
                 * For this purpose you can use the data inside the
                 * res.authResponse object
                 */
                changeAuth(true);
                factory.user.isLoggedFB = true;
                factory.user.id = res.authResponse.userID;
            } else {
                /**
                 * The user is not logged to the app, or into Facebook:
                 * destrpoy the session on the server.
                 */
                changeAuth(false);
                factory.user.isLoggedFB = false;
                factory.user.id = null;
            }
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
