'use strict';
angular.module('main').filter('numberWithCommas', function () {
	return function(x) {
 	var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
	};
});
