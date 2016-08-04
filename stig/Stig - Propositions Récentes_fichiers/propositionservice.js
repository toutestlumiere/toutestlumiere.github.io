/**
 * Created by lecourtoisg on 16/05/15.
 */

angular.module('stigv1.services.proposition', [])


//.provider('Backend', [function () {
.service('Proposition', ['Backend','$http','Config', function (Backend,$http, Config) {



		var PROPOSITIONS_PATH = "proposition";




		this.getSearch = function(keyword,mode){


			var req = {
				method: 'GET',
				params : {
					'keyword':keyword,
					'mode': mode
				},
				url: Backend.makeURL(PROPOSITIONS_PATH+'/search/'+Config.getScope(), true)

				//data: { test: 'test' }
			};


			return $http(req);

		};

		this.getMyContributions = function(){

			var req = {};
			req = {
				method: 'GET',
				url: Backend.makeURL(PROPOSITIONS_PATH+"/me/"+"contributions", true)

				//data: { test: 'test' }
			};
			return $http(req);

		};


		this.getMyDrafts = function(){

			var req = {};
			req = {
				method: 'GET',
				url: Backend.makeURL(PROPOSITIONS_PATH+"/me/"+"draft", true)

				//data: { test: 'test' }
			};
			return $http(req);

		};






		this.getMyFlux = function(bp,ba,bv){

			var req = {};
			req = {
				method: 'GET',
				params : {
					'beforep':bp,
					'beforea':ba,
					'beforev':bv

				},

				url: Backend.makeURL(PROPOSITIONS_PATH+"/me/"+"flux", true)


			};
			return $http(req);

		};


		this.getMyFavorites = function(){

			var req = {};
			req = {
				method: 'GET',
				url: Backend.makeURL("favorite", true)

				//data: { test: 'test' }
			};
			return $http(req);

		};


		this.getByOrderAfter = function(order, sCat, sId, filters){

			var req = {};


			var sParam = "";

			if(sCat && sCat > 0){
				sParam = "/"+sCat;
			}


			req = {
				method: 'GET',
				params : {
					'after':sId
				},
				url: Backend.makeURL(PROPOSITIONS_PATH+"/order/"+order+'/'+Config.getScope()+sParam, true, filters)

			};



			return $http(req);

		};

		this.getByOrderBefore = function(order, sCat, sId, filters){

			var req = {};

			var sParam = "";

			if(sCat && sCat > 0){
				sParam = "/"+sCat;
			}


			req = {
				method: 'GET',
				params : {
					'before':sId
				},
				url: Backend.makeURL(PROPOSITIONS_PATH+"/order/"+order+'/'+Config.getScope()+sParam, true, filters)

			};



			return $http(req);

		};


		// ici on récuppère directement les filtres à appliquer
		this.getByOrder = function( order, filters ){

			var req = {};

			var sParam = "";

			//Si présence d'un filtre catégorie, on l'ajoute dans l'URL (utile au réferencement ?)
			if ( filters && filters.catid ){
				sParam = "/"+ filters.catid;
			}

			/*

			if(order == 'controverses'){

				req = {
					method: 'GET',
					url: Backend.makeURL(PROPOSITIONS_PATH+"/controverses/"+Config.getScope()+sParam, true)

					//data: { test: 'test' }
				};

			} else {

			*/

				req = {
					method: 'GET',
					url: Backend.makeURL( PROPOSITIONS_PATH+"/order/"+order+'/'+Config.getScope()+sParam, true, filters)

					//data: { test: 'test' }
				};


			//}

			return $http(req);

		};


		this.getById = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id, true)

				//data: { test: 'test' }
			};


			return $http(req);

		};


		this.getByIdPublic = function(id,key){


			var req = {
				method: 'GET',
				params : {
					'id':id,
					'key':key
				},
				url: Backend.makeURL(PROPOSITIONS_PATH+'/proppublic', false)

			};


			return $http(req);

		};






		this.getShareKey = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id+'/share', true)

			};


			return $http(req);

		};



		this.getAmendements = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id+'/amendements', true)

				//data: { test: 'test' }
			};


			return $http(req);

		};




		this.addAmendement = function(id,content){


			var req = {
				method: 'POST',
				params : {
					'content':content
				},
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id+'/amendements', true)

			};


			return $http(req);

		};


		this.subscribeAmendements = function(id){

			var req = {
				method: 'POST',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id+'/amendements/subscribe', true)

			};


			return $http(req);

		};

		this.unSubscribeAmendements = function(id){

			var req = {
				method: 'DELETE',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id+'/amendements/subscribe', true)

			};


			return $http(req);

		};


		this.favorite = function(id) {

			var req = {
				method: 'POST',
				url: Backend.makeURL('favorite'+'/'+id, true)

			};

			return $http(req);


		};



		this.reportAbuse = function(id,type,content,typecontribution,idcontri) {


			idcontri = idcontri || '';


			var sURL = (typecontribution=='proposition')?PROPOSITIONS_PATH+'/'+id+'/reportabuse':PROPOSITIONS_PATH+'/amendement/'+id+'/reportabuse'


			var req = {
				method: 'POST',
				params : {
					'type':type,
					'content':content,
					'typecontribution':typecontribution,
					'idcontri':idcontri
				},
				url: Backend.makeURL(sURL, true)

			};

			return $http(req);


		};



		this.unfavorite = function(id) {

			var req = {
				method: 'DELETE',
				url: Backend.makeURL('favorite'+'/'+id, true)

			};
			return $http(req);

		};

		this.getAllByUserId = function(uid){


			var req = {
				method: 'GET',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/user/'+uid, true)


			};


			return $http(req);

		};




		this.removeAmemdement = function(id){


			var req = {
				method: 'DELETE',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/amendement/'+id, true)

				//data: { test: 'test' }
			};


			return $http(req);

		};


		this.transformAmemdement = function(id){


			var req = {
				method: 'POST',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/amendement/'+id+'/comment', true)

				//data: { test: 'test' }
			};


			return $http(req);

		};


		this.removeProposition = function(id){


			var req = {
				method: 'DELETE',
				url: Backend.makeURL(PROPOSITIONS_PATH+'/'+id, true)

				//data: { test: 'test' }
			};


			return $http(req);

		};





	}]);