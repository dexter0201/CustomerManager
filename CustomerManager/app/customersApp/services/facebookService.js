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
            return $http({
                url: serviceBase + id + '/comments',
                method: 'GET',
                params: {
                    access_token: token,
                    fields: 'from{link,name,picture},id,message,created_time',
                    summary: true
                }
            }).then(function (res) {
                return res.data;
            });
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