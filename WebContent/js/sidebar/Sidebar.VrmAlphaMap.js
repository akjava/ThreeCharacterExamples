Sidebar.VrmAlphaMap=function(ap){
	var container=new UI.TitlePanel("Vrm AlphaMap");
	
	var scope=this;

	
	
	
	var itemList=new UI.Select();
	container.add(itemList);
	itemList.onChange(function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		
		
	});
	
	ap.getSignal("loadingModelFinished").add(function(model){
		var keys={};
		model.traverse(function(model){
			if(model.isSkinnedMesh){
				keys[model.id]=model.name;
			}
		});
		itemList.setOptions(keys);
	});
	

	
	function getMaterial(){
		var value=itemList.getValue();
		if(value==""){
			return null;
		}
		var target=ap.skinnedMesh.getObjectById(Number(value));
		return target.material
	}
	
	
	this.textureBase="../../../dataset/vrm/texture/";
	
	var fileNames=["","alphamap1.png","alphamap2.png"];
	ap.defaultAlphaMapUrl=fileNames[0]==""?null:scope.textureBase+fileNames[0];
	ap.alphaMapUrl=ap.defaultAlphaMapUrl;
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Texture"));
	container.add(titleDiv);
	
	var list=new UI.List(fileNames,function(v){
		if(!v || v==""){
			ap.getSignal("loadingAlphaMapStarted").dispatch(null);
		}else{
			ap.getSignal("loadingAlphaMapStarted").dispatch(scope.textureBase+v);
		}
		fileInput.name.value="";
	});
	container.add(list);
	
	ap.getSignal("loadingAlphaMapStarted").add(function(url){
		ap.alphaMapUrl=url;
		if(!url || url==""){
			ap.alphaMapUrl=null;
			ap.getSignal("loadingAlphaMapFinished").dispatch(null);
		}else{
			new THREE.TextureLoader().load(url,function(texture){
				texture.flipY=false;
				
				ap.getSignal("loadingAlphaMapFinished").dispatch(texture);
			});
		}
		
		
	});
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	
	
	fileInput.onChange(function(fileName,blobUrl){
		application.alphaMapUrl=blobUrl;
		if(application.alphaMapUrl==null){
			application.alphaMapUrl=application.defaultAlphaMapUrl;
			list.setValue(fileNames[0]);
			
		}
		
		
		ap.getSignal("loadingAlphaMapStarted").dispatch(application.alphaMapUrl);
	});
	


	
	
	ap.getSignal("loadingAlphaMapFinished").add(function(texture){
		console.log(texture,ap.alphaMapUrl);
		
		var material=getMaterial();
		if(material==null){
			return;
		}
		material.transparent=true;
		material.alphaMap=texture;
		material.needsUpdate=true;
	});

	
	
	return container;
}