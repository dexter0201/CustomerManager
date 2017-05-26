'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataService', 'modalService', 'facebookService'];

    var FacebookCommentsController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService, facebookService) {

        var vm = this,
            paging = false,
            USERID = '346868925485831';

        vm.searchTerm = null;
        vm.postId = null;

        function Comment() {
            this.username = null;
            this.UID = null;
            this.messages = null;
            this.userProfile = null;
            this.avatar = null;
        }

        vm.comments = [];
        vm.curentCursor = null;

        function init() {
            // getCommentsByPost('1881435888795791');
        }

        vm.getCommentsByPost = function () {
            //346868925485831_733757866796933 : Example video
            //1481856742087043_1881435888795791 : Dexter post
            if (!vm.postId) {
                return;
            }

            facebookService.video.getCommentsById(USERID + '_' + vm.postId, vm.token)
                .then(function (res) {
                    if (res && res.data) {
                        populateComments(res.data);
                        vm.curentCursor = res.paging.next;
                    }
                }
            );
        };

        vm.getNextComments = function () {
            if (vm.curentCursor && !paging) {
                paging = true;
                facebookService.video.getNextComments(vm.curentCursor)
                    .then(function (res) {
                        if (res && res.data) {
                            populateComments(res.data);
                            vm.curentCursor = res.paging.next;
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