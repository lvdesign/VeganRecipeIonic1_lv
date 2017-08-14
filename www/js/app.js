// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('veganRecipe', ['ionic','ngCordova','veganRecipe.controllers', 'veganRecipe.services'])

.run(function($ionicPlatform,$rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
     if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
     }
      $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000);
               // $cordovaSplashscreen.show();


  });

    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })
  //home
  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'IndexController'
      }
    }
  })
  //about
  .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'mainContent': {
          templateUrl: 'templates/aboutus.html',
            controller: 'AboutController'
        }
      }
    })
  //fav
  .state('app.favorites', {
      url: '/favorites',
      cache:false,
      views: {
        'mainContent': {
          templateUrl: 'templates/favorites.html',
            controller:'FavoritesController'
        }
      }
    })

    //recipes
    .state('app.recipes', {
      url: '/recipes',
      views: {
        'mainContent': {
          templateUrl: 'templates/recipes.html',
          controller: 'RecipesController'
        }
      }
    })

    //details
    .state('app.recipedetails', {
    url: '/recipes/:id',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/recipedetail.html',
        controller: 'RecipeDetailController'
      }
    }
    })

    //details
    .state('app.instabase', {
    url: '/instabase',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/instabase.html',
        controller: 'InstaCtrl'
      }
    }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
