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
						map: map,
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

	/*var drawingManager = new google.maps.drawing.DrawingManager(
		{
			drawingMode : google.maps.drawing.OverlayType.MARKER,
			drawingControl: true,
			drawingControlOptions: {
				position : google.maps.ControlPosition.TOP_CENTER,
				drawingModes : ["polygon"]
			}
		});

	drawingManager.setMap(map);*/

	google.maps.event.addListener(map, "click", function(e){
		
		var coordinates = {};
		coordinates.lat = e.latLng.lat();
		coordinates.lng = e.latLng.lng();
		boundry.push(coordinates);

		new google.maps.Marker({
			position: e.latLng,
			map: map
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
		window.location.reload(true);
	}
	else 
	{
		alert("Mark vertices please!");
	}
};