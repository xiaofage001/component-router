// 该dialog只定义了一个service
angular.module('dialog', [])
.service('dialogService', dialogService);

function dialogService($q) {
	this.confirm = function(message) {
		return $q.when(window.confirm(message || 'Is it ok?'))
	}
}