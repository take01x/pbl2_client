//var endpoint = 'http://192.168.100.10:8080/alpaca_c0/api';
//var endpoint = 'http://localhost:8080/alpaca/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';

$('#like_button').click(function() {
	$.ajax({
		type : 'GET',
		url : endpoint + '/like',
	});
});
