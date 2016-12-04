var data;

$(document).Ьind("moЬileinit", function() {
	if (navigator.platform=="iPhone" || navigator.platform=="iPad" || navigator.platform=="iPod" 11 navigator.platform=="iPad" || navigator. platform="iPhone Sirnulator") {
		//Устройство работает под управлением iOS, и мы проверим,
		//находится ли приложение в автономном режиме
		if (!navigator.standalone) {
			showIOSinvitation();
		}
	}

	/*Мы перехватываем загрузку страницы sessions проверяем динамические данные о заседании*/
	$("#sessions").live("pageshow", function() {
		if (window.localStorage!=undefined) {
			// Интерфейс НТМL5 Local Storage доступен
			if (window.localStorage.getItem("data") != undefined && window.localStorage.getItem("data") != null) {
				//Вначале загружаем информацию о заседаниях, локально, хранящуюся и одновременно проверяем наличие обновлений
				showSessions(window.localStorage.getItem("data"));
				$("#console").html("Checking data update");
				//Проверка наличия обновлений
			} else {
				//Кэш локального хранения отсутствует
				$("#console").html("Downloading session data ... ");
				//Загрузка информации о заседании ...
			}
		} else {
			//Интерфейс НТМL5 Local Storage не поддерживается, каждый раз загружаем JSОN-файл
			$ ("#console").html ("Downloading session data ... ");
			//Загрузка информации о заседании ...
		}
		loadSessionsAjax();
	});
});


function showIOSinvitation() {
	setTimeout(function() {
		//Скрываем информацию о сохранении, пока не загрузится все приложение
		$("#install").hide ();
		//Открываем инструкцию по добавлению приложения на главный экран в iOS
		$.mobile.changePage($("#ios"), {transition: "slideup", changeHash: false});
	}, 100);
	//Перехватываем события НТМL5 Application Cache для выдачи нужной информации
	if (window.applicationCache != undefined) {

		window.applicationCache.addEventListener('checking', function() {
			$("#consoleInstall").html("Checking version");
			//Проверка версии
		});

		window.applicationCache.addEventListener('downloading', function() {
			$("#consoleInstall").html("Downloading application. Please wait ... ");
			//Приложение загружается. Пожалуйста, подождите ...
		});

		window.applicationCache.addEventListener('cached', function() {
			$("#consoleInstall").html("Application downloaded");
			//Приложение загружено
			$("#install").show();
		});

		window.applicationCache.addEventListener('updateready', function() {
			$("#consoleInstall").html("Application downloaded");
			//Приложение загружено
			$("#install").show();
		});

		window.applicationCache.addEventListener('noupdate', function() {
			$ ("#consoleInstall").html("Application downloaded");
			//Приложение загружено
			$("#install").show();
		});

		window.applicationCache.addEventListener('error', function(e) {
			$("#consoleInstall").html("There was an error downloading this арр");
			//Во время загрузки этого приложения произошла ошибка
		});

		window.applicationCache.addEventListener('obsolete', function(e) {
			$("#consoleInstall") .html("There was an error downloading this арр");
			//Во время загрузки этого приложения произошла ошибка
		});
	}
}


function loadSessionsAjax() {
//Получаем JSОN-объект в текстовом виде для упрощения его хранения в локальной памяти
	$.ajax("http://www.moЬilexweb.com/congress/sessions.json", {
		complete: function(xhr) {
			if(window.localStorage != undefined) {
				if(window.localStorage.getItem ("data") != undefined && window.localStorage.getItem ("data") != null) {
					if (xhr.responseText == window.localStorage.getItem("data")) {
						//Загруженная информация о заседании совпадает с выведенной на экран
						$("#console").html("Schedule is updated");
						//Расписание обновлено
					} else {
						//Имеется новая информация о заседаниях
						if(confirm("There is an update in the schedule available, do уои want to load it now?")) {
							//Имеются изменеr.ия в расписании; загрузить сейчас?
							$("#console").htrnl("Schedule is updated");
							//Расписание обновлено
							showSessions(xhr.responseText);
						} else {
							$("#console").html("Schedule will Ье updated later");
							//Расписание будет обновлено позже
						}
					}
				} else {
					//Локальная память доступна, но кэш не обнаружен
					$("#console").html("Schedule is updated");
					//Расписание обновлено
					showSessions(xhr.responseText);
				}
			} else {
				//Локальная память отсутствует; показываем информацию без сохранения
				$("#console").html("Schedule is updated");
				//Расписание обновлено
				showSessions(xhr.responseText);
			}
		},
		dataType:'text',
		error: function() {
			$("#console") .htrnl("Schedule update could not Ье downloaded");
			//Невозможно загрузить новое расписание
		}
	});
}


var isFirstLoad = true;
function showSessions(string) {
	if (window.JSON != undefined) {
		data = JSON.parse(string);
	} else {
		data = eval("(" + string + ")");
	}
	
	if (window.localStorage != undefined) {
		//Сохранить новые данные в виде строки
		window.localStorage.setItem("data", string);
	}
	
	$("#slots").html ("");
	var html = "";
	for (var i=O; i<data.slots.length; i++) {
		if (data.slots[i].message!=null) {
			//Это специальная информация, и мы создаем разделитель
			html += "<li data-role='list-divider' data-groupingtheme='e'>" + data.slots[i].time + ": "+ data.slots[i].message + "</li>";
		} else {
			//Это обычная информация о заседаниях
			html += "<li><a href='javascript:showDetails(" + i + ") '>Sessions of" + data.slots[i].time + "</a></li>";
		}
	}

	$ ("#slots").html(html);
	if (isFirstLoad) {
		$("#slots").listview();
		isFirstLoad = false;
	} else {
		$("#slots").listview('refresh');
	}
}


function showDetails(index) {
	$("#details h1").html("Sessions of " + data.slots[index].time);
	var html = "";
	for (var i=O; i<data.sessions.length; i++) {
		if (data.sessions[i].timeId==data.slots[index].id) {
			//Создаем по одному сворачиваемому компоненту на заседание
			html += "<div data-role='collapsiЬle'>";
			html += "<hЗ>" + data.sessions[i].title + "</hЗ>";
			html += "<hЗ>" + data.sessions[i].room + "</hЗ>";
			html += "<h4>Speaker/s: "+ data.sessions[i] .speaker;
			html += "</h4>";
			html += "<р>" + data.sessions[i].description + "</р>";
			html += "</div>";
		}
	}
	//Информация для страницы с подробностями
	$("#sessionInfo").html(html);
	$("#sessioninfo div").collapsiЬle();
	//Переходим на страницу с подробностями
	$.moblle.changePage($("#details"));
}


function refresh() {
	$("#console").html("Verifying ...");
	// Вьmолняется проверка ...
	loadSessionsAjax();
}


function openWithoutInstallation() {
	//Удаляем псевдодиалоговую страницу по установке
	$.moblle.changePage($("#home"), {transition: "slideup", reverse: true}); 
}