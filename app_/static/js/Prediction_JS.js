var getUrl = window.location;
//  This function will get which day it is today.
var stations_Url = getUrl.protocol + "//" + getUrl.host + "/" + "stations";


var xmlhttp = new XMLHttpRequest();
var link = stations_Url;

xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var parsedObj = JSON.parse(xmlhttp.responseText);
        getStationList(parsedObj);
        addressnumber(parsedObj);
    }
};

xmlhttp.open("GET", link, true);
xmlhttp.send();




function getStationList() {
    //  This function gets names of all stations and push them into a selection bar.
    var stationgroup = new Array();
    var everystation = JSON.parse(xmlhttp.responseText).stations;
    var bikestation = document.getElementById("stationlist");
    for (let j = 0; j <= everystation.length; j++) {
        var stationaddress = everystation[j].address;
        if (stationgroup.indexOf(stationaddress) == -1) {
            bikestation.innerHTML += "<option>" + stationaddress + "</option>";
            stationgroup.push(stationaddress);
        }



    }

}


function getweek() {
    //  This function will get which day it is today.
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

function daylater() {
    // This function will select how many days later the user wants to predict.
    var weeknumber;
    var week = new Date().getDay();

    if (document.getElementById("futurelist").value == "One Day Later") {
        if (week == 0) {
            weeknumber = 1;
        } else if (week == 1) {
            weeknumber = 2;
        } else if (week == 2) {
            weeknumber = 3;
        } else if (week == 3) {
            weeknumber = 4;
        } else if (week == 4) {
            weeknumber = 5;
        } else if (week == 5) {
            weeknumber = 6;
        } else if (week == 6) {
            weeknumber = 0;

        }


    } else if (document.getElementById("futurelist").value == "Two Days Later") {
        if (week == 0) {
            weeknumber = 2;
        } else if (week == 1) {
            weeknumber = 3;
        } else if (week == 2) {
            weeknumber = 4;
        } else if (week == 3) {
            weeknumber = 5;
        } else if (week == 4) {
            weeknumber = 6;
        } else if (week == 5) {
            weeknumber = 0;
        } else if (week == 6) {
            weeknumber = 1;

        }


    } else if (document.getElementById("futurelist").value == "Three Days Later") {
        if (week == 0) {
            weeknumber = 3;
        } else if (week == 1) {
            weeknumber = 4;
        } else if (week == 2) {
            weeknumber = 5;
        } else if (week == 3) {
            weeknumber = 6;
        } else if (week == 4) {
            weeknumber = 0;
        } else if (week == 5) {
            weeknumber = 1;
        } else if (week == 6) {
            weeknumber = 2;

        }


    } else if (document.getElementById("futurelist").value == "Four Days Later") {
        if (week == 0) {
            weeknumber = 4;
        } else if (week == 1) {
            weeknumber = 5;
        } else if (week == 2) {
            weeknumber = 6;
        } else if (week == 3) {
            weeknumber = 0;
        } else if (week == 4) {
            weeknumber = 1;
        } else if (week == 5) {
            weeknumber = 2;
        } else if (week == 6) {
            weeknumber = 3;

        }


    } else if (document.getElementById("futurelist").value == "Five Days Later") {
        if (week == 0) {
            weeknumber = 5;
        } else if (week == 1) {
            weeknumber = 6;
        } else if (week == 2) {
            weeknumber = 0;
        } else if (week == 3) {
            weeknumber = 1;
        } else if (week == 4) {
            weeknumber = 2;
        } else if (week == 5) {
            weeknumber = 3;
        } else if (week == 6) {
            weeknumber = 4;

        }


    } else if (document.getElementById("futurelist").value == "Six Days Later") {
        if (week == 0) {
            weeknumber = 6;
        } else if (week == 1) {
            weeknumber = 0;
        } else if (week == 2) {
            weeknumber = 1;
        } else if (week == 3) {
            weeknumber = 2;
        } else if (week == 4) {
            weeknumber = 3;
        } else if (week == 5) {
            weeknumber = 4;
        } else if (week == 6) {
            weeknumber = 5;

        }


    } else if (document.getElementById("futurelist").value == "Seven Days Later") {
        weeknumber = week;
    }
    return weeknumber;


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




function myObject() {

    var getUrl = window.location;

    var stations_Url = getUrl.protocol + "//" + getUrl.host + "/" + "stations";
    var available_Url = getUrl.protocol + "//" + getUrl.host + "/" + "available/";
    var predict_Url = getUrl.protocol + "//" + getUrl.host + "/" + "predict";
    


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
            var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);

            $.ajax({
                url: predict_Url,
                // Send the prediction result of all stations stored in json format.
                type: "get",
                dataType: "json",
                success: function (content) {
                    var predict_data = content.prediction_data;
                    var address_list = content.stations_li;


                    var chart = new CanvasJS.Chart("weekly", {
                        animationEnabled: false,
                        theme: "dark2",
                        title: {
                            text: "Hourly Prediction: " + document.getElementById("futurelist").value
                        },
                        data: [{
                            type: "line",
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
                    chart.render();





                    for (var i = 0; i < markers.length; i++) {

                        var data = markers[i];

                        var myLatlng = new google.maps.LatLng(data.position_lat, data.position_lng);

                        if (data.available_bikes <= 5 && data.available_bikes > 0) {
                            var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',

                            });
                        } else if (data.available_bikes > 5) {
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

                        (function (marker, data) {
                            google.maps.event.addListener(marker, "click", function (e) {
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



                                        infoWindow.setContent("<div style = 'width: 200px; min-height: 40px; font-style: italic; font-weight: 800'>" + "Last Updated Time: " + "<br>" + bikes.time + "<br><br>" + "Station Number: " + data.number + "<br>" + "Full Address: " + data.address + "<br>" + "Position: " + data.position_lat + ", " + data.position_lng + "<br>" + "Contract Name: " + data.contract_name + "<br><br>" + "Available Bikes: " + bikes.available_bikes + "<br>" + "Bike Stands: " + bikes.bike_stands + "<br>" + "Available Bikes Stands: " + bikes.available_bike_stands + "<br>" + "Bonus: " + data.bonus + "<br>" + "Status: " + bikes.status + "</div>");
                                        infoWindow.open(map, marker);





                                        var chart = new CanvasJS.Chart("weekly", {
                                            animationEnabled: true,
                                            theme: "dark2",
                                            title: {
                                                text: "Hourly Prediction: " + document.getElementById("futurelist").value
                                            },
                                            axisY: {
                                                includeZero: true,
                                                minimum: 0
                                            },
                                            legend: {
                                                cursor: "pointer",
                                                dockInsidePlotArea: true,
                                                itemclick: toggleDataSeries
                                            },
                                            data: [
                                                {
                                                    type: "line",
                                                    showInLegend: true,
                                                    name: "Available Stands",
                                                    color: "#CE0000",
                                                    dataPoints: [
                                                        {
                                                            label: "0:00 - 1:00",
                                                            y: predict_data[daylater()][address_list[data.address]][0]
                                                        },
                                                        {
                                                            label: "1:00 - 2:00",
                                                            y: predict_data[daylater()][address_list[data.address]][1]
                                                        },
                                                        {
                                                            label: "2:00 - 3:00",
                                                            y: predict_data[daylater()][address_list[data.address]][2]
                                                        },
                                                        {
                                                            label: "3:00 - 4:00",
                                                            y: predict_data[daylater()][address_list[data.address]][3]
                                                        },
                                                        {
                                                            label: "4:00 - 5:00",
                                                            y: predict_data[daylater()][address_list[data.address]][4]
                                                        },
                                                        {
                                                            label: "5:00 - 6:00",
                                                            y: predict_data[daylater()][address_list[data.address]][5]
                                                        },
                                                        {
                                                            label: "6:00 - 7:00",
                                                            y: predict_data[daylater()][address_list[data.address]][6]
                                                        },
                                                        {
                                                            label: "7:00 - 8:00",
                                                            y: predict_data[daylater()][address_list[data.address]][7]
                                                        },
                                                        {
                                                            label: "8:00 - 9:00",
                                                            y: predict_data[daylater()][address_list[data.address]][8]
                                                        },
                                                        {
                                                            label: "9:00 - 10:00",
                                                            y: predict_data[daylater()][address_list[data.address]][9]
                                                        },
                                                        {
                                                            label: "10:00 - 11:00",
                                                            y: predict_data[daylater()][address_list[data.address]][10]
                                                        },
                                                        {
                                                            label: "11:00 - 12:00",
                                                            y: predict_data[daylater()][address_list[data.address]][11]
                                                        },
                                                        {
                                                            label: "12:00 - 13:00",
                                                            y: predict_data[daylater()][address_list[data.address]][12]
                                                        },
                                                        {
                                                            label: "13:00 - 44:00",
                                                            y: predict_data[daylater()][address_list[data.address]][13]
                                                        },
                                                        {
                                                            label: "14:00 - 15:00",
                                                            y: predict_data[daylater()][address_list[data.address]][14]
                                                        },
                                                        {
                                                            label: "15:00 - 16:00",
                                                            y: predict_data[daylater()][address_list[data.address]][15]
                                                        },
                                                        {
                                                            label: "16:00 - 17:00",
                                                            y: predict_data[daylater()][address_list[data.address]][16]
                                                        },
                                                        {
                                                            label: "17:00 - 18:00",
                                                            y: predict_data[daylater()][address_list[data.address]][17]
                                                        },
                                                        {
                                                            label: "18:00 - 19:00",
                                                            y: predict_data[daylater()][address_list[data.address]][18]
                                                        },
                                                        {
                                                            label: "19:00 - 20:00",
                                                            y: predict_data[daylater()][address_list[data.address]][19]
                                                        },
                                                        {
                                                            label: "20:00 - 21:00",
                                                            y: predict_data[daylater()][address_list[data.address]][20]
                                                        },
                                                        {
                                                            label: "21:00 - 22:00",
                                                            y: predict_data[daylater()][address_list[data.address]][21]
                                                        },
                                                        {
                                                            label: "22:00 - 23:00",
                                                            y: predict_data[daylater()][address_list[data.address]][22]
                                                        },
                                                        {
                                                            label: "23:00 - 0:00",
                                                            y: predict_data[daylater()][address_list[data.address]][23]
                                                        }

                                                    ]
                                                }
                                            ]
                                        });
                                        chart.render();


                                        function toggleDataSeries(f) {
                                            if (typeof (f.dataSeries.visible) === "undefined" || f.dataSeries.visible) {
                                                f.dataSeries.visible = false;
                                            } else {
                                                f.dataSeries.visible = true;
                                            }
                                            chart.render();
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

                }
            });
        }
    });
}



function choose() {
        var getUrl = window.location;

    var stations_Url = getUrl.protocol + "//" + getUrl.host + "/" + "stations";
    var available_Url = getUrl.protocol + "//" + getUrl.host + "/" + "available/";
    var predict_Url = getUrl.protocol + "//" + getUrl.host + "/" + "predict";
    var basicurl = available_Url;
    
                $.ajax({
                url: predict_Url,
                type: "get",
                dataType: "json",
                success: function (content) {
    // This function is used to show a specific station we selected by searching module.
                    var predict_data = content.prediction_data;
                    var address_list = content.stations_li;



    var everystation = JSON.parse(xmlhttp.responseText).stations;
    var mapOptions = {
        center: new google.maps.LatLng(53.346763, -6.2568436),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var infoWindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
    var bikestation = document.getElementById("stationlist").value;
    var trigger = true;
    for (var i = 0; i < everystation.length; i++) {
        var data = everystation[i];



        if (bikestation == data.address) {
          
            
            var myLatlng = new google.maps.LatLng(data.position_lat, data.position_lng);
            latest_address = data.address;
            if (data.available_bikes <= 5 && data.available_bikes > 0) {
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',

                });
            } else if (data.available_bikes > 5) {
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


                    $.ajax({
                        url: basicurl + data.number,
                        type: "get",
                        dataType: "json",
                        success: function (content) {
                            var bikes = content.station_recent;
                            var bikes = content.station_recent;
                            var li_bike_weekly = content.li_bike_weekly;
                            var li_bike_stands_weekly = content.li_bike_stands_weekly;
                            var li_bike_hourly = content.li_bike_hourly;
                            var li_bike_stands_hourly = content.li_bike_stands_hourly;


                                    var chart = new CanvasJS.Chart("weekly", {
                                            animationEnabled: true,
                                            theme: "dark2",
                                            title: {
                                                text: "Hourly Prediction: " + document.getElementById("futurelist").value
                                            },
                                            axisY: {
                                                includeZero: true,
                                                minimum: 0
                                            },
                                            legend: {
                                                cursor: "pointer",
                                                dockInsidePlotArea: true,
                                                itemclick: toggleDataSeries
                                            },
                                            data: [
                                                {
                                                    type: "line",
                                                    showInLegend: true,
                                                    name: "Available Stands",
                                                    color: "#CE0000",
                                                    dataPoints: [
                                                        {
                                                            label: "0:00 - 1:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][0]
                                                        },
                                                        {
                                                            label: "1:00 - 2:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][1]
                                                        },
                                                        {
                                                            label: "2:00 - 3:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][2]
                                                        },
                                                        {
                                                            label: "3:00 - 4:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][3]
                                                        },
                                                        {
                                                            label: "4:00 - 5:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][4]
                                                        },
                                                        {
                                                            label: "5:00 - 6:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][5]
                                                        },
                                                        {
                                                            label: "6:00 - 7:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][6]
                                                        },
                                                        {
                                                            label: "7:00 - 8:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][7]
                                                        },
                                                        {
                                                            label: "8:00 - 9:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][8]
                                                        },
                                                        {
                                                            label: "9:00 - 10:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][9]
                                                        },
                                                        {
                                                            label: "10:00 - 11:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][10]
                                                        },
                                                        {
                                                            label: "11:00 - 12:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][11]
                                                        },
                                                        {
                                                            label: "12:00 - 13:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][12]
                                                        },
                                                        {
                                                            label: "13:00 - 44:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][13]
                                                        },
                                                        {
                                                            label: "14:00 - 15:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][14]
                                                        },
                                                        {
                                                            label: "15:00 - 16:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][15]
                                                        },
                                                        {
                                                            label: "16:00 - 17:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][16]
                                                        },
                                                        {
                                                            label: "17:00 - 18:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][17]
                                                        },
                                                        {
                                                            label: "18:00 - 19:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][18]
                                                        },
                                                        {
                                                            label: "19:00 - 20:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][19]
                                                        },
                                                        {
                                                            label: "20:00 - 21:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][20]
                                                        },
                                                        {
                                                            label: "21:00 - 22:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][21]
                                                        },
                                                        {
                                                            label: "22:00 - 23:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][22]
                                                        },
                                                        {
                                                            label: "23:00 - 0:00",
                                                            y: predict_data[daylater()][address_list[latest_address]][23]
                                                        }

                                                    ]
                                                }
                                            ]
                                        });
                                        chart.render();


                                        function toggleDataSeries(f) {
                                            if (typeof (f.dataSeries.visible) === "undefined" || f.dataSeries.visible) {
                                                f.dataSeries.visible = false;
                                            } else {
                                                f.dataSeries.visible = true;
                                            }
                                            chart.render();
                                        }


                        }
                    });



            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (event) {


                    
                    $.ajax({
                        url: basicurl + data.number,
                        type: "get",
                        dataType: "json",
                        success: function (content) {
                            var bikes = content.station_recent;
                            var bikes = content.station_recent;
                            var li_bike_weekly = content.li_bike_weekly;
                            var li_bike_stands_weekly = content.li_bike_stands_weekly;
                            var li_bike_hourly = content.li_bike_hourly;
                            var li_bike_stands_hourly = content.li_bike_stands_hourly;


                                    var chart = new CanvasJS.Chart("weekly", {
                                            animationEnabled: true,
                                            theme: "dark2",
                                            title: {
                                                text: "Hourly Prediction: " + document.getElementById("futurelist").value
                                            },
                                            axisY: {
                                                includeZero: true,
                                                minimum: 0
                                            },
                                            legend: {
                                                cursor: "pointer",
                                                dockInsidePlotArea: true,
                                                itemclick: toggleDataSeries
                                            },
                                            data: [
                                                {
                                                    type: "line",
                                                    showInLegend: true,
                                                    name: "Available Stands",
                                                    color: "#CE0000",
                                                    dataPoints: [
                                                        {
                                                            label: "0:00 - 1:00",
                                                            y: predict_data[daylater()][address_list[data.address]][0]
                                                        },
                                                        {
                                                            label: "1:00 - 2:00",
                                                            y: predict_data[daylater()][address_list[data.address]][1]
                                                        },
                                                        {
                                                            label: "2:00 - 3:00",
                                                            y: predict_data[daylater()][address_list[data.address]][2]
                                                        },
                                                        {
                                                            label: "3:00 - 4:00",
                                                            y: predict_data[daylater()][address_list[data.address]][3]
                                                        },
                                                        {
                                                            label: "4:00 - 5:00",
                                                            y: predict_data[daylater()][address_list[data.address]][4]
                                                        },
                                                        {
                                                            label: "5:00 - 6:00",
                                                            y: predict_data[daylater()][address_list[data.address]][5]
                                                        },
                                                        {
                                                            label: "6:00 - 7:00",
                                                            y: predict_data[daylater()][address_list[data.address]][6]
                                                        },
                                                        {
                                                            label: "7:00 - 8:00",
                                                            y: predict_data[daylater()][address_list[data.address]][7]
                                                        },
                                                        {
                                                            label: "8:00 - 9:00",
                                                            y: predict_data[daylater()][address_list[data.address]][8]
                                                        },
                                                        {
                                                            label: "9:00 - 10:00",
                                                            y: predict_data[daylater()][address_list[data.address]][9]
                                                        },
                                                        {
                                                            label: "10:00 - 11:00",
                                                            y: predict_data[daylater()][address_list[data.address]][10]
                                                        },
                                                        {
                                                            label: "11:00 - 12:00",
                                                            y: predict_data[daylater()][address_list[data.address]][11]
                                                        },
                                                        {
                                                            label: "12:00 - 13:00",
                                                            y: predict_data[daylater()][address_list[data.address]][12]
                                                        },
                                                        {
                                                            label: "13:00 - 44:00",
                                                            y: predict_data[daylater()][address_list[data.address]][13]
                                                        },
                                                        {
                                                            label: "14:00 - 15:00",
                                                            y: predict_data[daylater()][address_list[data.address]][14]
                                                        },
                                                        {
                                                            label: "15:00 - 16:00",
                                                            y: predict_data[daylater()][address_list[data.address]][15]
                                                        },
                                                        {
                                                            label: "16:00 - 17:00",
                                                            y: predict_data[daylater()][address_list[data.address]][16]
                                                        },
                                                        {
                                                            label: "17:00 - 18:00",
                                                            y: predict_data[daylater()][address_list[data.address]][17]
                                                        },
                                                        {
                                                            label: "18:00 - 19:00",
                                                            y: predict_data[daylater()][address_list[data.address]][18]
                                                        },
                                                        {
                                                            label: "19:00 - 20:00",
                                                            y: predict_data[daylater()][address_list[data.address]][19]
                                                        },
                                                        {
                                                            label: "20:00 - 21:00",
                                                            y: predict_data[daylater()][address_list[data.address]][20]
                                                        },
                                                        {
                                                            label: "21:00 - 22:00",
                                                            y: predict_data[daylater()][address_list[data.address]][21]
                                                        },
                                                        {
                                                            label: "22:00 - 23:00",
                                                            y: predict_data[daylater()][address_list[data.address]][22]
                                                        },
                                                        {
                                                            label: "23:00 - 0:00",
                                                            y: predict_data[daylater()][address_list[data.address]][23]
                                                        }

                                                    ]
                                                }
                                            ]
                                        });
                                        chart.render();


                                        function toggleDataSeries(f) {
                                            if (typeof (f.dataSeries.visible) === "undefined" || f.dataSeries.visible) {
                                                f.dataSeries.visible = false;
                                            } else {
                                                f.dataSeries.visible = true;
                                            }
                                            chart.render();
                                        }


                            infoWindow.setContent("<div style = 'width: 200px; min-height: 40px; font-style: italic; font-weight: 800'>" + "Last Updated Time: " + "<br>" + bikes.time + "<br><br>" + "Station Number: " + data.number + "<br>" + "Full Address: " + data.address + "<br>" + "Position: " + data.position_lat + ", " + data.position_lng + "<br>" + "Contract Name: " + data.contract_name + "<br><br>" + "Available Bikes: " + bikes.available_bikes + "<br>" + "Bike Stands: " + bikes.bike_stands + "<br>" + "Available Bikes Stands: " + bikes.available_bike_stands + "<br>" + "Bonus: " + data.bonus + "<br>" + "Status: " + bikes.status + "</div>");
                            infoWindow.open(map, marker);

                        }
                    });
   
                });
            })(marker, data);
        } else if (bikestation == '') {
            // The case when the selection bar is null without a station selected.

            if (trigger == true) {

                var chart = new CanvasJS.Chart("weekly", {
                        animationEnabled: false,
                        theme: "dark2",
                        title: {
                            text: "Hourly Prediction: " + document.getElementById("futurelist").value
                        },
                        data: [{
                            type: "line",
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
                    chart.render();


                trigger = false;
            }



            var myLatlng = new google.maps.LatLng(data.position_lat, data.position_lng);
            if (data.available_bikes <= 5 && data.available_bikes > 0) {
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',

                });
            } else if (data.available_bikes > 5) {
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


            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (event) {


                    
                    
                    
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



                            var chart = new CanvasJS.Chart("weekly", {
                                            animationEnabled: true,
                                            theme: "dark2",
                                            title: {
                                                text: "Hourly Prediction: " + document.getElementById("futurelist").value
                                            },
                                            axisY: {
                                                includeZero: true,
                                                minimum: 0
                                            },
                                            legend: {
                                                cursor: "pointer",
                                                dockInsidePlotArea: true,
                                                itemclick: toggleDataSeries
                                            },
                                            data: [
                                                {
                                                    type: "line",
                                                    showInLegend: true,
                                                    name: "Available Stands",
                                                    color: "#CE0000",
                                                    dataPoints: [
                                                        {
                                                            label: "0:00 - 1:00",
                                                            y: predict_data[daylater()][address_list[data.address]][0]
                                                        },
                                                        {
                                                            label: "1:00 - 2:00",
                                                            y: predict_data[daylater()][address_list[data.address]][1]
                                                        },
                                                        {
                                                            label: "2:00 - 3:00",
                                                            y: predict_data[daylater()][address_list[data.address]][2]
                                                        },
                                                        {
                                                            label: "3:00 - 4:00",
                                                            y: predict_data[daylater()][address_list[data.address]][3]
                                                        },
                                                        {
                                                            label: "4:00 - 5:00",
                                                            y: predict_data[daylater()][address_list[data.address]][4]
                                                        },
                                                        {
                                                            label: "5:00 - 6:00",
                                                            y: predict_data[daylater()][address_list[data.address]][5]
                                                        },
                                                        {
                                                            label: "6:00 - 7:00",
                                                            y: predict_data[daylater()][address_list[data.address]][6]
                                                        },
                                                        {
                                                            label: "7:00 - 8:00",
                                                            y: predict_data[daylater()][address_list[data.address]][7]
                                                        },
                                                        {
                                                            label: "8:00 - 9:00",
                                                            y: predict_data[daylater()][address_list[data.address]][8]
                                                        },
                                                        {
                                                            label: "9:00 - 10:00",
                                                            y: predict_data[daylater()][address_list[data.address]][9]
                                                        },
                                                        {
                                                            label: "10:00 - 11:00",
                                                            y: predict_data[daylater()][address_list[data.address]][10]
                                                        },
                                                        {
                                                            label: "11:00 - 12:00",
                                                            y: predict_data[daylater()][address_list[data.address]][11]
                                                        },
                                                        {
                                                            label: "12:00 - 13:00",
                                                            y: predict_data[daylater()][address_list[data.address]][12]
                                                        },
                                                        {
                                                            label: "13:00 - 44:00",
                                                            y: predict_data[daylater()][address_list[data.address]][13]
                                                        },
                                                        {
                                                            label: "14:00 - 15:00",
                                                            y: predict_data[daylater()][address_list[data.address]][14]
                                                        },
                                                        {
                                                            label: "15:00 - 16:00",
                                                            y: predict_data[daylater()][address_list[data.address]][15]
                                                        },
                                                        {
                                                            label: "16:00 - 17:00",
                                                            y: predict_data[daylater()][address_list[data.address]][16]
                                                        },
                                                        {
                                                            label: "17:00 - 18:00",
                                                            y: predict_data[daylater()][address_list[data.address]][17]
                                                        },
                                                        {
                                                            label: "18:00 - 19:00",
                                                            y: predict_data[daylater()][address_list[data.address]][18]
                                                        },
                                                        {
                                                            label: "19:00 - 20:00",
                                                            y: predict_data[daylater()][address_list[data.address]][19]
                                                        },
                                                        {
                                                            label: "20:00 - 21:00",
                                                            y: predict_data[daylater()][address_list[data.address]][20]
                                                        },
                                                        {
                                                            label: "21:00 - 22:00",
                                                            y: predict_data[daylater()][address_list[data.address]][21]
                                                        },
                                                        {
                                                            label: "22:00 - 23:00",
                                                            y: predict_data[daylater()][address_list[data.address]][22]
                                                        },
                                                        {
                                                            label: "23:00 - 0:00",
                                                            y: predict_data[daylater()][address_list[data.address]][23]
                                                        }

                                                    ]
                                                }
                                            ]
                                        });
                                        chart.render();


                                        function toggleDataSeries(f) {
                                            if (typeof (f.dataSeries.visible) === "undefined" || f.dataSeries.visible) {
                                                f.dataSeries.visible = false;
                                            } else {
                                                f.dataSeries.visible = true;
                                            }
                                            chart.render();
                                        }


                            infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + "Last Updated Time: " + "<br>" + bikes.time + "<br><br>" + "Station Number: " + data.number + "<br>" + "Full Address: " + data.address + "<br>" + "Position: " + data.position_lat + ", " + data.position_lng + "<br>" + "Contract Name: " + data.contract_name + "<br><br>" + "Available Bikes: " + bikes.available_bikes + "<br>" + "Bike Stands: " + bikes.bike_stands + "<br>" + "Available Bikes Stands: " + bikes.available_bike_stands + "<br>" + "Bonus: " + data.bonus + "<br>" + "Status: " + bikes.status + "</div>");
                            infoWindow.open(map, marker);
                        }
                    });

                });
            })(marker, data);
        }
    }
}
});
}






myObject();