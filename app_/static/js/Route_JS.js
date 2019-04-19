function myObject() {
    var getUrl = window.location;

    var stations_Url = getUrl.protocol + "//" + getUrl.host + "/" + "stations";
    var available_Url = getUrl.protocol + "//" + getUrl.host + "/" + "available/";



    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        // This function is used to to calculate the best route between two stations with google directions api.
        directionsService.route({
            origin: document.getElementById('start').innerHTML,
            destination: document.getElementById('end').innerHTML,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert("Please select a correct station!");
            }
        });
    }




    (function ($) {
        // Menu functions
        $(document).ready(function () {
            $('#menuToggle').click(function (e) {
                var $parent = $(this).parent('nav');
                $parent.toggleClass("open");
                var navState = $parent.hasClass('open') ? "hide" : "show";
                $(this).attr("title", navState + " navigation");
                // Set the timeout to the animation length in the CSS.
                e.preventDefault();
            });
        });
    })(jQuery);
    // referranced from https://codepen.io/mambroz/pen/rdFfx, and changed some style and codes based on my case.   




    $.ajax({
        url: stations_Url,
        // Send a request and get details of all the stations.
        type: "get",
        dataType: "json",
        success: function (content) {

            var markers = content.stations;
            var mapOptions = {
                center: new google.maps.LatLng(53.346763, -6.2568436),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var infoWindow = new google.maps.InfoWindow();
            var latlngbounds = new google.maps.LatLngBounds();
            var directionsService = new google.maps.DirectionsService;
            var directionsOptions = {
                polylineOptions: {
                    strokeColor: '#0080FF',
                    strokeOpacity: 0.5,
                    strokeWeight: 10
                }
            }
            var directionsDisplay = new google.maps.DirectionsRenderer(directionsOptions);
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            directionsDisplay.setMap(map);


            var onChangeHandler = function () {
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            };
            document.getElementById('send').addEventListener('click', onChangeHandler);

            // click the button to get the route.



            for (var i = 0; i < markers.length; i++) {


                var data = markers[i];

                var myLatlng = new google.maps.LatLng(data.position_lat, data.position_lng);

                if (data.available_bikes <= 5 && data.available_bikes > 0) {
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',

                    });
                } else if (data.available_bikes >= data.available_bike_stands) {
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',

                    });
                } else {
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    });
                }
                // Stations with different numbers of available bikes will be represented by markers with different colors. 

                (function (marker, data) {
                    google.maps.event.addListener(marker, "click", function (e) {
                        // Show the detail of a specific station when clicking on a marker. 
                        var basicurl = available_Url;
                        $.ajax({
                            url: basicurl + data.number,
                            type: "get",
                            dataType: "json",
                            success: function (content) {
                                var bikes = content.station_recent;
                                var li_bike_weekly = content.li_bike_weekly;
                                var li_bike_stands_weekly = content.li_bike_stands_weekly;
                                var li_bike_hourly = content.li_bike_hourly;
                                var li_bike_stands_hourly = content.li_bike_stands_hourly;



                                infoWindow.setContent("<div style = 'width: 200px; min-height: 40px; font-style: italic; font-weight: 800'>" + "Last Updated Time: " + "<br>" + bikes.time + "<br><br>" + "Station Number: " + data.number + "<br>" + "Full Address: " + data.address + "<br>" + "Position: " + data.position_lat + ", " + data.position_lng + "<br>" + "Contract Name: " + data.contract_name + "<br><br>" + "Available Bikes: " + bikes.available_bikes + "<br>" + "Bike Stands: " + bikes.bike_stands + "<br>" + "Available Bikes Stands: " + bikes.available_bike_stands + "<br>" + "Bonus: " + data.bonus + "<br>" + "Status: " + bikes.status + "</div><br><br><button onclick='document.getElementById(\"startnamepre\").innerHTML = \"Coordinate:&nbsp;&nbsp;\";document.getElementById(\"start\").innerHTML = \"" + data.position_lat + "," + data.position_lng + "\"; document.getElementById(\"startname\").innerHTML = \"Name:&nbsp;&nbsp;" + data.address + "\"' style = 'width: 100px'>Set Start</button><button onclick='document.getElementById(\"endnamepre\").innerHTML = \"Coordinate:&nbsp;&nbsp;\"; document.getElementById(\"end\").innerHTML = \"" + data.position_lat + "," + data.position_lng + "\"; document.getElementById(\"endname\").innerHTML = \"Name:&nbsp;&nbsp;" + data.address + "\"' style = 'width: 100px'>Set End</button>");
                                infoWindow.open(map, marker);

                                // Show details in an inflwindow.

                            }

                        });

                    });
                })(marker, data);
                latlngbounds.extend(marker.position);

            }


            var bounds = new google.maps.LatLngBounds();
            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds);

        }
    });
}









myObject();