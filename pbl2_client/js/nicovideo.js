//var endpoint = 'http://192.168.100.10:8080/alpaca_c8/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';
var postal = "";

var prevTime = '0';



var test1 =
[
{time:"01",comment:"一個目"},
{time:"02",comment:"煮込め"},
{time:"03",comment:"三個目"},
{time:"04",comment:"四個目"},
{time:"05",comment:"語米"},
];
test2 =
[
{time:"01",comment:"一個目"},
{time:"02",comment:"煮込め"},
{time:"03",comment:"三個目"},
{time:"04",comment:"四個目"},
{time:"05",comment:"語米"},
{time:"06",comment:"六個目"},
{time:"07",comment:"七個目"},
{time:"08",comment:"八個目"},
{time:"09",comment:"急米"},
{time:"10",comment:"十個目"},
{time:"11",comment:"十一個め"},
{time:"12",comment:"銃に米"}
];
test3 =
[
{time:"01",comment:"一個目"},
{time:"02",comment:"煮込め"},
{time:"03",comment:"三個目"},
{time:"04",comment:"四個目"},
{time:"05",comment:"語米"},
{time:"06",comment:"六個目"},
{time:"07",comment:"七個目"},
{time:"08",comment:"八個目"},
{time:"09",comment:"急米"},
{time:"10",comment:"十個目"},
{time:"11",comment:"十一個め"},
{time:"12",comment:"銃に米"}
];

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
});


function drawComment(data){
	var tempmaxtime = prevTime;

	for(i = 0 ; i < data.length;i++){
		if(prevTime < data[i]['time']){
			nicoscreen.add(data[i]['comment']);
		}
		if(tempmaxtime < data[i]['time']){
			tempmaxtime = data[i]['time'];
		}
	};
	prevTime = tempmaxtime;
}


// 1秒ごとに実行
window.setInterval(function() {
	drawComment(test1);	//test
	test1 = test2;		//test
/*
	// コメントの取得
	$.ajax({
		url: endpoint + "/getComment",
		success: function(data) {
			drawComment(data);
		},
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});
	*/
}, 1000);


// エラー表示関数
function showError(error) {
/*	var tmp = $('#error').text();
	tmp += error;
	$('#error').text(tmp);*/
	$('#error').text('');
	$('#error').append(error);
}