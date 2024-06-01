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
});
