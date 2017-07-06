$(document).ready(function() {
	$('.address').hide()
})

// whac-a- wheat
$(document).ready(function() {
    $('.uitleg').fadeIn()
    $('.game').hide()
    $('.end').hide()
})

$('.start').click(function() {
  $('.uitleg').hide() 
  $('.game').show()

/*  $("#wheat").click(function() {
    (this).hide()
  });

  $('#wheat2').click(function() {
    $('#wheat2').hide()
  })

  $('#wheat3').click(function() {
    $('#wheat3').hide()
  })

  $('#wheat4').click(function() {
    $('#wheat4').hide()
  })*/


  var end = function() {
  $('.game').hide()
  $('.end').fadeIn()
};
setTimeout(end, 12000)
});

$('#wheat').click(function() {
  $('#wheat').hide()
})

$('#wheat2').click(function() {
  $('#wheat').hide()
})

$('#wheat3').click(function() {
  $('#wheat').hide()
})

$('#wheat4').click(function() {
  $('#wheat').hide()
})


// Google Map
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: {lat: 52.379128, lng: 4.900272}
	});
	var geocoder = new google.maps.Geocoder();
	geocodeAddress(geocoder, map)

}

function geocodeAddress(geocoder, resultsMap) {
var address = document.getElementById('address').value;
geocoder.geocode({'address': address}, function(results, status) {
  if (status === 'OK') {
    resultsMap.setCenter(results[0].geometry.location);
    var marker = new google.maps.Marker({
      map: resultsMap,
      position: results[0].geometry.location
    });
  } else {
    alert('Geocode was not successful for the following reason: ' + status);
  }
});
}

