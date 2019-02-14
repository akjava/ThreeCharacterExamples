Sidebar.Model = function ( application ) {
	var ap=application;
	var scope=this;
	
	var container=new UI.Panel();
	container.setId( 'model' );
	
	this.modelBase="../../../dataset/mbl3d/models/";

	var itemList=["anime2_female.fbx","anime2_flatnipple.fbx","anime1_female.fbx","anime1_male.fbx","anime2_male.fbx","anime2_modifybreast.fbx","anime2_nomorph.glb"];
	application.defaultModelUrl=scope.modelBase+itemList[0];
	application.modelUrl=application.defaultModelUrl;
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Model"));
	container.add(titleDiv);
	
	var list=new UI.List(itemList,function(v){
		ap.signals.loadingModelStarted.dispatch(scope.modelBase+v);
	});
	container.add(list);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".fbx,.glb");
	row1.add(fileInput);
	
	
	
	fileInput.onChange(function(fileName,blobUrl){
		application.modelUrl=blobUrl;
		if(application.modelUrl==null){
			application.modelUrl=application.defaultModelUrl;
		}
		
		application.signals.loadingModelStarted.dispatch(application.modelUrl,fileName);
	});
	
	return container;
}