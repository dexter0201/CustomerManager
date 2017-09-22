'use strict';

define(['app'], function (app) {
    var highlightFilter = function ($sce) {

        return function (text, phrase) {
            if (phrase) {
                text = text.replace(
                    new RegExp('('+phrase+')', 'gi'),
                    '<span class="highlightedText">$1</span>'
                );
            }

            return $sce.trustAsHtml(text);
        };
    };

    app.filter('highlightFilter', highlightFilter);
});