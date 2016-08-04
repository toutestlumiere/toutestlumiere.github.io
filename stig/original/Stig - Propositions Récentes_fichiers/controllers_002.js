angular.module('stigv1.controllers.user', [])

.controller('UserCtrl', function ($scope, $location, $stateParams, UserInfo, User, $ionicContentBanner, Proposition) {


	$scope.loaded = false;

	$scope.propositions = [];

	console.log($stateParams,User.getId());

	$scope.id = $stateParams.id;

	if($stateParams.me){
		$scope.id = User.getId();
	}


		console.log($scope.id,$scope);



		$scope.clickItem = function (id) {

			$location.path('/app/propositions/' + id)

		};


	//La liste des proposition de la personne



	$scope.reloadProps = function(){

		Proposition.getAllByUserId($scope.id).success(function(data,status){



			$scope.propositions = data.results;

			//console.debug(data);

		});

	};





	$scope.reloadProps();


		$scope.onUser = function (id) {

			var sPath = '/app/user/' + id;
			$location.path(sPath)
		};




	$scope.successFunc = function (data, status) {

		if (data.results && data.results.length) {
			$scope.user = data.results[0];

			//$scope.user.followed = true;

			//console.log($scope.user);


			if(data.type == 'follow'){

				//console.log('Vous suivez à présent '+$scope.user.firstname);

				$ionicContentBanner.show({
					text: ['Vous suivez '+$scope.user.firstname+ ' '+$scope.user.lastname.substr(0,1)+'.'],

					autoClose: 2300,
					type: 'info',
					transition: 'vertical'
				});
			}


			$scope.loaded = true;
		} else {
			$scope.user = {};
			$scope.loaded = true;
		}


	}

	UserInfo.getById($scope.id).success($scope.successFunc);



	$scope.toggleFollow = function(){

		console.log($scope.user.followed);

		if($scope.user && $scope.user.followed == 1){
			console.log('on unfollow ...');
			UserInfo.unfollow($scope.id).success($scope.successFunc);
		} else {
			console.log('on follow !');
			UserInfo.follow($scope.id).success($scope.successFunc);
		}
	}



})

	.controller('FollowingController', function ($scope, $location, $stateParams, UserInfo, $ionicContentBanner, Proposition) {


		$scope.loaded = false;

		$scope.users = [];

		//console.log($stateParams);

		$scope.id = $stateParams.id;



		UserInfo.getFollowing($scope.id).success(function(data, status){

			if (data.results && data.results.length) {


				$scope.users = data.results;



			} else {
				$scope.users = [];
			}


		})





	})

	.controller('FollowerController', function ($scope, $location, $stateParams, UserInfo, $ionicContentBanner, Proposition) {


		$scope.loaded = false;

		$scope.users = [];

		//console.log($stateParams);

		$scope.id = $stateParams.id;



		UserInfo.getFollower($scope.id).success(function(data, status){

			if (data.results && data.results.length) {


				$scope.users = data.results;



			} else {
				$scope.users = [];
			}


		})





	})






;
