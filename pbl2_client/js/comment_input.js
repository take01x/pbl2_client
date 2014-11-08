//var endpoint = 'http://192.168.100.10:8080/alpaca_c0/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';
$('#submit').click(function() {
	var message = $('#message').val();
	$.ajax({
		url : endpoint + '/comment',
		data : {
			msg : message
		}
	});
    $('#message').val("")
});
