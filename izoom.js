zoomIsFunctional = null;
zoomMode = null;
zoomMaximumAllow = null;
zoomErrorMargin = null;

optionsFilled = false;

var zoomLogic = function()
{
    if (!zoomIsFunctional || window.outerWidth < 1) 
    {
		return;
    }
    
    var realstatePercentage = (window.innerWidth * 100 / screen.width) / 100;
    var zoom = (zoomMaximumAllow * realstatePercentage);
    
    if ((zoomMode == zoomModes.ShrinkOnly && zoom > 100) ||
		(zoomMode == zoomModes.GrowOnly && zoom < 100))
    {
		zoom = 100;
    }
	else
	{
		zoom = zoom - zoomErrorMargin;	
	}

    document.body.parentElement.style.zoom = zoom + "%";
};

function zoom()
{
	if (optionsFilled)
	{
		zoomLogic();
	}
	else
	{
		chrome.extension.sendRequest(
			{
				type: "options",
				location: window.location.toString()
			},
			function(response)
			{
				zoomMode = response.zoomMode;
				zoomErrorMargin = response.errorMargin;
				zoomMaximumAllow = response.maximumZoomAllowed;
				zoomIsFunctional = (response.enabled && !response.isException ? true : false);
				
				optionsFilled = true;
				
				zoomLogic();
			}
		);
	}
}

var observer = new window.MutationObserver(function(mutations, observer) {  
  mutations.forEach(function(mutation) {
	  if (mutation.addedNodes.length == 1 && mutation.addedNodes[0].nodeName == "BODY") {
		zoom();
		observer.disconnect();
	  }
  });
});

observer.observe(document, { childList: true, subtree: true });

window.onresize = function()
{
    zoom();
}