var endpoint = 'http://cloudspiral8.ddns.net/vicugna/api';
var postal = "";


$.ajax({
		url: endpoint + "/getHandout",
		success: function(data) {
			$('#handout').attr("src", data.url);
		},
		error: function(xhr, status, error) {
			showError(error.message);
		}
	});

function showError(error) {
	$('#error').text('');
	$('#error').append(error);
}