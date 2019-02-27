Sidebar.Model = function ( application ) {
	var ap=application;
	var scope=this;
	
	var container=new UI.Panel();
	container.setId( 'model' );
	
	this.modelBase="../../../dataset/mbl3d/models/";

	//TODO arg
	var itemList=["anime2_female.fbx","anime2_female_smallarm.fbx","anime1_female.fbx","anime1_male.fbx","anime2_male.fbx","anime2_modifybreast.fbx","anime2_nomorph.glb"];
	application.defaultModelUrl=scope.modelBase+itemList[0];
	application.modelUrl=application.defaultModelUrl;
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Model"));
	container.add(titleDiv);
	
	var list=new UI.List(itemList,function(v){
		fileInput.name.value="";
		ap.signals.loadingModelStarted.dispatch(scope.modelBase+v);
	});
	container.add(list);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".fbx,.glb");
	row1.add(fileInput);
	
	
	var fileInputUrl=null;
	
	fileInput.onChange(function(fileName,blobUrl){
		application.modelUrl=blobUrl;
		if(application.modelUrl==null){
			list.setValue(itemList[0]);
			application.modelUrl=application.defaultModelUrl;
		}
		
		fileInputUrl=application.modelUrl;
		application.signals.loadingModelStarted.dispatch(application.modelUrl,fileName);
	});
	
	
	
	return container;
}