//var endpoint = 'http://192.168.100.10:8080/alpaca_c0/api';
var endpoint = 'http://localhost:8080/alpaca/api';

var l = window.setInterval(function() {
	$.ajax({
		type : 'GET',
		url : endpoint + '/report',
		success : function(xml) {

			$('#board').empty();
			var len = $('comment', xml).size();
			var elem = $('comment', xml).find('message');
			for (var i = 0; i < len; i++) {
				var p = '<p>' + elem.eq(i).text() + '</p>';
				$('#board').append(p);
			}

		}
	});
}, 1000);