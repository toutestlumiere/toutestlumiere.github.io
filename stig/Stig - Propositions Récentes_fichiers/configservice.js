


/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.config', [])





	.service('Config', ['$localstorage','$rootScope','Town', function ($localstorage, $rootScope, Town ) {



		var _scopeLabels = {
			'local':'VILLE',
			'national' : 'FRANCE'


		}



		this.version = "v0.9.4";

		this.stigLogoTitle = '<img class="title-image" src="img/logo2.svg" style="vertical-align: middle;height: 38px"/>';





		var SCOPE_KEY = "stigv0.9.4.config.scope.key";


		var _scope = "";
		var _member = 0;
		var _town = "VILLE";


		this.updateTownName = function(fCallBack) {

			var that = this;
			return Town.getMe().success(function(data, status){


				//console.log(data);
				var town = data[0];


				_scopeLabels['local'] = town.name;

				_member = town.member;

				_town = town.name;




				that.updateRootScope();


				console.info("update dans le Service !", data);


				if(fCallBack){
					fCallBack();
				}



			});






		};

		this.updateRootScope = function(){

			$rootScope.labelscope = _scopeLabels[_scope];
			$rootScope.statescope = _scope;
			$rootScope.member = parseInt(_member);
			$rootScope.townname = _town;

		};



		this.default = function(){

			_scope = 'national';

			_member = 0;

			_town = 'VILLE';

			this.updateRootScope();

			this.store();

		};



		this.store = function(){
			$localstorage.set(SCOPE_KEY, _scope);

		};


		this.load = function(){

			_scope = $localstorage.get(SCOPE_KEY);
			this.updateRootScope();

		};

		this.erase = function(){

			$localstorage.erase(SCOPE_KEY);

		};

		this.getMember = function(){
			return _member;
		};




		this.getScope = function(){
			return _scope;
		};

		this.setScope = function(scope){
			_scope = scope;
			this.store();
			this.updateRootScope();
		};

	}]);
