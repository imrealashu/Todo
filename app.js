var App = angular.module("todo",[]);

App.controller("DefaultController",function($scope, $http){
	$scope.addTodo = function(){
		var todoName = $scope.todo_name;
			

		$http.post('/todo', {'data':$scope.todo_name}).success(function(data){
			// if(data['success']) {
			// 	//$scope.todos.push({'title':todoName,'status':false});

			// }
			$scope.todos = data;
		});
	}
	$scope.todoDone = function(id,status){

		$http.put('/todo',{'_id':id, 'status': status}).success(function(data){
			//console.log(data);
		});
	}

	$scope.todoDelete = function(id){
		console.log(id);
		$http.delete('/todo/'+id).success(function(data){
			$scope.todos = data;

		});
	}

	$http.get('/todo')
        .success(function(data) {
            $scope.todos = data;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});
