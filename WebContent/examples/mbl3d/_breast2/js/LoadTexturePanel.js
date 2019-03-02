var LoadTextureRow = function ( application ) {	
	
	if(application.signals.loadingTextureStarted==undefined){
		console.error("need application.signals.loadingTextureStarted");
		return;
	}

	if(application.signals.loadingTextureFinished==undefined){
		console.error("need application.signals.loadingTextureFinished");
		return;
	}

	
	var row1=new UI.Row();
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,blobUrl){
		
		application.textureUrl=blobUrl;
		if(application.textureUrl==null && application.defaultTextureUrl!==undefined){
			application.textureUrl=application.defaultTextureUrl;
		}
		application.signals.loadingTextureStarted.dispatch(application.textureUrl);
	});
	
	application.signals.loadingTextureStarted.add(function(textureUrl){
		
		var texture=Mbl3dUtils.loadTexture(textureUrl);
		application.texture=texture;
		application.signals.loadingTextureFinished.dispatch(texture);
	});
	
	
	return row1;
}

var LoadTexturePanel=function(application){
	var titlePanel=new UI.TitlePanel("Load Texture");
	titlePanel.add(new LoadTextureRow(application));
	return titlePanel;
}