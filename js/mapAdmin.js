var map = 0;
var boundry = []; 
var boundrySet = [];

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
				strokeWeight : 1,
				strokeColor: 'blue' 
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
				$.ajax({
					url: 'saveLocation',
					type: 'POST',
					data: {
						'coordinateSet' : JSON.stringify(coordinatesArray)
					},
					success: function(success)
					{
						alert("Saved the region");
						polygon.setMap(map);
					},
					error: function(error)
					{
						alert("Error saving boundry!");
						polygon.setMap(null);
					}
				});
			}
			else
			{
				//remove the completed polygon
				polygon.setMap(null);
			}
		});

	getRegions();

	return map;
};

markCurrentPosition();

var getRegions = function()
{
	$.ajax({
		url: 'getRegions',
		success: function(success){
			if (success.status_code == 200) 
			{
				var regions = success.regions;
				for (var i = 0; i < regions.length; i++) {
					var coordinates = JSON.parse(regions[i].coordinates);
					var region = new google.maps.Polygon({
						paths:coordinates,
						strokeWeight: 1,
						strokeColor: '#A3CCFF',
						strokeOpacity: 0.70,
						fillColor: 'green',
						fillOpacity: 0.20
					});
					region.setMap(map);
				}
			}
		},
		error: function(error){
			console.log(error);
		}
	});
};