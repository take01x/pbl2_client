var endpoint = 'http://192.168.100.10:8080/alpaca_c0/api';
//var endpoint = 'api';

$('#like').click(function() {
	$.ajax({
		type : 'GET',
		url : endpoint + '/like'
	});
});

$('#submit').click(function() {
	var message = $('#message').val();
	$.ajax({
		url : endpoint + '/comment',
		data : {
			msg : message
		}
	});
});

var l = window.setInterval(function() {
	$.ajax({
		type : 'GET',
		url : endpoint + '/report',
		success : function(xml) {
			$('#total').text($('total_like', xml).text());

			$('#board').empty();
			var len = $('comment', xml).size();
			var elem = $('comment', xml).find('message');
			for (var i = 0; i < len; i++) {
				var p = '<p>' + elem.eq(i).text() + '</p>';
				$('#board').append(p);
			}

			var lc = $('message', xml).eq(0).text();
			//var s = '夜この店いかん？  {30.001 135.001}';
			if (lc.match(/{(.*?)}/)) {
				var latlng = RegExp.lastParen.split(' ');
				map.setCenter(new google.maps.LatLng(
					parseFloat(latlng[0]),
					parseFloat(latlng[1])
				));

			}
		}
	});
}, 5000);


var map;

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(show_map, function(e) {});
} else {
	alert('not supported');
};

function show_map(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var latlng = new google.maps.LatLng(latitude, longitude);
	var opts = {zoom : 16, center : latlng};

	map = new google.maps.Map(document.getElementById('map'), opts);

	new google.maps.Marker({
		position: latlng,
		map: map
	});
}


$('#latlng').click(function() {
	navigator.geolocation.getCurrentPosition(function(pos) {
			var lat = pos.coords.latitude;
			var lng = pos.coords.longitude;
			$('#message').val('{' + lat + ' ' + lng +'}');
		},
		function(e){}
	);
});
