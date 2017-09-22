'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService', 'facebookService'];

    var FacebookCommentsController = function ($location, $filter, $window,
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

        function init() {
           initValues();
           getVideosList();
        }

        vm.getAllCommentsByPost = function (id) {
            if (!id) {
                return;
            }

            initValues();

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
                }
            );
        };

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
                }
            );
        }

        vm.getCommentsByPost = function () {
            if (!vm.postId) {
                return;
            }

            facebookService.video.getCommentsById(USERID + '_' + vm.postId, vm.token)
                .then(function (res) {
                    if (res && res.data) {
                        populateComments(res.data);
                        vm.nextCursor = res.paging.next;
                        vm.totalComments = res.summary.total_count;
                        vm.totalComments.actual += res.data.length;
                    }
                }
            );
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
                    }
                );
            }
        };

        vm.createCustomer = function (customer) {
            console.log(customer);
            modalService.show({
                templateUrl: '/app/customersApp/views/customers/partials/customerModal.html',
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

        function populateComments(comments) {
            var fbIds = [];

            comments.forEach(function (c) {
                var existedCommentByUsers = vm.comments.filter(function (item) {
                    return item.user.UID === c.from.id;
                });

                if (existedCommentByUsers.length === 0) {
                    var comment = new Comment();
                    comment.user.UID = c.from.id;
                    comment.user.username = c.from.name;
                    comment.user.userProfile = c.from.link;
                    comment.user.first_name = c.from.first_name;
                    comment.user.last_name = c.from.last_name;
                    comment.user.avatar = c.from.picture.data ? c.from.picture.data.url : '';
                    comment.messages = [{
                        text: c.message ? c.message : '(icon)'
                        // created: formatDateTime(new Date(c.created_time))
                    }]

                    vm.comments.push(comment);
                    fbIds.push(c.from.id);
                } else {
                    existedCommentByUsers[0].messages.push({
                        text: c.message ? c.message : '(icon)'
                        // created: formatDateTime(new Date(c.created_time))
                    });
                }
            });

            checkRegistered(fbIds);
        }

        function checkRegistered(fbIds) {
            dataService.checkCustomers(fbIds).then(function (res) {
                if (res && Array.isArray(res)) {
                    res.forEach(function (r) {
                        if (r && r.facebook && r.facebook.id) {
                            var comment = vm.comments.find(function (c) {
                                return c.user.id === r.facebook.id
                            });

                            if (comment) {
                                comment.user.registered = true;
                            }
                        }
                    });
                }
            });
        }

        function initValues() {
            vm.searchTerm = null;
            vm.totalComments = {
                fb: 0,
                actual: 0
            };

            vm.comments = [];
            vm.nextCursor = null;
        }

        function getVideosList() {
            FB.api('/me/videos/uploaded', function (res) {
                if (res) {
                    vm.videos = res.data || [];
                }
            });
        }

        function formatDateTime(d) {
            return [
                d.toLocaleTimeString(),
                ', ',
                d.getDay(),
                '/',
                d.getMonth() + 1,
                '/',
                d.getYear()
            ].join('');
        }

        init();
    };

    FacebookCommentsController.$inject = injectParams;

    app.register.controller('FacebookCommentsController', FacebookCommentsController);

});
