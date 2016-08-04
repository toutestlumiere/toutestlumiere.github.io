/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.comment', ['ionic.utils'])





//.provider('Backend', [function () {
	.service('Comment', ['$http','Backend', function ($http, Backend ) {

		var SERVICE_PATH = "comment";

		this.getComments = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(SERVICE_PATH+'/'+id, true)

			};


			return $http(req);

		};



		this.addComment = function(id,content){


			var req = {
				method: 'POST',
				params : {
					'content': content,
					'type':'comment'

				},
				url: Backend.makeURL(SERVICE_PATH+'/'+id, true)

			};


			return $http(req);

		};

		this.addReply = function(id,content){


			var req = {
				method: 'POST',
				params : {
					'content': content,
					'type':'reply'

				},
				url: Backend.makeURL(SERVICE_PATH+'/'+id, true)

			};


			return $http(req);

		};


		this.deleteComment = function(id){
			var req = {
				method: 'DELETE',
				params : {


				},
				url: Backend.makeURL(SERVICE_PATH+'/'+id, true)

			};
			return $http(req);
		};





	}]);