var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("JsZip"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	var test=new UI.ButtonRow("Test zip download",function(){
		var zip=new JSZip();
		zip.file("test.txt", "hello world");
		console.log(zip);
		var file=zip.file("test.txt");
		console.log(file);
		
		console.log(file.name);
		console.log(file.asText());
		console.log(file.date);
		console.log(file.dir);
		
		var dir=zip.folder("images");
		ap.onRender();
		var dataUrl=AppUtils.toPngDataUrl(ap.renderer);
		var index=dataUrl.indexOf("base64,");
		var imgData;
		if(index==-1){
			imgData=url;
		}else{
			imgData=dataUrl.substring(index+"base64,".length);
		}
		dir.file("image.png",imgData,{base64:true});
		
		var blob=zip.generate({type:"blob"});
		var a=AppUtils.generateBlobDownloadLink(blob,"application/zip","test.zip","download sample blob");
		console.log(a);
		a.click();
		
	});
	main.add(test);
	
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.ControlerCheck(ap));
	
	sub.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	sub.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	sub.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub.add(new Sidebar.MeshTransform(ap));
	Logics.loadingModelFinishedForMeshTransform(ap);
	
	sub.add(new Sidebar.ClipPlayer(ap));
	sub.add(new Sidebar.SimpleLight(ap));
	
	
	return container;
}
