angular.module('stigv1.controllers', [])


	.controller('TutorialController', function ($scope, $ionicSlideBoxDelegate, $location, $ionicHistory) {


		console.log(this, "Enter Tuto Controller");


		$scope.nextSlide = function () {
			$ionicSlideBoxDelegate.$getByHandle('slidetutorial').next();
		};


		$scope.closeTuto = function () {


			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
			$location.path('/app/propositions/top');


			$ionicSlideBoxDelegate.$getByHandle('slidetutorial').slide(0, 0.1);
		};


		$scope.goBack = function () {

			history.back();
			//$scope.apply();

		}

	})
	/**/

	.controller('ProfilController', function ($scope, $location, Login, $ionicHistory, $rootScope) {


		console.log(this, "Enter Profil Controller");


		$scope.onLogout = function () {

			Login.logout();

			$rootScope.refreshamds = Math.random();
			$rootScope.refreshprops = Math.random();


			$ionicHistory.clearHistory();
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});

			$location.path('/entry');

		};


	})

	/**/


	.controller('AppCtrl', function ($scope, $ionicModal, $timeout, User) {
		// Form data for the login modal
		$scope.loginData = {};

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

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function () {
				$scope.closeLogin();
			}, 1000);
		};
	})


	.controller('DisAddPropositionController', function ($scope, Login, Config, $location, $ionicContentBanner) {


		$scope.adddata = {};


		if (!Login.isLogged()) {
			$location.path('/entry/subscribe');
		}


		$scope.goAdd = function () {


			$scope.adddata.ischecked = false;

			Config.setScope('national');

			$location.path('/app/propositions/dis2');

		};

		$scope.goAddLocal = function () {


			Config.setScope('local');
			$scope.adddata.ischecked = false;
			$location.path('/app/propositions/dis2');

		};


	})


	.controller('AddPropositionController', function ($scope, $rootScope, Login, $http, Config, Categories, Town, Backend, $location, $ionicHistory, $stateParams, Proposition, $ionicContentBanner, $timeout) {


		if (!Login.isLogged()) {
			$location.path('/entry/subscribe');
		}


		$scope.sending = true;
		$scope.editMode = false;


		$scope.propData = {};

		//console.info($location.search())










		$scope.onDraft = function () {
			console.log('draft', false, $scope.propData);


			$scope.doSendData(true);


		};


		$scope.onProd = function () {
			console.log('submit', true, $scope.propData);


			$scope.doSendData(false);


		};


		$scope.doSendData = function (bDraft) {


			console.info($scope.propData);


			var aErrors = [];


			if (!$scope.propData.idcategory) {
				aErrors.push('Veuillez selectionner une catégorie');
			}


			if (!$scope.propData.title) {

				aErrors.push("Vous n'avez pas saisi de synthèse");


			}


			if ($scope.propData.title && ($scope.propData.title.length < 5)) {


				aErrors.push("La synthèse semble trop courte pour être intelligible");

			}

			if (!$scope.propData.description && !bDraft) {


				aErrors.push("Vous n'avez pas saisi de description");

			}


			if (aErrors.length > 0) {

				$ionicContentBanner.show({
					text: [aErrors[0]],

					autoClose: 2600,
					type: 'error',
					transition: 'vertical'
				});

				return;

			}

			//TEST pout valide simple du formulaire
			//return;

			$scope.sending = true;

			sMethod = "POST";

			if ($scope.editMode) {
				sMethod = "PUT";
			}


			console.info($scope.editMode, sMethod);

			//return;

			var req = {
				method: sMethod,
				params: {
					'idcategory': $scope.propData.idcategory,
					'title': $scope.propData.title,
					'desc': $scope.propData.description,
					'finance': $scope.propData.financement,
					'draft': bDraft ? 1 : 0,
					'zone': $scope.propData.idzone,
					'scope': Config.getScope(),
					'idprop': $scope.prop ? $scope.prop.uid : null
				},
				url: Backend.makeURL('proposition/', true)
			};

			$http(req).success(function (data, status) {

				console.log('Prop Inserted :', data, status);


				if ($scope.editMode) {

					if (bDraft) {


						$ionicContentBanner.show({
							text: ['Brouillon enregistré'],

							autoClose: 2600,
							type: 'info',
							transition: 'vertical'
						});

						$rootScope.refreshdrafts = Math.random();
						//$location.path('/app/drafts');

					} else {

						$scope.propData = {};
						$scope.propData.idcategory = 0;

						$ionicHistory.nextViewOptions({
							disableBack: true
						});

						$rootScope.refreshdrafts = Math.random();
						$rootScope.refreshprops = Math.random();
						$location.path('/app/propositions/recent');
					}

				} else {

					if (bDraft) {

						$ionicContentBanner.show({
							text: ['Brouillon enregistré'],

							autoClose: 2600,
							type: 'info',
							transition: 'vertical'
						});


						$scope.proposition = data.results[0];
						$scope.prop = $scope.proposition;

						if (data.uid) {
							//$stateParams.propId = data.uid;
							$scope.editMode = true;
						}


						$rootScope.refreshdrafts = Math.random();
						//$location.path('/app/drafts');


					} else {

						$scope.propData = {};
						$scope.propData.idcategory = 0;

						$ionicHistory.nextViewOptions({
							disableBack: true
						});


						$rootScope.refreshdrafts = Math.random();
						$rootScope.refreshprops = Math.random();
						$location.path('/app/propositions/recent');
					}


				}

				$scope.sending = false;


			});


		};



		//$scope.propData.idcategory = 0;

		$scope.categories = [];
		$scope.zones = [];


		//$scope.idzone = "34"

		$scope.$watch('statescope', function (news, olds) {

			console.log('change scope : ', news, olds);

			$scope.updateCategs();
			$scope.updateZones();

		});

		$scope.updateZones = function () {

			Town.getZones().success(function (data, status) {

				$scope.zones = data.results;

			});

		};


		$scope.updateCategs = function () {

			(Config.getScope() == 'local' ? Categories.getLocal() : Categories.getNational()).success(function (data, status) {

				$scope.categories = data.results;


				if($location.search().cat){

					$timeout(function(){


						$scope.propData.idcategory = ($location.search().cat);
						console.log('ID category : ',$scope.propData.idcategory);

					},20);

				} else {
					$scope.propData.idcategory = 0;
				}


			});

		};


		if ($stateParams.propId) {


			$scope.editMode = true;
			$scope.sending = true;


			Proposition.getById($stateParams.propId).success(function (data, status) {


				if (data.results && data.results.length) {
					$scope.loaded = true;
					$scope.proposition = data.results[0];
					$scope.prop = $scope.proposition;


					$scope.propData.uid = $scope.prop.uid;
					$scope.propData.idcategory = $scope.prop.catid.toString();
					$scope.propData.title = $scope.prop.title;
					$scope.propData.description = $scope.prop.description;
					$scope.propData.financement = $scope.prop.financement;

					//$scope.propData.idzone


					Config.setScope($scope.prop.scope);
					$scope.sending = false;


				} else {
					$scope.loaded = true;
					$scope.proposition = {};
					$scope.prop = $scope.proposition;
				}


			});


		} else {
			$scope.sending = false;
		}


	})


	//


	.controller('MyDraftsController', function ($scope, $rootScope, $location, Proposition, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Config, $ionicContentBanner) {


		$scope.$watch('refreshdrafts', function (news, olds) {

			console.log('refresh add props : ', news, olds);
			if (news != olds) {
				$scope.load(true);
			}

		});


		$scope.load = function (empty) {


			$ionicScrollDelegate.scrollTop();


			if (empty) {
				$scope.propositions = [];
			}


			//

			$scope.loaded = false;

			Proposition.getMyDrafts().success(function (data, status) {

				$scope.propositions = data.results;

				//$scope.propositions = [];

				$scope.loaded = true;

			}).finally(function () {

				$scope.$broadcast('scroll.refreshComplete');
			});

		};


		$scope.load(true);


	})


	.controller('MyFavoritesController', function ($scope, $rootScope, $location, Proposition, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Config) {


		$scope.$watch('refreshfavorites', function (news, olds) {

			console.log('refresh add props : ', news, olds);
			if (news != olds) {
				$scope.load(true);
			}

		});


		$scope.load = function (empty) {


			$ionicScrollDelegate.scrollTop();


			if (empty) {
				$scope.propositions = [];
			}


			//

			$scope.loaded = false;

			Proposition.getMyFavorites().success(function (data, status) {

				$scope.propositions = data.results;

				//$scope.propositions = [];

				$scope.loaded = true;

			}).finally(function () {

				$scope.$broadcast('scroll.refreshComplete');
			});

		};


		$scope.load(true);


	})


	.controller('MyVotesController', function ($scope, $rootScope, $location, Vote, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Config) {


		$scope.load = function (empty) {


			$ionicScrollDelegate.scrollTop();


			if (empty) {
				$scope.votes = [];
			}


			//

			$scope.loaded = false;

			Vote.getMyVotes().success(function (data, status) {

				$scope.votes = data.results;
				//$scope.votes = [];


				$scope.loaded = true;

			}).finally(function () {

				$scope.$broadcast('scroll.refreshComplete');
			});

		};


		$scope.clickProp = function (id) {
			$location.path('/app/propositions/' + id)
		}

		$scope.load(true);


	})


	.controller('MyFluxController', function ($scope, $rootScope, $location, Proposition, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Config) {


		$scope.order = "myflux";


		$scope.infiniteOk = true;

		$scope.loadOlderData = function () {


			console.log('loadOlderData Flux');

			var sPId = '';
			var sAId = '';
			var sVId = '';

			//Si on a des déjà des propositions
			if ($scope.propositions.length > 0) {


				var n = $scope.propositions.length;


				/**/

				for (var i = n - 1; i >= 0; i--) {

					var pP = $scope.propositions[i];
					if (sPId == '' && pP.type == 'proposition') {
						sPId = pP.uid;
					}
					if (sAId == '' && pP.type == 'amendement') {
						sAId = pP.uid;
					}
					if (sVId == '' && pP.type == 'vote') {
						sVId = pP.idvote;
					}

				}
				/**/

			}


			Proposition.getMyFlux(sPId, sAId, sVId).success(function (data, status) {


				if (data.results.length == 0) {
					$scope.infiniteOk = false;
				}

				$scope.propositions = $scope.propositions.concat(data.results);


				$scope.$broadcast('scroll.infiniteScrollComplete');


				$scope.loaded = true;

			}).finally(function () {


			});


		};


		$scope.load = function (empty) {


			$ionicScrollDelegate.scrollTop();


			if (empty) {
				$scope.propositions = [];
			}


			//

			$scope.loaded = false;

			Proposition.getMyFlux('', '', '').success(function (data, status) {

				$scope.propositions = data.results;

				//$scope.propositions = [];

				$scope.loaded = true;

			}).finally(function () {

				$scope.$broadcast('scroll.refreshComplete');
			});

		};


		$scope.onUser = function (id) {

			var sPath = '/app/user/' + id;
			$location.path(sPath)
		};

		$scope.clickItem = function (id) {


			$location.path('/app/propositions/' + id);

		};


		$scope.load(true);


	})


	.controller('MyContributionsController', function ($scope, $rootScope, $location, Proposition, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Config,$ionicLoading) {


		//$scope.order = "recent";



		$scope.transformAmemdement = function(id){

			console.log('transformAmemdement : ',id);


			$ionicLoading.show();




			Proposition.transformAmemdement(id).success(function (data, status) {



				for (var i in $scope.propositions) {

						if($scope.propositions[i] && ($scope.propositions[i].amduid == id)){
							$scope.propositions.splice(i, 1);
						}

				}


				$ionicLoading.hide();



			});
		};


		$scope.load = function (empty) {


			$ionicScrollDelegate.scrollTop();


			if (empty) {
				$scope.propositions = [];
			}



			//

			$scope.loaded = false;

			Proposition.getMyContributions().success(function (data, status) {

				$scope.propositions = data.results;

				//$scope.propositions = [];

				$scope.loaded = true;

			}).finally(function () {

				$scope.$broadcast('scroll.refreshComplete');
			});

		};


		$scope.load(true);


	})


;


