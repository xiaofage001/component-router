angular.module('heroes', [])
.component('heroes', {
	template:  '<h2>Heroes</h2><ng-outlet></ng-outlet>',
	$routeConfig: [
		{path: '/', 	name: 'HeroList',	component: 'herolist', useAsDefault: true},
		{path: '/:id',  name: 'HeroDetail', component: 'herodetail'}
	]
})