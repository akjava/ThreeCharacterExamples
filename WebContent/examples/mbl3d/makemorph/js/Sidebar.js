var Sidebar = function ( application ) {
	var ap=application;
	var scope=this;
	
	this.cameraX=0;
	this.cameraY=150;
	this.cameraZ=250;
	
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Make MorphTargets(Not Complete)"));
	
	
	function updateCamera(){
		ap.camera.position.set(scope.cameraX,scope.cameraY,scope.cameraZ);
		ap.controls.update();
	}
	
	//camera test 
	var cameraPanel=new UI.TitlePanel("Camera");
	//container.add(cameraPanel);
	var cameraX=new UI.NumberButtons("X",0,200,10,this.cameraX,function(v){
		scope.cameraX=v;
		updateCamera();
	});
	cameraPanel.add(cameraX);
	var cameraY=new UI.NumberButtons("Y",0,200,10,this.cameraY,function(v){
		scope.cameraY=v;
		updateCamera();
	});
	cameraPanel.add(cameraY);
	var cameraZ=new UI.NumberButtons("Z",-0,300,10,this.cameraZ,function(v){
		scope.cameraZ=v;
		updateCamera();
	});
	cameraPanel.add(cameraZ);
	
	var morphPanel=new UI.TitlePanel("Morph");
	container.add(morphPanel);
	var morphCheck=new UI.CheckboxRow("Morph Normal",true,function(v){
		ap.skinnedMesh.material.morphNormals=v;
		ap.skinnedMesh.material.needsUpdate=true;
	});
	morphPanel.add(morphCheck);
	
	var morph0=new UI.NumberButtons("Morph Index 0",0,1,1,0.5,function(v){
		ap.skinnedMesh.morphTargetInfluences[0]=v;
	});
	morphPanel.add(morph0);
	var morph1=new UI.NumberButtons("Max Breast",0,1,1,0,function(v){
		ap.skinnedMesh.morphTargetInfluences[1]=v;
	});
	//morphPanel.add(morph1);
	
	
	
	var buttonRow=new UI.Row();
	container.add(buttonRow);
	var button1=new UI.Button("Start Morph0");
	button1.onClick(function(){
		
		var clip=AnimeUtils.makeMorphAnimation(0,1,0.1,0.1);
		AnimeUtils.startClip(ap.mixer,clip);
	});
	buttonRow.add(button1);
	
	var button2=new UI.Button("Stop All");
	button2.onClick(function(){
		
		
		AnimeUtils.stopAndReset(ap.mixer,ap.skinnedMesh);
	});
	buttonRow.add(button2);
	
	
	return container;
}
