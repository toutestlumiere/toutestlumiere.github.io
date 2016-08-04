angular.module("stigv1.directives.scopehandle", [])




.directive('stigScopeHandler', function () {


	var controller = ['$scope','Config','$ionicModal','$rootScope', function ($scope,Config,$ionicModal,$rootScope) {



		$scope.clickable = true;

		$scope.onScopeClick = function () {


			if(Config.getScope() == 'local'){

				/**
				if($rootScope.townname == 'NUIT DEBOUT'){
					Config.setScope('local');
				} else {
					Config.setScope('national');
				}

				 /**/


				Config.setScope('national');
				Config.store();
			} else {
				Config.setScope('local');
				Config.store();


				/**
				//ON va tester si on a le droit ou s'il faut demander
				if(Config.getMember() > 0 && true){
					Config.setScope('local');
				} else {



					Config.updateTownName().success(function(data, status){

						if(data && data.length){
							if(Config.getMember() > 0){
								Config.setScope('local');
							} else {
								$scope.openTown();
							}

						}

					});
				}
				 /**/

			}



		};



		/**
		 * Systeme de catégories
		 */

			// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/membertown.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modalcat = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeTown = function () {
			$scope.modalcat.hide();
		};

		// Open the login modal
		$scope.openTown = function () {

			$scope.modalcat.show();
		};


	}];


	return {
		restrict: 'E',
		replace: true,
		controller : controller,

		templateUrl: 'templates/partials/scopehandler.html'
	}


});