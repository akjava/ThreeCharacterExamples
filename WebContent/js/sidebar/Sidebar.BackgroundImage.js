Sidebar.BackgroundImage=function(ap){
	var scope=this;
	var titlePanel=new UI.TitlePanel("Background Image");
	
	var row1=new UI.Row();
	titlePanel.add(row1);
	
	var fileInput=new UI.BlobFile(".jpg,.png,.jpeg,.gif");
	row1.add(fileInput);
	
	var bgWidth=0;
	var bgHeight=0;
	var texture=null;
	
	this.defaultBackground=ap.scene.background;
	function onResize(){
		if(texture==null){
			return;
		}
		var aspect = window.innerWidth / window.innerHeight;
		var texAspect = bgWidth / bgHeight;
		var relAspect = aspect / texAspect;

		texture.repeat = new THREE.Vector2( 
		    Math.max(relAspect, 1),
		    Math.max(1/relAspect,1) ); 
		texture.offset = new THREE.Vector2(
		    -Math.max(relAspect-1, 0)/2,
		    -Math.max(1/relAspect-1, 0)/2 ); 
	}
	ap.signals.windowResize.add(onResize);
	
	fileInput.onChange(function(fileName,blobUrl){
		
		if(blobUrl==null){
			scope.texture=null;
			ap.scene.background =scope.defaultBackground//TODO modify
			return;
		}
		//from https://stackoverflow.com/questions/19865537/three-js-set-background-image
	   texture=new THREE.TextureLoader().load(blobUrl, function ( texture ) {
			var img = texture.image;
	        bgWidth= img.width;
	        bgHeight = img.height;
	        
	        texture.wrapS = THREE.RepeatWrapping;
	        texture.wrapT = THREE.RepeatWrapping;
	        
	        ap.signals.windowResize.dispatch();
			
	        
	       
			ap.scene.background=texture;
		});
		
       
		
	});
	
	return titlePanel;
}