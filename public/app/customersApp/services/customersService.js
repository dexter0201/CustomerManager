'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'],
        customersFactory = function ($http, $q) {
            var serviceBase = '/api/dataservice/',
                factory = {};

            function ordersTotal(customer) {
                var total = 0,
                    orders = customer.orders,
                    count = orders.length,
                    i = 0;

                for (i = 0; i < count; i = i + 1) {
                    total += orders[i].orderTotal;
                }
                return total;
            }

            function extendCustomers(customers) {
                var custsLen = customers.length,
                    i = 0,
                    j = 0,
                    cust,
                    ordersLen,
                    order;
                //Iterate through customers
                for (i = 0; i < custsLen; i = i + 1) {
                    cust = customers[i];
                    if (cust.orders) {
                        ordersLen = cust.orders.length;
                        for (j = 0; j < ordersLen; j = j + 1) {
                            order = cust.orders[j];
                            order.orderTotal = order.quantity * order.price;
                        }
                        cust.ordersTotal = ordersTotal(cust);
                    }
                }
            }

            function buildPagingUri(params) {
                params = params || {};
                var uri = '?';

                uri += Object.keys(params).map(function (param) {
                    return param + '=' + params[param];
                }).join('&');

                return uri;
            }

            function getPagedResource(baseResource, params) {
                var resource = baseResource;

                resource += buildPagingUri(params);

                return $http.get(serviceBase + resource).then(function (response) {
                    var custs = response.data;
                    extendCustomers(custs);
                    return {
                        totalRecords: parseInt(response.headers('X-InlineCount'), 10),
                        results: custs
                    };
                });
            }

            function orderTotal(order) {
                return order.quantity * order.price;
            }

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
                    }
                );
            };

            factory.getCities = function () {
                return $http
                    .get(serviceBase + 'cities')
                    .then(function (results) {
                        return results.data;
                    });
            };

            factory.checkUniqueValue = function (id, property, value) {
                if (!id) {
                    id = 0;
                }
                return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + window.escape(value)).then(
                    function (results) {
                        return results.data.status;
                    }
                );
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
                return $http['delete'](serviceBase + 'deleteCustomer/' + id).then(function (status) {
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
                        return results.data || [];
                    });
            };

            factory.checkFacebookCustomers = function (fbIds) {
                return $http.post(
                    serviceBase + 'fb/checkCustomers/',
                    {
                        fbIds: fbIds
                    }
                ).then(function (results) {
                    return results.data;
                });
            };

            return factory;
        };

    customersFactory.$inject = injectParams;

    app.factory('customersService', customersFactory);

});
