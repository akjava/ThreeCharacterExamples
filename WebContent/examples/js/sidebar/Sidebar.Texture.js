Sidebar.Texture = function ( application ) {
	var ap=application;
	var scope=this;
	
	var container=new UI.Panel();
	container.setId( 'texture' );
	
	this.textureBase="../../../dataset/mbl3d/texture/";
	this.hairSelection='m_brown.png';
	var itemList=["m_brown.png","m_brown_male.png","m_brown_male2.png","m_brown_nd.png","uv_2048.png"];
	application.defaultTextureUrl=scope.textureBase+itemList[0];
	application.textureUrl=application.defaultTextureUrl;
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Texture"));
	container.add(titleDiv);
	
	var list=new UI.List(itemList,function(v){
		ap.signals.loadingTextureStarted.dispatch(scope.textureBase+v);
	});
	container.add(list);
	if(application.signals.loadingTextureStarted==undefined){
		application.signals.loadingTextureStarted=new signals.Signal();
	}
	ap.signals.loadingTextureStarted.add(function(url){
		ap.textureUrl=url;
		ap.texture=Mbl3dUtils.loadTexture(url);
		ap.signals.loadingTextureFinished.dispatch(ap.texture);
	});
	if(application.signals.loadingTextureFinished==undefined){
		application.signals.loadingTextureFinished=new signals.Signal();
	}
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	
	
	fileInput.onChange(function(fileName,blobUrl){
		application.textureUrl=blobUrl;
		if(application.textureUrl==null){
			application.textureUrl=application.defaultTextureUrl;
		}
		
		application.signals.loadingTextureStarted.dispatch(application.textureUrl);
	});
	

	ap.signals.loadingModelFinished.add(function(){
		application.signals.loadingTextureStarted.dispatch(ap.textureUrl);
	});
	
	if(application.signals.materialChanged==undefined){
		application.signals.materialChanged=new signals.Signal();
	}
	application.signals.loadingTextureFinished.add(function(texture){
		if(ap.isGltf){
			texture.flipY = false;
		}else{
			texture.flipY = true;//FBX
		}
		ap.texture=texture;
		application.signals.materialChanged.dispatch();
	});
	
	return container;
}