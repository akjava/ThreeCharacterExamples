Sidebar.CameraControler=function(ap){
	var titlePanel=new UI.TitlePanel("Camera Controler");
	
	function update(){
		var y1=cameraY.getValue();
		var y2=targetY.getValue();
		ap.camera.position.set( 0, y1, cameraZ.getValue() );
		ap.controls.target.set(0,y2,0);
		ap.controls.update();
	}

	
	var cameraY=new UI.NumberButtons("Camera Y",-500,500,100,ap.cameraY,function(){
		update();
	},[100,125,150]);
	
	titlePanel.add(cameraY);
	
	var cameraZ=new UI.NumberButtons("Camera Z",0,500,100,ap.cameraZ,function(){
		update();
	},[225,250,280]);
	titlePanel.add(cameraZ);
	
	
	var targetY=new UI.NumberButtons("Target Y",-500,500,100,ap.targetY,function(){
		update();
	},[60,90,100]);
	titlePanel.add(targetY);
	
	update();
	
	return titlePanel;
}