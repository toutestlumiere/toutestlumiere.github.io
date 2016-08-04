/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.category', ['ionic.utils'])





//.provider('Backend', [function () {
	.service('Categories', ['$http','Backend', function ($http, Backend ) {

		var CATEGORY_PATH = "category";

		this.getLocal = function(){


			var req = {
				method: 'GET',
				url: Backend.makeURL(CATEGORY_PATH+'/local', true)

				//data: { test: 'test' }
			};


			return $http(req);

		};


		this.getNational = function(){

			var req = {
				method: 'GET',
				url: Backend.makeURL(CATEGORY_PATH+'/national', true)

				//data: { test: 'test' }
			};


			return $http(req);

		}

	}]);