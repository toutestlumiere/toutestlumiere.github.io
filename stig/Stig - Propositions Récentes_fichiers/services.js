/**
 * Created by lecourtoisg on 04/05/15.
 */


angular.module('ionic.utils', [])

	.factory('$localstorage', ['$window', function ($window) {
		return {
			set: function (key, value) {
				$window.localStorage[key] = value;
			},
			get: function (key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			setObject: function (key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function (key) {
				return JSON.parse($window.localStorage[key] || '{}');
			},
			erase : function(key){
				$window.localStorage.removeItem(key);
			}

		}
	}])


	//.provider('BackEnd', ['$localstorage', function ($localstorage) {





	//.provider('Backend', [function () {
	.service('Backend', ['$localstorage','User', function ($localstorage,User) {


		var BEKey = "Backend.enpoint.key";
		var BEUrlDefault = "http://localhost/apistig/";

		var _url = BEUrlDefault;


		this.makeURL = function( path, isToken, params ){

			var parameters = "";

			//Permet d'ajouter des paramètres à l'url, au même titre que le token
			//Ajouté pour la gestion des filtres dans l'affichage des propositions
			if (params) {

				for (param in params) {
					parameters += (isToken ? "&" : "?") + param + "=" + params[param];

				}
			}

			parameters = encodeURI( parameters );

			console.log( "makeURL => " + parameters);

			return this.getBaseURL()+ path + (isToken? "?token_access="+User.getToken():"") + parameters;

		};

		this.getBaseURL = function(){

			//console.log(this, "getURL -> $localstorage : ", $localstorage);

			return _url;
		};


		this.setBaseURL = function(url){


			console.log(this, "setURL", url);
			_url = url;

		};



	}]);




