/* BEGIN Daris */
$(document).ready(function () {
    console.log("Ready!");


    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70 // Offset for fixed navbar if needed
            }, 800);
        }
    });


    const apiKey = "fa197b4fce904b7c8aaa518838879b1f";
    const apiBaseUrl = "https://api-v3.mbta.com/routes";


    $('#search-btn').click(function () {
        $('#alert-container').empty();
        var searchTerm = $('#search-input').val().trim();


        if (searchTerm === "") {

            showError("Please enter a route number or name.");
            return;
        }


        $.ajax({
            url: apiBaseUrl,
            method: 'GET',
            data: {
                'api_key': apiKey,
                'filter[id]': searchTerm
            },
            success: function (response) {

                if (response.data && response.data.length > 0) {
                    console.log("Routes found:", response.data);

                    displayRoutes(response.data, 'route');
                } else {
                    $('#results-area').empty();
                    showError("No routes found for '" + searchTerm + "'.");
                }
            },
            error: function () {

                showError("Failed to fetch data. Please try again.");
            }
        });
    });
});


$(document).ajaxStart(function () {
    $('#results-area').html('<div class="text-center my-4"><div class="spinner-border text-primary"></div></div>').show();
});



$('#scheduleModal').on('hidden.bs.modal', function () {
    $('#results-area').show();
    $('#results-area .spinner-border').remove();
});


$(document).ajaxStop(function () {

    $('#results-area .card').each(function () {
        var btn = $(this).find('.btn-details');
        var title = $(this).find('.card-title');
        var id = btn.attr('data-id');
        var type = btn.attr('data-type');


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

    $('#results-area').empty();


    $.each(routesArray, function (index, route) {

        var colDiv = $('<div>').addClass('col-md-4 mb-4');

        var cardClass = 'card h-100';

        if (route.id === 'Red') cardClass += ' border-danger';
        else if (route.id === 'Blue') cardClass += ' border-primary';
        else if (route.id === 'Orange') cardClass += ' border-warning';
        else if (route.id.startsWith('Green')) cardClass += ' border-success';

        var card = $('<div>').addClass(cardClass);
        var cardBody = $('<div>').addClass('card-body');


        var badgeClass = 'bg-secondary';
        var badgeText = route.id;
        var iconHtml = '<span class="me-2">🚆</span>';

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


        var cardTitle = $('<h5>').addClass('card-title')
            .html(iconHtml + titleText + ' <span class="badge ' + badgeClass + ' ms-2">' + badgeText + '</span>');

        var cardText = $('<p>').addClass('card-text').text(route.attributes.description);


        var detailsBtn = $('<button>')
            .addClass('btn btn-primary btn-details')
            .attr('data-id', route.id)
            .attr('data-type', type || 'route')
            .text('View Schedule');


        var btnWrapper = $('<div>').addClass('d-flex align-items-center mt-3');
        btnWrapper.append(detailsBtn);


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


    var lastLoadedPredictions = [];


    function renderPredictions(predictions) {

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

        renderPredictions(lastLoadedPredictions, selectedDirection);
    }


    function renderPredictions(predictions, selectedDirection) {
        const container = $('#predictions-list-container');
        if (container.length === 0) {

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

            if (selectedDirection) $('#directionFilter').val(selectedDirection);
        }

        var ul = $('<ul>').addClass('list-group');
        var hasItems = false;

        predictions.forEach(function (pred) {
            const direction = pred.attributes.direction_id;



            if (selectedDirection && selectedDirection !== "all" && Number(selectedDirection) !== direction) {
                return;
            }

            if (pred.attributes.arrival_time) {
                hasItems = true;
                var arrivalTime = new Date(pred.attributes.arrival_time);
                var timeStr = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


                var diffMs = arrivalTime - new Date();
                var diffMins = Math.round(diffMs / 60000);

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
                    lastLoadedPredictions = response.data;

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

});
/* END Anis */


/* BEGIN Art */
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


                            var mappedStops = response.data.map(function (stop) {
                                return {
                                    id: stop.id,
                                    attributes: {
                                        long_name: stop.attributes.name,
                                        description: stop.attributes.address || 'Nearest Stop'
                                    }
                                };
                            });

                            displayRoutes(mappedStops, 'stop');
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

    $('#results-area').on('click', '.btn-stoplist', function () {
        const routeId = $(this).attr('data-id');


        $.ajax({
            url: "https://api-v3.mbta.com/stops",
            method: "GET",
            global: false,
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


        $('#stopListModal').remove();


        $('body').append(html);
        const modal = new bootstrap.Modal(document.getElementById('stopListModal'));
        modal.show();
    }

});
/* END Art */