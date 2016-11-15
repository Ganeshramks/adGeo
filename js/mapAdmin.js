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

	var drawingManager = new google.maps.drawing.DrawingManager(
		{
			drawingMode : google.maps.drawing.OverlayType.POLYGON,
			drawingControl : true,
			drawingControlOptions : {
				position : google.maps.ControlPosition.TOP_LEFT,
				drawingModes : ["polygon"]
			},
			polygonOptions : {
				draggable : true,
				editable : true,
				fillColor : 'green',
				fillOpacity : 0.25,
				geodesic : true,
				strokeWeight : 1 
			}
		});

	drawingManager.setMap(map);

	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon)
		{
			var coordinatesArray = polygon.getPaths().getArray()[0].b;
			boundrySet[boundrySet.length] = coordinatesArray;
			if (confirm("Save Changes?")) 
			{
				window.localStorage.boundrySet = JSON.stringify(boundrySet);
				alert("Saved the region");
				polygon.setMap(map);
			}
			else
			{
				//remove the completed polygon
				polygon.setMap(null);
			}
		});

	if (window.localStorage.boundrySet) 
	{
		boundrySet = JSON.parse(window.localStorage.boundrySet);

		for (var i = 0; i < boundrySet.length; i++) {
			var region = new google.maps.Polygon(
				{
					paths:boundrySet[i],
	          		strokeWeight: 1,
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