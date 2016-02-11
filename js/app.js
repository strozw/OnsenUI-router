
var app = angular.module('myApp', ['onsen', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

	// By default show Tab 1 - Navigator MasterDetail example
	$urlRouterProvider.otherwise('/top');

	var changeTabbarPage = function(scope, naviName, page) {
		var navi = scope[naviName];
		var currentPage = navi.getCurrentPage();

		if (
			!currentPage ||
			(currentPage.page !== page)
		) {
			navi.resetToPage(page);
		}
	}

	var changeTab = function(scope, tabbarName, page, index) {
		var change = function(tabbar) {
			if (
					(
						(scope.fromState.tabbarName !== scope.toState.tabbarName) &&
						(tabbar.getActiveTabIndex() !== index)
					) ||
					(
						(scope.fromState.tabbarName === scope.toState.tabbarName) &&
						scope.fromState.tabIndex != index
					)
			) {
				tabbar.setActiveTab(index);
				tabbar.loadPage(page, {_removeElement:true});
			}
		};

		if (scope[tabbarName]) {
			change(scope[tabbarName]);
		} else {
			var unwatch = scope.$watch(tabbarName, function(tabbar) {
				if (tabbar) {
					change(tabbar);
					unwatch();
				}
			});
		}
	};

	$stateProvider
		.state('base', {
			abstract: true,
			onEnter: function($rootScope, $state) {
				changeTabbarPage($rootScope, 'myNavigator', 'html/top.html');
			}
		})

		// Tab 1 - MasterDetail example - List of items
		.state('top', {
			parent: 'base',
			url: '/top',
			page: 'html/master.html',
			tabbarName: 'myTabbar',
			tabIndex: 0,
			onEnter: ['$rootScope', '$state', function($rootScope, $state) {
				changeTab($rootScope, this.tabbarName, this.page, this.tabIndex);
			}]
		})
		.state('tab2', {
			parent: 'base',
			url: '/tab2',
			tabbarName: 'myTabbar',
			tabIndex: 1,
			onEnter: ['$rootScope', function($rootScope) {
				changeTab($rootScope, this.tabbarName, 'html/tab2.html', this.tabIndex);
			}]
		})

		.state('page1', {
			url: '/page1',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.pushPage('html/page1.html');
			}],
			onExit: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.popPage();
			}]
		})
		.state('page2', {
			url: '/page2',
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.pushPage('html/page2.html');
			}],
			onExit: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.popPage();
			}]
		})
		.state('detail', {
			url: '/detail/:index',
			onEnter: ['$rootScope','$stateParams', function($rootScope, $stateParams) {
				$rootScope.myNavigator.pushPage('html/detail.html', {'index': $stateParams.index});
			}],
			onExit: ['$rootScope', function($rootScope) {
				$rootScope.myNavigator.popPage();
			}]
		})
		;
});


app.run(['$rootScope', function($rootScope) {
	$rootScope.$on(
		'$stateChangeStart',
		function(e, to, toParams, from, fromParams) {
			$rootScope.toState = to;
			$rootScope.fromState = from;
		}
	);
}]);
