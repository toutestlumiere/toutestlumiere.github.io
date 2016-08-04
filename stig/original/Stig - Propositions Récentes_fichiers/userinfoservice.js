/**
 * Created by lecourtoisg on 16/05/15.
 */


angular.module('stigv1.services.userinfo', [])


	.service('UserInfo', ['Backend','$http', function (Backend, $http ) {




		var USER_PATH = "user";



		this.getById = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(USER_PATH+'/'+id, true)
			};

			return $http(req);

		};

		this.follow = function(id){


			var req = {
				method: 'POST',
				url: Backend.makeURL(USER_PATH+'/'+id+"/follow", true)
			};

			return $http(req);

		};

		this.unfollow = function(id){


			var req = {
				method: 'DELETE',
				url: Backend.makeURL(USER_PATH+'/'+id+"/follow", true)
			};

			return $http(req);

		};


		this.invite = function(email){


			var req = {
				method: 'POST',
				params : {
					'email':email
				},
				url: Backend.makeURL(USER_PATH+'/invite', true)
			};

			return $http(req);

		};

		this.getInviteCode = function(){


			var req = {
				method: 'GET',

				url: Backend.makeURL(USER_PATH+'/invite', true)
			};

			return $http(req);

		};


		this.getFollowing = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(USER_PATH+'/'+id+'/following', true)
			};

			return $http(req);

		};

		this.getFollower = function(id){


			var req = {
				method: 'GET',
				url: Backend.makeURL(USER_PATH+'/'+id+'/follower', true)
			};

			return $http(req);

		};


	}]);
