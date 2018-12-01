var Sidebar = function ( application ) {
	var scope=this;
	
	this.autoPlay=true;
	this.boneAngleX=0;
	this.boneAngleY=0;
	this.boneAngleZ=0;
	this.boneMoveX=0;
	this.boneMoveY=0;
	this.boneMoveZ=0;
	this.targetName="ball";
	
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Simple Transform"));
	
	var panel=new UI.Panel();
	container.add(panel);
	
	var listRow=UI.ListRow("Target",["root","ball","ball2","ball3"],function(v){
		scope.targetName=v;
	},scope.targetName);
	panel.add(listRow);
	
	function activate(){
		application.ball.getBody().activate();
		application.ball2.getBody().activate();
		application.ball3.getBody().activate();
	}
	function translate(){
		var body=application[scope.targetName].getBody();
		AmmoUtils.setPosition(body,scope.boneMoveX,scope.boneMoveY,scope.boneMoveZ);
		activate();
	}
	function rotated(){
		
		var q=new THREE.Quaternion();
		var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(scope.boneAngleX));
		q.multiply(xq);
		var yq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  THREE.Math.degToRad(scope.boneAngleY));
		q.multiply(yq);
		var zq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1),  THREE.Math.degToRad(scope.boneAngleZ));
		q.multiply(zq);
		
		
		var body=application[scope.targetName].getBody();
		
		
		
		var vec=new THREE.Vector3();
		//AmmoUtils.setAngularVelocity(body,vec);
		//AmmoUtils.setLinearVelocity(body,vec);
		
		AmmoUtils.setRotationFromXYZW(body,q.x,q.y,q.z,q.w);
		activate();//important
		//AmmoUtils.setAngularVelocity(body,vec);
		//AmmoUtils.setLinearVelocity(body,vec);
		//based on timing
	}
	
	
	//ui
	
	
	var boneAngleX=new UI.NumberButtons("AngleX",-180,180,10,scope.boneAngleX,function(v){
		scope.boneAngleX=v;
		if(scope.autoPlay){
			rotated();
			}
	},[0,45,90,180]);
	panel.add(boneAngleX);
	
	var boneAngleY=new UI.NumberButtons("AngleY",-180,180,10,scope.boneAngleY,function(v){
		scope.boneAngleY=v;
		if(scope.autoPlay){
			rotated();
			}
	},[0,45,90,180]);
	panel.add(boneAngleY);
	
	var boneAngleZ=new UI.NumberButtons("AngleZ",-180,180,10,scope.boneAngleZ,function(v){
		scope.boneAngleZ=v;
		if(scope.autoPlay){
			rotated();
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
	},[-5,-1,0,1,5]);
	panel.add(boneMoveY);
	var boneMoveZ=new UI.NumberButtons("MoveZ",-5,5,1,scope.boneMoveZ,function(v){
		scope.boneMoveZ=v;
		if(scope.autoPlay){
			translate();
			}
	},[-5,-1,0,1,5]);
	panel.add(boneMoveZ);
	
	return container;
}
