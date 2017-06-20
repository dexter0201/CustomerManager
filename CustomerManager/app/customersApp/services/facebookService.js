'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var facebookService = function ($http, $q) {
        var serviceBase = 'https://graph.facebook.com/',
            factory = {
                post: {},
                video: {}
            };

        factory.video.getCommentsById = function (id, token) {
            var defer = $q.defer();

            FB.api(
                '/' + id + '/comments', {
                    fields: 'from{link,name,picture},id,message,created_time',
                    summary: true
                }, function (res) {
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

        return factory;
    };

    facebookService.$inject = injectParams;

    app.factory('facebookService', facebookService);

});