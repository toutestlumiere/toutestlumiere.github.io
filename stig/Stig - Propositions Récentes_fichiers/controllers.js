angular.module('stigv1.controllers.amendements', [])

.controller('AmendementslistCtrl', function ($scope, $rootScope, $location, $stateParams, Proposition, $anchorScroll,$timeout) {

	//console.log($stateParams);





	$scope.id = $stateParams.propId;
	$scope.idamd = $stateParams.amdId || "none";
	$scope.amendements = [];

	$scope.proposition = {};


	$scope.loaded = false;

	$scope.settings = {};


	$scope.addAmendement = function(){

		var sPath = '/app/propositions/' + $stateParams.propId + '/amendements/add';
		$location.path(sPath);

	};



	$scope.notifChange = function(){

		//console.log('change ',$scope.settings.notifsubs);

		if($scope.settings.notifsubs){
			Proposition.subscribeAmendements($scope.id).success(function(){



			});
		} else {
			Proposition.unSubscribeAmendements($scope.id).success(function(){



			});
		}

	};


	$scope.scrollTo = function(id){

		//$anchorScroll.yOffset = 120;
		$anchorScroll(id);

	};


	$scope.load = function(empty) {


		//$ionicScrollDelegate.scrollTop();


		if(empty){
			$scope.amendements = [];
		}


		//

		Proposition.getAmendements($scope.id).success(function (data, status) {

			if (data.results && data.results.length) {

				$scope.amendements = data.results;
				$scope.voted = data.voted;

				$scope.proposition = data.proposition[0];

				$scope.loaded = true;

				$scope.settings.notifsubs = (data.amregister == "1" || data.amregister == 1);





			} else {
				$scope.amendements = [];
				$scope.voted = data.voted;
				$scope.proposition = data.proposition[0];
				$scope.loaded = true;



				$scope.settings.notifsubs = (data.amregister == "1" || data.amregister == 1);

			}


			//console.log('AmendementslistCtrl', $scope.amendements);


		}).finally(function() {

			$scope.$broadcast('scroll.refreshComplete');




			if($scope.idamd && $scope.idamd!='none'){
			$timeout(function(){
				//$scope.scrollTo("fcfb43db8541b0b6ab2dc04b75eb7c65bef1368b");
				//$scope.scrollTo("f8381bafef0688233bd47bb54115b5b5fcc45071");




					$scope.scrollTo($scope.idamd);


			},150)

		}



		});


		$scope.loaded = false;


	}


	$scope.load(true);




	$scope.$watch('refreshamds',function(news, olds){

		console.log('refreshamds : ', news, olds);

		if(news != olds){
			$scope.load(false);
		}

	});





})


	.controller('AddAmendementCtrl', function ($scope, $location, $stateParams, Proposition, $rootScope,$ionicHistory,$ionicContentBanner) {


		$scope.amdData = {};


		$scope.sending = false;


		$scope.id = $stateParams.propId;






		$scope.onAdd = function(){



			$scope.sending = true;



			var aErrors = [];





			if(!$scope.amdData.txt){

				aErrors.push("Vous n'avez pas saisi de texte pour cet amendement");


			}


			if($scope.amdData.txt && ($scope.amdData.txt.length < 5)){


				aErrors.push("Le texte de l'amendement semble trop court pour être intelligible");

			}


			if(aErrors.length > 0){

				$ionicContentBanner.show({
					text: [aErrors[0]],

					autoClose: 2600,
					type: 'error',
					transition: 'vertical'
				});


				$scope.sending = false;

				return;

			}

			// Décommenter pour tester le systeme simple de validation de formulaire
			//return;

			Proposition.addAmendement($scope.id, $scope.amdData.txt).success(function (data, status) {


				console.log('addAmendement status :', data, status);


				if(data.lastId && data.lastId.length > 0){

					$rootScope.refreshamds = Math.random();
					$rootScope.refreshprops = Math.random();

					$scope.amdData = {};


					/**/
					 $ionicHistory.nextViewOptions({
						disableBack: true
					});
					 /**/


					$rootScope.refreshcardfromid = $scope.id;





					history.back();


					$scope.sending = false;


					//var sPath = '/app/propositions/' + $stateParams.propId + '/amendements';
					//$location.path(sPath);





				}


				$scope.sending = false;

			});



		}





	});

