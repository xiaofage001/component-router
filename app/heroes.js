angular.module('heroes', [])
.service('heroService', HeroService)
.component('heroes', {
	template:  '<h2>Heroes</h2><ng-outlet></ng-outlet>',
	$routeConfig: [
		// 该处由于heroList写成herolist导致找不到component，进而找不到$routerOnActivate
		{path: '/', 	name: 'HeroList',	component: 'heroList', useAsDefault: true},
		{path: '/:id',  name: 'HeroDetail', component: 'heroDetail'}
	]
})

.component('heroList', {
	template:
		'<div ng-repeat="hero in $ctrl.heroes" ng-class="{selected: $ctrl.isSelected(hero)}">\n' +
			'<a ng-link="[\'HeroDetail\', {id: hero.id}]">{{hero.name}}</a>\n' +
		'</div>',
	controller: HeroListComponent		
})
.component('heroDetail', {
	template: 
	    '<div ng-if="$ctrl.hero">\n' +
	    '  <p>{{$ctrl.hero}}</p>' +
	    '  <h3>"{{$ctrl.hero.name}}"</h3>\n' +
	    '  <div>\n' +
	    '    <label>Id: </label>{{$ctrl.hero.id}}</div>\n' +
	    '  <div>\n' +
	    '    <label>Name: </label>\n' +
	    '    <input ng-model="$ctrl.hero.name" placeholder="name"/>\n' +
	    '  </div>\n' +
	    '  <button ng-click="$ctrl.gotoHeroes()">Back</button>\n' +
	    '</div>\n',
	bindings: {$router: '<'},
	controller: HeroDetailComponent
})

function HeroService($q) {
	var heroesPromise = $q.when([
			{id: 1, name: 'zhangsan1'},
			{id: 2, name: 'zhangsan2'},
			{id: 3, name: 'zhangsan3'},
			{id: 4, name: 'zhangsan4'}
		]);

	this.getHeroes = function() {
		return heroesPromise;
	}

	this.getHero = function(id) {
		return heroesPromise.then(function(heroes) {
			for (var i = 0; i < heroes.length; i++) {
				if(heroes[i].id == id) 
					return heroes[i];
			}
		}) 
	}
}

function HeroListComponent(heroService) {
	var $ctrl = this;
	var selectedId;
	this.$routerOnActivate = function(next) {
		heroService.getHeroes().then(function(heroes) {
			$ctrl.heroes = heroes;
			selectedId = next.params.id;
		})
	}

	$ctrl.isSelected = function(hero) {
		return (hero.id == selectedId);
	}
}

function HeroDetailComponent(heroService) {
	var $ctrl = this;
	this.$routerOnActivate = function(next, previous) {
		var id = next.params.id;
		heroService.getHero(id).then(function(hero) {
			$ctrl.hero = hero;
		})
	};
	$ctrl.gotoHeroes = function() {
		var heroId = this.hero && this.hero.id;
		// 此处如果将参数对象写在数组外面，会导致传不进参数
		// navigate的参数为数组，该数组包含导航所需要的全部信息
		this.$router.navigate(['HeroList', {id: heroId}]);
	}
}