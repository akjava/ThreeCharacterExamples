Sidebar.VrmCameraControler=function(ap){
	var titlePanel=new UI.TitlePanel("Camera Controler");
	
	function update(){
		var y1=cameraY.getValue();
		var y2=targetY.getValue();
		ap.camera.position.set( 0, y1, cameraZ.getValue() );
		ap.controls.target.set(0,y2,0);
		ap.controls.update();
	}
	ap.cameraY=100;
	ap.cameraZ=-250;
	ap.targetY=100;
	
	ap.getSignal("cameraControlerChanged").add(function(cpos,tpos){
		
		cameraY.setValue(cpos.y);
		cameraZ.setValue(cpos.z);
		targetY.setValue(tpos.y);
		update();
	})
	
	var cameraY=new UI.NumberButtons("Camera Y",-500,500,100,ap.cameraY,function(){
		update();
	},[100,125,150]);
	
	titlePanel.add(cameraY);
	
	var cameraZ=new UI.NumberButtons("Camera Z",-500,0,100,ap.cameraZ,function(){
		update();
	},[-225,-250,-280]);
	titlePanel.add(cameraZ);
	
	
	var targetY=new UI.NumberButtons("Target Y",-500,500,100,ap.targetY,function(){
		update();
	},[60,90,100]);
	titlePanel.add(targetY);
	
	update();
	
	return titlePanel;
}