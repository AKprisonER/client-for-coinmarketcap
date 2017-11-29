'use strict';
angular.module('main').controller('TabsCtrl', function ($scope, $state) {
  $scope.openTab = function (tab) {
    $state.go(tab);
  };
}).controller('ListCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $localStorage, $log, $http, $timeout, $ionicModal, $ionicPlatform, API, currencySymbols) {
  $scope.$storage = $localStorage;
  $scope.show = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 5000
    });
  };
  $scope.hide = function () {
    $ionicLoading.hide();
  };
  $scope.getCoins = function () {
    $scope.show();
    $scope.currencies = [];
    $log.log('Downloading: https://api.coinmarketcap.com/v1/ticker/?limit=100&convert=' + $scope.$storage.mainCurrencyUpper);
    API.getData('https://api.coinmarketcap.com/v1/ticker/?limit=100&convert=' + $scope.$storage.mainCurrencyUpper).then(function (values) {
      if (values.length > 0) {
        angular.forEach(values, function (value, key) {
          if ($scope.$storage.mainCurrency === 'btc' || $scope.$storage.mainCurrency === 'usd' || $scope.$storage.mainCurrency === 'eth') {
            $scope.currencies.push({
              'id': value.id,
              'rank': parseFloat(value.rank),
              'name': value.name,
              'symbol': value.symbol,
              'available_supply': parseFloat(value.available_supply),
              'total_supply': parseFloat(value.total_supply),
              'percent_change_1h': parseFloat(value.percent_change_1h),
              'percent_change_24h': parseFloat(value.percent_change_24h),
              'percent_change_7d': parseFloat(value.percent_change_7d),
              'price': parseFloat(value[$scope.$storage.priceJsonKey]),
              // Important
              'market_cap': parseFloat(value[$scope.$storage.marketCapJsonKey]),
              'volume_24h': parseFloat(value[$scope.$storage.volume24JsonKey]),
              'last_updated': parseFloat(value.last_updated)
            });
          } else {
            $scope.currencies.push({
              'id': value.id,
              'rank': parseFloat(value.rank),
              'name': value.name,
              'symbol': value.symbol,
              'available_supply': parseFloat(value.available_supply),
              'total_supply': parseFloat(value.total_supply),
              'percent_change_1h': parseFloat(value.percent_change_1h),
              'percent_change_24h': parseFloat(value.percent_change_24h),
              'percent_change_7d': parseFloat(value.percent_change_7d),
              'price': parseFloat(value[$scope.$storage.priceJsonKey]).toFixed(3),
              'market_cap': parseFloat(value[$scope.$storage.marketCapJsonKey]),
              'volume_24h': parseFloat(value[$scope.$storage.volume24JsonKey]),
              'last_updated': parseFloat(value.last_updated)
            });
          }
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $scope.hide();
    });
  };
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
	$scope.modal2 = $ionicModal.fromTemplate('<div class="modal"><header class="bar bar-header bar-light"> <h1 class="title">Full List</h1><div class="button button-clear" ng-click="modal2.hide()"><span class="icon ion-close"></span></div></header><content has-header="true" padding="true"><p ng-repeat="currency in currencies">{{curreny.title}}</p></content></div>', {
      scope: $scope
    });
  $scope.cryptoDetail = function (currency) {
    $scope.$storage.cryptoDetail = currency;
    $scope.$storage.cryptoCurrencySlug = currency.id;
    $scope.$storage.cryptoCurrencySymbol = currency.symbol;
    $state.go('main.topDetail');
  };
  $scope.sortBy = function (sort, rev) {
    $scope.$storage.listSorting = sort;
    $scope.$storage.listSortingReverse = rev;
    $log.log('Sort by: ' + $scope.$storage.listSorting + ' - ' + $scope.$storage.listSortingReverse);
  };
  $scope.openCurrencyOptions = function () {
    document.addEventListener("deviceready", onDeviceReady, false);
	  function onDeviceReady() {
      // Prepare the picker configuration
      var config = {
        title: 'Choose Currency',
        items: [
          {
            text: 'USD - $',
            value: 'usd'
          },
          {
            text: 'BTC - \u20BF',
            value: 'btc'
          },
          {
            text: 'ETH - Ξ',
            value: 'eth'
          },
          {
            text: 'EUR - \u20AC',
            value: 'eur'
          },
          {
            text: 'AUD - A$',
            value: 'aud'
          },
          {
            text: 'BRL - R$',
            value: 'brl'
          },
          {
            text: 'CAD - C$',
            value: 'cad'
          },
          {
            text: 'CHF - Fr',
            value: 'chf'
          },
          {
            text: 'CNY - \xA5',
            value: 'cny'
          },
          {
            text: 'GBP - \xA3',
            value: 'gbp'
          },
          {
            text: 'HKD - HK$',
            value: 'hkd'
          },
          {
            text: 'IDR - Rp',
            value: 'idr'
          },
          {
            text: 'INR - \u20B9',
            value: 'inr'
          },
          {
            text: 'JPY - \xA5',
            value: 'jpy'
          },
          {
            text: 'KRW - \u20A9',
            value: 'krw'
          },
          {
            text: 'MXN - Mex$',
            value: 'mxn'
          },
          {
            text: 'RUB - \u20BD',
            value: 'rub'
          }
        ],
        selectedValue: $scope.$storage.mainCurrency,
        doneButtonLabel: 'Done',
        cancelButtonLabel: 'Cancel'
      };
      // Show the picker
      window.plugins.listpicker.showPicker(config, function (item) {
        $scope.$apply(function () {
          $scope.$storage.mainCurrencyUpper = item.toUpperCase();
          $scope.$storage.mainCurrency = item;
          $scope.$storage.priceJsonKey = 'price_' + item;
          $scope.$storage.marketCapJsonKey = 'market_cap_' + item;
          $scope.$storage.volume24JsonKey = '24h_volume_' + item;
          $scope.$storage.globalMarketCapJsonKey = 'total_market_cap_' + item;
          $scope.$storage.globalVolume24hJsonKey = 'total_24h_volume_' + item;
          $scope.$storage.mainCurrencySymbol = currencySymbols[item.toUpperCase()];
          $scope.getCoins();
        });
        $log.log('Currency: ' + item);
      }, function () {
        $log.log('Currency Options closed');
      });
    }
  };
  $scope.openSortingyOptions = function () {
    $ionicPlatform.ready(function () {
      // Prepare the picker configuration
      var config = {
        title: 'Sort List',
        items: [
          {
            text: 'Market Cap \u25B2',
            value: 'rank-d'
          },
          {
            text: 'Market Cap \u25BC',
            value: 'rank-a'
          },
          {
            text: 'Volume 24h \u25BC',
            value: 'volume-d'
          },
          {
            text: 'Volume 24h \u25B2',
            value: 'volume-a'
          },
          {
            text: 'Name \u25BC',
            value: 'name-d'
          },
          {
            text: 'Name \u25B2',
            value: 'name-a'
          },
          {
            text: 'Price \u25BC',
            value: 'price-d'
          },
          {
            text: 'Price \u25B2',
            value: 'price-a'
          },
          {
            text: 'Change \u25BC',
            value: 'change-d'
          },
          {
            text: 'Change \u25B2',
            value: 'change-a'
          }
        ],
        selectedValue: $scope.$storage.sortingSelection,
        doneButtonLabel: 'Done',
        cancelButtonLabel: 'Cancel'
      };
      // Show the picker
      window.plugins.listpicker.showPicker(config, function (item) {
        switch (item) {
        case 'rank-d':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'rank';
            $scope.$storage.listSortingReverse = true;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Market Cap \u25B2';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'rank-a':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'rank';
            $scope.$storage.listSortingReverse = false;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Market Cap \u25BC';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'volume-d':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'volume_24h';
            $scope.$storage.listSortingReverse = true;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Volume 24h \u25BC';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'volume-a':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'volume_24h';
            $scope.$storage.listSortingReverse = false;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Volume 24h \u25B2';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'name-d':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'name';
            $scope.$storage.listSortingReverse = true;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Name \u25BC';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'name-a':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'name';
            $scope.$storage.listSortingReverse = false;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Name \u25B2';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'price-d':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'price';
            $scope.$storage.listSortingReverse = true;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Price \u25BC';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'price-a':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'price';
            $scope.$storage.listSortingReverse = false;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Price \u25B2';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'change-d':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'percent_change_24h';
            $scope.$storage.listSortingReverse = true;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Change \u25BC';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        case 'change-a':
          $scope.$apply(function () {
            $scope.$storage.listSorting = 'percent_change_24h';
            $scope.$storage.listSortingReverse = false;
            $scope.$storage.sortingSelection = item;
            $scope.$storage.sortingDisplay = 'Change \u25B2';
          });
          $log.log('Sorting: ' + $scope.$storage.listSorting + ' / ' + $scope.$storage.listSortingReverse);
          break;
        }
      }, function () {
        $log.log('Sorting Options closed');
      });
    });
  };
  if (!$scope.$storage.mainCurrency) {
    $scope.$storage.sortingSelection = 'rank-a';
    $scope.$storage.sortingDisplay = 'Market Cap \u25BC';
  }
  $scope.writeMail = function () {
    document.addEventListener('deviceready', function () {
      cordova.plugins.email.open({
        to: 'hey@condacore.com',
        subject: 'CoinMarketCap App',
        body: 'Hey,<br><br>',
        isHtml: true
      });
    }, false);  // End Device Ready
  };
  $scope.openTwitter = function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
      cordova.InAppBrowser.open('twitter://user?screen_name=condacore', '_system', 'location=yes');
    }
  };
  $scope.openWebsite = function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
      cordova.InAppBrowser.open('https://condacore.com', '_system', 'location=yes');
    }
  };
  $scope.rateApp = function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
      var isIOS = ionic.Platform.isIOS();
      if (isIOS) {
        cordova.InAppBrowser.open('itms-apps://itunes.apple.com/app/id1261889758?action=write-review', '_system', 'location=yes');
      } else {
        cordova.InAppBrowser.open('market://details?id=com.condacore.coinmktcap', '_system', 'location=yes');
      }
    }
  };
  $scope.shareApp = function () {
    $ionicPlatform.ready(function () {
      // this is the complete list of currently supported params you can pass to the plugin (all optional)
      var options = {
        message: 'Get the famous CoinMarketCap Website as an App right to your Smartphone!\n',
        // not supported on some apps (Facebook, Instagram)
        subject: 'Download the CoinMarketCap App',
        // fi. for email
        //files: ['', ''], // an array of filenames either locally or remotely
        url: 'https://coinmarketcap.mobi/',
        chooserTitle: 'Pick an app'  // Android only, you can override the default share sheet title
      };
      var onSuccess = function (result) {
        console.log('Share completed? ' + result.completed);
        // On Android apps mostly return false even while it's true
        console.log('Shared to app: ' + result.app);  // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
      };
      var onError = function (msg) {
        console.log('Sharing failed with message: ' + msg);
      };
      window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    });
  };
  if (!$scope.$storage.mainCurrency) {
    $scope.openCurrencyOptions();
  } else {
    $scope.getCoins();
  }
$scope.refreshCoins = function() {
	$ionicHistory.clearCache().then(function () {
          $scope.getCoins();
        });
};
  if (!window.cordova) {
    $scope.$storage.mainCurrencyUpper = 'USD';
    $scope.$storage.mainCurrency = 'usd';
    $scope.$storage.priceJsonKey = 'price_usd';
    $scope.$storage.marketCapJsonKey = 'market_cap_usd';
    $scope.$storage.volume24JsonKey = '24h_volume_usd';
    $scope.$storage.globalMarketCapJsonKey = 'total_market_cap_usd';
    $scope.$storage.globalVolume24hJsonKey = 'total_24h_volume_sud';
    $scope.$storage.mainCurrencySymbol = currencySymbols.USD;
    $scope.getCoins();
  }
}).controller('AllCoinsCtrl', function ($scope, $state, $ionicLoading, $log, $localStorage, API) {
  $scope.$storage = $localStorage;
  $scope.getAllCoins = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 5000
    });
    $scope.allCoins = [];
    $log.log('Downloading: https://api.condacore.com/cryptocurrencies/static/all.json');
    API.getData('https://api.condacore.com/cryptocurrencies/static/all.json').then(function (values) {
      if (values.length > 0) {
        angular.forEach(values, function (value, key) {
          $scope.allCoins.push(value);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $ionicLoading.hide();
    });
  };
  $scope.cryptoDetail = function (all) {
    $scope.$storage.cryptoDetail = all;
    $scope.$storage.cryptoCurrencySlug = all.slug;
    $scope.$storage.cryptoCurrencySymbol = all.symbol;
    $state.go('main.fullDetail');
  };
  $scope.getAllCoins();
}).controller('DetailCtrl', function ($scope, $state, $log, $filter, $http, $timeout, $cordovaDevice, $localStorage, $ionicLoading, API, isTopTab, isFullTab) {
  $scope.$storage = $localStorage;
  $scope.getCurrencyDetails = function () {
    $ionicLoading.show({
      template: 'Refreshing...',
      duration: 5000
    });
    $scope.details = [];
    $log.log('Loading Details from Server: https://api.coinmarketcap.com/v1/ticker/' + $scope.$storage.cryptoCurrencySlug + '/?convert=' + $scope.$storage.mainCurrencyUpper);
    API.getData('https://api.coinmarketcap.com/v1/ticker/' + $scope.$storage.cryptoCurrencySlug + '/?convert=' + $scope.$storage.mainCurrencyUpper).then(function (values) {
      if (values.length > 0) {
        angular.forEach(values, function (value, key) {
          //$scope.coindata.push(value);
          $scope.details.push({
            'id': value.id,
            'rank': parseFloat(value.rank),
            'name': value.name,
            'symbol': value.symbol,
            'available_supply': parseFloat(value.available_supply),
            'total_supply': parseFloat(value.total_supply),
            'percent_change_1h': parseFloat(value.percent_change_1h),
            'percent_change_24h': parseFloat(value.percent_change_24h),
            'percent_change_7d': parseFloat(value.percent_change_7d),
            'price': parseFloat(value[$scope.$storage.priceJsonKey]),
            'market_cap': parseFloat(value[$scope.$storage.marketCapJsonKey]),
            'volume_24h': parseFloat(value[$scope.$storage.volume24JsonKey]),
            'last_updated': parseFloat(value.last_updated)
          });
        });
        $scope.$storage.shareName = $scope.details[0].name;
        $scope.$storage.shareSlug = $scope.details[0].id;
        $scope.$storage.shareSymbol = $scope.details[0].symbol;
        $scope.$storage.sharePrice = $scope.details[0].price;
        $scope.$storage.shareChange = $scope.details[0].percent_change_24h;
        $scope.$storage.shareVolume = $scope.details[0].volume_24h;
        $scope.$storage.shareMarketCap = $scope.details[0].market_cap;
        $log.log('Server: ' + $scope.$storage.shareName);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $ionicLoading.hide();
    });
  };
  $scope.getCurrencyDetailsFromStorage = function () {
    $log.log('Loading Details from Local Strorage');
    $scope.details = [];
    $scope.details.push($scope.$storage.cryptoDetail);
    $scope.$storage.shareName = $scope.$storage.cryptoDetail.name;
    $scope.$storage.shareSlug = $scope.$storage.cryptoDetail.id;
    $scope.$storage.shareSymbol = $scope.$storage.cryptoDetail.symbol;
    $scope.$storage.sharePrice = $scope.$storage.cryptoDetail.price;
    $scope.$storage.shareChange = $scope.$storage.cryptoDetail.percent_change_24h;
    $scope.$storage.shareVolume = $scope.$storage.cryptoDetail.volume_24h;
    $scope.$storage.shareMarketCap = $scope.$storage.cryptoDetail.market_cap;
    $log.log('Local:' + $scope.$storage.shareName);
    $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.$broadcast('scroll.refreshComplete');
  };
  if (!$scope.$storage.cryptoDetail.id) {
    $scope.getCurrencyDetails();
  } else {
    $scope.getCurrencyDetailsFromStorage();
  }
  $scope.navigateTo = function (ctrl) {
    $state.go(ctrl);
  };
  if (isTopTab) {
    $scope.historyState = 'main.topHistory';
    $scope.chartState = 'main.topCharts';
    $scope.marketsState = 'main.topMarkets';
    $scope.newsState = 'main.topNews';
  }
  if (isFullTab) {
    $scope.historyState = 'main.fullHistory';
    $scope.chartState = 'main.fullCharts';
    $scope.marketsState = 'main.fullMarkets';
    $scope.newsState = 'main.fullNews';
  }
  $scope.showActionSheet = function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
      window.plugins.actionsheet.show({
        buttonLabels: [
          'Share Rates',
          'Open on coinmarketcap.com'
        ],
        title: $scope.$storage.shareName + ' Options',
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton: true,
        winphoneEnableCancelButton: true
      }, function (buttonIndex) {
        switch (buttonIndex) {
        case 1:
          var options = {
            message: 'Current #' + $scope.$storage.shareName + ' ( $' + $scope.$storage.shareSymbol + ' ) ' + 'Rates:\n\nPrice: ' + $scope.$storage.mainCurrencySymbol + $filter('numberWithCommas')($scope.$storage.sharePrice) + '\nChange 24h: ' + $filter('numberWithCommas')($scope.$storage.shareChange) + '%\nMarket Cap: ' + $scope.$storage.mainCurrencySymbol + $filter('numberWithCommas')($scope.$storage.shareMarketCap) + '\n\n',
            // not supported on some apps (Facebook, Instagram)
            subject: 'Current ' + $scope.$storage.shareName + ' (' + $scope.$storage.shareSymbol + ') ' + 'Rates',
            // fi. for email
            url: 'https://coinmarketcap.mobi',
            chooserTitle: 'Pick an app'  // Android only, you can override the default share sheet title
          };
          var onSuccess = function (result) {
            console.log('Share completed? ' + result.completed);
            // On Android apps mostly return false even while it's true
            console.log('Shared to app: ' + result.app);  // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
          };
          var onError = function (msg) {
            console.log('Sharing failed with message: ' + msg);
          };
          window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
          break;
        case 2:
          cordova.InAppBrowser.open('https://coinmarketcap.com/currencies/' + $scope.$storage.shareSlug + '/', '_blank', 'location=yes');
          break;
        case 3:
          $log.log('Action Sheet: canceled');
          break;
        }
      });
    }
  };
}).controller('GlobalInfoCtrl', function ($scope, $state, $ionicLoading, $localStorage, $log, $http, $timeout, API, currencySymbols) {
  $scope.$storage = $localStorage;
  $scope.symbol = currencySymbols[$scope.$storage.mainCurrencyUpper];
  $scope.getGlobalInfo = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 5000
    });
    $scope.globals = [];
    $log.log('Downloading:  https://api.coinmarketcap.com/v1/global/?convert=' + $scope.$storage.mainCurrencyUpper);
    API.getData('https://api.coinmarketcap.com/v1/global/?convert=' + $scope.$storage.mainCurrencyUpper).then(function (value) {
      //if (values.length > 0) {
      $scope.globals.push({
        'total_market_cap': value[$scope.$storage.globalMarketCapJsonKey],
        'total_24h_volume': value[$scope.$storage.globalVolume24hJsonKey],
        'bitcoin_percentage_of_market_cap': value.bitcoin_percentage_of_market_cap,
        'active_currencies': value.active_currencies,
        'active_assets': value.active_assets,
        'active_markets': value.active_markets
      });
      //  });
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');  /*} else {

      }*/
    }).then(function () {
      $ionicLoading.hide();
    });
  };
  $scope.getGlobalInfo();
}).controller('MarketCapHistoryCtrl', function ($scope, $log, $http, $timeout, $cordovaDevice, $localStorage, $ionicLoading, API, currencySymbols) {
  $scope.$storage = $localStorage;
  $scope.show = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 5000
    });
  };
  $scope.hide = function () {
    $ionicLoading.hide();
  };
  $scope.$storage = $localStorage;
  $scope.getHistory = function (selection) {
    $log.log('Loading...');
    $scope.show();
    $scope.marketCapHistory = [];
    $log.log('Downloading: https://coincap.io/history/365day/' + $scope.$storage.shareSymbol);
    API.getData('https://coincap.io/history/365day/' + $scope.$storage.shareSymbol).then(function (values) {
      if (values.market_cap.length > 0) {
        angular.forEach(values[selection], function (value, key) {
          $scope.marketCapHistory.push(value);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $scope.hide();
    });
  };
  $scope.showHistory = function (selection) {
    $scope.getHistory(selection);
    $scope.selected = selection;
  };
  $scope.selected = 'market_cap';
  $scope.getHistory('market_cap');
}).controller('MarketsCtrl', function ($scope, $log, $http, $timeout, $cordovaDevice, $localStorage, $ionicLoading, $ionicPopover, API) {
  $scope.$storage = $localStorage;
  $scope.getMarkets = function () {
    $log.log('Loading...');
    $ionicLoading.show({
      template: 'Loading...',
      duration: 2000
    });
    $scope.markets = [];
    //$log.log('Downloading: https://api.cryptonator.com/api/full/' + $scope.$storage.cryptoCurrencySymbol + '-usd');
    $log.log('https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=' + $scope.$storage.shareSymbol + '&tsym=' + $scope.market);
    API.getData('https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=' + $scope.$storage.shareSymbol + '&tsym=' + $scope.market).then(function (values) {
      if (values.Data.Exchanges.length > 0) {
        angular.forEach(values.Data.Exchanges, function (value, key) {
          $scope.markets.push(value);
        });
        $scope.timestamp = values.Data.AggregatedData.LASTUPDATE;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $ionicLoading.hide();
    });
  };
  $scope.marketValueToShow = 'PRICE';
  $scope.showActionSheet = function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
      window.plugins.actionsheet.show({
        buttonLabels: [
          'Current Price',
          'Volume 24h',
          'Open 24h',
          'High 24h',
          'Low 24h'
        ],
        title: 'What do you want to see?',
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton: true,
        winphoneEnableCancelButton: true
      }, function (buttonIndex) {
        switch (buttonIndex) {
        case 1:
          $scope.$apply(function () {
            $scope.marketValueToShow = 'PRICE';
            $scope.headerText = 'Price';
          });
          break;
        case 2:
          $scope.$apply(function () {
            $scope.marketValueToShow = 'VOLUME24HOUR';
            $scope.headerText = 'Volume 24h';
          });
          break;
        case 3:
          $scope.$apply(function () {
            $scope.marketValueToShow = 'OPEN24HOUR';
            $scope.headerText = 'Open 24h';
          });
          break;
        case 4:
          $scope.$apply(function () {
            $scope.marketValueToShow = 'HIGH24HOUR';
            $scope.headerText = 'High 24h';
          });
          break;
        case 5:
          $scope.$apply(function () {
            $scope.marketValueToShow = 'LOW24HOUR';
            $scope.headerText = 'Low 4h';
          });
          break;
        case 6:
          $log.log('Action Sheet: canceled');
          break;
        }
      });
    }
  };
  $scope.changeMarket = function (c) {
    $scope.market = c;
    $scope.getMarkets();
  };
  if ($scope.$storage.cryptoCurrencySymbol === 'BTC') {
    $scope.market = 'USD';
  } else {
    $scope.market = 'BTC';
  }
  $scope.headerText = 'Price';
  $scope.getMarkets();
  function numberWithCommas(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}).controller('NewsCtrl', function ($scope, $log, $http, $timeout, $cordovaDevice, $localStorage, $ionicLoading, API) {
  $scope.$storage = $localStorage;
  $scope.show = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 5000
    });
  };
  $scope.hide = function () {
    $ionicLoading.hide();
  };
  $scope.$storage = $localStorage;
  $scope.getNews = function () {
    $log.log('Loading...');
    $scope.show();
    $scope.news = [];
    $log.log('Downloading: https://api.condacore.com/cryptocurrencies/news/?keyword=' + $scope.$storage.shareName);
    API.getData('https://api.condacore.com/cryptocurrencies/news/?keyword=' + $scope.$storage.shareName).then(function (values) {
      if (values.length > 0) {
        angular.forEach(values, function (value, key) {
          $scope.news.push(value);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $scope.hide();
    });
  };
  $scope.getNews();
  $scope.openInBrowser = function (newsLink) {
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
      cordova.InAppBrowser.open(newsLink, '_blank', 'location=yes');
    }  // End Device Ready
  };
}).controller('ChartCtrl', function ($scope, $log, $http, $timeout, $cordovaDevice, $localStorage, $ionicLoading, $filter, API) {
  $scope.$storage = $localStorage;
  $scope.show = function () {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 5000
    });
  };
  $scope.hide = function () {
    $ionicLoading.hide();
  };
  $scope.$storage = $localStorage;
  $scope.getChartData = function () {
    $log.log('Loading...');
    $scope.show();
    $scope.price_data = [];
    $scope.price_labels = [];
    $scope.marketcap_data = [];
    $scope.marketcap_labels = [];
    $scope.volume_data = [];
    $scope.volume_labels = [];
    $log.log('Downloading: http://coincap.io/history' + $scope.timespan + '/' + $scope.$storage.shareSymbol);
    API.getData('http://coincap.io/history' + $scope.timespan + '/' + $scope.$storage.shareSymbol).then(function (values) {
      if (values.price.length > 0) {
        angular.forEach(values.price, function (value, key) {
          $scope.price_data.push(value[1]);
          $scope.price_labels.push($filter('date')(value[0], 'medium'));
        });
        angular.forEach(values.volume, function (value, key) {
          $scope.volume_data.push(value[1]);
          $scope.volume_labels.push($filter('date')(value[0], 'medium'));
        });
        angular.forEach(values.market_cap, function (value, key) {
          $scope.marketcap_data.push(value[1]);
          $scope.marketcap_labels.push($filter('date')(value[0], 'medium'));
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      } else {
      }
    }).then(function () {
      $scope.hide();
    });
  };
  $scope.timespan = '/1day';
  $timeout(function () {
    $scope.getChartData();
  }, 500);
  $scope.series = [
    'Price',
    'Average Estimated Effort',
    'Average Remainning Effort'
  ];
  $scope.colors = ['#ff6384'];
  $scope.options = {
    animation: false,
    responsive: true,
    tooltipEvents: [
      'mousemove',
      'touchstart',
      'touchmove'
    ],
    elements: {
      point: { radius: 0 },
      line: { fill: false }
    },
    scales: {
      yAxes: [{ display: true }],
      xAxes: [{ display: false }]
    }
  };
  $scope.changeTimespan = function (timespan) {
    $scope.timespan = timespan;
    $scope.getChartData();
  };
});