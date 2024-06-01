#!/usr/bin/node
$(document).ready(function () {
    const selectedAmenities = {};
  
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
        $('.amenities h4').text(amenityNames.join(', '));
      } else {
        $('.amenities h4').html('&nbsp;');
      }
    });
  
    // Check the API status
    $.get('http://0.0.0.0:5001/api/v1/status/')
      .done(function (data) {
        console.log('API response:', data);
        if (data.status === 'OK') {
          $('#api_status').addClass('available');
        } else {
          $('#api_status').removeClass('available');
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Failed to fetch API status:', textStatus, errorThrown);
        $('#api_status').removeClass('available');
      });
  });
  