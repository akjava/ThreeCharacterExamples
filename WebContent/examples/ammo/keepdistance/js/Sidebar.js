var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Keep Distance(not complated)"));
	
	var springPanel=new UI.Panel();
	container.add(springPanel);
	var springTitle=new UI.Div().setClass("title").add(new UI.Text("Spring"));
	springPanel.add(springTitle);
	
	var damping=new UI.NumberButtons("Damping",0,200,1,application.damping,function(v){
		application.linearLimitValue=v;
	},[0,1,10,100]);
	springPanel.add(damping);
	
	var stiffness=new UI.NumberButtons("Stiffness",0,200,10,application.stiffness,function(v){
		application.stiffness=v;
	},[0,10,50,100]);
	springPanel.add(stiffness);
	
	var constraintPanel=new UI.Panel();
	container.add(constraintPanel);
	var constraintTitle=new UI.Div().setClass("title").add(new UI.Text("Constraint"));
	constraintPanel.add(constraintTitle);
	
	var lineLength=new UI.NumberRow("Line Length",0.1,50,10,application.lineLength,function(v){
		application.lineLength=v;
	});
	constraintPanel.add(lineLength);
	
	var limitValue=new UI.NumberButtons("Linear Limit",0,20,5,application.linearLimitValue,function(v){
		application.linearLimitValue=v;
	},[0,1,5,10]);
	constraintPanel.add(limitValue)
	
	var disableCollisionRow=new UI.CheckboxRow("Disable Collision",application.disableCollisionsBetweenLinkedBodies,function(v){
		application.disableCollisionsBetweenLinkedBodies=v;
	});
	constraintPanel.add(disableCollisionRow);
	
	var frameInA=new UI.CheckboxRow("FrameInA",application.frameInA,function(v){
		application.frameInA=v;
	});
	constraintPanel.add(frameInA);
	
	var keepDistance=new UI.CheckboxRow("Keep Max Distance 10",application.keepDistance,function(v){
		application.keepDistance=v;
	});
	constraintPanel.add(keepDistance);
	
	
	
	var p1=new UI.Panel();
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball"));
	p1.add(titleDiv);

	var bt=new UI.Button("New Ball").onClick( function () {

		Example.newBall(application);

	} );
	p1.add(bt);
	var check=new UI.CheckboxText("Pos Y Direction",application.posYDirection,function(v){
		application.posYDirection=v;
	});
	check.text.setWidth("120px");
	p1.add(check);
	
	var xForce=new UI.NumberButtons("Force X",-50,50,10,application.xForce,function(v){
		application.xForce=v;
	},[-25,0,25,50]);
	p1.add(xForce);
	var yForce=new UI.NumberButtons("Force Y",-50,50,10,application.yForce,function(v){
		application.yForce=v;
	},[-25,0,25,50]);
	p1.add(yForce);
	var zForce=new UI.NumberButtons("Force Z",-50,50,10,application.zForce,function(v){
		application.zForce=v;
	},[-25,0,25,50]);
	p1.add(zForce);
	

	
	
	

	
	//ui
	var p0=new UI.Panel();

	
	p0.add(new UI.Div().setClass("title").add(new UI.Text("Ball Damping")));
	container.add(p0);
	
	var linearDamping=new UI.NumberButtons("Linear",0,10,1,application.linearDamping,function(v){
		application.linearDamping=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	p0.add(linearDamping);
	
	var angularDamping=new UI.NumberButtons("Angular",0,10,1,application.angularDamping,function(v){
		application.angularDamping=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	p0.add(angularDamping);
	
	

	var factorPanel=new UI.TitlePanel("Ball Factor Enabled");
	container.add(factorPanel);
	var linearRow=new UI.TextRow("Linear");
	
	linearRow.text.setWidth("90px");
	
	factorPanel.add(linearRow);
	var linearX=new UI.CheckboxText("X",ap.linearX,function(v){
		ap.linearX=v;
	});
	linearRow.add(linearX);
	var linearY=new UI.CheckboxText("Y",ap.linearY,function(v){
		ap.linearY=v;
	});
	linearRow.add(linearY);
	var linearZ=new UI.CheckboxText("Z",ap.linearZ,function(v){
		ap.linearZ=v;
	});
	linearRow.add(linearZ);
	var angularRow=new UI.TextRow("angular");
	
	angularRow.text.setWidth("90px");
	
	factorPanel.add(angularRow);
	var angularX=new UI.CheckboxText("X",ap.angularX,function(v){
		ap.angularX=v;
	});
	angularRow.add(angularX);
	var angularY=new UI.CheckboxText("Y",ap.angularY,function(v){
		ap.angularY=v;
	});
	angularRow.add(angularY);
	var angularZ=new UI.CheckboxText("Z",ap.angularZ,function(v){
		ap.angularZ=v;
	});
	angularRow.add(angularZ);
	

	
	
	
	var titlePanel=new UI.TitlePanel("Rotate Animation");
	container.add(titlePanel);

	var rotateDiv=new RotationDiv(application,{key:"rotate"});
	titlePanel.add(rotateDiv);
	
	
	var duration=new UI.NumberButtons("duration",0.1,20,10,ap.duration,function(v){
		ap.duration=v;
	},[0.1,1,10,20]);
	titlePanel.add(duration);
	
	container.add(p1);
	
	var btrow=new UI.ButtonRow("Start Rotate",function(){
		var endq=BoneUtils.makeQuaternionFromXYZDegree(rotateDiv.angleX.getValue(),rotateDiv.angleY.getValue(),rotateDiv.angleZ.getValue());
		var startq=new THREE.Quaternion();
		var halfduration=ap.duration/2;
		var clip=AnimeUtils.makeQuaternionAnimation(startq,endq,halfduration);
		
		var target=application.ball2.getMesh();
		var target=application.scene;
		
		application.ball2.syncBodyToMesh=false;//sync mesh to body
		application.ball2.syncWorldMatrix=true;
		application.ball.syncWorldMatrix=true;
		
		ap.maxDistance=0;
		//console.log(clip);
		var mixer=application.mixer;
		mixer.stopAllAction();
		mixer.uncacheClip(clip);
		mixer.clipAction(clip,target).play();
	});
	titlePanel.add(btrow);
	var stopBt=new UI.Button("Stop").onClick(function(){ap.signals.animationStopped.dispatch()});
	btrow.add(stopBt);
	
	return container;
}
