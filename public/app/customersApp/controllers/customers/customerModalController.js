'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$modalInstance', 'dataService', 'customer'],
        CustomerModalController = function ($scope, $modalInstance, dataService, customer) {
            var vm = this;

            vm.customer = customer;

            $scope.modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };
            $scope.modalOptions.ok = function (result) {
                dataService.insertOrUpdate({
                    firstName: vm.customer.first_name,
                    lastName: vm.customer.last_name,
                    phone: vm.customer.phone,
                    address: vm.customer.address,
                    typeId: vm.customer.typeId,
                    gender: 'Female', // TODO: change...
                    email: vm.customer.email,
                    fbId: vm.customer.UID,
                    fbName: vm.customer.username,
                    fbLink: vm.customer.userProfile,
                    fbAvatar: vm.customer.avatar,
                    fbRelateInfo: ''
                });
                $modalInstance.close('ok');
            };
            $scope.modalOptions.close = function (result) {
                $modalInstance.close('cancel');
            };

            function init() {
                vm.customer.email = 'dummy.email@gmail.com';
            }

            init();
        };

    CustomerModalController.$inject = injectParams;

    app.controller('CustomerModalController', CustomerModalController);
});
