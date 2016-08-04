/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.vote', [])


	.service('Vote', ['Backend','$http', function (Backend, $http ) {




		var VOTE_PATH = "vote";




		this.getMyVotes = function(){


			var req = {
				method: 'GET',
				params : {

				},
				url: Backend.makeURL(VOTE_PATH+'/', true)
			};

			return $http(req);


		};



		this.addVoteAmendement = function(id,type,idProp){


			console.log("VoteService Amendement", id, type, idProp);

			var req = {
				method: 'POST',
				params : {
					'id':id,
					'type':type,
					'idprop':idProp
				},
				url: Backend.makeURL(VOTE_PATH+'/amendement', true)
			};

			return $http(req);

		};


		this.addVote = function(id,type,bPublic){


			console.log("VoteService", id, type);

			var req = {
				method: 'POST',
				params : {
					'id':id,
					'type':type,
					'public':bPublic?"true":"false"
				},
				url: Backend.makeURL(VOTE_PATH+'/', true)
			};

			return $http(req);

		};

		this.removeVote = function(id){


			var req = {
				method: 'DELETE',
				params : {
					'id':id

				},
				url: Backend.makeURL(VOTE_PATH+'/', true)
			};

			return $http(req);

		};

		this.removeVoteAmendement = function(id){


			var req = {
				method: 'DELETE',
				params : {
					'id':id

				},
				url: Backend.makeURL(VOTE_PATH+'/amendement/', true)
			};

			return $http(req);

		};


	}]);
