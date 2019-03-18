Sidebar.VrmCameraControler=function(ap){
	var titlePanel=new UI.TitlePanel("Camera Controler");
	
	function update(){
		var y1=cameraY.getValue();
		var y2=targetY.getValue();
		var x1=cameraX.getValue();
		ap.camera.position.set( x1, y1, cameraZ.getValue() );
		ap.controls.target.set(0,y2,0);
		ap.controls.update();
	}
	ap.cameraY=100;
	ap.cameraZ=-260;
	ap.targetY=90;//TODO sync
	
	ap.getSignal("cameraControlerChanged").add(function(cpos,tpos){
		cameraX.setValue(cpos.x);
		cameraY.setValue(cpos.y);
		cameraZ.setValue(cpos.z);
		targetY.setValue(tpos.y);
		update();
	})
	ap.getSignal("cameraControlerUpdate").add(function(){
		update();
	})
	var cameraX=new UI.NumberButtons("Camera X",-500,500,100,ap.cameraX,function(){
		update();
	},[0]);
	
	titlePanel.add(cameraX);
	
	var cameraY=new UI.NumberButtons("Camera Y",-500,500,100,ap.cameraY,function(){
		update();
	},[100,125,150]);
	
	titlePanel.add(cameraY);
	
	var cameraZ=new UI.NumberButtons("Camera Z",-500,500,100,ap.cameraZ,function(){
		update();
	},[-225,-260,-280]);
	titlePanel.add(cameraZ);
	cameraZ.number.setWidth("50px");
	
	
	var targetY=new UI.NumberButtons("Target Y",-500,500,100,ap.targetY,function(){
		update();
	},[60,90,100]);
	titlePanel.add(targetY);
	
	update();
	
	return titlePanel;
}