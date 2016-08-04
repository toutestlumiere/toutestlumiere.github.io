angular.module('stigv1.controllers.dashboard', [])


	.controller('DashboardController', function ($scope, $location) {


		$scope.goBack = function(){

			//$location.back();

			$location.path('/app/propositions')






		};


		var Color = net.brehaut.Color;

		var green = Color("#4ebfa6");

		var aColor = [];

		var aGreens = green.neutralScheme();

		for(var i in aGreens){

			//aColor.push( {value:aGreens[i].toCSS() });

		}

		console.log(green.toCSS());

		aColor.push( {value:green.toCSS()});


		Chart.defaults.global.colours = [];


		Chart.defaults.global.colours.push(green.toCSS());


		var steps = 5;
		for(var i = 1 ; i <= steps ; i++){

			var nC = green.clone();

			aColor.push( {value: nC.darkenByRatio(0.97*i/steps).toCSS()});


			Chart.defaults.global.colours.push(nC.darkenByRatio(0.97*i/steps).toCSS());

		}





		$scope.aColor = aColor;


		console.log(aColor);


		$scope.data = {
			labels: [
				'Avril',
				'Mai',
				'Juin',
				'Juil',
				'Aout'
			],
			datasets: [
				{
					fillColor : green.toCSS(),
					data: [23, 70, 129, 278, 361]
				}
			]
		};



		var data2 = [
			{
				value: 300,
				color:aColor[0].value,
				//highlight: aColor[0].lightenByRatio(0.91).toCSS(),
				label: "Red"
			},
			{
				value: 50,
				color:aColor[1].value,
				//highlight: aColor[1].lightenByRatio(0.91).toCSS(),
				label: "Green"
			},
			{
				value: 100,
				color:aColor[2].value,
				//highlight: aColor[2].lightenByRatio(0.91).toCSS(),
				label: "Yellow"
			}
		]

		$scope.activeData = data2;


		$scope.someOptions = {


			scaleShowLabels:false,
			showTooltips: true,
			showXLabels: 5


		};





		$scope.labels2 = [];

		$scope.data2 = [[]];


		var s = Date.parse('2015-06-27');
		var e = new Date();
		var a = [];

		console.log(s);

		while(s < e) {
			a.push(s);

			$scope.labels2.push(s.toString('d-MMM-yyyy'));

			$scope.data2[0].push(Math.round(Math.random()*100));

			//console.log(a,'\n-----');

			s = new Date(s.setDate(
				s.getDate() + 1
			))
		}



		//$scope.labels2 = ["January", "February", "March", "April", "May", "June", "July"];
		//$scope.series = ['Series A', 'Series B'];
		//$scope.data2 = [[65, 59, 80, 81, 56, 55, 40]];








		$scope.onClick = function (points, evt) {
			console.log(points, evt);
		};

		$scope.rond = {};
		$scope.rond.labels = ["Education", "Sport", "Défense","Urbanisme","Recherche"];
		$scope.rond.data = [300, 540, 100,56,45];

		//$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
		//$scope.data = [300, 500, 100];

		$scope.date = new Date();


	});