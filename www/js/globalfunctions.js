
function isConnected() {
	var result = false;
	
	if (navigator.connection.type != Connection.NONE) {
		result = true;
	}
	
	return result;
}

function showSpinner() {
	SpinnerPlugin.activityStart("Requesting Location\nPlease Wait...", {dimBackground: true});
}

function hideSpinner() {
	SpinnerPlugin.activityStop(null, null);
}


function onToggleZipcode() {
	
	if (LocalStorage.isZipcode) {
		FCMPlugin.unsubscribeFromTopic(LocalStorage.zipcode);
		LocalStorage.setIsZipcode(false);
		LocalStorage.setZipcode(null);
		console.log("zipcode enabled: " + LocalStorage.isZipcode);
		console.log("zipcode: " + LocalStorage.zipcode);
	} else {
		window.plugins.numberDialog.promptClear("Enter a zipcode", function(result) {
			if (result.buttonIndex == 1 && result.input1 != "") {
				LocalStorage.setIsZipcode(true);
				LocalStorage.setZipcode(result.input1);
				FCMPlugin.subscribeToTopic(LocalStorage.zipcode);
				console.log("isZipcode: " + LocalStorage.isZipcode);
				console.log("zipecode: " + LocalStorage.zipcode);
			} else {
				LocalStorage.setIsZipcode(false);
				LocalStorage.setZipcode(null);
				$('#zipcodeInput').prop('checked', LocalStorage.isZipcode).checkboxradio('refresh');
			}
		},
		"Notifications", ["Ok", "Cancel"]);
	}
	
}


function onToggleACHD() {
	
}


function onClickSubmit() {
	if (isConnected()) {
		// get input values
		var latitude = (coords != null) ? coords.latitude : 0;
		var longitude = (coords != null) ? coords.longitude : 0;
		var smell_value = $("#slider_smell_value")[0].value;
		var smell_description = $("#textfield_smell_description")[0].value;
		var feelings_symptoms = $("#textfield_feelings_symptoms")[0].value;
		// userHash
		var userHash = LocalStorage.generateUserHash();

		$.ajax({
			type: "POST",
			dataType: "json",
			url: "http://localhost/api/v1/smell_reports",
			data: {
				"user_hash" : userHash,
				"latitude" : latitude,
				"longitude" : longitude,
				"smell_value" : smell_value,
				"smell_description" : smell_description,
				"feelings_symptoms" : feelings_symptoms,
			},
			xhrFields: { withCredentials: false },
			success: function(data) {
				console.log("success!");
				console.log(data);
				$.mobile.changePage($("#map"), {changeHash:false, transition: "none"});
			},
			error: function(msg) {
				alert(msg.message);
			}
		});
	} else {
		if (isDeviceReady) {
			navigator.notification.alert(
				"Connect to the internet before submitting a smell report.",
				null,
				"No Internet Connection",
				"Ok"
			);
		}
	}
}


$(document).on("pagecontainershow", function(someEvent, ui){
	var pageId = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
	
	switch (pageId) {
		case "map":
			console.log("refreshing iframe");
			$('#iframe-map').attr('src', $('#iframe-map').attr('src'));
			break;
		case "settings":
			$('#zipcodeInput').prop('checked', LocalStorage.isZipcode).checkboxradio('refresh');
			break;
	}
});


