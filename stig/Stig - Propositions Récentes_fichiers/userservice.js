/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.user', [])


	.service('User', ['$localstorage','$rootScope', function ($localstorage,$rootScope) {


		$rootScope.groupid = 0;



		var lcversion = "stigv0.9.4"

		var LOGIN_KEY = lcversion+".login.key";
		var ID_KEY = lcversion+".id.key";
		var GROUP_KEY = lcversion+".group.key";
		var TOKEN_KEY = lcversion+".token.key";
		var TUTO_KEY = lcversion+".tuto.key";

		/**
		var LOGIN_KEY = "stig"+Config.version+".login.key";
		var ID_KEY = "stig"+Config.version+".id.key";
		var GROUP_KEY = "stig"+Config.version+".group.key";
		var TOKEN_KEY = "stig"+Config.version+".token.key";
		/**/


		var _login = "";
		var _id = "";
		var _group = "";
		var _token = "";
		var _tuto = "";
		var _refreshtoken = "";







		this.store = function(){




			//ATTENTION  !!!!!!! // TODO

			/**/



			$localstorage.set(LOGIN_KEY, _login);
			$localstorage.set(ID_KEY, _id);
			$localstorage.set(GROUP_KEY, _group);
			$localstorage.set(TOKEN_KEY, _token);
			$localstorage.set(TUTO_KEY, _tuto);


			/**/

		};


		this.load = function(){

			_login = $localstorage.get(LOGIN_KEY);
			_id = $localstorage.get(ID_KEY);
			_group = $localstorage.get(GROUP_KEY);
			$rootScope.groupid = _group;
			_token = $localstorage.get(TOKEN_KEY);
			_tuto = $localstorage.get(TUTO_KEY)?true:false;

		};

		this.erase = function(){


			_login = undefined;
			_id = undefined;
			_group = undefined;
			_token = undefined;
			_tuto = undefined;

			$localstorage.erase(LOGIN_KEY);
			$localstorage.erase(ID_KEY);
			$localstorage.erase(GROUP_KEY);
			$localstorage.erase(TOKEN_KEY);
			$localstorage.erase(TUTO_KEY);

		};



		this.getLogin = function(){
			return _login;
		};

		this.setLogin = function(login){
			_login = login;
		};

		this.getId = function(){
			return _id;
		};

		this.setId = function(id){
			_id = id;
		};


		this.getGroup = function(){
			return _group;
		};

		this.setGroup = function(group){
			$rootScope.groupid = group;
			_group = group;
		};


		this.getToken = function(){
			return _token;
		};

		this.setToken = function(token){
			_token = token;
		};

		this.getTuto = function(){
			return _tuto;
		};

		this.setTuto = function(tuto){
			_tuto = tuto;
		};



	}]);
