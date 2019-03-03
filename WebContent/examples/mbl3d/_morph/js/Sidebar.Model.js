Sidebar.Model = function ( application ) {
	var container=new UI.Panel();
	container.setId( 'model' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Model"));
	container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".glb");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,blobUrl){
		application.modelUrl=blobUrl;
		if(application.modelUrl==null){
			application.modelUrl=application.defaultModelUrl;
		}
		
		application.signals.loadingModelStarted.dispatch();
	});
	
	
	return container;
}