angular.module('veganRecipe.controllers', [])


/**
 * App
 */
.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, $cordovaGeolocation,AuthFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.registration = {};
    $scope.loggedIn = false;

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        $scope.closeLogin();
    };

    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });



    /*
    * Page add recipe
    * Liaison vers BD
    */

    $scope.addrecipe = {};
    $ionicModal.fromTemplateUrl('templates/addrecipe.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.addrecipeForm = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeAddrecipe = function () {
        $scope.addrecipeForm.hide();
    };

    // Open the login modal
    $scope.showAddrecipe = function () {
        $scope.addrecipeForm.show();
    };

    $scope.AddRecipe = function () {

    console.log('Doing Add recipe', $scope.addrecipe);

            // Simulate a registration delay. Remove this and replace with your registration
            // code if using a registration system
            $timeout(function () {
                $scope.closeAddrecipe();
            }, 1000);
        };


    /*
    * Create the login modal that we will use later
    * Liaison vers BD
    */


    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the login modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;

        AuthFactory.register($scope.registration);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $localStorage.storeObject('userinfo',$scope.loginData);
    });

    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            //problem avec $cordovaCamera.DestinationType.FILE_URL, ou FILE_URL ou DATA_URI
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {//imageURIimageData
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            $scope.registerform.show();
        };

          var pickoptions = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
          };

        $scope.pickImage = function() {
          $cordovaImagePicker.getPictures(pickoptions)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                      $scope.registration.imgSrc = results[0];
                  }
              }, function (error) {
                  // error getting photos
              });
        };

    });
})

/**
*  RecipesController
*/

.controller('RecipesController', ['$scope', 'recipesFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, recipesFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    recipesFactory.query(
        function (response) {
            $scope.recipes = response;
        },
        function (response) {
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else if (setTab === 4) {
            $scope.filtText = "drink";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function (recipeid) {
        console.log("recipeid is " + recipeid);

        favoriteFactory.save({id: recipeid});//_id for mongoDB
        $ionicListDelegate.closeOptionButtons();

        $ionicPlatform.ready(function () {

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.recipes[recipeid].title
                }).then(function () {
                    console.log('Added Favorite '+$scope.recipes[recipeid].title);
                },
                function () {
                    console.log('Failed to add Favorite ');
                });

              $cordovaToast
                  .show('Added Favorite '+$scope.recipes[recipeid].title, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });


        });
    }
}])


/**
 * Recipe detail
 */
.controller('RecipeDetailController', ['$scope', '$state', '$stateParams', 'recipesFactory', 'favoriteFactory', 'commentFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', '$cordovaSocialSharing', function ($scope, $state, $stateParams, recipesFactory, favoriteFactory, commentFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast, $cordovaSocialSharing) {

    $scope.baseURL = baseURL;

     $scope.recipe = recipesFactory.get({
            id: $stateParams.id
        },
            function (response) {
                $scope.recipe = response;
            },
            function (response) {
            }
        );

        console.log($scope.recipe);



    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/recipe-detail-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
    });

    $scope.addFavorite = function () {
        console.log("index is " + $stateParams.id);

        favoriteFactory.save({_id: $stateParams.id});;
        $scope.popover.hide();


        $ionicPlatform.ready(function () {

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.recipe.title
                }).then(function () {
                    console.log('Added Favorite '+$scope.recipe.title);
                },
                function () {
                    console.log('Failed to add Favorite ');
                });

              $cordovaToast
                  .show('Added Favorite '+$scope.recipe.title, 'long', 'bottom')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });


        });

    };

    $scope.mycomment = {
        rating: 5,
        comment: ""
    };

    $scope.submitComment = function () {

        commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        $scope.closeCommentForm();


        $scope.mycomment = {
            rating: 5,
            comment: ""
        };

        $state.go($state.current, null, {reload: true});
    }

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/recipe-comment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.commentForm = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeCommentForm = function () {
        $scope.commentForm.hide();
    };

    // Open the login modal
    $scope.showCommentForm = function () {
        $scope.commentForm.show();
        $scope.popover.hide();
    };

    $ionicPlatform.ready(function() {

        var message = $scope.recipe.summary;
        var subject = $scope.recipe.title;
        var link = $scope.baseURL+$scope.recipe.image;
        var image = $scope.baseURL+$scope.recipe.image;

        $scope.nativeShare = function() {
            $cordovaSocialSharing
                .share(message, subject, link); // Share via native share sheet
        };

        //checkout http://ngcordova.com/docs/plugins/socialSharing/
        // for other sharing options
    });

}])


/**
 * Index controller
 */
.controller('IndexController', ['$scope', 'recipesFactory', 'baseURL', function ($scope, recipesFactory, baseURL) {

    $scope.baseURL = baseURL;
    //recipes
    recipesFactory.query({
            featured: "true"
        },
            function (response) {
                var recipes = response;
                $scope.recipe = recipes[0];
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );


}])

/**
 * About
 */
.controller('AboutController', ['$scope', 'baseURL', function ($scope,  baseURL) {

    $scope.baseURL = baseURL;


}])

/**
 * Favorites
 */
.controller('FavoritesController', ['$scope', '$state', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$ionicPlatform', '$cordovaVibration', function ($scope, $state, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $ionicPlatform, $cordovaVibration) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    favoriteFactory.query(
        function (response) {
            $scope.recipes = response.recipes;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    console.log($scope.recipes);


    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (recipeid) {

        var confirmPopup = $ionicPopup.confirm({
            title: '<h3>Confirm Delete</h3>',
            template: '<p>Are you sure you want to delete this item?</p>'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.delete({id: recipeid});

               $state.go($state.current, {}, {reload: true});
               // $window.location.reload();
            } else {
                console.log('Canceled delete');
            }
        });
        $scope.shouldShowDelete = false;


    }

}])

/**
 *  INSTAGRAM controller
 */

.controller('InstaCtrl', ['$scope', '$http', function($scope, $http){

  var userFeed = $scope.userFeed;

  userFeed = new Instafeed({
        clientId: '633451b360954f9eac3090d8f2cef264',
        userId: '5768253461',
        accessToken: '5768253461.633451b.6cae0e0c9c4747d088428eb1bc9acbc3',
        target:'instafeed',
        get: 'user',
        tagName: 'recettevegan',
        links: true,
        limit: 25,
        sortBy: 'most-recent',
        resolution: 'standard_resolution',
        template: '<div class="card"><a href="{{link}}"><img class="img-responsive" src="{{image}}" alt="{{caption}}" /></a><p class="padding">{{caption}}</p><i class="padding"><span>like : {{likes}} </span> | <span> Comments : {{comments}}</span></i></div>'
    });
    userFeed.run();
console.log($scope.userFeed);
}])

;//controller
