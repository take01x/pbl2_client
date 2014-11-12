var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';
var postal = "";


window.onload = function() {
	$.ajax({
		url: endpoint + "/getHandout",
		success: function(data) {
			$('#handout').html($(data).find('html').text());
		},
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});
};

function showError(error) {
	$('#error').text('');
	$('#error').append(error);
}
