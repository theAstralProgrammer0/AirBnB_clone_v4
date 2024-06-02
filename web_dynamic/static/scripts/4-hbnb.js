$(document).ready(function () {
    const selectedAmenities = {};
  
    // Handling amenities checkboxes
    $('input[type="checkbox"]').change(function () {
      const amenityId = $(this).attr('data-id');
      const amenityName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        selectedAmenities[amenityId] = amenityName;
      } else {
        delete selectedAmenities[amenityId];
      }
  
      const amenityNames = Object.values(selectedAmenities);
  
      if (amenityNames.length > 0) {
        $('.amenities h4').text(amenityNames.sort().join(', '));
      } else {
        $('.amenities h4').html('&nbsp;');
      }
    });
  
    // Check the API status
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    // Fetch and display places
    function fetchPlaces(amenities = {}) {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ amenities: Object.keys(amenities) }),
        success: function (data) {
          $('.places').empty(); // Clear previous places
          for (const place of data) {
            $('.places').append(
              `<article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
              </article>`
            );
          }
        },
        error: function (error) {
          console.error('Error fetching places:', error);
        }
      });
    }
  
    // Initial fetch of places
    fetchPlaces();

    $('button').click(function () {
      fetchPlaces(selectedAmenities);
    });
  });
