// BEGIN Daris
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
                    displayRoutes(response.data);
                } else {
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
// END Daris

/* BEGIN Member D */
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
/* END Member D */

/* BEGIN Member B */
// Teammate B will implement displayRoutes(data) here   
// Helper to prevent crash while testing
function displayRoutes(data) { console.warn("displayRoutes not implemented yet", data); }
/* END Member B */

/* BEGIN Member D */
// Teammate D will implement showError(message) here
// Helper to prevent crash while testing
function showError(message) { alert(message); }
/* END Member D */

/* BEGIN Member C */
// Teammate C will add Event Listeners here for the "Details" buttons
// Example: $('#results-area').on('click', '.btn-details', function() { ... });
/* END Member C */
