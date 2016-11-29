window.onload = function()
{
var socket = io();
var mediaIdArray = [];
var mediaArray = [];
var currentMediaIndex = 0;
var videoSrc = document.getElementById("vidSrc");
var video = document.getElementById("vid");
var image = document.getElementById("img");
var homeView = document.getElementById("homeDiv");
var repeat = 0;
var imageDisplayTimeout = null;

video.onended = function()
{
	++currentMediaIndex;
	handleMedia(currentMediaIndex);
};

mediaUpdateHandler = function(response)
{
	if (!response.noData) {
		var data = response.ad;
		var indexQue = mediaIdArray.indexOf(data.id);
		if (data.remove) 
		{
			if (indexQue != -1) 
			{
				mediaIdArray.splice(indexQue, 1);
				mediaArray.splice(indexQue, 1);
			}
		}
		else 
		{
			if (indexQue == -1) 
			{
				mediaIdArray.push(data.id);
				mediaArray.push(data);
			}
		}

		homeView.style.display = "none";

		if (mediaArray.length == 1 && !repeat) 
		{
			handleMedia(0);
		}
		else if (repeat)
		{
			repeat = 0;
			handleMedia(mediaArray.length-1);
		}
	}
	else
	{
		homeView.style.display = "block";
	}
};

handleMedia = function(i)
{
	if (i != mediaArray.length) 
	{
		clearTimeout(imageDisplayTimeout);
		var mediaEndPoint = "/media/" + mediaArray[i].filename;

		currentMediaIndex = i;
		if (mediaArray[i].mediaType == 'video') 
		{
			image.style.display = "none";
			image.setAttribute("src","");
			video.style.display = "block";
			playVideo(mediaEndPoint);
		}
		else
		{
			video.style.display = "none";
			videoSrc.setAttribute("src","");
			image.style.display = "block";
			showImage(i, mediaEndPoint);
		}
	}
	else
	{
		repeat = 1;
		handleMedia(0);
	}
};

playVideo = function(mediaEndPoint)
{
	if (video.currentTime < 0.01 || video.ended) 
	{
		videoSrc.setAttribute("src", mediaEndPoint);
		video.load();
	}
};

showImage = function(i, mediaEndPoint)
{
	image.setAttribute("src", mediaEndPoint); //set src attribute and start timer

	imageDisplayTimeout = setTimeout(imageDisplayTimeoutHandler, 1000*mediaArray[i].duration);
};

imageDisplayTimeoutHandler = function()
{
	++currentMediaIndex;
	handleMedia(currentMediaIndex);
	return;
};

//socket.emit("start");

func = function()
{
socket.emit("start");
}
setTimeout(func, 2000);

socket.on("mediaUpdate", mediaUpdateHandler);

var emitEventAtInterval = setInterval(function(){
	socket.emit("start");
}, 10000);
};