'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var customersFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.getCustomers = function (pageIndex, pageSize) {
            return getPagedResource('customers', {
                '$top': pageSize,
                '$skip': pageSize * pageIndex
            });
        };

        factory.getCustomersSummary = function (pageIndex, pageSize) {
            return getPagedResource('customersSummary', {
                '$top': pageSize,
                '$skip': pageSize * pageIndex
            });
        };

        factory.getCustomersSummaryByType = function (type, pageIndex, pageSize) {
            return getPagedResource('customersSummaryByType', {
                '$top': pageSize,
                '$skip': pageSize * pageIndex,
                '$type': type
            });
        };

        factory.getStates = function () {
            return $http.get(serviceBase + 'states').then(
                function (results) {
                    return results.data;
                });
        };

        factory.getCities = function () {
            return $http
                .get(serviceBase + 'cities')
                .then(function (results) {
                    return results.data;
                });
        };

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        factory.insertCustomer = function (customer) {
            return $http.post(serviceBase + 'postCustomer', customer).then(function (results) {
                customer.id = results.data.id;
                return results.data;
            });
        };

        factory.insertOrUpdate = function (customer) {
            return $http.post(serviceBase + 'addOrEditCustomer', customer).then(function (results) {
                customer.id = results.data.id;
                return results.data;
            });
        };

        factory.newCustomer = function () {
            return $q.when({
                id: 0,
                typeId: 1,
                gender: 'Female'
            });
        };

        factory.updateCustomer = function (customer) {
            return $http.put(serviceBase + 'putCustomer/' + customer.id, customer).then(function (status) {
                return status.data;
            });
        };

        factory.deleteCustomer = function (id) {
            return $http.delete(serviceBase + 'deleteCustomer/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getCustomer = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'customerById/' + id).then(function (results) {
                extendCustomers([results.data]);
                return results.data;
            });
        };

        factory.checkCustomers = function (fbIds) {
            return $http
                .get(serviceBase + 'fb/checkCustomers/' + '?fbIds=' + fbIds.join(','))
                .then(function (results) {
                    return results.data;
                });
        };

        function extendCustomers(customers) {
            var custsLen = customers.length;
            //Iterate through customers
            for (var i = 0; i < custsLen; i++) {
                var cust = customers[i];
                if (!cust.orders) continue;

                var ordersLen = cust.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = cust.orders[j];
                    order.orderTotal = order.quantity * order.price;
                }
                cust.ordersTotal = ordersTotal(cust);
            }
        }

        function getPagedResource(baseResource, params) {
            var resource = baseResource;

            resource += buildPagingUri(params);

            return $http.get(serviceBase + resource).then(function (response) {
                var custs = response.data;
                extendCustomers(custs);
                return {
                    totalRecords: parseInt(response.headers('X-InlineCount')),
                    results: custs
                };
            });
        }

        function buildPagingUri(params) {
            params = params || {};
            var uri = '?';

            uri += Object.keys(params).map(function (param) {
                return param + '=' + params[param];
            }).join('&');

            return uri;
        }

        function orderTotal(order) {
            return order.quantity * order.price;
        };

        function ordersTotal(customer) {
            var total = 0;
            var orders = customer.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        return factory;
    };

    customersFactory.$inject = injectParams;

    app.factory('customersService', customersFactory);

});
