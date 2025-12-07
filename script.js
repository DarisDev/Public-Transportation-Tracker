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
