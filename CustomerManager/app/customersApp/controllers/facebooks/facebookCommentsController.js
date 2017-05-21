'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService', '$http'];

    var FacebookCommentsController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService, $http) {

        var vm = this;

        function Comment() {
            this.name = null;
            this.UID = null;
            this.text = null;
        }

        vm.comments = [];
     // vm.filteredCustomers = [];
        // vm.filteredCount = 0;
        // vm.orderby = 'lastName';
        // vm.reverse = false;
        // vm.searchText = null;
        // vm.cardAnimationClass = '.card-animation';

        // //paging
        // vm.totalRecords = 0;
        // vm.pageSize = 10;
        // vm.currentPage = 1;

        // vm.pageChanged = function (page) {
        //     vm.currentPage = page;
        //     getCustomersSummary();
        // };

        // vm.deleteCustomer = function (id) {
        //     if (!authService.user.isAuthenticated) {
        //         $location.path(authService.loginPath + $location.$$path);
        //         return;
        //     }

        //     var cust = getCustomerById(id);
        //     var custName = cust.firstName + ' ' + cust.lastName;

        //     var modalOptions = {
        //         closeButtonText: 'Cancel',
        //         actionButtonText: 'Delete Customer',
        //         headerText: 'Delete ' + custName + '?',
        //         bodyText: 'Are you sure you want to delete this customer?'
        //     };

        //     modalService.showModal({}, modalOptions).then(function (result) {
        //         if (result === 'ok') {
        //             dataService.deleteCustomer(id).then(function () {
        //                 for (var i = 0; i < vm.customers.length; i++) {
        //                     if (vm.customers[i].id === id) {
        //                         vm.customers.splice(i, 1);
        //                         break;
        //                     }
        //                 }
        //                 filterCustomers(vm.searchText);
        //             }, function (error) {
        //                 $window.alert('Error deleting customer: ' + error.message);
        //             });
        //         }
        //     });
        // };

        // vm.DisplayModeEnum = {
        //     Card: 0,
        //     List: 1
        // };

        // vm.changeDisplayMode = function (displayMode) {
        //     switch (displayMode) {
        //         case vm.DisplayModeEnum.Card:
        //             vm.listDisplayModeEnabled = false;
        //             break;
        //         case vm.DisplayModeEnum.List:
        //             vm.listDisplayModeEnabled = true;
        //             break;
        //     }
        // };

        // vm.navigate = function (url) {
        //     $location.path(url);
        // };

        // vm.setOrder = function (orderby) {
        //     if (orderby === vm.orderby) {
        //         vm.reverse = !vm.reverse;
        //     }
        //     vm.orderby = orderby;
        // };

        // vm.searchTextChanged = function () {
        //     filterCustomers(vm.searchText);
        // };

        function init() {
            getCommentsByPost('1881435888795791');
        }

        function getCommentsByPost(id) {
            var token = 'EAACEdEose0cBAGXOpAzsyK1LBcbLZA995ZALXHprX9OkNuAwzZBD5ccUQCZBqbq3rVhUntOWrAZBkscyaPeBJ8PSHc2jFSEUYTkA9KagJK4l2DqRPpYrvnr5gJ8GBaONAcs9YOgCscvLiovq0ZAp1ma1l7at9mpKILEQdRNZA89SGqFhLztGZBdwVbsZCq9wLaU0ZD';
            var url = 'https://graph.facebook.com/{object-id}/comments';

            $http.get(url.replace('{object-id}', id) + '?access_token=' + token)
                .success(function (res) {
                    if (res && res.data) {
                        res.data.forEach(function (c) {
                            var comment = new Comment();

                            comment.name = c.from.name;
                            comment.UID = c.from.id;
                            comment.text = c.message;

                            vm.comments.push(comment);
                        });
                    }
                });


            // dataService.getCustomersSummary(vm.currentPage - 1, vm.pageSize)
            // .then(function (data) {
            //     vm.totalRecords = data.totalRecords;
            //     vm.customers = data.results;
            //     filterCustomers(''); //Trigger initial filter

            //     $timeout(function () {
            //         vm.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
            //     }, 1000);

            // }, function (error) {
            //     $window.alert('Sorry, an error occurred: ' + error.data.message);
            // });
        }

        // function filterCustomers(filterText) {
        //     vm.filteredCustomers = $filter("nameCityStateFilter")(vm.customers, filterText);
        //     vm.filteredCount = vm.filteredCustomers.length;
        // }

        // function getCustomerById(id) {
        //     for (var i = 0; i < vm.customers.length; i++) {
        //         var cust = vm.customers[i];
        //         if (cust.id === id) {
        //             return cust;
        //         }
        //     }
        //     return null;
        // }

        init();
    };

    FacebookCommentsController.$inject = injectParams;

    app.register.controller('FacebookCommentsController', FacebookCommentsController);

});