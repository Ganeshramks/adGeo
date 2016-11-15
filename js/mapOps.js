/*
	alert("Sai Ram");
*/

var map = 0;
var boundry = []; 
var boundrySet = [];
//window.localStorage.removeItem('boundrySet');

var markCurrentPosition = function()
{
	if (navigator.geolocation) 
	{
			navigator.geolocation.getCurrentPosition(
			function(position)
			{
				var pos = {
					lat : position.coords.latitude,
					lng : position.coords.longitude
				};

				map = initMap(pos);

				var marker = new google.maps.Marker(
					{
						position: pos,
						map: map
					});
			}, 
			function(error)
			{
				console.log("error");
				console.log(error);
			});
	}
};

var initMap = function(pos)
{
	var map = new google.maps.Map(document.getElementById("map"), 
		{
			center: pos,
			zoom: 16
		});

	var drawingManager = new google.maps.drawing.DrawingManager(
		{
			drawingMode : google.maps.drawing.OverlayType.MARKER,
			drawingControl: true,
			drawingControlOptions: {
				position : google.maps.ControlPosition.TOP_CENTER,
				drawingModes : ["polygon"]
			}
		});

	drawingManager.setMap(map);

	google.maps.event.addListener(map, "click", function(e){
		
		var coordinates = {};
		coordinates.lat = e.latLng.lat();
		coordinates.lng = e.latLng.lng();
		boundry.push(coordinates);

		new google.maps.Marker({
			position: e.latLng,
			map: map,
			title: "SAI RAM"
		});
	});

	if (window.localStorage.boundrySet) 
	{
		boundrySet = JSON.parse(window.localStorage.boundrySet);

		for (var i = 0; i < boundrySet.length; i++) {
			var region = new google.maps.Polygon(
				{
					paths:boundrySet[i],
					strokeColor: 'grey',
	       			strokeOpacity: 0.8,
	          		strokeWeight: 2,
	          		fillColor: 'green',
	          		fillOpacity: 0.20
				});
			region.setMap(map);

		};
	}
	else
	{
		window.localStorage.boundrySet = boundrySet;
	}

	return map;
};

markCurrentPosition();

var saveBoundry = function()
{
	if (boundry.length > 0) 
	{
		boundrySet[boundrySet.length] = boundry;
		window.localStorage.boundrySet = JSON.stringify(boundrySet);
		boundry=[];
		alert("Saved");
	}
	else 
	{
		alert("Mark vertices please!");
	}
};

var coordinateSearch = function(boundrySet)
{
	var coordinates = {};
	if (navigator.geolocation) 
	{
		navigator.geolocation.getCurrentPosition(
			function(position)
			{
				var lat = position.coords.latitude;
				var lng = lng = position.coords.longitude;

				coordinates = new google.maps.LatLng(lat, lng);

				var isInside = false;

				for (var i = 0; i < boundrySet.length; i++) 
				{
					var polygon = new google.maps.Polygon({paths: boundrySet[i]});
					isInside = google.maps.geometry.poly.containsLocation(coordinates, polygon);

					if (isInside) 
						break;
				}

				if (isInside) 
				{
					$.ajax({
						url: 'getMedia',
						success: function(success)
						{
							if (!document.getElementById("vidSrc").getAttribute("src")) 
							{
								document.getElementById("vidSrc").setAttribute("src", "/media/toystory.mp4");
								document.getElementById("vid").load();
								document.getElementById("vid").play();
							}
						},
						error: function(err)
						{
							console.log(err);
							document.getElementById("vidSrc").setAttribute("src", "");
						}
					});
				}
				else 
				{
					document.getElementById("vidSrc").setAttribute("src", "");
					document.getElementById("content").innerHTML = "You are at :" + coordinates.lat() + " , " + coordinates.lng();
				}
			},
			function(err)
			{

			});
	}
};

// check every 5 seconds for location change and update advertisement on the screen 

var watcher = setInterval(function()
	{
		coordinateSearch(boundrySet);
	}, 5000);

