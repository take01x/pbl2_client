//var endpoint = 'http://192.168.100.10:8080/alpaca_c0/api';
var endpoint = 'http://localhost:8080/alpaca/api';
//var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(test);

var SEC_INTERVAL = 10;	// 何秒間隔にするか

/*
 * 発表開始・終了時刻が不明なので,
 * ページロード時 or DB の最古の like 日時の 1秒前 のうち, より過去のものを原点とする.
 * また, 終了は DB の最新の like 日時に 10秒加算した時刻で更新を一時停止する.
 * ただし, 機能だけ実装してコメントアウトしておく.
 */
var originDate = getCurrentDate();

function test(){
//var intervalId = window.setInterval(function() {
	$.ajax({
		type : 'GET',
		url : endpoint + '/report',
		success : function(xml) {

			$('#like_graph').empty();	// 描画中のグラフを削除

			var len = $('like', xml).size();	// like のデータ数 = total_like となるはず
			//var elem = $('like', xml).find('likeCount');
			var dates = $('like', xml).find('date');

			var array = new Array();
			array[array.length] = ['Date', 'Like'];		// データラベル

			/* 原点の設定 */
			var oldest = newDate(dates.eq(0).text());	// 先頭(最古)のlike時刻
			if(compareDate(originDate,oldest) > 0) {
				originDate = addDate(oldest, -SEC_INTERVAL, 's');
			}
			array[array.length] = [originDate, 0];

			var currDate = getCurrentDate();
			var sec_num = (currDate.getTime() - originDate.getTime()) / (1000 * SEC_INTERVAL);

			/* データ数が多すぎると止まるので上限. 普通はここまで多くならないが,  */
			var interval = SEC_INTERVAL;
			if(sec_num > 10) {
				sec_num = 10;
				interval = Math.floor((currDate.getTime() - originDate.getTime()) / (1000 * sec_num));
			}

			/* データ格納 */
			var tempDate = newDate(originDate);
			tempDate = addDate(tempDate, SEC_INTERVAL, 's');
			var likeCnt = 0;
			var i = 0;

			console.log(new Date('2014/11/5 13:00:120048'));
			console.log('sec_num:' + sec_num +' len:' + len + "iv: " + interval);

			while(i < sec_num && i < len) {
				var dbDate = newDate(dates.eq(i).text());

				if(compareDate(tempDate, dbDate) == 0) {
					likeCnt++;
					i++;
				} else {
					array[array.length] = [tempDate, likeCnt];
					tempDate = addDate(tempDate, interval, 's');
				}
			}

			/* データが足りなければ穴埋め */
			if(array.length < (sec_num+2)) {
				for(var i = array.length; i < sec_num; i++) {
					array[array.length] = [tempDate, likeCnt];
					tempDate = addDate(tempDate, interval, 's');
				}
			}

			var data = google.visualization.arrayToDataTable(array);

			var dateCount = (array[array.length-1][0].getTime() - array[1][0].getTime())/(1000*SEC_INTERVAL);
			var hAxisGridCount = 7;
			if(dateCount < 2) {
				hAxisGridCount = 2;
			} else if(dateCount < 7) {
				hAxisGridCount = dateCount;
			}

			var options = {
				title: 'Like Graph',
				legend: {position: 'none'},
				hAxis: {format: 'hh:mm:ss', gridlines: {count: Number(hAxisGridCount)}},
				vAxis: {viewWindow: {min: 0}, gridlines: {count: 5}}
			};

			var chart = new google.visualization.LineChart(document.getElementById('like_graph'));
			chart.draw(data, options);

			$('#total').text($('total_like', xml).text());
		}
	});
//}, 1000 * SEC_INTERVAL);
}

function addDate(date, offset, type) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;	// 月は何故か 0 ~ 11 らしい
	var d = date.getDate();
	var h = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();

	switch(type) {
	case 'Y':
		y += offset;
		break;

	case 'M':
		m += offset;
		break;

	case 'D':
		d += offset;
		break;

	case 'h':
		h += offset;
		break;

	case 'm':
		min += offset;
		break;

	case 's':
		sec += offset;
		break;

	default:
		console.log('ERROR: Unexpected type.');
		break;
	}

	var dateStr = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + sec;
	return new Date(dateStr);
}


function newDate(str) {
	var d = new Date(str);
	d.setMilliseconds(0);
	return d;
}

/**
 *	比較しやすいように ms の情報は落とす
 */
function getCurrentDate() {
	var d = new Date();
	d.setMilliseconds(0);
	return d;
}

function compareDate(date1, date2) {
	var time1 = date1.getTime();
	var time2 = date2.getTime();

	if(time1 > time2) {
		return 1;
	} else if(time1 == time2) {
		return 0;
	}
	return -1;
}
