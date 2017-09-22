'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams',
                        '$timeout', 'config', 'dataService', 'modalService'];

    var CustomerEditController = function ($scope, $location, $routeParams,
                                           $timeout, config, dataService, modalService) {

        var vm = this,
            customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0,
            timer,
            onRouteChangeOff;

        vm.customer = {};
        vm.cities = [];
        vm.title = (customerId > 0) ? 'Sửa' : 'Thêm';
        vm.buttonText = (customerId > 0) ? 'Cập nhật' : 'Thêm';
        vm.updateStatus = false;
        vm.errorMessage = '';

        vm.saveCustomer = function () {
            if ($scope.editForm.$valid) {
                if (!vm.customer.id) {
                    dataService.insertCustomer(vm.customer).then(processSuccess, processError);
                } else {
                    dataService.updateCustomer(vm.customer).then(processSuccess, processError);
                }
            }
        };

        vm.deleteCustomer = function () {
            var custName = vm.customer.firstName + ' ' + vm.customer.lastName;
            var modalOptions = {
                closeButtonText: 'Huỷ',
                actionButtonText: 'Xoá khách hàng',
                headerText: 'Xoá ' + custName + '?',
                bodyText: 'Bạn chắc chắn xoá khách hàng này?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteCustomer(vm.customer.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/customers');
                    }, processError);
                }
            });
        };

        function init() {
            if (customerId > 0) {
                dataService.getCustomer(customerId).then(function (customer) {
                    vm.customer = customer;
                    vm.customer.typeId = customer.type.id;
                }, processError);
            } else {
                dataService.newCustomer().then(function (customer) {
                    vm.customer = customer;
                });
            }

            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
        }

        init();

        function routeChange(event, newUrl, oldUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!vm.editForm || !vm.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Huỷ',
                actionButtonText: 'Loại bỏ thay đổi',
                headerText: 'Thay đổi chưa được lưu',
                bodyText: 'Những thay đổi của bạn chưa được lưu. Tiếp tục rời khỏi?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path($location.url(newUrl).hash()); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function getCities() {
            return dataService.getCities().then(function (cities) {
                vm.cities = cities;
            }, processError);
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            vm.updateStatus = true;
            vm.title = 'Sửa';
            vm.buttonText = 'Cập nhật';
            startTimer();
        }

        function processError(error) {
            vm.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.errorMessage = '';
                vm.updateStatus = false;
            }, 3000);
        }
    };

    CustomerEditController.$inject = injectParams;

    app.register.controller('CustomerEditController', CustomerEditController);

});