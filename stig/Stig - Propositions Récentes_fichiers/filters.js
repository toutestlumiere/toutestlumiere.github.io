/**
 * Created by lecourtoisg on 12/05/15.
 */

angular.module('stigv1.filters', [])


.filter('cut', function () {
	return function (value, wordwise, max, tail) {
		if (!value) return '';

		max = parseInt(max, 10);
		if (!max) return value;
		if (value.length <= max) return value;

		value = value.substr(0, max);
		if (wordwise) {
			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				value = value.substr(0, lastspace);
			}
		}

		return value + (tail || ' …');
	};
})


.filter('singleDecimal', function ($filter) {
	return function (input) {
		if (isNaN(input)) return input;
		return Math.round(input * 10) / 10;
	};
})

.filter('setDecimal', function ($filter) {
	return function (input, places) {
		if (isNaN(input)) return input;
		var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
		return Math.round(input * factor) / factor;
	};
})

.filter('setDigits', function ($filter) {


	return function (input, places) {


//		console.info("setDigits : ", input, places)

		if (isNaN(input)) return input;

		if(input>=100){

			places = 0;



		} else if(input>=10){

			places = 1;
		} else {

			places = 2;

		}


//		console.info("setDigits placeRev : ", input, places)

		var factor = "1" + Array(+(places > 0 && places + 1)).join("0");


//		console.info("setDigits factor : ", factor)




	//	return (Math.round(input * factor) / factor);
		var char = (Math.round(input * factor) / factor).toString().split('.').join('.');

//		console.info("char bef : ", char)


		if(char.indexOf('.')>=0){

			if(char.length === 3){
				char += '0';
			}

		} else {
			if(char.length == 2){
				char += '.0';
			} else if(char.length == 1){
				char += '.00';
			}
		}

		return char;


	};
});