var TransformPanel=function(ap){
var panel=new UI.Panel();
panel.autoUpdate=true;

function rotate(){
	if(ap.signals.objectRotated)
		ap.signals.objectRotated.dispatch();
	else
		console.log("ap.signals.objectRotated is not exist");
}

function rotate(){
	if(ap.signals.objectRotated)
		ap.signals.objectRotated.dispatch();
}

	var angleX=new UI.NumberButtons("AngleX",-180,180,10,scope.boneAngleX,function(v){
		if(panel.autoUpdate){
			rotate();
			}
	},[-90,-45,0,45,90]);
	angleX.text.setWidth("60px");
	panel.add(angleX);
	panel.getAngleX=function(){
		return angleX.getValue();
	}
	panel.setAngleX=function(v){
		angleX.number.setValue(v);
	}
	
	var boneAngleY=new UI.NumberButtons("AngleY",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[0,45,90,180]);
	panel.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberButtons("AngleZ",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		if(scope.autoUpdate){
			rotate();
			}
	},[0,45,90,180]);
	panel.add(boneAngleZ);
	
	var boneMoveX=new UI.NumberButtons("MoveX",-5,5,1,scope.boneMoveX,function(v){
		scope.boneMoveX=v;
		if(scope.autoPlay){
			translate();
			}
	},[-5,-1,0,1,5]);
	panel.add(boneMoveX);
	var boneMoveY=new UI.NumberButtons("MoveY",-5,5,1,scope.boneMoveY,function(v){
		scope.boneMoveY=v;
		if(scope.autoPlay){
			translate();
			}
	},[-10,-5,-1,0]);
	panel.add(boneMoveY);
	var boneMoveZ=new UI.NumberButtons("MoveZ",-5,5,1,scope.boneMoveZ,function(v){
		scope.boneMoveZ=v;
		if(scope.autoPlay){
			translate();
			}
	},[-5,-1,0,1,5]);
	panel.add(boneMoveZ);
	
	return panel;
}