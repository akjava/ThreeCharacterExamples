var ListTextureDiv=function(ap,itemList,type){
	type=type==undefined?"map":type;
	var container=new UI.Div();
	var ap=application;
	var scope=this;
	
	//TODO arg?
	this.textureBase="../../../dataset/mbl3d/texture/";
	
	application.defaultTextureUrls[type]=scope.textureBase+itemList[0];
	application.textureUrls[type]=application.defaultTextureUrls[type];
	
	
	var list=new UI.List(itemList,function(v){
		ap.signals.loadingTextureStarted.dispatch(scope.textureBase+v,type);
	});
	container.add(list);
	
	ap.getSignal("loadingTextureStarted").add(function(url,tp){
		if(type!=tp){
			return;
		}
		ap.textureUrls[type]=url;
		var texture=Mbl3dUtils.loadTexture(url);
		ap.signals.loadingTextureFinished.dispatch(texture,type);
	});
	
	ap.getSignal("loadingTextureFinished");
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	
	var fileInputUrl=null;
	
	fileInput.onChange(function(fileName,blobUrl){
		application.textureUrls[type]=blobUrl;
		if(application.textureUrls[type]==null){
			list.setValue(itemList[0]);
			application.textureUrls[type]=application.defaultTextureUrls[type];
		}
		fileInputUrl=application.textureUrls[type];
		application.signals.loadingTextureStarted.dispatch(application.textureUrls[type],type);
		
	});
	


	
	application.getSignal("materialChanged");
	
	application.signals.loadingTextureFinished.add(function(texture,tp){
		if(type!=tp){
			return;
		}
		
		
		if(fileInputUrl!=application.textureUrls[type]){
			fileInput.name.value="";
		}
		
		ap.textures[type]=texture;
		application.getSignal("materialChanged").dispatch();
	});
	
	return container;
}