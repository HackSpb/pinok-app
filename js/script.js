var data;
$(document).bind("pageshow", function() {
	if(window.localStorage != undefined) {
		if(window.localStorage.getItem("key_auth") == undefined && window.localStorage.getItem("key_auth") == null) {
			$.ajax({
		 		url: 'http://pinok.dh/app/exam/connect',
				dataType: 'jsonp',
		 		type: 'GET',

		 		success: function(data) {
					if(data['status'] == 11) {
						$.mobile.changePage('#authorization', "slide");
					}
				},
		 
				error: function(data) {
					alert('Интернета сейчас нет, давайте подождем.');
				}
			});
		}
	} else {
		$("#form_auth").html('<center><h2>Данное устройство не поддерживает это приложение. Для нормального функционирования необходим API Storage.</h2></center>');
	}
});


function autorizathion () {
	var user_email = $('input[name =\'email\']').val();
	var user_password = $('input[name =\'password\']').val();
	$.ajax({
		url: 'http://pinok.dh/app/authorization/site',
		dataType: 'jsonp',
		type: 'GET',
		data: { 'user_email' : user_email, 'user_password' : user_password },
		success: function(data) {
			if(data['status'] == 11) {
				window.localStorage.setItem('key_auth', data['auth_key']);
				window.localStorage.setItem('user_information', data['result']);
				$.mobile.changePage('#task_list', "slide");
			}
			if(data['status'] == 33 || data['status'] == 34) {
				alert('Введены неверные данные, попробуйте еще раз');
			}
		},
		 
		error: function(data) {
				alert('Интернета сейчас нет, давайте подождем.');
		}
	});
}

$(document).on("pageshow", "#authorization", function() {
	if(window.localStorage != undefined) {
		if(window.localStorage.getItem("key_auth") != undefined && window.localStorage.getItem("key_auth") != null) {
			$.mobile.changePage('#task_list', "slide");
		}
	}
});

$(document).on("pageshow", "#task_list", function() {
	if(window.localStorage != undefined) {
		if(window.localStorage.getItem("key_auth") != undefined && window.localStorage.getItem("key_auth") != null) {
			load_tasks();
		} else {
			$.mobile.changePage('#authorization', "slide");
		}
	} else {
		$("#tasks").html('<center><h2>Данное устройство не поддерживает это приложение. Для нормального функционирования необходим API Storage.</h2></center>');
	}
});

function load_tasks() {
	var key_auth = window.localStorage.getItem('key_auth');
	$.ajax({
		url: 'http://pinok.dh/app/upload/task',
		dataType: 'jsonp',
		type: 'GET',
		data: { 'key_auth' : key_auth },
		success: function(data) {
			if(data['status'] == 11) {
				window.localStorage.setItem('tasks_storage', JSON.stringify(data.result));
				show_tasks();
			}
			if(data['status'] == 34) {
				alert('Введены неверные данные, попробуйте еще раз');
			}
		},
		 
		error: function(data) {
			alert('Интернет соединение разорвано. Данные могут быть не актуальными');
			show_tasks();
		}
	});
	
}

function show_tasks() {
	if(window.localStorage != undefined) {
		if(window.localStorage.getItem("tasks_storage") != undefined && window.localStorage.getItem("tasks_storage") != null) {
			$("#tasks").html ("");
			var html = "";
			var data = JSON.parse(window.localStorage.getItem("tasks_storage"));
			console.log(data);
			for (var i=0; i<data.length; i++) {
				html += "<li><a href='javascript:show_details(" + data[i]['t_id'] + ") '>" + data[i]['t_short_name'] + "</a></li>";
			}
			$("#tasks").append(html);
			$('#tasks').listview('refresh');
		} else {
			$("#tasks").html('<center><h2>У Вас еще не создано ни одной задачи.</h2></center>');
		}
	} else {
		$("#tasks").html('<center><h2>Данное устройство не поддерживает это приложение. Для нормального функционирования необходим API Storage.</h2></center>');
	}
}

function show_details(task_id) {
	var data = JSON.parse(window.localStorage.getItem("tasks_storage"));
	var html = "";
	for (var i=0; i<data.length; i++) {
		if (data[i]['t_id'] == task_id) {
			html = "<div><hЗ>" + data[i]['t_name'] + "</hЗ><h4>Описание: " + data[i]['t_description'] + "</h4><h5>Начало: " + data[i]['t_date_create'] + "</h5><h5>Конец: " + data[i]['t_date_finish'] + "</h5>";
		}
	}
	$("#task_details").html(html);
	$.mobile.changePage($("#details"));
}

function logout() {
	var html = "";
	$("#tasks").html(html);
	$("#task_details").html(html);
	window.localStorage.clear();
	$.mobile.changePage($("#authorization"));
}


function task_for_user() {
	var task_for = $('input:radio[name=radio-choice-owner]:checked').val();
	$("#input_for_email").html('');
	if (task_for == '2') { 
		var hop = '<legend>Email друга:</legend><input type="email" name="email_friend" id="email_friend" required>';
		$("#input_for_email").append(hop);
	}
};

function date_for_task() {
	var task_for = $('input:radio[name=radio-choice-date]:checked').val();
	$("#input_for_date").html('');
	if (task_for == '1') { 
		var now = new Date();
	  	var year = now.getFullYear();
	  	var month = now.getMonth();
	  	var day = now.getDate();
	  	var hour = now.getHours() + 1;

	  	$('#input_for_date').append('<select name="task_deadline_year" id="task_deadline_year" data-native-menu="false"></select>');
	  	for (i=2016;i<2026;i++){
	  		if (i == year) {
	  			$('#task_deadline_year').append('<option selected value="'+i+'">'+i+'</option>');
	  		} else {
	  			$('#task_deadline_year').append('<option value="'+i+'">'+i+'</option>');
	  		}
	  	}

	  	$('#input_for_date').append('<select name="task_deadline_month" id="task_deadline_month" data-native-menu="false"></select>');
	  	var arr = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
		arr.forEach(function(item, i, arr) {
			if (i == month) {
	  			$('#task_deadline_month').append('<option selected value="'+i+'">'+item+'</option>');
	  		} else {
	  			$('#task_deadline_month').append('<option value="'+i+'">'+item+'</option>');
	  		}
		});

		$('#input_for_date').append('<select name="task_deadline_day" id="task_deadline_day" data-native-menu="false"></select>');
	  	for (i=1;i<31;i++){
	  		if (i == day) {
	  			$('#task_deadline_day').append('<option selected value="'+i+'">'+i+'</option>')
	  		} else {
	  			$('#task_deadline_day').append('<option value="'+i+'">'+i+'</option>')
	  		}
	  	}

	  	$('#input_for_date').append('<select name="task_deadline_hour" id="task_deadline_hour" data-native-menu="false"></select>');			
	  	for (i=0;i<23;i++){
	  		if (i == hour) {
	  			$('#task_deadline_hour').append('<option selected value="'+i+'">'+i+':00</option>')
	  		} else {
	  			$('#task_deadline_hour').append('<option value="'+i+'">'+i+':00</option>')
	  		}
	  	}
	}
};


function create_task_form_app() {
	var task_name = $('#task_name').val();

	var task_for = $('input:radio[name=radio-choice-owner]:checked').val();
	var email_friend = $('#email_friend').val();
					
	var task_deadline_turn = $('input:radio[name=radio-choice-date]:checked').val();		
	var task_deadline_year = $('#task_deadline_year').val();
	var task_deadline_month = $('#task_deadline_month').val();
	var task_deadline_day = $('#task_deadline_day').val();
	var task_deadline_hour = $('#task_deadline_hour').val();

	var key_auth = window.localStorage.getItem('key_auth');
	$.ajax({
		url: 'http://pinok.dh/app/import/task',
		dataType: 'jsonp',
		type: 'GET',
		data: { 'task_name' : task_name, 'task_for' : task_for, 'email_friend' : email_friend, 'task_deadline_turn' : task_deadline_turn,  'task_deadline_year' : task_deadline_year, 'task_deadline_month' : task_deadline_month, 'task_deadline_day' : task_deadline_day, 'task_deadline_hour' : task_deadline_hour, 'task_type' : 62, 'key_auth' : key_auth },
		success: function(data) {
			if(data.status == 11){
				alert('Задача успешно создана');
				$('#create_task_form')[0].reset();
				$("#input_for_email").html('');
				$("#input_for_date").html('');
				$.mobile.changePage($("#task_list"));
			}
			if(data.status == 33){
				alert('Авторизация устарела. Авторизуйтесь снова.');
				$.mobile.changePage($("#authorization"));
			}
			if(data.status == 34){
				alert('Ошибка в введенных данных. Попробуйте снова.');
			}
		},
		 
		error: function(data) {
			alert('Интернет соединение разорвано. Попробуйте позже.');
		}
	});	
}
