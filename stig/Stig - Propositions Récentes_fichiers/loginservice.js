/**
 * Created by lecourtoisg on 16/05/15.
 */

angular.module('stigv1.services.login', [])



.service('Login', ['$http', 'User','Backend', function ($http, User, Backend) {


		var CLIENT_ID = "xbakowk4w84sgcwwwk48o4k44c8s8kgoc32ggc0ggomabjhgm2_1";
		var CLIENT_SECRET = "poi0c8oc488c04kg0wwo8gcg8kc0wgsgkok0c8wcjm7iwej9o8";

		var AUTH_PATH = 'auth/validateCredentials';
		var REGISTER_PATH = 'auth/register';

		this.login = function(log, pass){

			return $http.get(Backend.getBaseURL()+AUTH_PATH,
				{
					params: {
						user: log,
						pass: pass,
						client_id: CLIENT_ID.split('').reverse().join(''),
						client_secret: CLIENT_SECRET.split('').reverse().join('')

					}
				});



		};


		this.register = function(code,lastname,firstname,townid, login, password){


			/**/
			return $http.get(Backend.getBaseURL()+REGISTER_PATH,
				{
					params: {
						code:code,
						user: login,
						pass: password,
						townid : townid,

						firstname : firstname,
						lastname : lastname,

						client_id: CLIENT_ID.split('').reverse().join(''),
						client_secret: CLIENT_SECRET.split('').reverse().join('')

					}
				});

			/**/

		};




		this.resetPassword = function(log){

				var req = {
					method: 'PUT',
					params: {
						user: log,
						client_id: CLIENT_ID.split('').reverse().join(''),
						client_secret: CLIENT_SECRET.split('').reverse().join('')

					},
					url:Backend.getBaseURL()+AUTH_PATH
				};

			return $http(req);

		};






		this.logout = function(){

			User.erase();

		};

		this.isLogged = function(){

			return ( User.getId() != '' && User.getId() != undefined ) && ( User.getToken() != '' && User.getToken() != undefined )

		};







}]);