/* BEGIN Daris D. */
$(document).ready(function () {
    console.log("Ready!");

    // Your MBTA Configuration
    const apiKey = "fa197b4fce904b7c8aaa518838879b1f";
    const apiBaseUrl = "https://api-v3.mbta.com/routes";

    // Search Button Click Listener
    $('#search-btn').click(function () {
        var searchTerm = $('#search-input').val().trim();

        // Validation: Check if empty
        if (searchTerm === "") {
            // Call Member D's function (Placeholder)
            showError("Please enter a route number or name.");
            return;
        }

        // AJAX Call (Mock Data)
        $.ajax({
            url: apiBaseUrl,
            method: 'GET',
            data: {
                'api_key': apiKey,       // Authenticates you
                'filter[id]': searchTerm // MBTA specific way to search (e.g. "Red", "66")
            },
            success: function (response) {
                // Check if the 'data' array exists and has items
                if (response.data && response.data.length > 0) {
                    console.log("Routes found:", response.data);
                    // Pass the specific array to Member B
                    displayRoutes(response.data, 'route'); // We are searching for Routes
                } else {
                    $('#results-area').empty();
                    showError("No routes found for '" + searchTerm + "'.");
                }
            },
            error: function () {
                // Call Member D's function (Placeholder)
                showError("Failed to fetch data. Please try again.");
            }
        });
    });
});

// Global Loading Spinner & Animation
$(document).ajaxStart(function () {
    $('#results-area').html('<div class="text-center my-4"><div class="spinner-border text-primary"></div></div>').show();
});

// When closing the schedule modal, ensure results remain visible
$('#scheduleModal').on('hidden.bs.modal', function () {
    $('#results-area').show();
    $('#results-area .spinner-border').remove();
});


$(document).ajaxStop(function () {
    // Tag Routes and Stops with Badges
    $('#results-area .card').each(function () {
        var btn = $(this).find('.btn-details');
        var title = $(this).find('.card-title');
        var id = btn.attr('data-id');
        var type = btn.attr('data-type');

        // Avoid adding duplicate elements
        if (title.find('.badge').length > 0) return;

        var badgeClass = '';
        var badgeText = '';
        var subtitleText = '';

        if (type === 'route') {
            subtitleText = 'Route ID: ' + id;
            if (id === 'Red') {
                badgeClass = 'bg-danger';
                badgeText = 'Red Line';
            } else if (id === 'Blue') {
                badgeClass = 'bg-primary';
                badgeText = 'Blue Line';
            } else if (id === 'Orange') {
                badgeClass = 'bg-warning';
                badgeText = 'Orange Line';
            } else if (id.indexOf('Green') === 0) {
                badgeClass = 'bg-success';
                badgeText = 'Green Line';
            } else {
                badgeClass = 'bg-secondary';
                badgeText = id;
            }
        } else {
            badgeClass = 'bg-info';
            badgeText = 'Stop';
            subtitleText = 'Stop ID: ' + id;
        }

        title.append(' <span class="badge ' + badgeClass + ' ms-2">' + badgeText + '</span>');
        title.after('<p class="text-muted small mb-2">' + subtitleText + '</p>');
    });

    $('#results-area').hide().fadeIn(300);
});
/* END Daris D. */


/* BEGIN Art L.*/
// Function to display errors using Bootstrap alerts
function showError(message) {
    var alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    $('#alert-container').html(alertHtml);
}

$(document).ready(function () {
    $('#btn-near-me').click(function () {
        if (navigator.geolocation) {
            // Show loading state or message (Optional but good UX)
            $('#results-area').html('<div class="text-center p-4">Finding nearest stops...</div>');

            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var apiKey = 'fa197b4fce904b7c8aaa518838879b1f';

                $.ajax({
                    url: 'https://api-v3.mbta.com/stops',
                    method: 'GET',
                    data: {
                        'api_key': apiKey,
                        'filter[latitude]': lat,
                        'filter[longitude]': lon,
                        'sort': 'distance',
                        'page[limit]': 6
                    },
                    success: function (response) {
                        if (response.data && response.data.length > 0) {
                            // Map Stops to structure Member B expects
                            // Member B expects: { id: "...", attributes: { long_name: "...", description: "..." } }
                            var mappedStops = response.data.map(function (stop) {
                                return {
                                    id: stop.id,
                                    attributes: {
                                        long_name: stop.attributes.name,
                                        description: stop.attributes.address || 'Nearest Stop'
                                    }
                                };
                            });
                            // Use Member B's function to display
                            displayRoutes(mappedStops, 'stop'); // We are searching for Stops
                        } else {
                            showError("No stops found near your location.");
                            $('#results-area').empty();
                        }
                    },
                    error: function () {
                        showError("Failed to fetch nearby stops.");
                        $('#results-area').empty();
                    }
                });

            }, function (error) {
                showError("Unable to retrieve your location. Please ensure location services are enabled.");
                $('#results-area').empty();
            });
        } else {
            showError("Geolocation is not supported by this browser.");
        }
    });
});
/* END Art L. */


/* BEGIN Bert K.*/
function displayRoutes(routesArray, type) {
    // Clear the results area
    $('#results-area').empty();

    // Iterate through routesArray
    $.each(routesArray, function (index, route) {
        // Create Card Container
        var colDiv = $('<div>').addClass('col-md-4 mb-4');

        var cardClass = 'card h-100';
        if (route.id === 'Red') cardClass += ' border-danger';
        else if (route.id === 'Blue') cardClass += ' border-primary';
        else if (route.id === 'Orange') cardClass += ' border-warning';
        else if (route.id.startsWith('Green')) cardClass += ' border-success';

        var card = $('<div>').addClass(cardClass);
        var cardBody = $('<div>').addClass('card-body');

        var titleText = route.attributes.long_name || route.attributes.short_name;
        var cardTitle = $('<h5>').addClass('card-title').text(titleText);
        var cardText = $('<p>').addClass('card-text').text(route.attributes.description);

        // Button with Type Distinction
        var detailsBtn = $('<button>')
            .addClass('btn btn-primary btn-details')
            .attr('data-id', route.id)
            .attr('data-type', type || 'route') // <--- NEW: Stores if it's a 'route' or 'stop'
            .text('View Schedule');

        cardBody.append(cardTitle, cardText, detailsBtn);
        card.append(cardBody);
        colDiv.append(card);
        $('#results-area').append(colDiv);
    });
}
/* END Bert K. */


/* BEGIN Anis R. */
// Teammate C will add Event Listeners here for the "Details" buttons
// Example: $('#results-area').on('click', '.btn-details', function() { ... });
/* END Anis R. */
