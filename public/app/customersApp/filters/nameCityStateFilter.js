'use strict';

define(['app'], function (app) {

    var nameCityStateFilter = function () {

        return function (customers, filterValue) {
            if (!filterValue) {
                return customers;
            }

            var matches = [],
                i = 0,
                cust;
            filterValue = filterValue.toLowerCase();
            for (i = 0; i < customers.length; i = i + 1) {
                cust = customers[i];
                if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                        cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                        cust.city.toLowerCase().indexOf(filterValue) > -1 ||
                        (cust.phone && cust.phone.toLowerCase().indexOf(filterValue) > -1)) {

                    matches.push(cust);
                }
            }
            return matches;
        };
    };

    app.filter('nameCityStateFilter', nameCityStateFilter);

});
