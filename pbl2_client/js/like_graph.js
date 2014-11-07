//var endpoint = 'http://localhost:8080/alpaca/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';

google.load("visualization", "1", {packages:["corechart"]});

var SEC_INTERVAL = 1;	// 何秒間隔にするか
var start_offset = 5;	// 最古のlike時刻の何秒前を原点とするか

/*
 * 発表開始・終了時刻が不明なので,
 * ページロード時 or DB の最古の like 日時の x秒前 のうち, より過去のものを原点とする.
 */
var originDate = getCurrentDate();	// ページロード時刻

var chart = null;

var intervalId = window.setInterval(function() {

	// ライブラリ読み込み待ち
	if(typeof google.visualization === "undefined") {
		console.log('loading google.visualization...');
		return;
	} else if(typeof google.visualization.arrayToDataTable === "undefined") {
		console.log('loading google.visualization.arrayToDataTable...');
		return;
	}

	$.ajax({
		type : 'GET',
		url : endpoint + '/report',
		success : function(xml) {

			if(chart != null) {
				chart.clearChart();
			}

			var len = $('like', xml).size();	// like のデータ数 = total_like
			var dates = $('like', xml).find('date');

			var array = new Array();
			array[array.length] = ['Date', 'Like'];		// データラベル

			// 原点の設定
			var oldest = newDate(dates.eq(0).text());	// 先頭(最古)のlike時刻
			if(compareDate(originDate,oldest) > 0) {
				originDate = addDate(oldest, -SEC_INTERVAL*start_offset, 's');
			}
			array[array.length] = [originDate, 0];

			var currDate = getCurrentDate();
			var sec_num = (currDate.getTime() - originDate.getTime()) / (1000 * SEC_INTERVAL);

			var interval = SEC_INTERVAL;

			// グラフデータ数の上限. 以降は時間間隔の方が変化する.
			/*
			var MAX_DIVIDE = 30;
			if(sec_num > MAX_DIVIDE) {
				sec_num = MAX_DIVIDE;
				interval = Math.ceil((currDate.getTime() - originDate.getTime()) / (sec_num * 1000));
			}
			*/

			// データ格納
			var tempDate = newDate(originDate);
			tempDate = addDate(tempDate, interval, 's');
			var likeCnt = 0;
			var i = 0;

			while(i < len) {
				var dbDate = newDate(dates.eq(i).text());

				if(compareDate(tempDate, dbDate) >= 0) {
					likeCnt++;
					i++;
				} else {
					array[array.length] = [tempDate, likeCnt];
					tempDate = addDate(tempDate, interval, 's');
				}
			}

			// データが足りなければ穴埋め
			if(array.length < (sec_num+2)) {
				for(var i = array.length; i < (sec_num+2); i++) {
					array[array.length] = [tempDate, likeCnt];
					tempDate = addDate(tempDate, interval, 's');
				}
			}

			var data = google.visualization.arrayToDataTable(array);

			var options = {
				title: 'Like Graph',
				legend: {position: 'none'},
				vAxis: {viewWindow: {min: 0}, gridlines: {count: 5}}
			};

			var chart = new google.visualization.LineChart(document.getElementById('like_graph'));
			chart.draw(data, options);

			$('#total').text($('total_like', xml).text());

		}
	});
}, 1000);	// これ以上早くするとグラフ処理が追いつかずにメモリ消費が激しくなる.


function addDate(date, offset, type) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;	// 月は何故か 0 ~ 11 らしい
	var d = date.getDate();
	var h = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();

	var nd = new Date(date);

	switch(type) {
	case 'Y':
		nd.setFullYear(y + offset);
		break;

	case 'M':
		nd.setMonth(m + offset);
		break;

	case 'D':
		nd.setDate(d + offset);
		break;

	case 'h':
		nd.setHours(h + offset);
		break;

	case 'm':
		nd.setMinutes(min + offset);
		break;

	case 's':
		nd.setSeconds(sec + offset);
		break;

	default:
		console.log('ERROR: Unexpected type.');
		break;
	}

	return nd;
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
