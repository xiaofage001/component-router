angular.module('app', ['ngComponentRouter', 'heroes'])
.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
})
.value('$routerRootComponent', 'app')

.component('app', {
	template: 
		'<nav>\n' +
	    '  <a>Crisis Center</a>\n' +
	    '  <a ng-link="[\'Heroes\']">Heroes</a>\n' +
	    '</nav>\n' +
	    '<ng-outlet></ng-outlet>\n',
	$routeConfig: [
		{path: '/heroes/...', name: 'Heroes', components: 'heroes'}
	]
});