﻿'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService'],
        CustomersController = function ($location, $filter, $window,
            $timeout, authService, dataService, modalService) {

            var vm = this;

            vm.customers = [];
            vm.filteredCustomers = [];
            vm.filteredCount = 0;
            vm.orderby = 'lastName';
            vm.reverse = false;
            vm.searchText = null;
            vm.cardAnimationClass = '.card-animation';
            vm.CustomerTypeEnum = {
                retail: 1,
                whole: 2
            };

            vm.totalRecords = 0;
            vm.pageSize = 10;
            vm.currentPage = 1;
            vm.maxSize = 5;

            function filterCustomers(filterText) {
                vm.filteredCustomers = $filter("nameCityStateFilter")(vm.customers, filterText);
                vm.filteredCount = vm.filteredCustomers.length;
            }

            function getCustomersSummary() {
                dataService.getCustomersSummary(vm.currentPage - 1, vm.pageSize)
                    .then(function (data) {
                        vm.totalRecords = data.totalRecords;
                        vm.customers = data.results;
                        filterCustomers('');

                        $timeout(function () {
                            vm.cardAnimationClass = '';
                        }, 1000);

                    }, function (error) {
                        $window.alert('Sorry, an error occurred: ' + error.data.message);
                    });
            }

            function getCustomerSummaryByType(type) {
                dataService
                    .getCustomersSummaryByType(type, vm.currentPage - 1, vm.pageSize)
                    .then(function (data) {
                        vm.totalRecords = data.totalRecords;
                        vm.customers = data.results;
                        filterCustomers('');
                        $timeout(function () {
                            vm.cardAnimationClass = '';
                        }, 1000);
                    }, function (error) {
                        $window.alert('Sorry, an error occurred: ' + error.data.message);
                    });
            }

            function getCustomerById(id) {
                var i = 0,
                    cust;
                for (i = 0; i < vm.customers.length; i = i + 1) {
                    cust = vm.customers[i];
                    if (cust.id === id) {
                        return cust;
                    }
                }
                return null;
            }

            vm.pageChanged = function (page) {
                var currentType = vm.isDisplayWholeCustomer === true ? vm.CustomerTypeEnum.whole : vm.CustomerTypeEnum.retail;
                vm.currentPage = page;
                getCustomerSummaryByType(currentType);
            };

            vm.deleteCustomer = function (id) {
                if (!authService.user.isAuthenticated) {
                    $location.path(authService.loginPath + $location.$$path);
                    return;
                }

                var cust = getCustomerById(id),
                    modalOptions = {
                        closeButtonText: 'Huỷ',
                        actionButtonText: 'Xoá khách hàng',
                        headerText: 'Xoá ' + cust.facebook.name + '?',
                        bodyText: 'Bạn có chắc muốn xoá khách hàng này?'
                    },
                    i = 0;

                modalService.showModal({}, modalOptions).then(function (result) {
                    if (result === 'ok') {
                        dataService.deleteCustomer(id).then(function () {
                            for (i = 0; i < vm.customers.length; i = i + 1) {
                                if (vm.customers[i].id === id) {
                                    vm.customers.splice(i, 1);
                                    break;
                                }
                            }
                            filterCustomers(vm.searchText);
                        }, function (error) {
                            $window.alert('Có lỗi xảy ra khi xoá khách hàng: ' + error.message);
                        });
                    }
                });
            };

            vm.getCustomerSummaryByType = function (type) {
                switch (type) {
                case vm.CustomerTypeEnum.whole:
                    getCustomerSummaryByType(vm.CustomerTypeEnum.whole);
                    vm.isDisplayWholeCustomer = true;
                    break;
                case vm.CustomerTypeEnum.retail:
                    getCustomerSummaryByType(vm.CustomerTypeEnum.retail);
                    vm.isDisplayWholeCustomer = false;
                    break;
                }
            };

            vm.navigate = function (url) {
                $location.path(url);
            };

            vm.setOrder = function (orderby) {
                if (orderby === vm.orderby) {
                    vm.reverse = !vm.reverse;
                }
                vm.orderby = orderby;
            };

            vm.searchTextChanged = function () {
                filterCustomers(vm.searchText);
            };

            function init() {
                //createWatches();
                // getCustomersSummary();
                getCustomerSummaryByType(vm.CustomerTypeEnum.retail);
                vm.isDisplayWholeCustomer = false;
            }

            //function createWatches() {
            //    //Watch searchText value and pass it and the customers to nameCityStateFilter
            //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //    //while also accessing the filtered count via vm.filteredCount above

            //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
            //    vm.$watch("searchText", function (filterText) {
            //        filterCustomers(filterText);
            //    });
            //}

            init();
        };

    CustomersController.$inject = injectParams;

    app.register.controller('CustomersController', CustomersController);

});
