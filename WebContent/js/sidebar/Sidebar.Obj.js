Sidebar.Obj = function ( application ) {
	var ap=application;
	var scope=this;
	
	var container=new UI.Panel();
	container.setId( 'texture' );
	
	this.objBase="../../../dataset/mbl3d/obj/";
	this.objSelection='axe.obj';
	var itemList=["","axe.obj","stake.obj"];
	application.defaultObjUrl=null;
	application.objUrl=application.defaultObjUrl;
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("3D Obj Format"));
	container.add(titleDiv);
	
	var list=new UI.List(itemList,function(v){
		var url=null;
		if(v==""){
			url=null;
		}else{
			url=scope.objBase+v
		}
		fileInput.reset();
		ap.getSignal("loadingObjStarted").dispatch(url);
	});
	container.add(list);
	
	//load
	ap.getSignal("loadingObjStarted").add(function(url){
		ap.objUrl=url;
		if(url==null){
			ap.getSignal("loadingObjFinished").dispatch(null);
		}else{
			var objLoader = new THREE.OBJLoader();
			objLoader.load(url,function(obj){
				ap.getSignal("loadingObjFinished").dispatch(obj);
			});
		}
	});
	
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".obj");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,blobUrl){
		application.objUrl=blobUrl;
		if(application.objUrl==null){//reset
			list.setValue(itemList[0]);
			application.objUrl=application.defaultObjUrl;
		}
		
		ap.getSignal("loadingObjStarted").dispatch(application.objUrl);
	});
	
	return container;
}