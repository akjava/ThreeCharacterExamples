Sidebar.Texture = function ( application ) {
	var container=new UI.Panel();
	container.setId( 'texture' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Texture"));
	container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,blobUrl){
		application.textureUrl=blobUrl;
		if(application.textureUrl==null){
			application.textureUrl=application.defaultTextureUrl;
		}
		application.signals.loadingTextureStarted.dispatch();
		application.signals.loadingTextureFinished.dispatch();
	});
	
	
	return container;
}