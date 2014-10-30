//var endpoint = 'http://192.168.100.10:8080/alpaca_c8/api';
var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';
var postal = "";

// id=slide_prevをクリックするとスライドを戻す
$('#slide_prev').click(function(){
	//API呼び出し
	$.ajax({
		url: endpoint + "/prev",
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});
});
// id=slide_nextをクリックするとスライドを進める
$('#slide_next').click(function(){
	//API呼び出し
	$.ajax({
		url: endpoint + "/next",
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});

});
var test = "http://image.slidesharecdn.com/110103quotes2010-12-110103073149-phpapp01/95/business-quotes-for-2011-4-728.jpg?cb=1294126271";

// 1秒ごとに実行
window.setInterval(function() {

$('#slide').attr("src", test);
/*
	//スライドの更新
	$.ajax({
		url: endpoint + "/getSlide",
		success: function(data) {
//			$('#slide').text($('total_like', data).text());//帰ってきたスライドシェアのＵＲＬからスライドをどんと貼る
			$('#slide').attr("src", data.url);
		},
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});
	*/
}, 4000);

// エラー表示関数
function showError(error) {
/*	var tmp = $('#error').text();
	tmp += error;
	$('#error').text(tmp);*/
	$('#error').text('');
	$('#error').append(error);
}