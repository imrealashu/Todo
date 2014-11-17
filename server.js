var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();
var bodyParser = require("body-parser");
var todoSchema = new Schema({
	title: String,
	status: Boolean
});
app.use("/", express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({strict: false}));

mongoose.connect('mongodb://localhost/todo_app',function(err, res){
	if(err){
		console.log('errror hai');
	}else{
		console.log('ho gya connect');
	}
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay');
});
var Todo = mongoose.model('todo',todoSchema);

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/todo/',function(req, res){
	Todo.find({},{title:1,status:1},'', function (err, todos) {
  if (err) return handleError(err);
  res.json(todos);
});
});

app.post('/todo/', function(req, reso){
	var g = req.body;
	var nt = new Todo({'title':g.data,'status':false});
	nt.save(function(err, res){
		if(err){
			reso.json({"success":false});
			console.error(err);
		}
		else{
			console.log(res);
			//reso.json({"success":true, 'id':res._id});
			Todo.find({},{title:1,status:1},'', function (err, todos) {
  if (err) return handleError(err);
  reso.json(todos);
});
		}
	});
	
	//console.log(g.data);
})

app.put('/todo/', function(req, reso){
	var g = req.body;
	//var c = new Todo({_id:g._id, 'status':!g.status});
	var co = {_id: g._id}, up = {$set:{status: !g.status}};
	Todo.update(co, up, {multi:false}, function(err, res){
	
		if(err){
			reso.json({"success":false});
			console.error(err);
		}
		else{
			console.log(res[0]);
			reso.json({"success":true});
		}
	});
	
	//console.log(g.data);
});

app.delete('/todo/:id', function(req, reso){
	var g = req.params.id;
	console.log('yahin aya h'+g);
	//var c = new Todo({_id:g._id});
	var co = {_id: g};
	//c.remove();
	Todo.remove(co, function(err, res){
		if(err){
			reso.json({"success":false});
			console.error(err);
		}
		else{
			//reso.json({"success":true});
			Todo.find({},{title:1,status:1},'', function (err, todos) {
  if (err) return handleError(err);
  reso.json(todos);
});
		}
	});
	//console.log(g.data);
});


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})