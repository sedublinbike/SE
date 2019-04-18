 function getweek() {
            var str = "";
            var week = new Date().getDay();
            if (week == 0) {
                str = "Sunday";
            } else if (week == 1) {
                str = "Monday";
            } else if (week == 2) {
                str = "Tuesday";
            } else if (week == 3) {
                str = "Wednesday";
            } else if (week == 4) {
                str = "Thursday";
            } else if (week == 5) {
                str = "Friday";
            } else if (week == 6) {
                str = "Saturday";

            }
            return str;
        }


function onedaylater() {
    var str = ""
    var week = new Date().getDay();
                if (week == 0) {
                str = "Monday";
            } else if (week == 1) {
                str = "Tuesday";
            } else if (week == 2) {
                str = "Wednesday";
            } else if (week == 3) {
                str = "Thursday";
            } else if (week == 4) {
                str = "Friday";
            } else if (week == 5) {
                str = "Saturday";
            } else if (week == 6) {
                str = "Sunday";

            }
            return str;
        }
    
}
















                (function($) {
            // Menu Functions
            $(document).ready(function() {
                $('#menuToggle').click(function(e) {
                    var $parent = $(this).parent('nav');
                    $parent.toggleClass("open");
                    var navState = $parent.hasClass('open') ? "hide" : "show";
                    $(this).attr("title", navState + " navigation");
                    // Set the timeout to the animation length in the CSS.
                    e.preventDefault();
                });
            });
        })(jQuery);







        function myObject() {
            $.ajax({
                url: "http://127.0.0.1:5000/available/33",
                type: "get",
                dataType: "json",
                success: function(content) {
                    var dublin = content.station_recent;
                    var temperature = document.getElementById("temperature");
                    var description = document.getElementById("description");
                    var humidity = document.getElementById("humidity");
                    var wind_speed = document.getElementById("wind_speed");
                    var future_temperature = document.getElementById("future_temperature");
                    var future_description = document.getElementById("future_description");
                    var station_location = document.getElementById("station_location");
                    var temperature_icon = document.getElementById("temperature_icon");
                    var future_temperature_icon = document.getElementById("future_temperature_icon");



                    temperature.innerHTML = "<span>" + dublin.temperature + '&#176;C' + "</span>";
                    description.innerHTML = "<span>" + dublin.weather + "</span>";
                    humidity.innerHTML = "<span>Humidity: " + dublin.humidity + "</span>";
                    wind_speed.innerHTML = "<span>Wind Speed: " + dublin.wind_speed + "m/s</span>";
                    future_temperature.innerHTML = "<span>" + dublin.future_temperature + "&#176;C</span>";
                    future_description.innerHTML = "<span>" + dublin.future_weather + "</span>";


                    if (dublin.icon == "01d" || dublin.icon == "01n") {
                        document.getElementById('temperature_icon').src = '../static/images/sunny.gif';
                    } else if (dublin.icon == "02d" || dublin.icon == "02n") {
                        document.getElementById('temperature_icon').src = '../static/images/suncloudy.gif';
                    } else if (dublin.icon == "03d" || dublin.icon == "03n" || dublin.icon == "04d" || dublin.icon == "04n" || dublin.icon == "50d" || dublin.icon == "50n") {
                        document.getElementById('temperature_icon').src = '../static/images/cloudy.gif';
                    } else if (dublin.icon == "09d" || dublin.icon == "09n") {
                        document.getElementById('temperature_icon').src = '../static/images/rainy.gif';
                    } else if (dublin.icon == "10d" || dublin.icon == "10n") {
                        document.getElementById('temperature_icon').src = '../static/images/mixed.gif';
                    } else if (dublin.icon == "11d" || dublin.icon == "11n") {
                        document.getElementById('temperature_icon').src = '../static/images/lightning.gif';
                    } else if (dublin.icon == "13d" || dublin.icon == "13n") {
                        document.getElementById('temperature_icon').src = '../static/images/snowy.gif';
                    }


                    if (dublin.future_icon == "01d" || dublin.future_icon == "01n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/sunny.gif';
                    } else if (dublin.future_icon == "02d" || dublin.future_icon == "02n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/suncloudy.gif';
                    } else if (dublin.future_icon == "03d" || dublin.future_icon == "03n" || dublin.future_icon == "04d" || dublin.future_icon == "04n" || dublin.future_icon == "50d" || dublin.future_icon == "50n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/cloudy.gif';
                    } else if (dublin.future_icon == "09d" || dublin.future_icon == "09n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/rainy.gif';
                    } else if (dublin.future_icon == "10d" || dublin.future_icon == "10n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/mixed.gif';
                    } else if (dublin.future_icon == "11d" || dublin.future_icon == "11n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/lightning.gif';
                    } else if (dublin.future_icon == "13d" || dublin.future_icon == "13n") {
                        document.getElementById('future_temperature_icon').src = '../static/images/snowy.gif';
                    }

                },
                error: function() {
                   alert(An error occurs!);    //http响应状态

                   }

            });









            $.ajax({
                url: "http://127.0.0.1:5000/stations",
                type: "get",
                dataType: "json",
                success: function(content) {
                    var markers = content.stations;
                    var mapOptions = {
                        center: new google.maps.LatLng(53.346763, -6.2568436),
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var infoWindow = new google.maps.InfoWindow();
                    var latlngbounds = new google.maps.LatLngBounds();
                    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);

                    var chart = new CanvasJS.Chart("weekly", {
                        animationEnabled: false,
                        theme: "dark2",
                        title: {
                            text: "History Daily Data"
                        },
                        data: [{
                            type: "line",
                            dataPoints: [{
                                    label: "Sunday",
                                    y: null
                                },
                                {
                                    label: "Monday",
                                    y: null
                                },
                                {
                                    label: "Tuesday",
                                    y: null
                                },
                                {
                                    label: "Wednesday",
                                    y: null
                                },
                                {
                                    label: "Thursday",
                                    y: null
                                },
                                {
                                    label: "Friday",
                                    y: null
                                },
                                {
                                    label: "Saturday",
                                    y: null
                                }

                            ]
                        }]
                    });
                    chart.render();






                    var columnchart = new CanvasJS.Chart("hourly", {
                        animationEnabled: false,
                        theme: "dark2",
                        title: {
                            text: "History Hourly Data on " + onedaylater()
                        },
                        data: [{
                            type: "column",
                            dataPoints: [{
                                    label: "0:00 - 1:00",
                                    y: null
                                },
                                {
                                    label: "1:00 - 2:00",
                                    y: null
                                },
                                {
                                    label: "2:00 - 3:00",
                                    y: null
                                },
                                {
                                    label: "3:00 - 4:00",
                                    y: null
                                },
                                {
                                    label: "4:00 - 5:00",
                                    y: null
                                },
                                {
                                    label: "5:00 - 6:00",
                                    y: null
                                },
                                {
                                    label: "6:00 - 7:00",
                                    y: null
                                },
                                {
                                    label: "7:00 - 8:00",
                                    y: null
                                },
                                {
                                    label: "8:00 - 9:00",
                                    y: null
                                },
                                {
                                    label: "9:00 - 10:00",
                                    y: null
                                },
                                {
                                    label: "10:00 - 11:00",
                                    y: null
                                },
                                {
                                    label: "11:00 - 12:00",
                                    y: null
                                },
                                {
                                    label: "12:00 - 13:00",
                                    y: null
                                },
                                {
                                    label: "13:00 - 44:00",
                                    y: null
                                },
                                {
                                    label: "14:00 - 15:00",
                                    y: null
                                },
                                {
                                    label: "15:00 - 16:00",
                                    y: null
                                },
                                {
                                    label: "16:00 - 17:00",
                                    y: null
                                },
                                {
                                    label: "17:00 - 18:00",
                                    y: null
                                },
                                {
                                    label: "18:00 - 19:00",
                                    y: null
                                },
                                {
                                    label: "19:00 - 20:00",
                                    y: null
                                },
                                {
                                    label: "20:00 - 21:00",
                                    y: null
                                },
                                {
                                    label: "21:00 - 22:00",
                                    y: null
                                },
                                {
                                    label: "22:00 - 23:00",
                                    y: null
                                },
                                {
                                    label: "23:00 - 0:00",
                                    y: null
                                }
                            ]
                        }]
                    });
                    columnchart.render();

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

                        (function(marker, data) {
                            google.maps.event.addListener(marker, "click", function(e) {
                                var basicurl = "http://127.0.0.1:5000/available/";
                                $.ajax({
                                    url: basicurl + data.number,
                                    type: "get",
                                    dataType: "json",
                                    success: function(content) {
                                        var bikes = content.station_recent;
                                        var li_bike_weekly = content.li_bike_weekly;
                                        var li_bike_stands_weekly = content.li_bike_stands_weekly;
                                        var li_bike_hourly = content.li_bike_hourly;
                                        var li_bike_stands_hourly = content.li_bike_stands_hourly;
                                        var temperature = document.getElementById("temperature");
                                        var description = document.getElementById("description");
                                        var humidity = document.getElementById("humidity");
                                        var wind_speed = document.getElementById("wind_speed");
                                        var future_temperature = document.getElementById("future_temperature");
                                        var future_description = document.getElementById("future_description");
                                        var station_location = document.getElementById("station_location");
                                        var temperature_icon = document.getElementById("teperature_icon");
                                        var future_temperature_icon = document.getElementById("future_teperature_icon");

                                        var k;
                                        if (getweek() == "Monday") {
                                            k = 1;
                                        } else if (getweek() == "Tuesday") {
                                            k = 2;
                                        } else if (getweek() == "Wednesday") {
                                            k = 3
                                        } else if (getweek() == "Thursday") {
                                            k = 4;
                                        } else if (getweek() == "Friday") {
                                            k = 5;
                                        } else if (getweek() == "Saturday") {
                                            k = 6;
                                        } else if (getweek() == "Sunday") {
                                            k = 7;
                                        }



                                        infoWindow.setContent("<div style = 'width: 200px; min-height: 40px; font-style: italic; font-weight: 800'>" + "Last Updated Time: " + "<br>" + bikes.time + "<br><br>" + "Station Number: " + data.number + "<br>" + "Full Address: " + data.address + "<br>" + "Position: " + data.position_lat + ", " + data.position_lng + "<br>" + "Contract Name: " + data.contract_name + "<br><br>" + "Available Bikes: " + bikes.available_bikes + "<br>" + "Bike Stands: " + bikes.bike_stands + "<br>" + "Available Bikes Stands: " + bikes.available_bike_stands + "<br>" + "Bonus: " + data.bonus + "<br>" + "Status: " + bikes.status + "</div>");
                                        infoWindow.open(map, marker);


                                        temperature.innerHTML = "<span>" + bikes.temperature + '&#176;C' + "</span>";
                                        description.innerHTML = "<span>" + bikes.weather + "</span>";
                                        humidity.innerHTML = "<span>Humidity: " + bikes.humidity + "</span>";
                                        wind_speed.innerHTML = "<span>Wind Speed: " + bikes.wind_speed + "m/s</span>";
                                        station_location.innerHTML = "<span>" + data.address + "</span>";
                                        future_temperature.innerHTML = "<span>" + bikes.future_temperature + "&#176;C</span>";
                                        future_description.innerHTML = "<span>" + bikes.future_weather + "</span>";


                                        if (bikes.icon == "01d" || bikes.icon == "01n") {
                                            document.getElementById('temperature_icon').src = '../static/images/sunny.gif';
                                        } else if (bikes.icon == "02d" || bikes.icon == "02n") {
                                            document.getElementById('temperature_icon').src = '../static/images/suncloudy.gif';
                                        } else if (bikes.icon == "03d" || bikes.icon == "03n" || bikes.icon == "04d" || bikes.icon == "04n" || bikes.icon == "50d" || bikes.icon == "50n") {
                                            document.getElementById('temperature_icon').src = '../static/images/cloudy.gif';
                                        } else if (bikes.icon == "09d" || bikes.icon == "09n") {
                                            document.getElementById('temperature_icon').src = '../static/images/rainy.gif';
                                        } else if (bikes.icon == "10d" || bikes.icon == "10n") {
                                            document.getElementById('temperature_icon').src = '../static/images/mixed.gif';
                                        } else if (bikes.icon == "11d" || bikes.icon == "11n") {
                                            document.getElementById('temperature_icon').src = '../static/images/lightning.gif';
                                        } else if (bikes.icon == "13d" || bikes.icon == "13n") {
                                            document.getElementById('temperature_icon').src = '../static/images/snowy.gif';
                                        }


                                        if (bikes.future_icon == "01d" || bikes.future_icon == "01n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/sunny.gif';
                                        } else if (bikes.future_icon == "02d" || bikes.future_icon == "02n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/suncloudy.gif';
                                        } else if (bikes.future_icon == "03d" || bikes.future_icon == "03n" || bikes.future_icon == "04d" || bikes.future_icon == "04n" || bikes.future_icon == "50d" || bikes.future_icon == "50n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/cloudy.gif';
                                        } else if (bikes.future_icon == "09d" || bikes.future_icon == "09n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/rainy.gif';
                                        } else if (bikes.future_icon == "10d" || bikes.future_icon == "10n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/mixed.gif';
                                        } else if (bikes.future_icon == "11d" || bikes.future_icon == "11n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/lightning.gif';
                                        } else if (bikes.future_icon == "13d" || bikes.future_icon == "13n") {
                                            document.getElementById('future_temperature_icon').src = '../static/images/snowy.gif';
                                        }









                                        var chart = new CanvasJS.Chart("weekly", {
                                            animationEnabled: true,
                                            theme: "dark2",
                                            title: {
                                                text: "History Daily Data"
                                            },
                                            axisY: {
                                                includeZero: true
                                            },
                                            legend: {
                                                cursor: "pointer",
                                                dockInsidePlotArea: true,
                                                itemclick: toggleDataSeries
                                            },
                                            data: [{
                                                    type: "line",
                                                    showInLegend: true,
                                                    name: "Available Bikes",
                                                    color: "#04B486",
                                                    dataPoints: [{
                                                            label: "Sunday",
                                                            y: li_bike_weekly[6]
                                                        },
                                                        {
                                                            label: "Monday",
                                                            y: li_bike_weekly[0]
                                                        },
                                                        {
                                                            label: "Tuesday",
                                                            y: li_bike_weekly[1]
                                                        },
                                                        {
                                                            label: "Wednesday",
                                                            y: li_bike_weekly[2]
                                                        },
                                                        {
                                                            label: "Thursday",
                                                            y: li_bike_weekly[3]
                                                        },
                                                        {
                                                            label: "Friday",
                                                            y: li_bike_weekly[4]
                                                        },
                                                        {
                                                            label: "Saturday",
                                                            y: li_bike_weekly[5]
                                                        },

                                                    ]
                                                },
                                                {
                                                    type: "line",
                                                    showInLegend: true,
                                                    name: "Available Stands",
                                                    color: "#CE0000",
                                                    dataPoints: [{
                                                            label: "Sunday",
                                                            y: li_bike_stands_weekly[6]
                                                        },
                                                        {
                                                            label: "Monday",
                                                            y: li_bike_stands_weekly[0]
                                                        },
                                                        {
                                                            label: "Tuesday",
                                                            y: li_bike_stands_weekly[1]
                                                        },
                                                        {
                                                            label: "Wednesday",
                                                            y: li_bike_stands_weekly[2]
                                                        },
                                                        {
                                                            label: "Thursday",
                                                            y: li_bike_stands_weekly[3]
                                                        },
                                                        {
                                                            label: "Friday",
                                                            y: li_bike_stands_weekly[4]
                                                        },
                                                        {
                                                            label: "Saturday",
                                                            y: li_bike_stands_weekly[5]
                                                        },

                                                    ]
                                                }
                                            ]
                                        });
                                        chart.render();


                                        function toggleDataSeries(f) {
                                            if (typeof(f.dataSeries.visible) === "undefined" || f.dataSeries.visible) {
                                                f.dataSeries.visible = false;
                                            } else {
                                                f.dataSeries.visible = true;
                                            }
                                            chart.render();
                                        }


                                        var columnchart = new CanvasJS.Chart("hourly", {
                                            animationEnabled: true,
                                            theme: "dark2",
                                            title: {
                                                text: "History Hourly Data on " + getweek()
                                            },
                                            axisY: {

                                                minimum: 0,
                                                maximum: 40,
                                                title: "Available Bikes",
                                                titleFontColor: "#04B486",
                                                lineColor: "#04B486",
                                                labelFontColor: "#04B486",
                                                tickColor: "#04B486"
                                            },
                                            axisY2: {

                                                minimum: 0,
                                                maximum: 40,
                                                title: "Available Stands",
                                                titleFontColor: "#F75000",
                                                lineColor: "#F75000",
                                                labelFontColor: "#F75000",
                                                tickColor: "#F75000"
                                            },
                                            toolTip: {
                                                shared: true
                                            },
                                            legend: {
                                                cursor: "pointer",
                                                itemclick: columntoggleDataSeries
                                            },
                                            data: [{
                                                    type: "column",
                                                    name: "Available Bikes",
                                                    legendText: "Available Bikes",
                                                    showInLegend: true,
                                                    color: "#04B486",
                                                    dataPoints: [{
                                                            label: "0:00 - 1:00",
                                                            y: li_bike_hourly[k][0]
                                                        },
                                                        {
                                                            label: "1:00 - 2:00",
                                                            y: li_bike_hourly[k][1]
                                                        },
                                                        {
                                                            label: "2:00 - 3:00",
                                                            y: li_bike_hourly[k][2]
                                                        },
                                                        {
                                                            label: "3:00 - 4:00",
                                                            y: li_bike_hourly[k][3]
                                                        },
                                                        {
                                                            label: "4:00 - 5:00",
                                                            y: li_bike_hourly[k][4]
                                                        },
                                                        {
                                                            label: "5:00 - 6:00",
                                                            y: li_bike_hourly[k][5]
                                                        },
                                                        {
                                                            label: "6:00 - 7:00",
                                                            y: li_bike_hourly[k][6]
                                                        },
                                                        {
                                                            label: "7:00 - 8:00",
                                                            y: li_bike_hourly[k][7]
                                                        },
                                                        {
                                                            label: "8:00 - 9:00",
                                                            y: li_bike_hourly[k][8]
                                                        },
                                                        {
                                                            label: "9:00 - 10:00",
                                                            y: li_bike_hourly[k][9]
                                                        },
                                                        {
                                                            label: "10:00 - 11:00",
                                                            y: li_bike_hourly[k][10]
                                                        },
                                                        {
                                                            label: "11:00 - 12:00",
                                                            y: li_bike_hourly[k][11]
                                                        },
                                                        {
                                                            label: "12:00 - 13:00",
                                                            y: li_bike_hourly[k][12]
                                                        },
                                                        {
                                                            label: "13:00 - 44:00",
                                                            y: li_bike_hourly[k][13]
                                                        },
                                                        {
                                                            label: "14:00 - 15:00",
                                                            y: li_bike_hourly[k][14]
                                                        },
                                                        {
                                                            label: "15:00 - 16:00",
                                                            y: li_bike_hourly[k][15]
                                                        },
                                                        {
                                                            label: "16:00 - 17:00",
                                                            y: li_bike_hourly[k][16]
                                                        },
                                                        {
                                                            label: "17:00 - 18:00",
                                                            y: li_bike_hourly[k][17]
                                                        },
                                                        {
                                                            label: "18:00 - 19:00",
                                                            y: li_bike_hourly[k][18]
                                                        },
                                                        {
                                                            label: "19:00 - 20:00",
                                                            y: li_bike_hourly[k][19]
                                                        },
                                                        {
                                                            label: "20:00 - 21:00",
                                                            y: li_bike_hourly[k][20]
                                                        },
                                                        {
                                                            label: "21:00 - 22:00",
                                                            y: li_bike_hourly[k][21]
                                                        },
                                                        {
                                                            label: "22:00 - 23:00",
                                                            y: li_bike_hourly[k][22]
                                                        },
                                                        {
                                                            label: "23:00 - 0:00",
                                                            y: li_bike_hourly[k][23]
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "column",
                                                    name: "Available Stands",
                                                    legendText: "Available Stands",
                                                    axisYType: "secondary",
                                                    showInLegend: true,
                                                    color: "#F75000",
                                                    dataPoints: [{
                                                            label: "0:00 - 1:00",
                                                            y: li_bike_stands_hourly[k][0]
                                                        },
                                                        {
                                                            label: "1:00 - 2:00",
                                                            y: li_bike_stands_hourly[k][1]
                                                        },
                                                        {
                                                            label: "2:00 - 3:00",
                                                            y: li_bike_stands_hourly[k][2]
                                                        },
                                                        {
                                                            label: "3:00 - 4:00",
                                                            y: li_bike_stands_hourly[k][3]
                                                        },
                                                        {
                                                            label: "4:00 - 5:00",
                                                            y: li_bike_stands_hourly[k][4]
                                                        },
                                                        {
                                                            label: "5:00 - 6:00",
                                                            y: li_bike_stands_hourly[k][5]
                                                        },
                                                        {
                                                            label: "6:00 - 7:00",
                                                            y: li_bike_stands_hourly[k][6]
                                                        },
                                                        {
                                                            label: "7:00 - 8:00",
                                                            y: li_bike_stands_hourly[k][7]
                                                        },
                                                        {
                                                            label: "8:00 - 9:00",
                                                            y: li_bike_stands_hourly[k][8]
                                                        },
                                                        {
                                                            label: "9:00 - 10:00",
                                                            y: li_bike_stands_hourly[k][9]
                                                        },
                                                        {
                                                            label: "10:00 - 11:00",
                                                            y: li_bike_stands_hourly[k][10]
                                                        },
                                                        {
                                                            label: "11:00 - 12:00",
                                                            y: li_bike_stands_hourly[k][11]
                                                        },
                                                        {
                                                            label: "12:00 - 13:00",
                                                            y: li_bike_stands_hourly[k][12]
                                                        },
                                                        {
                                                            label: "13:00 - 44:00",
                                                            y: li_bike_stands_hourly[k][13]
                                                        },
                                                        {
                                                            label: "14:00 - 15:00",
                                                            y: li_bike_stands_hourly[k][14]
                                                        },
                                                        {
                                                            label: "15:00 - 16:00",
                                                            y: li_bike_stands_hourly[k][15]
                                                        },
                                                        {
                                                            label: "16:00 - 17:00",
                                                            y: li_bike_stands_hourly[k][16]
                                                        },
                                                        {
                                                            label: "17:00 - 18:00",
                                                            y: li_bike_stands_hourly[k][17]
                                                        },
                                                        {
                                                            label: "18:00 - 19:00",
                                                            y: li_bike_stands_hourly[k][18]
                                                        },
                                                        {
                                                            label: "19:00 - 20:00",
                                                            y: li_bike_stands_hourly[k][19]
                                                        },
                                                        {
                                                            label: "20:00 - 21:00",
                                                            y: li_bike_stands_hourly[k][20]
                                                        },
                                                        {
                                                            label: "21:00 - 22:00",
                                                            y: li_bike_stands_hourly[k][21]
                                                        },
                                                        {
                                                            label: "22:00 - 23:00",
                                                            y: li_bike_stands_hourly[k][22]
                                                        },
                                                        {
                                                            label: "23:00 - 0:00",
                                                            y: li_bike_stands_hourly[k][23]
                                                        }
                                                    ]
                                                }
                                            ]
                                        });
                                        columnchart.render();

                                        function columntoggleDataSeries(e) {
                                            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                                e.dataSeries.visible = false;
                                            } else {
                                                e.dataSeries.visible = true;
                                            }
                                            columnchart.render();
                                        }



                                    }

                                });
                            });
                        })(marker, data);
                        latlngbounds.extend(marker.position);

                    }

                    var bounds = new google.maps.LatLngBounds();
                    map.setCenter(latlngbounds.getCenter());
                    map.fitBounds(latlngbounds);
                },
                error: function() {
                   alert(An error occurs!);    //http响应状态
                   }
            });
        }









        myObject();