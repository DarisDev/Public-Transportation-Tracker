/* BEGIN Daris */
$(document).ready(function () {
    console.log("Ready!");

    // Smooth Scroll
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70 // Offset for fixed navbar if needed
            }, 800);
        }
    });

    // Your MBTA Configuration
    const apiKey = "fa197b4fce904b7c8aaa518838879b1f";
    const apiBaseUrl = "https://api-v3.mbta.com/routes";

    // Search Button Click Listener
    $('#search-btn').click(function () {
        $('#alert-container').empty();
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
/* END Daris */

/* BEGIN Bert */
function displayRoutes(routesArray, type) {
    // Clear the results area
    $('#results-area').empty();

    // Iterate through routesArray
    $.each(routesArray, function (index, route) {
        // Create Card Container
        var colDiv = $('<div>').addClass('col-md-4 mb-4');

        var cardClass = 'card h-100';
        // Border color logic
        if (route.id === 'Red') cardClass += ' border-danger';
        else if (route.id === 'Blue') cardClass += ' border-primary';
        else if (route.id === 'Orange') cardClass += ' border-warning';
        else if (route.id.startsWith('Green')) cardClass += ' border-success';

        var card = $('<div>').addClass(cardClass);
        var cardBody = $('<div>').addClass('card-body');

        // Determine Badge & Icon Properties
        var badgeClass = 'bg-secondary';
        var badgeText = route.id;
        var iconHtml = '<span class="me-2">🚆</span>'; // Default train icon

        if (type === 'stop') {
            badgeClass = 'bg-info';
            badgeText = 'Stop';
            iconHtml = '<span class="me-2">🚏</span>';
        } else {
            if (route.id === 'Red') {
                badgeClass = 'bg-danger';
                badgeText = 'Red Line';
            } else if (route.id === 'Blue') {
                badgeClass = 'bg-primary';
                badgeText = 'Blue Line';
            } else if (route.id === 'Orange') {
                badgeClass = 'bg-warning';
                badgeText = 'Orange Line';
            } else if (route.id.startsWith('Green')) {
                badgeClass = 'bg-success';
                badgeText = 'Green Line';
            }
        }

        var titleText = route.attributes.long_name || route.attributes.short_name;

        // Construct Title with Icon and Badge
        var cardTitle = $('<h5>').addClass('card-title')
            .html(iconHtml + titleText + ' <span class="badge ' + badgeClass + ' ms-2">' + badgeText + '</span>');

        var cardText = $('<p>').addClass('card-text').text(route.attributes.description);

        // Button with Type Distinction
        var detailsBtn = $('<button>')
            .addClass('btn btn-primary btn-details')
            .attr('data-id', route.id)
            .attr('data-type', type || 'route')
            .text('View Schedule');

        // Create a wrapper for buttons to ensure alignment
        var btnWrapper = $('<div>').addClass('d-flex align-items-center mt-3');
        btnWrapper.append(detailsBtn);

        // Add View Stops Button (For routes only)
        if (type !== 'stop') {
            var stopsBtn = $('<button>')
                .addClass('btn btn-outline-primary btn-stoplist ms-2')
                .attr('data-id', route.id)
                .attr('data-type', 'route')
                .text('View Stops');
            btnWrapper.append(stopsBtn);
        }

        cardBody.append(cardTitle, cardText, btnWrapper);
        card.append(cardBody);
        colDiv.append(card);
        $('#results-area').append(colDiv);
    });
}
/* END Bert*/


/* BEGIN Anis */
$(document).ready(function () {

    /* Direction Filter */
    var lastLoadedPredictions = [];

    // Helper to render predictions with filter
    function renderPredictions(predictions) {
        // Inject wrapper for content + filter
        var wrapperHtml = `
            <div class="mb-3">
                <label class="form-label fw-bold">Direction</label>
                <select id="directionFilter" class="form-select">
                    <option value="all">All</option>
                    <option value="1">Inbound</option>
                    <option value="0">Outbound</option>
                </select>
            </div>
            <div id="predictions-list-container"></div>
        `;

        $('#modal-schedule-content').html(wrapperHtml);
    }

    var lastLoadedPredictions = [];

    function updateFilteredPredictions() {
        const selectedDirection = $('#directionFilter').val();
        // Pass true to indicate we are re-rendering existing data
        renderPredictions(lastLoadedPredictions, selectedDirection);
    }

    // Main Render Function
    function renderPredictions(predictions, selectedDirection) {
        const container = $('#predictions-list-container');
        if (container.length === 0) {
            // Initial setup if not exists
            $('#modal-schedule-content').html(`
                <div class="mb-3">
                    <label class="form-label fw-bold">Direction</label>
                    <select id="directionFilter" class="form-select">
                        <option value="all">All</option>
                        <option value="1">Inbound</option>
                        <option value="0">Outbound</option>
                    </select>
                </div>
                <div id="predictions-list-container"></div>
             `);
            // Set dropdown value if provided (persisting state), or default all
            if (selectedDirection) $('#directionFilter').val(selectedDirection);
        }

        var ul = $('<ul>').addClass('list-group');
        var hasItems = false;

        predictions.forEach(function (pred) {
            const direction = pred.attributes.direction_id;

            // Filter Logic
            // Note: selectedDirection from .val() is a string, API direction is number
            if (selectedDirection && selectedDirection !== "all" && Number(selectedDirection) !== direction) {
                return;
            }

            if (pred.attributes.arrival_time) {
                hasItems = true;
                var arrivalTime = new Date(pred.attributes.arrival_time);
                var timeStr = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Calculate minutes remaining
                var diffMs = arrivalTime - new Date();
                var diffMins = Math.round(diffMs / 60000);
                // Handle past/now times gracefully, though API usually gives future times
                var minText = diffMins > 0 ? '(in ' + diffMins + ' minutes)' : '(Arriving now)';

                var dirText = direction === 1 ? ' (Inbound)' : ' (Outbound)';

                var li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center')
                    .html('Next Arrival: <strong>' + timeStr + ' <span class="text-muted small">' + minText + '</span> <span class="text-muted small">' + dirText + '</span></strong>');
                ul.append(li);
            }
        });

        if (hasItems) {
            $('#predictions-list-container').html(ul);
        } else {
            $('#predictions-list-container').html('<div class="alert alert-warning">No upcoming times found for this direction.</div>');
        }
    }

    // Filter Change Listener
    $(document).on('change', '#directionFilter', function () {
        updateFilteredPredictions();
    });

    $('#results-area').on('click', '.btn-details', function () {
        var id = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        var apiKey = 'fa197b4fce904b7c8aaa518838879b1f';

        $('#modal-schedule-content').empty();
        $('#scheduleModal').modal('show');
        $('#modal-schedule-content').html('<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Loading schedule...</p></div>');

        var apiData = {
            'api_key': apiKey,
            'sort': 'arrival_time',
            'page[limit]': 10
        };

        if (type === 'stop') {
            apiData['filter[stop]'] = id;
        } else {
            apiData['filter[route]'] = id;
        }

        $.ajax({
            url: 'https://api-v3.mbta.com/predictions',
            method: 'GET',
            global: false,
            data: apiData,
            success: function (response) {
                if (response.data && response.data.length > 0) {
                    lastLoadedPredictions = response.data; // Store data
                    // Initial render with 'all'
                    renderPredictions(lastLoadedPredictions, "all");
                } else {
                    $('#modal-schedule-content').html('<div class="alert alert-info">No departures found currently.</div>');
                }
            },
            error: function () {
                $('#modal-schedule-content').html('<div class="alert alert-danger">Error loading schedule.</div>');
            }
        });
    });
    /* Direction Filter Ends*/
});
/* END Anis */

/* BEGIN Art */
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
    /* BEGIN Art – Stop List Feature */
    $('#results-area').on('click', '.btn-stoplist', function () {
        const routeId = $(this).attr('data-id');

        // API call for stops on this route
        $.ajax({
            url: "https://api-v3.mbta.com/stops",
            method: "GET",
            global: false, // Prevent global spinner from wiping results
            data: {
                "filter[route]": routeId,
                "sort": "name"
            },
            success: function (response) {
                if (response.data && response.data.length > 0) {
                    displayStopList(response.data, routeId);
                } else {
                    showError("No stops found for route " + routeId);
                }
            },
            error: function () {
                showError("Failed to load stops. Try again.");
            }
        });
    });

    /* BEGIN Art – Single Accordion Stop List Feature */
    function displayStopList(stops, routeId) {

        let html = `
        <div class="modal fade" id="stopListModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Stops for Route ${routeId}</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">

                        <div class="accordion" id="accordionStops">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#allStops">
                                        All Stops (${stops.length})
                                    </button>
                                </h2>
                                <div id="allStops" class="accordion-collapse collapse show" data-bs-parent="#accordionStops">
                                    <div class="accordion-body">
                                        <ul class="list-group">
                                            ${stops.map(s => `<li class="list-group-item">${s.attributes.name}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>`;

        // Remove any existing modal first
        $('#stopListModal').remove();

        // Append new modal and show it
        $('body').append(html);
        const modal = new bootstrap.Modal(document.getElementById('stopListModal'));
        modal.show();
    }
    /* END Art – Single Accordion Stop List Feature */
});
/* END Art */