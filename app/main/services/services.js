'use strict';
angular.module('main').factory('API', function ($http, $log) {
  var coins = [];
  return {
    getData: function (selection, $url) {
      var _url = selection;
      if (typeof $url !== 'undefined') {
        _url += $url;
      }
      return $http({
        method: 'GET',
        url: _url
      }).then(function (response) {
        // handle success things
        //if (response.data.status === appValue.API_SUCCESS) {
        coins = response.data;
        return coins;  //} else {
                        //return coins;
                        //}
      }, function error (response) {
        $log.log(response);
        return false;
      });
    }
  };
});
