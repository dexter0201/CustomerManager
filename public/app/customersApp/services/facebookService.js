'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q', 'dataService'],
        FacebookService = function ($http, $q, dataService) {
            var serviceBase = 'https://graph.facebook.com/',
                factory = {
                    post: {},
                    video: {}
                },
                userFields = 'link,name,picture,first_name,last_name,email,gender';

            factory.video.getUploaded = function () {
                var defer = $q.defer();

                window.FB.api(
                    '/me/videos/uploaded',
                    {
                        fields: 'id,description,created_time'
                    },
                    function (res) {
                        if (res && res.data) {
                            defer.resolve(res.data);
                        } else {
                            defer.reject();
                        }
                    }
                );

                return defer.promise;
            };

            factory.video.getCommentsById = function (id, token) {
                var defer = $q.defer();

                window.FB.api(
                    '/' + id + '/comments',
                    {
                        fields: 'from{' + userFields + '},id,message,created_time',
                        summary: true
                    },
                    function (res) {
                        if (res) {
                            defer.resolve(res);
                        } else {
                            defer.reject();
                        }
                    }
                );

                return defer.promise;
            };

            factory.video.getNextComments = function (nextCursor) {
                return $http({
                    url: nextCursor,
                    method: 'GET'
                }).then(function (res) {
                    return res.data;
                });
            };

            /**
             *
             * RelateInfo will be removed. This is just a temp data
             **/
            factory.saveAsDaisyCustomer = function (fbCustomer, phone, address, relateInfo) {
                dataService.insertOrUpdate({
                    firstName: fbCustomer.first_name,
                    lastName: fbCustomer.last_name,
                    phone: phone,
                    address: address,
                    typeId: 1, // TODO: change...
                    gender: 'Female', // TODO: change...
                    email: 'dummy.email@gmail.com',
                    fbId: fbCustomer.id,
                    fbName: fbCustomer.name,
                    fbLink: fbCustomer.link,
                    fbAvatar: fbCustomer.picture && fbCustomer.picture.data ? fbCustomer.picture.data.url : '',
                    fbRelateInfo: relateInfo
                });
            };

            return factory;
        };

    FacebookService.$inject = injectParams;
    app.factory('facebookService', FacebookService);
});
