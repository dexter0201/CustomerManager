'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService', 'facebookService'],
        FacebookCommentsController = function ($location, $filter, $window,
            $timeout, authService, dataService, modalService, facebookService) {

            var vm = this,
                paging = false;

            vm.currentUser = authService.user;

            function Comment() {
                this.messages = [];
                this.user = {
                    UID: null,
                    username: null,
                    first_name: null,
                    last_name: null,
                    userProfile: null,
                    avatar: null,
                    registered: false
                };
                this.isCollapsed = true;
            }

            function resetValues() {
                vm.searchTerm = null;
                vm.totalComments = {
                    fb: 0,
                    actual: 0
                };

                vm.comments = [];
                vm.nextCursor = null;
            }

            function getVideosList() {
                facebookService.video.getUploaded().then(function (videos) {
                    vm.videos = videos;
                    vm.videos = vm.videos.map(function (c) {
                        c.created_time = new Date(c.created_time);
                        return c;
                    });
                });
            }

            function saveCustomerByComment(comment) {
                var phonePosition = -1,
                    addressPosition = -1,
                    phoneNumber,
                    address,
                    relateInfo,
                    isAvailableToSave = (function () {
                        if (comment.message) {
                            phonePosition = comment.message.indexOf('0');
                            addressPosition = comment.message.indexOf('//');

                            if (phonePosition === 0 || (phonePosition > 0 && (comment.message[phonePosition - 1] === ' ' || comment.message[phonePosition - 1] === '.'))) {
                                return true;
                            }

                            if (addressPosition > -1) {
                                return true;
                            }
                        }

                        return false;
                    }());

                if (isAvailableToSave) {
                    if (comment.message.indexOf('.', phonePosition) > -1) {
                        phoneNumber = comment.message.slice(phonePosition, comment.message.indexOf('.', phonePosition));
                    } else if (comment.message.indexOf(' ') > -1) {
                        phoneNumber = comment.message.slice(phonePosition, comment.message.indexOf(' ', phonePosition));
                    } else {
                        phoneNumber = comment.message.slice(phonePosition);
                    }

                    phoneNumber = phoneNumber.length < 10 ? undefined : phoneNumber;
                    address = comment.message.slice(addressPosition, comment.message.indexOf(' ', addressPosition));

                    if (!phoneNumber && !address) {
                        return;
                    }

                    relateInfo = comment.message;
                    facebookService.saveAsDaisyCustomer(comment.from, phoneNumber, address, relateInfo);
                }
            }

            function init() {
                getVideosList();
            }

            function populateComments(comments) {
                comments.forEach(function (c) {
                    var existedCommentByUsers = vm.comments.filter(function (item) {
                        return item.user.UID === c.from.id;
                    }),
                        comment;

                    if (existedCommentByUsers.length === 0) {
                        comment = new Comment();
                        comment.user.UID = c.from.id;
                        comment.user.username = c.from.name;
                        comment.user.userProfile = c.from.link;
                        comment.user.first_name = c.from.first_name;
                        comment.user.last_name = c.from.last_name;
                        comment.user.avatar = c.from.picture.data ? c.from.picture.data.url : '';
                        comment.messages = [{
                            text: c.message || '(icon)'
                        }];

                        vm.comments.push(comment);
                    } else {
                        existedCommentByUsers[0].messages.push({
                            text: c.message || '(icon)'
                        });
                    }

                    saveCustomerByComment(c);
                });
            }

            function getAllNextComments(nextCursor) {
                facebookService.video.getNextComments(nextCursor)
                    .then(function (res) {
                        if (res && res.data) {
                            populateComments(res.data);
                            vm.totalComments.actual += res.data.length;

                            if (res.paging.next) {
                                getAllNextComments.call(null, res.paging.next);
                            }
                        }
                    });
            }

            /*function checkRegistered(fbIds) {
                dataService.checkCustomers(fbIds).then(function (res) {
                    if (res && Array.isArray(res)) {
                        res.forEach(function (r) {
                            if (r && r.facebook && r.facebook.id) {
                                var comment = vm.comments.find(function (c) {
                                    return c.user.id === r.facebook.id;
                                });

                                if (comment) {
                                    comment.user.registered = true;
                                }
                            }
                        });
                    }
                });
            }*/

            init();

            // =============== PUBLIC METHOD ====================
            vm.getAllCommentsByPost = function (id) {
                if (!id) {
                    return;
                }

                resetValues();

                vm.currentVideoId = id;

                facebookService.video.getCommentsById(vm.currentUser.id + '_' + id)
                    .then(function (res) {
                        if (res && res.data) {
                            populateComments(res.data);
                            vm.totalComments.fb = res.summary.total_count;
                            vm.totalComments.actual += res.data.length;

                            if (res.paging.next) {
                                getAllNextComments(res.paging.next);
                            }
                        }
                    });
            };

            vm.getNextComments = function () {
                if (vm.nextCursor && !paging) {
                    paging = true;
                    facebookService.video.getNextComments(vm.nextCursor)
                        .then(function (res) {
                            if (res && res.data) {
                                populateComments(res.data);
                                vm.totalComments.actual += res.data.length;
                                vm.nextCursor = res.paging.next;
                                paging = false;
                            }
                        });
                }
            };

            vm.createCustomer = function (customer) {
                console.log(customer);
                modalService.show({
                    templateUrl: 'public/app/customersApp/views/customers/partials/customerModal.html',
                    controller: 'CustomerModalController as vm',
                    resolve: {
                        customer: function () {
                            return customer;
                        }
                    }
                }, {
                    closeButtonText: 'Đóng',
                    actionButtonText: 'Lưu',
                    headerText: 'Lưu thông tin khách hàng',
                    bodyText: 'Perform this action?'
                });
            };

            vm.sendMessage = function (customer) {
                window.FB.ui({
                    method: 'send',
                    link: 'https://www.facebook.com/DaisyFashionShopp',
                    to: customer.UID
                });
            };
        };

    FacebookCommentsController.$inject = injectParams;
    app.register.controller('FacebookCommentsController', FacebookCommentsController);
});
