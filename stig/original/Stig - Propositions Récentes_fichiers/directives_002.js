/**
 * Created by lecourtoisg on 30/03/15.
 */

angular.module("stigv1.directives", [])

	.directive('stgCircularProgress', function () {

		return {
			restrict: 'A',
			scope: {
				progressValue: '@stgCircularValue',
				color: '@stgCircularColor',



				circValue:'@circValue'
			},

			template: '<div style=" stroke: {{color}}; fill: #000; width: 90px;height: 90px">\
				<svg width="90" height="90">\
				<g transform="rotate(-90,45,45)">\
				\
				\
				\
				<circle stroke="#d20d0d" stroke-width="6"\
				r="36" cx="45" cy="45" fill="none"\
				transform="scale(1,1)"></circle>\
				\
				\
				<circle stroke-width="11"\
				stroke-dasharray="226.1946744"\
				stroke-dashoffset="{{(226.1946744) - (progressValue / 100 * 2 * 3.1415927 * 36)}}"\
				r="36" cx="45" cy="45" fill="none"\
				transform="scale(1,1) translate(0,0)"></circle>\
				\
				\
				\
				\
				\
				\
				</g>\
				</svg>\
				</div>',
			compile: function (element, attrs) {

				if (!attrs.stgCircularStrokeWidth) {
					attrs.stgCircularStrokeWidth = 10;
				}

			}

		};

	})



	.directive('stgCircularProgressOld', function () {

		return {
			restrict: 'A',
			scope: {
				progressValue: '@stgCircularValue',
				color: '@stgCircularColor',
				size: '@stgCircularSize',
				radius: '@stgCircularRadius',
				strokeWidth: '@stgCircularStrokeWidth'
			},

			template: '<div style=" stroke: {{color}}; fill: #000; width: {{size}}px;height: {{size}}px">\
				<svg ng-attr-width="{{size}}" ng-attr-height="{{size}}">\
				<g ng-attr-transform="rotate(-90,{{size/2}},{{size/2}})">\
				\
				\
				\
				<circle stroke="#d20d0d" stroke-width="{{strokeWidth-5}}"\
				ng-attr-r="{{radius}}" ng-attr-cx="{{size/2}}" ng-attr-cy="{{size/2}}" fill="none"\
				ng-attr-transform="scale(1,1)"></circle>\
				\
				\
				<circle stroke-width="{{strokeWidth}}"\
				stroke-dasharray="{{2 * 3.1415927 * radius }}"\
				stroke-dashoffset="{{(2 * 3.1415927 * radius) - (progressValue / 100 * 2 * 3.1415927 * radius)}}"\
				ng-attr-r="{{radius}}" ng-attr-cx="{{size/2}}" ng-attr-cy="{{size/2}}" fill="none"\
				transform="scale(1,1) translate(0,0)"></circle>\
				\
				\
				\
				\
				\
				\
				</g>\
				</svg>\
				</div>',
			compile: function (element, attrs) {

				if (!attrs.stgCircularStrokeWidth) {
					attrs.stgCircularStrokeWidth = 10;
				}

			}

		};

	})



	.directive('timeago', function () {

		return {
			restrict: 'E',
			replace: true,
			scope : {
				date:'@date'
			},
			template: '<span></span>',
			compile: function (tElement, tAttrs, transclude) {
				return function (scope, elm, attrs) {

					var nDate = scope.date;


					console.log(scope,elm,nDate);


				}
			}
		};


	})



	.directive('stigHeaderLogo', function () {

		return {
			restrict: 'EA',

			replace: true,
			template: '<img class="title-image" src="img/logo2.svg" style="vertical-align: middle;height: 38px"/>'
		};


	})


	.directive('stigScopeFull', function () {



		return {
			restrict: 'E',
			replace: true,


			templateUrl: 'templates/partials/scopeviewfull.html'
		};


	})


	.directive('stigScopeView', function () {


		var controller = ['$scope', function ($scope) {

			$scope.onScopeClick = function () {


			}


		}];


		return {
			restrict: 'E',
			replace: true,
			controller : controller,

			templateUrl: 'templates/partials/scopehandler.html'
		}


	})





/**/



/**/


.directive('stigBottomTabs', function () {


	var controller = ['$scope', function($scope){

		function init(){



		}


		init();



	}];


	return {
		restrict: 'EAC',
		replace : true,
		controller : controller,
		templateUrl: 'templates/partials/stigbottomtabs.html'
	}
	})



	.directive('ngHold', [function () {
		return {
			restrict: "A",
			link: function (scope, elm, attrs) {

			},
			controller: ["$scope", "$element", "$attrs", "$transclude", "$timeout", function ($scope, $element, $attrs, $transclude, $timeout) {
				var onHold = function () {
					return $scope.$eval($attrs.ngHold);
				};
				var onDone = function () {
					return $scope.$eval($attrs.ngHoldDone);
				};

				var onCancel = function () {
					return $scope.$eval($attrs.ngHoldCancel);
				};

				var intervals = [];
				($attrs.ngHoldInterval || "500").split(",").forEach(function (interval) {
					intervals.push(interval.split(";"));
				});
				var timeout=null;
				var intervalIdx;
				var intervalCount;

				function timeoutFoo() {
					intervalCount++;
					var max = intervals[intervalIdx].length == 1 ? 1 : intervals[intervalIdx][1];

					console.log(intervalCount, intervalIdx, max);

					if (intervalCount > parseInt(max)) {
						intervalIdx = Math.min(intervalIdx + 1, intervals.length - 1);
						//intervalCount = 1;
						$timeout.cancel(timeout);
						$scope.$apply(onDone);
						timeout=null;

					} else {
						timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
						onHold();
					}

				}

				$element.on("mousedown touchstart", function (e) {
					intervalIdx = 0;
					intervalCount = 1;
					timeout = $timeout(timeoutFoo, intervals[intervalIdx][0]);
					$scope.$apply(onHold);
				});
				$element.on("mouseup touchend", function (e) {
					if (!!timeout) {
						$timeout.cancel(timeout);
						$scope.$apply(onCancel);
						timeout=null;
					}
				});
				$element.on("mouseleave", function (e) {
					if (!!timeout) {
						$timeout.cancel(timeout);
						$scope.$apply(onCancel);
						timeout=null;
					}
				});
			}]
		};
	}])






/**

	.directive('uiVirtualList',
	[function () {
		return {
			restrict: 'E',
			require: "ngModel",
			template: '<div class="canvas" ng-style="canvasHeight">\
  <div ng-repeat="prop in visibleProvider track by prop.uid" class="centercardhandler renderer" ng-style="prop.styles">\
    <stig-proposition-card  showmore="true" showuser="false" index="$index + 1" datasource="prop" ng-attr-ordered="globalorder"></stig-proposition-card>\
  </div>\
</div>',
			scope: {
				uiDataProvider: '=',
				uiOnSelect: '&',
				itemHeight: '@'
			},
			link: function (scope, elem, attrs, ngModelCtrl) {
				var rowHeight = 40;

				scope.itemHeight = 100;
				scope.scrollTop = 0;
				scope.visibleProvider = [];
				scope.cellsPerPage = 0;
				scope.numberOfCells = 0;
				scope.canvasHeight = {};

				// Init
				scope.init = function () {
					elem[0].addEventListener('scroll', scope.onScroll);
					scope.cellsPerPage = Math.round(scope.itemHeight / rowHeight);
					scope.numberOfCells = 3 * scope.cellsPerPage;
					scope.canvasHeight = {
						//height: scope.uiDataProvider.length * rowHeight + 'px'
						height: '300px'
					};





					console.log("UIVirtual", this, 'init',scope.canvasHeight,scope.uiDataProvider,scope.itemHeight);

					scope.updateDisplayList();
				};

				scope.updateDisplayList = function () {
					console.log(this, "updateDisplayList");
					var firstCell = Math.max(Math.floor(scope.scrollTop / rowHeight) - scope.cellsPerPage, 0);
					var cellsToCreate = Math.min(firstCell + scope.numberOfCells, scope.numberOfCells);
					scope.visibleProvider = scope.uiDataProvider.slice(firstCell, firstCell + cellsToCreate);

					for (var i = 0; i < scope.visibleProvider.length; i++) {
						scope.visibleProvider[i].styles = {
							'top': ((firstCell + i) * rowHeight) + "px"
						}
					}
				};

				scope.onScroll = function (evt) {
					scope.scrollTop = elem.prop('scrollTop');
					scope.updateDisplayList();

					scope.$apply();
				};

				scope.onClickOption = function (option) {
					ngModelCtrl.$setViewValue(option);
					scope.currentOption = option;
					scope.uiOnSelect({"option": option});
				};

				scope.init();
			}
		};
	}
	])



;


 /**/

/**

 .directive('scrollWatch', function($rootScope) {
  return function(scope, elem, attr) {
    var start = 0;
    var threshold = 150;

    elem.bind('scroll', function(e) {
      if(e.detail.scrollTop - start > threshold) {
        $rootScope.slideHeader = true;
      } else {
        $rootScope.slideHeader = false;
      }
      if ($rootScope.slideHeaderPrevious >= e.detail.scrollTop - start) {
        $rootScope.slideHeader = false;
      }
      $rootScope.slideHeaderPrevious = e.detail.scrollTop - start;
      $rootScope.$apply();
    });
  };
});

 /**/


/**
 .directive('stigPropositionCard', function () {



		return {
			restrict: 'E',

			replace : true,

			templateUrl: 'templates/partials/propositioncard.html'
		}
	});

 /**/
;