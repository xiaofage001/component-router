// 漏掉crisis-center导致路由找不到
angular.module('app', ['ngComponentRouter', 'heroes', 'crisis-center'])
.config(function($locationProvider) {
	// $locationProvider.html5Mode(true);
})
.value('$routerRootComponent', 'app')

.component('app', {
	template: 
		'<nav>\n' +
	    '  <a ng-link="[\'CrisisCenter\']">Crisis Center</a>\n' +
	    '  <a ng-link="[\'Heroes\']">Heroes</a>\n' +
	    '</nav>\n' +
	    '<ng-outlet></ng-outlet>\n',
	$routeConfig: [
		// route definition中的name作用是用来翻译上面链接中的heroes
		//实际上，用路径来匹配组件，即是： path来配置components
		{path: '/heroes/...', name: 'Heroes', component: 'heroes'},
		{path: '/crisis-center/...', name: 'CrisisCenter', component: 'crisisCenter', useAsDefault: true}	]
});

//