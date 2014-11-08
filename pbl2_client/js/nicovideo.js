//var endpoint = 'http://192.168.100.10:8080/alpaca_c8/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';
var postal = "";

var prevTime = '0';

$(function(){
	var obj = {
	//基本情報が設定できます
	"base":{
		color:"white", //文字の色を指定します
		speed:"normal", //文字が流れるスピードを指定します。slow/fast/normal
		interval:"normal",//文字が流れる間隔を指定します。slow/fast/normal
		font_size:"30px", //フォントのサイズを指定します。
		loop:false //文字が最後まで流れた後に、繰り返すかどうか true/false
	},
			//ここに、重ねるコメントを登録します。個数制限はありません。
	"comments":[
	]
	};
	nicoscreen.set(obj);
	nicoscreen.start();
	var now	= new Date();
	var y	= now.getFullYear();
	var m	= now.getMonth()+1;
	if(m<10){m="0"+m;}
	var d	= now.getDate();
	if(d<10){d="0"+d;}
	var w	= now.getDay();
	var hr	= now.getHours();
	if(hr<10){hr="0"+hr;}
	var min	= now.getMinutes();
	if(min<10){min="0"+min;}
	var sec	= now.getSeconds();
	if(sec<10){sec="0"+sec;}
	var msec= now.getMilliseconds();
	var temp= y+"-"+m+"-"+d+"T"+hr+":"+min+":"+sec+"."+"000+0900";
	prevTime = temp;

});


function drawComment(data){
	var tempmaxtime = prevTime;
	for(i = 0 ; i < data.length;i++){
		if(prevTime < data[i]['date']){
			nicoscreen.add(data[i]['message']);
		}

		if(tempmaxtime < data[i]['date']){
			tempmaxtime = data[i]['date'];
		}
	};
	prevTime = tempmaxtime;
}


// 1秒ごとに実行
window.setInterval(function() {
/*	drawComment(test1);	//test
	test1 = test2;		//test
*/
	// コメントの取得
	$.ajax({
		url: endpoint + "/getComment",
        dataType: 'json',
        accepts: {
            xml: 'text/xml',
            text: 'text/plain'
        },
		success: function(data) {
			drawComment(data['comment']);
		},
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});

}, 1000);


// エラー表示関数
function showError(error) {
/*	var tmp = $('#error').text();
	tmp += error;
	$('#error').text(tmp);*/
	$('#error').text('');
	$('#error').append(error);
}
