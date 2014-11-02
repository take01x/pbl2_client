//var endpoint = 'http://192.168.100.10:8080/alpaca_c0/api';
//var endpoint = 'http://localhost:8080/alpaca/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';

google.load("visualization", "1", {packages:["corechart"]});

var intervalId = window.setInterval(function() {
	$.ajax({
		type : 'GET',
		url : endpoint + '/report',
		success : function(xml) {

			$('#like_graph').empty();
			var len = $('like', xml).size();
			var elem = $('like', xml).find('likeCount');
			var time = $('like', xml).find('date');

			var array = new Array(len+2);
			array[0] = ['Date', 'Like'];

			var originDate = new Date(time.eq(0).text());
			array[1] = [getOriginDate(originDate), 0];

			for (var i = 0; i < len; i++) {
				array[i+2] = [getDate(new Date(time.eq(i).text())), array[i+1][1] + Number(elem.eq(i).text())];
			}

			var data = google.visualization.arrayToDataTable(array);

			var dateCount = (array[i+1][0].getTime() - array[1][0].getTime())/(1000*60);
			var hAxisGridCount = 7;
			if(dateCount < 2) {
				hAxisGridCount = 2;

			} else if(dateCount < 7) {
				hAxisGridCount = dateCount;
			}

			var options = {
				title: 'Like Graph',
				legend: {position: 'none'},
				hAxis: {format: 'hh:mm', gridlines: {count: Number(hAxisGridCount)}},
				vAxis: {viewWindow: {min: 0}, gridlines: {count: 5}}
			};

			var chart = new google.visualization.LineChart(document.getElementById('like_graph'));
			chart.draw(data, options);

			$('#total').text($('total_like', xml).text());
		}
	});
}, 1000);


function getDateOffset(date, offset) {
	var dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' +
				  date.getHours() + ':' + (date.getMinutes()+offset) + ':' + '00';

	return new Date(dateStr);
}

function getDate(date) {
	var dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' ' +
				  date.getHours() + ':' + (date.getMinutes()) + ':' + '00';

	return new Date(dateStr);
}

function getOriginDate(date) {
	return getDateOffset(date, -1);
}



