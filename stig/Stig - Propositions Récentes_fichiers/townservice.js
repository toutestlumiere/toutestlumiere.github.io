/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.town', ['ionic.utils'])





//.provider('Backend', [function () {
	.service('Town', ['$http','Backend', function ($http, Backend ) {

		var TOWN_PATH = "town";

		this.getZones = function(){


			var req = {
				method: 'GET',
				url: Backend.makeURL(TOWN_PATH+'/zones', true)


			};


			return $http(req);

		};

		this.getMe = function(){


			var req = {
				method: 'GET',
				url: Backend.makeURL(TOWN_PATH+'/me', true)


			};


			return $http(req);

		};





	}]);