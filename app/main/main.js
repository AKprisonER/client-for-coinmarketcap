'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ngStorage',
  'ui.router',
  'chart.js'
]).run(function ($ionicPlatform, $rootScope, $state, $timeout, $cordovaNetwork, $ionicLoading, $window, $log) {
  $ionicPlatform.ready(function () {
    $log.log('Im ready');
    // Screen Größe anpassen
    if ($window.MobileAccessibility) {
      $window.MobileAccessibility.usePreferredTextZoom(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // Check network status
    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
      $ionicLoading.hide();
    });
    $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
      $log.log(navigator.notification);
      $ionicLoading.show({
        template: 'No Connection',
        duration: 3000
      });
    });
  });
}).config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.tabs.position('bottom');
  //$ionicConfigProvider.scrolling.jsScrolling(false);
  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/topList');
  $stateProvider  // this state is placed in the <ion-nav-view> in the index.html
.state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'main/templates/tabs.html',
    controller: 'TabsCtrl as ctrl'
  }).state('main.topList', {
    url: '/topList',
    views: {
      'tab-top': {
        templateUrl: 'main/templates/list.html',
        controller: 'ListCtrl as ctrl'
      }
    }
  }).state('main.topDetail', {
    url: '/topDetail',
    views: {
      'tab-top': {
        templateUrl: 'main/templates/list-detail.html',
        controller: 'DetailCtrl as ctrl'
      }
    },
    resolve: {
      isTopTab: function () {
        return true;
      },
      isFullTab: function () {
        return false;
      }
    }
  }).state('main.topMarkets', {
    url: '/topMarkets',
    views: {
      'tab-top': {
        templateUrl: 'main/templates/detail-markets.html',
        controller: 'MarketsCtrl as ctrl'
      }
    }
  }).state('main.topHistory', {
    url: '/topHistory',
    views: {
      'tab-top': {
        templateUrl: 'main/templates/detail-marketcaphistory.html',
        controller: 'MarketCapHistoryCtrl as ctrl'
      }
    }
  }).state('main.topNews', {
    url: '/topNews',
    views: {
      'tab-top': {
        templateUrl: 'main/templates/detail-news.html',
        controller: 'NewsCtrl as ctrl'
      }
    }
  }).state('main.topCharts', {
    url: '/topCharts',
    views: { 
		'tab-top': { 
			templateUrl: 'main/templates/detail-charts.html', 
			controller: 'ChartCtrl as ctrl' 
		}
	}
  }).state('main.fullList', {
    url: '/fullList',
    views: {
      'tab-full': {
        templateUrl: 'main/templates/all-coins.html',
        controller: 'AllCoinsCtrl as ctrl'
      }
    }
  }).state('main.fullDetail', {
    url: '/fullDetail',
    views: {
      'tab-full': {
        templateUrl: 'main/templates/list-detail.html',
        controller: 'DetailCtrl as ctrl'
      }
    },
    resolve: {
      isTopTab: function () {
        return false;
      },
      isFullTab: function () {
        return true;
      }
    }
  }).state('main.fullMarkets', {
    url: '/fullMarkets',
    views: {
      'tab-full': {
        templateUrl: 'main/templates/detail-markets.html',
        controller: 'MarketsCtrl as ctrl'
      }
    }
  }).state('main.fullHistory', {
    url: '/fullHistory',
    views: {
      'tab-full': {
        templateUrl: 'main/templates/detail-marketcaphistory.html',
        controller: 'MarketCapHistoryCtrl as ctrl'
      }
    }
  }).state('main.fullNews', {
    url: '/fullNews',
    views: {
      'tab-full': {
        templateUrl: 'main/templates/detail-news.html',
        controller: 'NewsCtrl as ctrl'
      }
    }
  }).state('main.fullCharts', {
    url: '/fullCharts',
    views: { 
		'tab-full': { 
			templateUrl: 'main/templates/detail-charts.html', 
			controller: 'ChartCtrl as ctrl' 
		}
	}
  }).state('main.globalInfo', {
    url: '/globalInfo',
    views: {
      'tab-global': {
        templateUrl: 'main/templates/global-info.html',
        controller: 'GlobalInfoCtrl as ctrl'
      }
    }
  });
});