angular.module('stigv1.controllers.propositionslists', [])

	.controller('ProplistsCtrl', function ($scope, $rootScope, $ionicHistory, $location, Proposition, $state, $ionicScrollDelegate, $ionicNavBarDelegate, Config, Categories, $ionicModal, UserInfo, $ionicContentBanner, $timeout) {

		$rootScope.slideHeader = false;
		$rootScope.slideHeaderPrevious = 0;

		$scope.selectionObject = {};
		$scope.filters = {};
		$scope.filters.dateRange = "all";


		var dp = [];

		/**
		 for (var i = 0; i < 100; i++) {
			dp.push({
				index: i,
				title: "Label " + i

			});
		}
		 /**/

		$scope.datas = {};


		$scope.datas.propositions = {};
		$scope.propositions = dp;


		$rootScope.invites = 0;

		$scope.inviteData = {};


		$scope.inviteData.generatedCode = "";


		$scope.order = 'recent';

		$scope.showactive = true;

		$scope.catlabel = "";


		//console.log('PropListsCtrl', $scope.loaded);


		/**
		 * Gestion de la liste des catégories
		 */

		$scope.updateCat = function () {


			$scope.categories = [];

			(Config.getScope() == 'local' ? Categories.getLocal() : Categories.getNational())
				.success(function (data, status) {

					$scope.categories = data.results;

				});

		};

		$scope.$watch('statescope', function (n, o) {

			$scope.updateCat();

		});


		$scope.removeFilters = function () {

			$scope.infiniteOk = true;
			$scope.filters = {};
			$scope.load(true);

		};


		$scope.selectCat = function (id, label) {

			$scope.filters = $scope.filters || {};

			if (id == 0) {

				$scope.infiniteOk = true;
				$scope.filters.catid = null;
				delete $scope.filters.catid;
				$scope.filters.catlabel = null;
				delete $scope.filters.catlabel;

			} else {

				$scope.infiniteOk = true;
				$scope.filters.catid = id;

				$scope.filters.catlabel = label;
			}


			$scope.load(true);


			//console.info("Categorie ", id, {});

			$scope.closeCats();

		};


		/**
		 * Systeme d'invitation
		 */

			// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/invitations.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modalinvite = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeInvite = function () {
			$scope.modalinvite.hide();
		};

		// Open the login modal
		$scope.openInvite = function () {

			var mod = $scope.modalinvite.show();
			console.info(mod);


		};
		/**
		 * Systeme d'invitation END
		 */


		/**
		 * Systeme de catégories
		 */

			// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/categories.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modalcat = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeCats = function () {
			$scope.modalcat.hide();
		};

		// Open the login modal
		$scope.openCats = function () {
			$scope.updateCat();
			$scope.modalcat.show();
		};
		/**
		 * Systeme de catéories END
		 */


		/**
		 * Systeme de Filtres
		 */

			// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/filters.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modalfilters = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeFilters = function () {
			$scope.modalfilters.hide();
		};

		// Open the filter modal
		$scope.openFilters = function () {
			$scope.modalfilters.show();
		};

		//Applique les filtres
		$scope.applyFilters = function () {
			$scope.closeFilters();
			$scope.load();
		}
		/**
		 * Systeme de Filtres END
		 */



		$scope.onClickFilters = function () {

			$scope.openFilters();

		};

		$scope.onClickCategory = function () {

			$scope.openCats();

		};


		//Lancement des invitations !
		$scope.onInviteClick = function () {

			console.log("invites : ", $rootScope.invites);


			$scope.inviteData = {};
			$scope.inviteData.generatedCode = "";

			if ($rootScope.invites > 0) {


				$scope.openInvite();

			}

		};

		$rootScope.linkinvitesending = false;
		$scope.onSubmitCodeInvite = function (form) {

			$scope.linkinvitesending = true;


			UserInfo.getInviteCode()
				.success(function (data) {


					$scope.linkinvitesending = false;

					console.info("getInviteCode : ", data);


					if (!data.error) {


						$rootScope.invites = data.left;

						$scope.inviteData.generatedCode = data.url;


						var clipboard = new Clipboard('[data-link-copy]');


						clipboard.on('success', function (e) {
							//console.info('Action:', e.action);
							//console.info('Text:', e.text);
							//console.info('Trigger:', e.trigger);


							$scope.inviteData.messageCode = "Lien copié !";

							$timeout(function () {

								$scope.inviteData.messageCode = "";

							}, 2300);

							/**
							 $ionicContentBanner.show({
								text: ['Lien copié !'],

								autoClose: 3200,
								type: 'info',
								transition: 'vertical'
							});
							 /**/


							e.clearSelection();
						});

						clipboard.on('error', function (e) {
							console.error('Action:', e.action);
							console.error('Trigger:', e.trigger);
						});


						console.info(clipboard);


					} else {
						$scope.inviteData.generatedCode = "Une erreur est survenue";
					}


				});


		};


		$rootScope.inviteerror = "";

		$rootScope.invitesending = false;

		$scope.onSubmitInvite = function (form) {


			$rootScope.invitesending = true;

			$rootScope.inviteerror = "";

			//console.log($scope.inviteData);


			//console.info(form);


			if (form.$valid) {

				/**/


				UserInfo.invite($scope.inviteData.email)
					.success(function () {

						$rootScope.inviteerror = "";
						$scope.closeInvite();


						$ionicContentBanner.show({
							text: ['Invitation envoyée'],

							autoClose: 3200,
							type: 'info',
							transition: 'vertical'
						});


						$scope.inviteData = {};
						$rootScope.invites--;

						$rootScope.invitesending = false;


					});

				/**/

			} else {
				$rootScope.invitesending = false;
				$rootScope.inviteerror = "Les informations fournies sont incorrectes";
			}


			console.log($scope.inviteData);


			//$scope.closeInvite();

		};


		$scope.onClickAdd = function () {
			//alert('Ajouter');
			$location.path('/app/propositions/dis')
		};


		$scope.$watch('statescope', function (news, olds) {

			if (news && olds && (news != olds)) {
				console.log('change scope : ', news, olds);
				$scope.infiniteOk = true;
				$scope.load(true);
			}


		});

		$scope.$watch('refreshprops', function (news, olds) {

			if (news) {
				console.log('refresh add props : ', news, olds);
				$scope.infiniteOk = true;
				$scope.load(true);
			}


		});


		$scope.loadNewerDatas = function () {

			console.log('loadNewerDatas');


			var sFirstId = '';

			if ($scope.propositions.length > 0) {
				sLastId = $scope.propositions[0].uid;


				var iCat = null;
				if ($scope.filters && $scope.filters.catid) {
					iCat = $scope.filters.catid;
				}


				Proposition.getByOrderAfter($scope.globalorder, iCat, sLastId, $scope.filters).success(function (data, status) {


					$scope.propositions = data.results.concat($scope.propositions);
					$rootScope.invites = data.invites;


					$scope.loaded = true;

				}).finally(function () {

					$scope.$broadcast('scroll.refreshComplete');
				});

			} else {
				$scope.$broadcast('scroll.refreshComplete');
			}


		};


		$scope.infiniteOk = true;

		$scope.loadOlderData = function () {


			console.log('loadOlderData');


			var sLastId = '';

			if ($scope.propositions.length > 0) {
				sLastId = $scope.propositions[$scope.propositions.length - 1].uid;
			}

			var iCat = null;
			if ($scope.filters && $scope.filters.catid) {
				iCat = $scope.filters.catid;
			}


			Proposition.getByOrderBefore($scope.globalorder, iCat, sLastId, $scope.filters).success(function (data, status) {


				if (data.results.length < 8 || data.results.length == 0) {
					$scope.infiniteOk = false;
				}

				$scope.propositions = $scope.propositions.concat(data.results);
				$rootScope.invites = data.invites;

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

			$scope.loaded = false;

			//On balance directement l'ensemble des filtres au service, qui va se charger de les gérer correctement
			Proposition.getByOrder($scope.globalorder, $scope.filters).success(function (data, status) {

				console.log($scope.filters);

				$scope.propositions = data.results;
				$rootScope.invites = data.invites;

				//$scope.propositions = [];

				$scope.loaded = true;

			}).finally(function () {
				$scope.$broadcast('scroll.refreshComplete');
			});

		};


		$scope.clickItem = function (id) {

			$location.path('/app/propositions/' + id)

		};


		$scope.onUser = function (id) {

			var sPath = '/app/propositions/user/' + id;
			$location.path(sPath)
		};


		$scope.onReload = function (id) {

			//$state.go($state.current, {}, {reload: true}); //second parameter is for $stateParams

		};


		$scope.showRecent = function () {

			$scope.order = 'recent';

			//$ionicNavBarDelegate.title(Config.stigLogoTitle+' Récent');

			$scope.load(true);

		};


		$scope.load(true);

	})

	.controller('ProplistCtrl', function ($scope, $ionicHistory, $location, Login, $stateParams, Proposition, $rootScope, $ionicModal, $ionicContentBanner, $anchorScroll, $timeout, $sce, $ionicActionSheet, $ionicScrollDelegate, $timeout, Comment) {


		$scope.scrollTo = function (id) {

			//$anchorScroll.yOffset = 120;
			$anchorScroll(id);

		};


		/**
		 * Systeme de report abuse
		 */

			// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/reportabuse.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modalreport = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeReport = function () {
			$scope.modalreport.hide();
		};


		// Open the login modal
		$scope.openReport = function ($event, id) {


			console.info(this, $event, id);

			$rootScope.globalOpenReport($event, id, 'proposition');

			/**


			 console.log(this, "open abuse form : ", id);


			 $scope.abuse = {};
			 $scope.abuse.type = 0;
			 $scope.abuse.content = "";

			 $scope.currentPropId = id;
			 $scope.modalreport.show();

			 /**/

		};


		$scope.abuse = {};
		$scope.abuse.type = 0;
		$scope.abuse.content = "";

		$scope.onSubmitAbuse = function (form) {


			$scope.sendingabuse = true;

			Proposition.reportAbuse($scope.id, $scope.abuse.type, $scope.abuse.content)
				.success(function () {


					$scope.closeReport();


					$ionicContentBanner.show({
						text: ['Signalement enregistré, merci.'],

						autoClose: 3200,
						type: 'info',
						transition: 'vertical'
					});


					$scope.sendingabuse = false;

				}).finally(function () {


					$scope.sendingabuse = false;

				});


		};


		$scope.idamd = $stateParams.amdId || "none";
		$scope.amendements = [];


		$scope.comments = [];


		$scope.proposition = {};


		$scope.settings = {};


		console.log('ProplistCtrl', $stateParams);

		$scope.id = $stateParams.propId;
		$scope.loaded = false;
		$scope.proposition = {};

		$scope.sendingabuse = false;

		$scope.favorite = false;

		$scope.prop = {};

		$scope.$watch('refreshprops', function (news, olds) {

			console.log('refreshprops PROPOSITION refresh add props : ', news, olds);
			$scope.load(true);

		});


		$scope.$watch('refreshcardfromid', function (news, olds) {

			console.log('refreshcardfromid PROPOSITION refresh add props : ', news, olds);
			$scope.load(true);

		});


		$scope.newcomment = {};

		$scope.newcomment.body = "";
		$scope.newcomment.sending = false;


		$scope.deleteCo = function (comment) {


			var hideSheet = $ionicActionSheet.show({

				destructiveText: 'Oui, je supprime.',
				titleText: 'Supprimer un commentaire est irreversible. Êtes-vous sûr ?',
				cancelText: 'Non, annuler.',
				cancel: function () {
					// add cancel code..


				},
				destructiveButtonClicked: function () {

					console.info('Delete Comment', comment.data.id);

					var sId = comment.data.id;


					Comment.deleteComment(sId);

					var bDel = false;
					for (var i in $scope.comments) {

						if ((bDel == false) && $scope.comments[i].data.id == sId) {
							$scope.comments.splice(i, 1);
							bDel = true;
							break;
						}

						if (!bDel && $scope.comments[i].data.replies) {
							for (var j in $scope.comments[i].data.replies) {
								if (!bDel && $scope.comments[i].data.replies[j].data.id == sId) {
									$scope.comments[i].data.replies.splice(j, 1);
									bDel = true;
									break;
								}

							}
						}


					}


					return true;
				}
			});


		};


		$scope.replyToComment = function (comment) {

			console.log('toggle', comment);


			for (var i in $scope.comments) {
				if ($scope.comments[i].data.uid == comment.data.uid) {

				} else {
					console.log('On ferme ', $scope.comments[i].data.uid);
					$scope.comments[i].showForm = false;
				}
			}


			if (comment.showForm) {
				comment.showForm = false;
			} else {
				comment.showForm = true;
			}
		};


		$scope.onAnswerPost = function (comment) {


			comment.sending = true;


			console.log('answer : ', comment);


			//Comment.


			Comment.addReply(comment.data.id, comment.newanswer.toString()).success(function (data, status) {


				comment.data.replies.push({
					data: {
						iduser: data.iduser,
						author: data.firstname + " " + data.lastname,
						id: data.lastid,
						body: comment.newanswer.toString()
					}
				});

				comment.newanswer = "";
				comment.showForm = false;


				comment.sending = false;


			});


		};

		$scope.onAddComment = function () {

			console.log('AddComment : ', $scope);

			$scope.newcomment.sending = true;


			Comment.addComment($scope.id, $scope.newcomment.body).success(function (data, status) {


				console.log('Comment.addComment Callback : ', data);

				var tempcom = {
					data: {
						author: data.firstname + " " + data.lastname,
						id: data.lastid,
						body: $scope.newcomment.body,
						replies: [],
						iduser: data.iduser
					}
				};

				$scope.comments.push(tempcom);
				$ionicScrollDelegate.scrollBottom();


				$scope.newcomment.body = "";


				$scope.newcomment.sending = false;

			});


			/**
			 $timeout(function(){




			},500)
			 /**/


		};


		$scope.clickDelete = function (uid) {


			console.log('removeProposition ', uid);


			var hideSheet = $ionicActionSheet.show({

				destructiveText: 'Oui, je supprime.',
				titleText: 'Supprimer une proposition est irreversible. Êtes-vous sûr ?',
				cancelText: 'Non, annuler.',
				cancel: function () {
					// add cancel code..


				},
				destructiveButtonClicked: function () {


					console.log('Proposition à supprimer', $scope.prop);


					Proposition.removeProposition(uid).success(function (data, status) {

						//console.info('retour de suppression de proposition', data, $scope, $ionicContentBanner);


						$rootScope.refreshprops = Math.random();


						$location.path('/app/propositions/recent');


						/**

						 if (data.results && data.results.length >= 0) {


							angular.extend($scope.prop, data.results[0]);


							$rootScope.refreshcardfromid = $scope.prop.uid;

							$scope.showVote = false;


						}
						 /**/

					});

					return true;
				}
			});


			/**



			 /**/


		};


		$scope.notifChange = function () {

			//console.log('change ',$scope.settings.notifsubs);

			if ($scope.settings.notifsubs) {
				Proposition.subscribeAmendements($scope.id).success(function () {


				});
			} else {
				Proposition.unSubscribeAmendements($scope.id).success(function () {


				});
			}

		};


		$scope.clickFavorite = function (event, uid) {


			$scope.favorite = !$scope.favorite;


			$scope.prop.favorite = $scope.favorite ? 1 : 0;


			if ($scope.favorite) {
				Proposition.favorite(uid);

				$ionicContentBanner.show({
					text: ['Ajouté aux favoris'],

					autoClose: 2600,
					type: 'info',
					transition: 'vertical'
				});

				$rootScope.refreshfavorites = Math.random();
			} else {

				$ionicContentBanner.show({
					text: ['Supprimé des favoris'],

					autoClose: 2600,
					type: 'info',
					transition: 'vertical'
				});

				Proposition.unfavorite(uid);
				$rootScope.refreshfavorites = Math.random();
			}


		};


		$scope.load = function (erase) {


			$scope.loaded = false;

			if (erase) {
				$scope.amendements = [];
			}


			Proposition.getById($stateParams.propId).success(function (data, status) {


				if (data.results && data.results.length && data.results.length > 0) {
					$scope.loaded = true;
					$scope.proposition = data.results[0];


					$scope.voted = data.voted;

					$scope.amendements = data.amendements;


					$scope.proposition.description = $sce.trustAsHtml($scope.proposition.description);

					$scope.prop = $scope.proposition;


					$scope.settings.notifsubs = (data.amregister == "1" || data.amregister == 1);

					$scope.favorite = $scope.proposition.favorite == "1";


					Comment.getComments($stateParams.propId).success(function (data, status) {


						if (data.results && data.results.length && data.results.length > 0) {


							$scope.comments = data.results;


						}
					});


				} else {
					$scope.loaded = true;
					$scope.voted = data.voted;
					$scope.proposition = {};
					$scope.amendements = [];
					$scope.comments = [];
					$scope.settings.notifsubs = (data.amregister == "1" || data.amregister == 1);
					$scope.prop = $scope.proposition;
					$scope.favorite = false;


					$ionicHistory.clearHistory();
					$ionicHistory.nextViewOptions({
						disableBack: true,
						disableAnimate: true

					});


					if (Login.isLogged()) {
						$location.path('/app/propositions/recent');
					} else {
						$location.path('/entry/subscribe');
					}


				}


			}).finally(function () {


				$scope.$broadcast('scroll.refreshComplete');
				$scope.loaded = true;


				if ($scope.idamd && $scope.idamd != 'none') {
					$timeout(function () {
						//$scope.scrollTo("fcfb43db8541b0b6ab2dc04b75eb7c65bef1368b");
						//$scope.scrollTo("f8381bafef0688233bd47bb54115b5b5fcc45071");


						//console.info("SCROLLTO !",$scope.idamd);

						$scope.scrollTo($scope.idamd);


					}, 200)

				}


			});


		};


		$scope.addAmendement = function () {

			var sPath = '/app/propositions/' + $stateParams.propId + '/amendements/add';
			$location.path(sPath);

		};


		$scope.onUser = function (id) {

			var sPath = '/app/user/' + id;
			$location.path(sPath)
		};


		$scope.clickAmendement = function () {

			$location.path('/app/propositions/' + $stateParams.propId + '/amendements')

		}

	})


	.controller('PropositionOfflineController', function ($scope, Proposition, $stateParams, $location) {


		$scope.proposition = {enabled: true};
		$scope.valid = false;

		$scope.loaded = false;

		$scope.load = function () {


			Proposition.getByIdPublic($stateParams.propId, 0).success(function (data, status) {


				if (data.proposition && data.proposition.uid) {
					$scope.proposition = data.proposition;
					$scope.valid = true;
					$scope.loaded = true;
				} else {
					$scope.proposition = {};
					$scope.valid = false;
					$location.path('/entry/subscribe');
				}


			});


		};


		$scope.goStig = function () {


			window.open('https://getstig.org', '_self');

		};


		$scope.load();


	})

;
