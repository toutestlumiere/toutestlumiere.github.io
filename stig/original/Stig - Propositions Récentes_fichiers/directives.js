angular.module("stigv1.directives.cards", [])


	.directive('stigPropositionCard', function () {

		var controller = ['$scope', '$location', '$ionicActionSheet', 'Vote', 'Proposition', '$ionicContentBanner', '$rootScope', function ($scope, $location, $ionicActionSheet, Vote, Proposition, $ionicContentBanner, $rootScope) {

			function init() {




				//console.info('$ionicContentBanner INIT CARD', $ionicContentBanner);


				//$scope.prop = angular.copy($scope.datasource);


				//console.log('showmore',$scope.showmore);


				//$scope.prop = $scope.datasource;


				$scope.labelscope = $rootScope.labelscope;


				$scope.progressVote = 0;
				$scope.holdCount = 0;


				//console.info($scope.datasource);
				//console.table($scope.prop);


				$rootScope.$on('stig-refreshid', function (event, args) {

					//console.info('BRAODCAST receive : ',$scope.prop.uid, event, args);

					if ($scope.prop.uid == args.id) {

						//console.log('Refresh CARD ! ',args.id);

						$scope.refreshCard();
					}


				});


				$scope.showVote = false;

			}


			init();


			$scope.onHoldCancel = function () {
				$scope.progressVote = 0;
				$scope.holdCount = 0;
			};


			$scope.onHold = function (bPlus) {

				//console.log("onHold : ", bPlus,$scope.holdCount+1 );

				$scope.progressPlus = bPlus;

				$scope.holdCount++;

				if ($scope.holdCount >= 4) {

					$scope.progressVote += 10;

				}

			};


			$scope.onHoldDone = function (bPlus) {

				console.log("onHoldDone : ", bPlus);

				$scope.progressVote = 0;
				$scope.holdCount = 0;

				$scope.progressPlus = bPlus;

				$scope.vote($scope.prop.uid, bPlus ? 'plus' : 'minus', true);


			};

			$scope.onUser = function (id) {

				var sPath = '/app/user/' + id;
				$location.path(sPath)
			};


			$scope.onClick = function () {


				if ($scope.showVote) {

				}

				if ($scope.prop.enabled == 1 || $scope.prop.enabled == '1') {
					$scope.showVote = !$scope.showVote;
				}

			};


			$scope.vote = function (id, type, bPublic) {



				//console.info('$ionicContentBanner : ',$ionicContentBanner);


				Vote.addVote(id, type, bPublic).success(function (data, status) {


					//console.info('retour de vote', data, this, $ionicContentBanner, $scope);

					if (data.results && data.results.length >= 0) {


						angular.extend($scope.prop, data.results[0]);


						$ionicContentBanner.show({
							text: ['a voté !' + (bPublic ? ' (vote public)' : ' (vote anonyme)')],

							autoClose: 2600,
							type: 'info',
							transition: 'vertical'
						});


						console.log('RefreshCard addVote : ', id);

						$rootScope.refreshcardfromid = id;


						$scope.showVote = false;


					}

				});

			};


			$scope.shareProposition = function ($event, id, title) {

				$rootScope.shareProposition($event, id,title);

			};


			$scope.favoriteProposition = function ($event, id) {

				if ($scope.prop.favorite.toString() == "1") {


					Proposition.unfavorite(id).success(function (data, o) {

						console.log('RefreshCard unfavorite : ', id);

						$rootScope.refreshcardfromid = id;
					});

					$ionicContentBanner.show({
						text: ['Supprimé des favoris'],

						autoClose: 2600,
						type: 'info',
						transition: 'vertical'
					});

					$scope.prop.favorite = 0;
					$rootScope.refreshcardfromid = "id" + Math.random();

				} else {

					Proposition.favorite(id).success(function (data, o) {

						console.log('RefreshCard favorite : ', id);

						$rootScope.refreshcardfromid = id;
					});
					$scope.prop.favorite = 1;


					console.info('Favoris enregistré.');


					$ionicContentBanner.show({
						text: ['Ajouté aux favoris'],

						autoClose: 2600,
						type: 'info',
						transition: 'vertical'
					});

					//$rootScope.refreshcardfromid = Math.random();
					$rootScope.refreshfavorites = Math.random();


				}

			};


			$scope.onCLickPlus = function () {


				if ($scope.holdCount < 2) {
					console.log('Vote PLUS');
					$scope.vote($scope.prop.uid, 'plus', false);
				}

			};


			$scope.onClickMoins = function () {

				if ($scope.holdCount < 2) {

					console.log('Vote MOINS');
					$scope.vote($scope.prop.uid, 'minus', false);
				}

			};


			$scope.refreshCard = function () {


				//console.info($scope, $scope.prop);


				Proposition.getById($scope.prop.uid).success(function (data, status) {


					if (data.results && data.results.length >= 0) {


						angular.extend($scope.prop, data.results[0]);


					}


				});


			};






			$scope.onCancelVote = function () {
				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({

					destructiveText: 'Oui, je supprime.',
					titleText: 'Si vous avez déposé un amendement, celui-ci sera également supprimé. Êtes-vous sûr ?',
					cancelText: 'Non',
					cancel: function () {
						// add cancel code..


					},
					destructiveButtonClicked: function () {


						console.log('Vote à supprimer', $scope.prop);

						Vote.removeVote($scope.prop.uid).success(function (data, status) {

							console.info('retour de annulation de vote', data, $scope, $ionicContentBanner);

							if (data.results && data.results.length >= 0) {


								angular.extend($scope.prop, data.results[0]);


								$rootScope.refreshcardfromid = $scope.prop.uid;

								$scope.showVote = false;


							}

						});

						return true;
					}
				});
			};

			$scope.clickItem = function (id) {

				//console.info(id);

				//$location.path('/app/propositions/' + id)

				if ($scope.prop.enabled == 1 || $scope.prop.enabled == '1') {

					$location.path('/app/propositions/' + id)

				} else {

					$scope.edit(id);

				}

			};


			$scope.edit = function (id) {

				$location.path('/app/propositions/edit/' + id);

				//alert('Edition depuis controller de '+id);

			};


		}];


		return {
			restrict: 'E',
			scope: {
				/**/
				prop: '=datasource',
				ordered: "=",

				showmore: "@showmore",
				showuser: "="


				 /**/

			},
			replace: true,
			controller: controller,
			templateUrl: 'templates/partials/propositioncard.html'
		}


	})


	///PROP CARD PUBLIC

	.directive('stigPropositionCardPublic', function () {

		var controller = ['$scope', '$location', '$ionicActionSheet', 'Vote', 'Proposition', '$ionicContentBanner', '$rootScope', function ($scope, $location, $ionicActionSheet, Vote, Proposition, $ionicContentBanner, $rootScope) {

			function init() {

				//console.info('$ionicContentBanner INIT CARD', $ionicContentBanner);


				//$scope.prop = angular.copy($scope.datasource);


				//console.log('showmore',$scope.showmore);


				//$scope.prop = $scope.datasource;


				$scope.labelscope = $rootScope.labelscope;


				$scope.progressVote = 0;
				$scope.holdCount = 0;


				//console.info($scope.datasource);
				//console.table($scope.prop);


				$rootScope.$on('stig-refreshid', function (event, args) {


				});


				$scope.showVote = false;

			}


			init();


			$scope.goStig = function(){


				window.open('https://getstig.org','_self');

			};


			$scope.onHoldCancel = function () {
				$scope.progressVote = 0;
				$scope.holdCount = 0;
			};


			$scope.onHold = function (bPlus) {


			};


			$scope.onHoldDone = function (bPlus) {


			};

			$scope.onUser = function (id) {


			};


			$scope.onClick = function () {
				/**
				if ($scope.showVote) {

				}

				if ($scope.prop.enabled == 1 || $scope.prop.enabled == '1') {
					$scope.showVote = !$scope.showVote;
				}
				 /**/

			};


			$scope.onCLickPlus = function () {


				$scope.goStig();

			};


			$scope.onClickMoins = function () {

				$scope.goStig();

			};


			$scope.clickItem = function (id) {


			};


			$scope.edit = function (id) {


			};


		}];


		return {
			restrict: 'E',
			scope: {
				prop: '=datasource',
				ordered: "=",
				showmore: "=",
				showuser: "=",
				index: "="

			},
			replace: true,
			controller: controller,
			templateUrl: 'templates/partials/propositioncard.html'
		}


	}) //End propCard Public


	.directive('stigAmendementReviewCard', function () {

		var controller = ['$scope', '$location', '$ionicActionSheet', 'Vote', function ($scope, $location, $ionicActionSheet, Vote) {

			function init() {


			}

			init();


			$scope.clickAmd = function (propid, amdid) {

				$location.path('/app/propositions/' + propid + '/amendements/' + amdid)

			};


			$scope.onUser = function (id) {

				var sPath = '/app/user/' + id;
				$location.path(sPath)
			};


			$scope.clickItem = function (id) {


				$location.path('/app/propositions/' + id)

			};


		}];


		return {
			restrict: 'E',
			scope: {
				prop: '=datasource',
				ordered: "=",

				showuser: "=",
				index: "="
			},
			replace: true,
			controller: controller,
			templateUrl: 'templates/partials/amendementreviewcard.html'
		}


	})

	.directive('stigAmendementCard', function () {

		var controller = ['$scope', '$location', '$ionicActionSheet', 'Vote', '$ionicContentBanner', '$rootScope','Proposition', function ($scope, $location, $ionicActionSheet, Vote, $ionicContentBanner, $rootScope,Proposition) {

			function init() {


			}

			init();


			$scope.openReport = function ($event, id) {


				console.info('CARD openReport : ', id, $scope.am.uidprop);


				console.info(this, $event, id);

				$rootScope.globalOpenReport($event, id, 'amendement', $scope.am.uidprop);

			};


			$scope.deleteAm = function(uid){


				console.log('removeAmendement ', uid);


				var hideSheet = $ionicActionSheet.show({

					destructiveText: 'Oui, je supprime.',
					titleText: 'Supprimer un amendement est irreversible. Êtes-vous sûr ?',
					cancelText: 'Non, annuler.',
					cancel: function () {
						// add cancel code..


					},
					destructiveButtonClicked: function () {


						console.log('Amendement à supprimer', $scope.prop);





						Proposition.removeAmemdement(uid).success(function(data, status) {





							console.info('retour de suppression de amendement', data, $scope, $ionicContentBanner);


							if(data.prop && data.prop.length>0) {
								if($rootScope.refreshcardfromid == data.prop[0].uidprop){

									$rootScope.refreshprops = Math.random();


								} else {
									$rootScope.refreshcardfromid = data.prop[0].uidprop
								}


							}



						});

						/**/

						return true;
					}
				});



				/**



				 /**/


			};


			$scope.onCancelVote = function () {
				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({

					destructiveText: "Oui, j'annule.",
					titleText: 'Vous allez annuler le vote sur cet amendement. Êtes-vous sûr ?',
					cancelText: 'Non',
					cancel: function () {
						// add cancel code..


					},
					destructiveButtonClicked: function () {


						console.log('Vote amendement à supprimer', $scope.am);

						Vote.removeVoteAmendement($scope.am.uid).success(function (data, status) {

							console.info('retour de annulation de vote amendement', data, $scope, $ionicContentBanner);

							if (data.results && data.results.length >= 0) {


								angular.extend($scope.am, data.results[0]);


							}

						});

						return true;
					}
				});
			};



			$scope.onCLickPlus = function () {

				console.log('Vote amendement PLUS');
				$scope.vote($scope.am.uid, 'plus');

			};


			$scope.onClickMoins = function () {

				console.log('Vote amendement MOINS');
				$scope.vote($scope.am.uid, 'minus');

			};


			$scope.vote = function (id, type) {


				console.log("VOTE amendement", id, type, $scope.am.uidprop);



				if($scope.am.voted == 1 || $scope.am.voted == '1') {


					$scope.onCancelVote();


				} else {

					/**/

					Vote.addVoteAmendement(id, type, $scope.am.uidprop).success(function (data, status) {


						console.info('retour de vote', data, data.results[0])

						if (data.results && data.results.length >= 0) {


							angular.extend($scope.am, data.results[0]);

							var sTxt = "";
							if (parseInt(data.idreturn) > 0) {
								sTxt = 'a voté !'
							} else {
								sTxt = 'Vous avez déjà voté.'
							}


							$ionicContentBanner.show({
								text: [sTxt],

								autoClose: 2600,
								type: 'info',
								transition: 'vertical'
							});

							$scope.showVote = false;


						}

					});


				}

				/**/

			};


			$scope.onUser = function (id) {

				var sPath = '/app/user/' + id;
				$location.path(sPath)
			};


			$scope.clickItem = function (id) {


				//$location.path('/app/propositions/' + id)

			};


		}];


		return {
			restrict: 'EA',
			scope: {
				am: '=datasource',
				amdid: '=',


				index: "="
			},
			replace: true,
			controller: controller,
			templateUrl: 'templates/partials/amendementcard.html'
		}


	})


;