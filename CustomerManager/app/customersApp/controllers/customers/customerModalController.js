'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$modalInstance', 'customer'];

    var CustomerModalController = function ($scope, $modalInstance, customer) {
        var vm = this;

        vm.customer = customer;

        $scope.modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
        $scope.modalOptions.ok = function (result) {
            $modalInstance.close('ok');
        };
        $scope.modalOptions.close = function (result) {
            $modalInstance.close('cancel');
        };

        function init() {
            console.log(customer);
        }

        init();
    };

    CustomerModalController.$inject = injectParams;

    app.controller('CustomerModalController', CustomerModalController);
});
