var map = 0;
var prevRegionId = null;
var boundry = []; 
var boundrySet = [];

document.getElementById("vid").style.display = 'none';
document.getElementById("homeDiv").style.display = 'block';


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
			{//parse coordinates
				var regions = success.regions;
				for (var i = 0; i < regions.length; i++) {
					regions[i].coordinates = JSON.parse(regions[i].coordinates);
				}
				boundrySet = regions;
			}
		},
		error: function(error){
			console.log(error);
		}
	});
};

var coordinateSearch = function(boundrySet)
{
	var coordinates = {};
	var regionId = null;
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
					var polygon = new google.maps.Polygon({paths: boundrySet[i].coordinates});
					isInside = google.maps.geometry.poly.containsLocation(coordinates, polygon);

					if (isInside) 
					{
						regionId = boundrySet[i].id;
						break;
					}
				}

				if (isInside && (prevRegionId==null || prevRegionId!=regionId)) 
				{
					prevRegionId = regionId;
					
					$.ajax({
						url: 'getAdForRegionId',
						type: 'POST',
						data: {
							'regionId' : regionId
						},
						success: function(success)
						{
							if (!document.getElementById("vidSrc").getAttribute("src")) 
							{	
								document.getElementById("vid").style.display = 'block';
								document.getElementById("homeDiv").style.display = 'none';
								document.getElementById("vidSrc").setAttribute("src", "/media/"+success.filename);
								document.getElementById("vid").load();
								document.getElementById("vid").play();
							}
						},
						error: function(err)
						{
							console.log(err);
							document.getElementById("vidSrc").setAttribute("src", "");
							document.getElementById("vid").style.display = 'none';
							document.getElementById("homeDiv").style.display = 'block';
						}
					});
				}
				else if (!isInside)
				{	
					document.getElementById("vidSrc").setAttribute("src", "");
					document.getElementById("vid").style.display = 'none';
					document.getElementById("homeDiv").style.display = 'block';
					//document.getElementById("content").innerHTML = "You are at :" + coordinates.lat() + " , " + coordinates.lng();
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

