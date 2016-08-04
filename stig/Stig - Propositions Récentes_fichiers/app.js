// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'stigv1' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'stigv1.controllers' is found in controllers.js
var app = angular.module('stigv1', ['ionic', 'angucomplete', 'yaru22.angular-timeago', 'ionic.utils',
	'stigv1.controllers',
	'stigv1.controllers.login',
	'stigv1.controllers.user',
	'stigv1.controllers.propositionslists',
	'stigv1.controllers.amendements',
	'stigv1.controllers.search',
	'stigv1.controllers.dashboard',
	'stigv1.directives',
	'stigv1.directives.cards',
	'stigv1.directives.scopehandle',
	'stigv1.filters',
	'stigv1.services.category',
	'stigv1.services.user',
	'stigv1.services.login',
	'stigv1.services.proposition',
	'stigv1.services.userinfo',
	'stigv1.services.vote',
	'stigv1.services.town',
	'stigv1.services.config',
	'stigv1.services.filter',
	'stigv1.services.comment',
	'pasvaz.bindonce',
	'jett.ionic.content.banner'

])

	.run(function ($ionicPlatform, $rootScope, Backend, User, Config, $location, Login, $ionicHistory, $ionicPopover, $anchorScroll, $timeout, $ionicContentBanner, $ionicModal, Proposition) {

		console.log("stigv1.run");


		$anchorScroll.yOffset = 50;

		if (document.URL.indexOf("file") >= 0 || document.URL.indexOf("localhost") >= 0 || document.URL.indexOf("stigapp") >= 0 || document.URL.indexOf("192.168.") >= 0) {




			if(window.cordova){
				Backend.setBaseURL('https://getstig.org/api/');
			} else {
				Backend.setBaseURL('http://stigapi/');
			}




		} else {

			Backend.setBaseURL('https://getstig.org/api/');

		}


		//Backend.setBaseURL('https://getstig.org/api42/');




		$rootScope.$on("$locationChangeStart",function(event, next, current) {


			try {
				if (ga) {

					ga('send', 'pageview', $location.path());


				}
			} catch(e){

			}
			try {
				if (fbq) {



					fbq('track', "PageView");



				}
			} catch(e){

			}






		});









		User.load();




		var pageModShare = false;
		var sSharePrefix = "/app/propositions/";
		var sID = '';



		if(($location.path().indexOf(sSharePrefix) === 0) && ($location.path().substr(sSharePrefix.length).split('/').length===1)){


			//console.warn("C'est un SHARE potentiel");

			pageModShare = true;

		}


		//Si on est logués
		///////////////////

		if (Login.isLogged()) {
			console.info('Logged!');
			//Chargement des preferences
			Config.load();


			if ($location.path() === "") {
				$ionicHistory.nextViewOptions({

					historyRoot: true

				});
				$location.path('/app/propositions/recent');
			} else {

				//Si on est dans le cas d'un share
				if(pageModShare){


					//$location.path('/app/propositions/'+$location.path().substr(sSharePrefix.length).split('/')[0]);


				} else {

					//$location.path('/app/propositions/top');


				}





			}

			Config.updateTownName();


			//Si on est pas logués
			///////////////////

		} else {


			if ($location.search().redirect && !pageModShare) {


				$rootScope.redirect = $location.search().redirect;

			}

			if(pageModShare){



				$rootScope.redirect = $location.path();


				$location.path('/proposition/'+$location.path().substr(sSharePrefix.length).split('/')[0]);

				console.info("PAGE MODE SHARE OFFLINE !!!");


			} else {




				if(($location.path() != '/entry/subscribe') && ($location.path() != '/entry') /** && ($location.path() != '/app/myamendements')**/ ) {
					$rootScope.redirect = $location.path();
					$ionicHistory.nextViewOptions({

						historyRoot: true

					});
					
					if($rootScope.redirect == '/app/myamendements'){
						$location.path('/entry');
					} else {
						$location.path('/entry/subscribe');
					}
					
					
				} else {
					//$location.path('/entry/subscribe');
				}


			}




		}


		/**/


		$rootScope.$on('stig.networkError', function (event, msg, status) {



			$ionicContentBanner.show({
				text: [msg],

				autoClose: 3000,
				type: 'error',
				transition: 'vertical'
			});


			if(status == 403) {
				User.erase();
				$location.path('/entry/subscribe');

			}
			if(status == 404) $location.path('/entry/subscribe');
			//if(status == 500) $location.path('/entry/subscribe');

		});


		/**
		 * SYSTEME DE SIGNALEMENT
		 **/



			// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/reportabuse.html', {
			scope: $rootScope
		}).then(function (modal) {
			$rootScope.modalreport = modal;
		});

		// Triggered in the login modal to close it
		$rootScope.closeReport = function () {
			$rootScope.modalreport.hide();
		};

		// Open the login modal
		$rootScope.globalOpenReport = function ($event, id, type, idprop) {


			console.log(this, "open abuse form : ", id);


			$rootScope.abuse = {};
			$rootScope.abuse.type = 0;
			$rootScope.abuse.content = "";

			$rootScope.currentPropType = type;
			$rootScope.currentPropId = id;
			$rootScope.currentPropIdProp = idprop;
			$rootScope.modalreport.show();
		};


		$rootScope.abuse = {};
		$rootScope.abuse.type = 0;
		$rootScope.abuse.content = "";

		$rootScope.onSubmitAbuse = function (form) {


			$rootScope.sendingabuse = true;

			Proposition.reportAbuse($rootScope.currentPropId, $rootScope.abuse.type, $rootScope.abuse.content, $rootScope.currentPropType, $rootScope.currentPropIdProp)
				.success(function () {


					$rootScope.closeReport();


					$ionicContentBanner.show({
						text: ['Signalement enregistré, merci.'],

						autoClose: 3200,
						type: 'info',
						transition: 'vertical'
					});


					$rootScope.sendingabuse = false;

				}).finally(function () {


					$rootScope.sendingabuse = false;

				});


		};


		/**
		 * FIN DE SYSTEME DE SIGNALEMENT
		 */




		/**
		 * Systeme de share DEBUT
		 **/


		$ionicPopover.fromTemplateUrl('templates/sharepopover.html', {

			scope: $rootScope

		}).then(function (popover) {
			$rootScope.popovershare = popover;
		});


		$rootScope.shareProposition = function ($event, id, title) {




			$rootScope.idtoshare = id;
			$rootScope.linktoshare = 'https://sti.gr/';
			$rootScope.titletoshare = title;
			$rootScope.shareloaded = false;


			Proposition.getShareKey(id).success(function (data) {


				console.info(data);

				if (data && data.sharehash) {



					var clipboard = new Clipboard('[data-link-copy-share]');


					clipboard.on('success', function (e) {

						$ionicContentBanner.show({
							text: ['Lien copié !'],

							autoClose: 2300,
							type: 'info',
							transition: 'vertical'
						});


					});



					$rootScope.idtoshare = data.sharehash;


					$rootScope.linktoshare = 'https://sti.gr/'+data.sharehash;

					$rootScope.shareloaded = true;

				}

			});


			console.info("shareProposition : ", id, title);


			$rootScope.popovershare.show($event);


		};


		/**
		 * Systeme de share END
		 */



		$rootScope.openURLExt = function (url) {


			console.info(url);


			window.open(url, '_blank');

		};


		$rootScope.goRecentGlobal = function () {

			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				historyRoot: true

			});

			$location.path('/app/propositions/recent');


		};


		$rootScope.goTopGlobal = function () {

			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				historyRoot: true

			});

			$location.path('/app/propositions/top');


		};


		$rootScope.goFluxGlobal = function () {

			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				historyRoot: true

			});

			$location.path('/app/propositions/monflux');


		};


		$rootScope.goControverseGlobal = function () {

			$ionicHistory.nextViewOptions({

				disableAnimate: true,
				historyRoot: true

			});

			$location.path('/app/propositions/controverse');


		};

		$rootScope.goSearchGlobal = function () {

			$ionicHistory.nextViewOptions({

				disableAnimate: true,
				historyRoot: true

			});

			$location.path('/app/propositions/search');


		};


		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.config(function ($stateProvider, $logProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider, $httpProvider,$compileProvider) {


		//.config('$stateProvider','$urlRouterProvider','$ionicConfigProvider',function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {


		console.log("stigv1.config");

		$locationProvider.html5Mode(true);


		if (document.URL.indexOf("file") >= 0 || document.URL.indexOf("localhost") >= 0 || document.URL.indexOf("192.168.") >= 0) {

			$compileProvider.debugInfoEnabled(false);
			$logProvider.debugEnabled(false);
		} else {
			$compileProvider.debugInfoEnabled(false);
			$logProvider.debugEnabled(false);
		}





		$ionicConfigProvider.views.maxCache(3);
		//$ionicConfigProvider.views.forwardCache(false);
		if(ionic.Platform.isAndroid()){
			$ionicConfigProvider.views.transition('none');
		}






		//$httpProvider.interceptors.push(interceptor);


		$httpProvider.interceptors.push(function ($q, $rootScope, $location) {
			return {


				'responseError': function (rejection) {


					$rootScope.$broadcast('stig.networkError', "Erreur réseau. Impossible d'éxécuter l'opération",rejection.status );

					return $q.reject(rejection);

				}

			};
		});


		$ionicConfigProvider.backButton.previousTitleText(false);
		$ionicConfigProvider.backButton.text('');

		if (ionic.Platform.isAndroid()) {
			$ionicConfigProvider.scrolling.jsScrolling(false);
		}

		//$ionicConfigProvider.scrolling.jsScrolling(false);


		$ionicConfigProvider.navBar.alignTitle('center');


		//$locationProvider.hashPrefix('!');


		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/entry/subscribe');
		//$urlRouterProvider.otherwise('/app/propositions/recent');


		$stateProvider


			/**

			.state('testscrollrecent', {
				url: "/app/propositions/recent",

				templateUrl: "templates/testlists.html",
				controller: 'ProplistsCtrl'
				,
				onEnter: ['$rootScope', function ($rootScope) {
					console.info("On Enter Recent");

					$rootScope.globalorder = "recent";






				}]
			})


			.state('testscrolltop', {
				url: "/app/propositions/top",

				templateUrl: "templates/testlists.html",
				controller: 'ProplistsCtrl'
				,
				onEnter: ['$rootScope', function ($rootScope) {
					console.info("On Enter Recent");

					$rootScope.globalorder = "top";






				}]
			})

		/**/

		/**/

			.state('entry', {
				url: "/entry",

				templateUrl: "templates/entry.html",
				controller: 'EntryController'
			})


			.state('subscribe', {
				url: "/entry/subscribe",

				templateUrl: "templates/subscribe.html",
				controller: 'SubscribeController'

			})


			.state('resetpassword', {
				url: "/entry/resetpassword",

				templateUrl: "templates/resetpassword.html",
				controller: 'ResetPasswordController'

			})


			.state('dashboard', {
				url: "/dashboard",

				templateUrl: "templates/dashboard.html",
				controller: 'DashboardController'

			})


			.state('tutorial', {
				url: "/tutorial",
				templateUrl: "templates/tutorial.html",
				controller: 'TutorialController'
			})


			.state('propositionshare', {
				url: "/proposition/:propId",
				templateUrl: "templates/propoffline.html",
				controller: 'PropositionOfflineController'
			})

			/*
			.state('apphashpropdetail', {
				url: "!/app/propositions/:propId",
				views: {
					'menuContent': {
						templateUrl: "templates/proposition.html",
						controller: 'ProplistCtrl'
					}
				}
			})*/

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'AppCtrl'
			})




			.state('app.settings', {
				url: "/settings",
				params: {},

				views: {
					'menuContent': {
						templateUrl: "templates/profil.html",
						controller: 'ProfilController'
					}
				}

			})


			.state('app.aide', {
				url: "/aide",
				params: {},

				views: {
					'menuContent': {
						templateUrl: "templates/aide.html",
						controller: function(){}
					}
				}

			})


			.state('app.profil', {
				url: "/profil",
				params: {
					me: true
				},

				views: {
					'menuContent': {
						templateUrl: "templates/user.html",
						controller: 'UserCtrl'
					}
				}

			})

			.state('app.myamendements', {
				url: "/myamendements",


				views: {
					'menuContent': {
						templateUrl: "templates/myamendements.html",
						controller: 'MyContributionsController'
					}
				}

			})

			.state('app.myvotes', {
				url: "/myvotes",


				views: {
					'menuContent': {
						templateUrl: "templates/myvotes.html",
						controller: 'MyVotesController'
					}
				}

			})


			.state('app.mydrafts', {
				url: "/drafts",


				views: {
					'menuContent': {
						templateUrl: "templates/mydrafts.html",
						controller: 'MyDraftsController'
					}
				}

			})

			.state('app.favorites', {
				url: "/favorites",


				views: {
					'menuContent': {
						templateUrl: "templates/favorites.html",
						controller: 'MyFavoritesController'
					}
				}

			})


			.state('app.propositions', {
				url: "/propositions",
				views: {
					'menuContent': {
						templateUrl: "templates/propositions.html",
						controller: 'ProplistsCtrl'
					}
				}

			})


			.state('app.propositionsearch', {
				url: "/propositions/search",
				views: {
					'menuContent': {
						templateUrl: "templates/search.html",
						controller: 'SearchController'

					}
				}
			})


			.state('app.propositionsrecent', {
				url: "/propositions/recent",
				views: {
					'menuContent': {
						templateUrl: "templates/propositions.html",
						controller: 'ProplistsCtrl'
					}
				},
				onEnter: ['$rootScope', function ($rootScope) {
					console.info("On Enter Recent");

					//$ionicNavBarDelegate.title(Config.stigLogoTitle+' Récent!');

					//$rootScope.refreshprops = Math.random();


					$rootScope.globalorder = "recent";
					$rootScope.propstitle = ( '<i class="icon stigicon-recent calm" style="font-size: 32px;position: relative;top: 4px"></i>' + ' Récent');


					if (($rootScope.refreshcardfromid !== undefined) && ($rootScope.refreshcardfromid !== '')) {
						$rootScope.$broadcast('stig-refreshid', {id: $rootScope.refreshcardfromid, type: "vote"});

						$rootScope.refreshcardfromid = undefined;
					}


				}]
			})


			.state('app.propositionstop', {
				url: "/propositions/top",
				views: {
					'menuContent': {
						templateUrl: "templates/propositions.html",
						controller: 'ProplistsCtrl'
					}
				},
				onEnter: ['$rootScope', function ($rootScope) {
					console.info("On Enter TOP");
					//$rootScope.refreshprops = Math.random();
					//$ionicNavBarDelegate.title(Config.stigLogoTitle+' Top!');
					$rootScope.globalorder = "top";
					//$rootScope.propstitle = ('<i class="icon stigicon-top calm" style="font-size: 32px;position: relative;top: 4px"></i>' + ' Volonté générale');

					$rootScope.propstitle = ('<i class="icon stigicon-top calm" style="font-size: 32px;position: relative;top: 4px"></i>' + ' Top');
					if (($rootScope.refreshcardfromid !== undefined) && ($rootScope.refreshcardfromid !== '')) {
						$rootScope.$broadcast('stig-refreshid', {id: $rootScope.refreshcardfromid, type: "vote"});

						$rootScope.refreshcardfromid = undefined;
					}

				}]
			})

			.state('app.propositionstopwelcome', {
				url: "/propositions/top/welcome",
				views: {
					'menuContent': {
						templateUrl: "templates/propositions.html",
						controller: 'ProplistsCtrl'
					}
				},
				onEnter: ['$rootScope', function ($rootScope) {
					console.info("On Enter TOP");
					//$rootScope.refreshprops = Math.random();
					//$ionicNavBarDelegate.title(Config.stigLogoTitle+' Top!');
					$rootScope.globalorder = "top";
					//$rootScope.propstitle = ('<i class="icon stigicon-top calm" style="font-size: 32px;position: relative;top: 4px"></i>' + '  Volonté générale');

					$rootScope.propstitle = ('<i class="icon stigicon-top calm" style="font-size: 32px;position: relative;top: 4px"></i>' + '  Top');

					if (($rootScope.refreshcardfromid !== undefined) && ($rootScope.refreshcardfromid !== '')) {
						$rootScope.$broadcast('stig-refreshid', {id: $rootScope.refreshcardfromid, type: "vote"});

						$rootScope.refreshcardfromid = undefined;
					}

				}]
			})


			.state('app.propositionscontroverses', {
				url: "/propositions/controverse",
				views: {
					'menuContent': {
						templateUrl: "templates/propositions.html",
						controller: 'ProplistsCtrl'
					}
				},
				onEnter: ['$rootScope', function ($rootScope) {
					//$rootScope.refreshprops = Math.random();
					console.info("On Enter Controverses");
					$rootScope.globalorder = "controverses";
					$rootScope.propstitle = ('<i class="icon stigicon-controverses calm" style="font-size: 32px;position: relative;top: 4px"></i>' + ' Controverses');

					if (($rootScope.refreshcardfromid !== undefined) && ($rootScope.refreshcardfromid !== '')) {
						$rootScope.$broadcast('stig-refreshid', {id: $rootScope.refreshcardfromid, type: "vote"});

						$rootScope.refreshcardfromid = undefined;
					}

				}]
			})


			.state('app.propositionsmonflux', {
				url: "/propositions/monflux",
				views: {
					'menuContent': {
						templateUrl: "templates/myflux.html",
						controller: 'MyFluxController'
					}
				},
				onEnter: ['$rootScope', function ($rootScope) {
					$rootScope.refreshprops = Math.random();
					console.info("On Enter Controverses");
					//$rootScope.globalorder = "myflux";
					$rootScope.propstitle = ('<i class="icon stigicon-myflux calm" ></i>' + ' Mon Flux');

					if (($rootScope.refreshcardfromid !== undefined) && ($rootScope.refreshcardfromid !== '')) {
						$rootScope.$broadcast('stig-refreshid', {id: $rootScope.refreshcardfromid, type: "vote"});

						$rootScope.refreshcardfromid = undefined;
					}

				}]
			})


			.state('app.addproposition', {
				url: "/addproposition",
				views: {
					'menuContent': {
						templateUrl: "templates/addproposition.html",
						controller: 'AddPropositionController'
					}
				}
			})


			.state('app.propdisadd', {
				url: "/propositions/dis",
				views: {
					'menuContent': {
						templateUrl: "templates/preaddproposition.html",
						controller: 'DisAddPropositionController'

					}
				}
			})

			.state('app.propdisadd2', {
				url: "/propositions/dis2",
				views: {
					'menuContent': {
						templateUrl: "templates/preaddpropositionsearch.html",
						controller: 'DisAddPropositionController2'

					}
				}
			})


			.state('app.propadd', {
				url: "/propositions/dis/add",
				views: {
					'menuContent': {
						templateUrl: "templates/addproposition.html",
						controller: 'AddPropositionController'
					}
				}
			})


			.state('app.propedit', {
				url: "/propositions/edit/:propId",
				views: {
					'menuContent': {
						templateUrl: "templates/addproposition.html",
						controller: 'AddPropositionController'
					}
				}
			})




			.state('app.propdetail', {
				url: "/propositions/:propId",
				views: {
					'menuContent': {
						templateUrl: "templates/proposition.html",
						controller: 'ProplistCtrl'
					}
				}
			})





			.state('app.addamendement', {
				url: "/propositions/:propId/amendements/add",
				views: {
					'menuContent': {
						templateUrl: "templates/addamendement.html",
						controller: 'AddAmendementCtrl'
					}
				}
			})

			.state('app.listamendementsscroll', {
				url: "/propositions/:propId/amendements/:amdId",
				views: {
					'menuContent': {
						templateUrl: "templates/proposition.html",
						controller: 'ProplistCtrl'
					}
				}
			})




			.state('app.userprops', {
				url: "/propositions/user/:id",
				views: {
					'menuContent': {
						templateUrl: "templates/user.html",
						controller: 'UserCtrl'
					}
				}
			})

			.state('app.user', {
				url: "/user/:id",
				views: {
					'menuContent': {
						templateUrl: "templates/user.html",
						controller: 'UserCtrl'
					}
				}
			})

			.state('app.userfollowing', {
				url: "/user/:id/following",
				views: {
					'menuContent': {
						templateUrl: "templates/following.html",
						controller: 'FollowingController'
					}
				}
			})


			.state('app.userfollower', {
				url: "/user/:id/follower",
				views: {
					'menuContent': {
						templateUrl: "templates/follower.html",
						controller: 'FollowerController'
					}
				}
			})

		/**/

		;

	});
