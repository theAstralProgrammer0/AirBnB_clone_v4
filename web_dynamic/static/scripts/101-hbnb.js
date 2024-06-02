#!/usr/bin/node
$(document).ready(function () {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    // Handling amenities / State / City checkboxes
    $('input[type="checkbox"]').change(function () {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            if ($(this).closest('.locations').length) {
                if ($(this).closest('ul').parent().find('h2').length) {
                    selectedStates[id] = name;
                } else {
                    selectedCities[id] = name;
                }
            } else {
                selectedAmenities[id] = name;
            }
        } else {
            if ($(this).closest('.locations').length) {
                if ($(this).closest('ul').parent().find('h2').length) {
                    delete selectedStates[id];
                } else {
                    delete selectedCities[id];
                }
            } else {
                delete selectedAmenities[id];
            }
        }

        const amenityNames = Object.values(selectedAmenities);
        const stateNames = Object.values(selectedStates);
        const cityNames = Object.values(selectedCities);

        // Update amenities display
        if (amenityNames.length > 0) {
            $('.amenities h4').text(amenityNames.sort().join(', '));
        } else {
            $('.amenities h4').html('&nbsp;');
        }

        // Update locations display
        const locationNames = stateNames.concat(cityNames);
        if (locationNames.length > 0) {
            $('.locations h4').text(locationNames.sort().join(', '));
        } else {
            $('.locations h4').html('&nbsp;');
        }
    });

    // Check the API status
    $.getJSON('http://192.168.0.113:5001/api/v1/status/', (data) => {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Fetch and display places
    function fetchPlaces(amenities = {}, states = {}, cities = {}) {
        $.ajax({
            url: 'http://192.168.0.113:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: Object.keys(amenities),
                states: Object.keys(states),
                cities: Object.keys(cities)
            }),
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

    // Fetch places on button click with selected amenities, states, and cities
    $('button').click(function () {
        fetchPlaces(selectedAmenities, selectedStates, selectedCities);
    });

    // Toggle reviews
    $('.toggle-reviews').click(function () {
        const span = $(this);
        const reviewList = $('.review-list');

        if (span.text() === 'show') {
            // Fetch and display reviews
            $.getJSON('http://192.168.0.113:5001/api/v1/reviews/', (data) => {
                reviewList.empty(); // Clear previous reviews
                for (const review of data) {
                    reviewList.append(
                        `<li>
                            <h3>From ${review.user} the ${new Date(review.date).toLocaleDateString()}</h3>
                            <p>${review.text}</p>
                        </li>`
                    );
                }
                span.text('hide');
            });
        } else {
            // Hide reviews
            reviewList.empty();
            span.text('show');
        }
    });
});

