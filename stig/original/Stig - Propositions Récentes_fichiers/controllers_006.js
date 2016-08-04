angular.module('stigv1.controllers.login', [])


	.controller('EntryController', function ($log, $scope, $window, $rootScope , $ionicModal, $ionicLoading, $timeout, $ionicPopup, Login, $location, User, Config, $ionicHistory, $ionicContentBanner) {



		if (Login.isLogged()) {
			$location.path('/app/propositions/recent');
		}



		//$scope.loginData = {username: 'germain.lecourtois@imarkahann.com', password: "pouetpouet"};
		$scope.loginData = {};

		$scope.onLoginClick = function (form) {


			console.log($scope);

			console.log(form);


			var aErrors = [];


			if (!form.username.$valid) {


				aErrors.push("Veuillez saisir un e-mail valide");

			}


			if (!form.password.$valid) {


				aErrors.push("Veuillez saisir un mot de passe");

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


			$ionicLoading.show();


			Login.login($scope.loginData.username, $scope.loginData.password)
				.then(function (resolve) {








					console.log("success ", resolve);
					var data = resolve.data;
					if (data.status && data.info && data.info.token) {

						$scope.token = data.info.token;

						User.setId(data.info.id);
						User.setGroup(data.info.group);
						User.setToken(data.info.token);

						User.store();


						Config.default();
						Config.setScope('national');
						Config.store();


						//console.log('$rootScope.redirect :',$rootScope.redirect)



						$ionicLoading.hide();



						$timeout(function(){






						},900);

						if ($rootScope.redirect && $rootScope.redirect.length > 0 ) {



							console.warn("On demande redirect à "+$rootScope.redirect);


							//$window.location = $rootScope.redirect;

							$location.path($rootScope.redirect+'');

							$rootScope.redirect = null;
							delete $rootScope.redirect;


						} else {


							$ionicHistory.nextViewOptions({
								disableBack: true,
								disableAnimate: true

							});


							console.warn("On demande d'aller à /app/propositions/recent");

							$location.path('/app/propositions/recent');

						}


						Config.updateTownName();

						$scope.token = '';
						$scope.loginData = {};




					} else {
						$scope.token = "Acces refusé";

						$ionicContentBanner.show({
							text: ["E-mail ou mot de passe incorrecte"],

							autoClose: 3000,
							type: 'error',
							transition: 'vertical'
						});


						$ionicLoading.hide();

					}

				}, function (error) {


					$ionicLoading.hide();

					$ionicContentBanner.show({
						text: ["E-mail ou mot de passe incorrecte"],

						autoClose: 3000,
						type: 'error',
						transition: 'vertical'
					});

					$scope.token = "Acces refusé";
					console.log("error ", error);

				});

		};


		$scope.onSubscribeClick = function () {
			//$ionicLoading.show();


			//$ionicPopup.alert({title: "La possibilité de s'inscrire librement arrive Bientôt !", cssClass:"dark"});


			$location.path('entry/subscribe');


		};


	})


	.controller('SubscribeController', function ($log, Backend, $scope, $window, $rootScope, $ionicModal, $ionicLoading, $timeout, $ionicPopup, Login, $timeout, $location, User, Config, $ionicHistory, $ionicContentBanner) {



		if (Login.isLogged()) {
			$location.path('/app/propositions/recent');
		}


		$scope.townid = null;

		$scope.nuitdebout = false;

		$scope.sending = false;

		$scope.signupData = {};


		if (($location.search()['code'])) {

			$scope.signupData.code = $location.search()['code'];
			$scope.nuitdebout = $scope.signupData.code == 'NUIT-DEBO-UTNU-ITDE-BOUT';

		}


		$scope.townurl = Backend.getBaseURL() + "town/find/?key=";


		$scope.onSubmitSignIn = function (form) {


			if($scope.sending) {
				return;
			}


			console.info("signupData ", $scope.signupData, form);

			var origObject = null;


			$scope.sending = true;

			if (!form.$valid) {


				$ionicContentBanner.show({
					//text: ["Les informations fournies sont incorrectes"],
					text: ["Les informations fournies sont incorrectes"],

					autoClose: 3000,
					type: 'error',
					transition: 'vertical'
				});

				$scope.sending = false;

				return;

			}


			if (($scope.signupData.townselect && $scope.signupData.townselect.originalObject) || $scope.nuitdebout) {

				//GO !

				console.info('Lets go !!!');



				var tempidtown = 1;
				if($scope.nuitdebout){
					tempidtown = 37176;
				} else {
					tempidtown = $scope.signupData.townselect.originalObject.id;
				}

				Login.register($scope.signupData.code, $scope.signupData.nom, $scope.signupData.prenom, tempidtown, $scope.signupData.username, $scope.signupData.password)

					.then(function (resolve) {

						var data = resolve.data;

						console.log('Retour Register : ', data);


						if (data.error) {

							//console.warn(data.error_message);

							$ionicContentBanner.show({
								text: [data.error_message],

								autoClose: 3000,
								type: 'error',
								transition: 'vertical'
							});


							$scope.sending = false;


						} else {


							if (data.status && data.info && data.info.token) {

								$scope.token = data.info.token;

								User.setId(data.info.id);
								User.setGroup(data.info.group);
								User.setToken(data.info.token);

								User.store();


								Config.default();

								if($scope.nuitdebout){
									Config.setScope('local');
								} else {
									Config.setScope('national');
								}

								Config.store();


								//console.log('$rootScope.redirect :',$rootScope.redirect)



								Config.updateTownName();

								$scope.token = '';
								$scope.loginData = {};


								if ($rootScope.redirect) {

									//$window.location = $rootScope.redirect;

									$location.path($rootScope.redirect);


									$rootScope.redirect = null;
									delete $rootScope.redirect;


								} else {


									$ionicHistory.nextViewOptions({
										disableBack: true,
										disableAnimate : true
									});


									$location.path('/tutorial');

								}



								$timeout(function(){

									$scope.sending = false;

								},2300);




							} else {
								$scope.token = "Acces refusé";

								$ionicContentBanner.show({
									text: ["E-mail ou mot de passe incorrecte"],

									autoClose: 3000,
									type: 'error',
									transition: 'vertical'
								});

								$timeout(function(){





									$scope.sending = false;

								},200);

							}


						}




					}, function (error) {

						console.warn('Retour Register error: ', error);



						$timeout(function(){

							$scope.sending = false;

						},200);

					});


				//$ionicLoading.show();


				//$ionicLoading.hide();


			} else {

				$ionicContentBanner.show({
					text: ["Veuillez choisir une ville parmis la liste proposée","Un icone (✓) Vous l'indiquera"],

					interval: 3000,
					autoClose: 12000,
					type: 'error',
					transition: 'vertical'
				});




				$timeout(function(){

					$scope.sending = false;

				},200);

				return;

			}


			/**

			 for(var cs = $scope.$$childHead; cs; cs = cs.$$nextSibling) {
					// cs is child scope
					if(cs.townselect){
						origObject = cs.townselect.originalObject;


					}
				}

			 if(origObject){
				$scope.townid = origObject.id;
			}


			 /**/


			//console.log($scope, $scope.townid);

		}


	})



	.controller('ResetPasswordController', function ($log, $scope, $rootScope, $ionicModal, $ionicLoading, $timeout, $ionicPopup, Login, $location, User, Config, $ionicHistory, $ionicContentBanner) {


		$scope.loginData = {};


		$scope.emailSent = false;
		$scope.sending = false;

		$scope.onLoginClick = function (form) {


			//console.log($scope);

			//console.log(form);


			var aErrors = [];


			if (!form.username.$valid) {

				aErrors.push("Veuillez saisir un e-mail valide");

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


			$ionicLoading.show();

			$scope.sending = true;

			Login.resetPassword($scope.loginData.username).success(function(data,state){


				$scope.emailSent = true;
				$scope.sending = false;

				$ionicLoading.hide();

			}).finally(function(){
				$scope.emailSent = true;
				$scope.sending = false;


				$ionicLoading.hide();
			});

		};


	})


;

