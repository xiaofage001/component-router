angular.module('crisis-center', ['dialog'])
.service('crisisService', CrisisService)
.component('crisisCenter', {
	template: '<h2>Crisis Center</h2><ng-outlet></ng-outlet>',
	$routeConfig: [
		{path: '/', name: 'CrisisList', component: 'crisisList', useAsDefault: true},
		{path: '/:id', name: 'CrisisDetail', component: 'crisisDetail'}
	]
})

.component('crisisList', {
	template: 
		'<ul>\n'+
		'	<li ng-repeat="crisis in $ctrl.crises"\n' +
		'	ng-class="{selected: $ctrl.isSelected(crisis)}"' +
		'	ng-click="$ctrl.onSelect(crisis)"' +
		'	>\n' +
      	'   <span class="badge">{{crisis.id}}</span> {{crisis.name}}\n' +
		'	</li>\n' +
		'</ul>',
	bindings: {$router: '<'},
	controller: CrisisListComponent,
	$canActivate: function($nextInstruction, $prevInstruction) {
		console.log('$canActivate', arguments);
		if($nextInstruction.params.id == 11) {
			return false;
		}
	}
})

.component('crisisDetail', {
	templateUrl: 'app/crisisDetail.html',
	bindings: {$router: '<'},
	controller: CrisisDetailComponent
})

// crisis service
function CrisisService($q) {
	var crisesPromise = $q.when([
			{id: 11, name: 'crisis11'},
			{id: 12, name: 'crisis12'},
			{id: 13, name: 'crisis13'},
			{id: 14, name: 'crisis14'},
			{id: 15, name: 'crisis15'}
		]);
	this.getCrises = function() {
		return crisesPromise;
	}
	this.getCrisis = function(id) {
		return crisesPromise.then(function(crises) {
			for (var i = 0; i < crises.length; i++) {
				if(crises[i].id == id) 
					return crises[i];
			}
		})
	}
}

function CrisisListComponent(crisisService) {
	var selectedId = null;
	var ctrl = this;

	this.$routerOnActivate = function(next) {
		console.log('$routerOnActivate', this, arguments);
		// Load up the crises for this view
		crisisService.getCrises().then(function(crises) {
			ctrl.crises = crises;
			selectedId = next.params.id;
		});
	};

	this.isSelected = function(crisis) {
		return (crisis.id == selectedId);
	};

	this.onSelect = function(crisis) {
		this.$router.navigate(['CrisisDetail', {
			id: crisis.id
		}]);
	};
}
// 此处如果名称写的不对，会导致找不到provider
//实力名称首字母都用小写
function CrisisDetailComponent(crisisService, dialogService) {
	var ctrl = this;
	this.$routerOnActivate = function(next) {
		// Get the crisis identified by the route parameter
		var id = next.params.id;
		crisisService.getCrisis(id).then(function(crisis) {
			if (crisis) {
				ctrl.editName = crisis.name;
				ctrl.crisis = crisis;
			} else { // id not found
				ctrl.gotoCrises();
			}
		});
	};
	// 当component中的$canActivate和$routerCanDeactivate都存在的时候， 
	// 会先调用$canActivate判断下一个路由是否可用， 如果不可用则不会调用$routerCanDeactivate
	this.$routerCanDeactivate = function() {
		// Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged.
		console.log(!this.crisis || this.crisis.name === this.editName);
		if (!this.crisis || this.crisis.name === this.editName) {
			return true;
		}
		// Otherwise ask the user with the dialog service and return its
		// promise which resolves to true or false when the user decides
		return dialogService.confirm('Discard changes?');
	};

	this.cancel = function() {
		ctrl.editName = ctrl.crisis.name;
		ctrl.gotoCrises();
	};

	this.save = function() {
		ctrl.crisis.name = ctrl.editName;
		ctrl.gotoCrises();
	};

	this.gotoCrises = function() {
		var crisisId = ctrl.crisis && ctrl.crisis.id;
		// Pass along the hero id if available
		// so that the CrisisListComponent can select that hero.
		this.$router.navigate(['CrisisList', {
			id: crisisId
		}]);
	};
}