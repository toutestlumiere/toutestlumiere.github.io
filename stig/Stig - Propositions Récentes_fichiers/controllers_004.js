/**
 * Created by lecourtoisg on 23/01/16.
 */

angular.module('stigv1.controllers.search', [])


	.controller('SearchController', function ($scope, $location, Proposition, $timeout) {


		$scope.order = 'search';

		$scope.searchdata = {};


		$scope.searchMode = 'proposition';

		$scope.searchdata.request = '';

		$scope.loaded = true;
		$scope.idTimer = null;

		$scope.propositions = [];



		$scope.searchProp = function(){
			$scope.searchMode = 'proposition';
		};

		$scope.searchUser = function(){
			$scope.searchMode = 'user';
		};


		$scope.onRequestChange = function () {


			console.info($scope.searchdata.request);

			$scope.loaded = false;




			$timeout.cancel($scope.idTimer);


			var nTime = $scope.searchdata.request.length>1?400:0;


			$scope.idTimer = $timeout(function(){

					if($scope.searchdata.request && $scope.searchdata.request.length > 0) {

						$scope.load(false);

					} else {
						$scope.load(true);
					}

				},nTime
			);







		};






		$scope.$watch('searchMode', function (news, olds) {

			if($scope.searchdata.request && $scope.searchdata.request.length > 0) {

				$scope.load(true);

			}

		});



		$scope.$watch('statescope', function (news, olds) {

			console.log('change scope : ', news, olds);

			if($scope.searchdata.request && $scope.searchdata.request.length > 0) {

				$scope.load(true);

			}

		});


		$scope.load = function (empty) {


			console.info($scope.searchdata.request);


			if (empty) {
				$scope.propositions = [];
			}


			//

			$scope.loaded = false;


			Proposition.getSearch($scope.searchdata.request,$scope.searchMode).success(function (data, status) {

				$scope.propositions = data.results;

				console.info($scope.searchdata.request, '-> ', data.searchProp);

				//$scope.propositions = [];

				$scope.loaded = true;

			}).finally(function () {

				//$scope.$broadcast('scroll.refreshComplete');
			});


		};


		//$scope.load(true)


	})






	.controller('DisAddPropositionController2', function ($scope, $location, Proposition, $timeout) {




		$scope.searchdata = {};


		$scope.searchMode = 'proposition';

		$scope.searchdata.request = '';

		$scope.loaded = true;
		$scope.idTimer = null;

		$scope.propositions = [];




		$scope.onRequestChange = function () {





			console.info($scope.searchdata.request);

			$scope.loaded = false;




			$timeout.cancel($scope.idTimer);


			var nTime = $scope.searchdata.request.length>1?400:0;


			$scope.idTimer = $timeout(function(){

					if($scope.searchdata.request && $scope.searchdata.request.length > 0) {

						$scope.load(true);

					} else {
						$scope.load(true);
					}

				},nTime
			);

		};







		$scope.load = function (empty) {


			console.info("load : ", $scope.searchdata.request);


			if (empty) {
				$scope.propositions = [];
			}


			//

			$scope.loaded = false;


			Proposition.getSearch($scope.searchdata.request,'propositions').success(function (data, status) {



				//console.info($scope.searchdata.request, ' -> ', data.searchProp,data.results);

				$scope.propositions = data.results;


				//console.info($scope.searchdata.request, ' -> ', $scope.propositions, data.searchProp,data.results);






				$scope.loaded = true;

			}).finally(function () {

				//$scope.propositions = [];
				$scope.loaded = true;

				//$scope.$broadcast('scroll.refreshComplete');
			});


		};


		//$scope.load(true)


	});