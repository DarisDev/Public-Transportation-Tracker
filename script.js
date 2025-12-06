// BEGIN Daris
$(document).ready(function () {
    console.log("Ready!");

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
            url: 'https://jsonplaceholder.typicode.com/posts', // Placeholder URL
            method: 'GET',
            data: { query: searchTerm }, // sending fake query
            success: function (data) {
                console.log("Data fetched:", data); // Debug log
                // Call Member B's function (Placeholder)
                displayRoutes(data);
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
