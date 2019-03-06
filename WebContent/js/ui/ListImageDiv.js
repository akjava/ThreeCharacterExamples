/*
 * almost same as ListTextureDiv
 */
var ListImageDiv=function(ap,itemList,type,baseDir){
	type=type==undefined?"map":type;
	var container=new UI.Div();
	var ap=application;
	var scope=this;
	
	this.imageBase=baseDir;
	
	application.defaultImageUrls[type]=scope.imageBase+itemList[0];
	application.imageUrls[type]=application.defaultImageUrls[type];
	
	
	
	function load(v){
		var url;
		if(v==""){
			url=null;
		}else{
			url=scope.imageBase+v;
		}
		ap.signals.loadingImageStarted.dispatch(url,type);
	}
	container.load=load;
	
	var list=new UI.List(itemList,function(v){
		load(v);
	});
	container.add(list);
	
	ap.getSignal("loadingImageStarted").add(function(url,tp){
		if(type!=tp){
			return;
		}
		ap.imageUrls[type]=url;
		new THREE.ImageLoader().load(url,function(image){
			ap.signals.loadingImageFinished.dispatch(image,type);
		});
		
	});
	
	
	
	var row1=new UI.Row();
	container.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg");
	row1.add(fileInput);
	
	
	var fileInputUrl=null;
	
	fileInput.onChange(function(fileName,blobUrl){
		application.imageUrls[type]=blobUrl;
		if(application.imageUrls[type]==null){
			list.setValue(itemList[0]);
			application.imageUrls[type]=application.defaultimageUrls[type];
		}
		fileInputUrl=application.imageUrls[type];
		application.signals.loadingImageStarted.dispatch(application.imageUrls[type],type);
		
	});
	


	
	
	application.getSignal("loadingImageFinished").add(function(image,tp){
		if(type!=tp){
			return;
		}
		
		
		if(fileInputUrl!=application.imageUrls[type]){
			fileInput.name.value="";
		}
		
		ap.images[type]=image;
	},undefined,100);
	
	return container;
}