'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService', 'facebookService'];

    var FacebookCommentsController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService, facebookService) {

        var vm = this,
            paging = false,
            USERID = '346868925485831';

        function Comment() {
            this.username = null;
            this.UID = null;
            this.messages = null;
            this.userProfile = null;
            this.avatar = null;
            this.isCollapsed = true;
        }

        function init() {
            // getCommentsByPost('1881435888795791');
           initValues();
        }

        vm.getAllCommentsByPost = function () {
            if (!vm.postId) {
                return;
            }
       
            initValues();

            facebookService.video.getCommentsById(USERID + '_' + vm.postId, vm.token)
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

        function populateComments(comments) {
            comments.forEach(function (c) {
                var existedCommentByUsers = vm.comments.filter(function (item) {
                    return item.UID === c.from.id;
                });

                if (existedCommentByUsers.length === 0) {
                    var comment = new Comment();
                    comment.UID = c.from.id;
                    comment.username = c.from.name;
                    comment.userProfile = c.from.link;
                    comment.avatar = c.from.picture.data ? c.from.picture.data.url : '';
                    comment.messages = [{
                        text: c.message,
                        created: formatDateTime(new Date(c.created_time))
                    }]

                    vm.comments.push(comment);
                } else {
                    existedCommentByUsers[0].messages.push({
                        text: c.message,
                        created: formatDateTime(new Date(c.created_time))
                    });
                }
            });
        }
       
        function initValues() {
            vm.searchTerm = null;
            //vm.postId = null;
            vm.totalComments = {
                fb: 0,
                actual: 0
            };
       
            vm.comments = [];
            vm.nextCursor = null;
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
