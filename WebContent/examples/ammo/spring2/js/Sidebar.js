var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Parameter Generic6dofSpring"));
	
	var springLinearPanel=new UI.Panel();
	container.add(springLinearPanel);
	var springLinearTitle=new UI.Div().setClass("title").add(new UI.Text("Spring Linear"));
	springLinearPanel.add(springLinearTitle);
	
	var linearEnabled=new UI.Row().add(new UI.Text("Enable").setWidth( '90px' ));
	springLinearPanel.add(linearEnabled)
	var linearXEnabled=new UI.CheckboxText("X",application.linearXEnabled,function(v){
		application.linearXEnabled=v;
	});
	linearEnabled.add(linearXEnabled);
	
	var linearYEnabled=new UI.CheckboxText("Y",application.linearYEnabled,function(v){
		application.linearYEnabled=v;
	});
	linearEnabled.add(linearYEnabled);
	
	var linearZEnabled=new UI.CheckboxText("Z",application.linearZEnabled,function(v){
		application.linearZEnabled=v;
	});
	linearEnabled.add(linearZEnabled);
	
	var linearXDamping=new UI.NumberButtons("X Damping",0,200,1,application.linearXDamping,function(v){
		application.linearXDamping=v;
	},[0,1,10,100]);
	springLinearPanel.add(linearXDamping);
	var linearYDamping=new UI.NumberButtons("Y Damping",0,200,1,application.linearYDamping,function(v){
		application.linearYDamping=v;
	},[0,1,10,100]);
	springLinearPanel.add(linearYDamping);
	var linearZDamping=new UI.NumberButtons("Z Damping",0,200,1,application.linearZDamping,function(v){
		application.linearZDamping=v;
	},[0,1,10,100]);
	springLinearPanel.add(linearZDamping);
	
	var linearXStiffness=new UI.NumberButtons("X Stiffness",0,200,10,application.linearXStiffness,function(v){
		application.linearXStiffness=v;
	},[0,10,50,100]);
	springLinearPanel.add(linearXStiffness);
	
	var linearYStiffness=new UI.NumberButtons("Y Stiffness",0,200,10,application.linearYStiffness,function(v){
		application.linearYStiffness=v;
	},[0,10,50,100]);
	springLinearPanel.add(linearYStiffness);
	
	var linearZStiffness=new UI.NumberButtons("Z Stiffness",0,200,10,application.linearZStiffness,function(v){
		application.linearZStiffness=v;
	},[0,10,50,100]);
	springLinearPanel.add(linearZStiffness);
	
	

	var springAngularPanel=new UI.Panel();
	container.add(springAngularPanel);
	var springAngularTitle=new UI.Div().setClass("title").add(new UI.Text("Spring Angular"));
	springAngularPanel.add(springAngularTitle);
	
	var angularEnabled=new UI.Row().add(new UI.Text("Enable").setWidth( '90px' ));
	springAngularPanel.add(angularEnabled)
	
	var angularXEnabled=new UI.CheckboxText("X",application.angularXEnabled,function(v){
		application.angularXEnabled=v;
	});
	angularEnabled.add(angularXEnabled);
	
	var angularYEnabled=new UI.CheckboxText("Y",application.angularYEnabled,function(v){
		application.angularYEnabled=v;
	});
	angularEnabled.add(angularYEnabled);
	
	var angularZEnabled=new UI.CheckboxText("Z",application.angularZEnabled,function(v){
		application.angularZEnabled=v;
	});
	angularEnabled.add(angularZEnabled);
	
	var angularXDamping=new UI.NumberButtons("X Damping",0,200,1,application.angularXDamping,function(v){
		application.angularXDamping=v;
	},[0,1,10,100]);
	springAngularPanel.add(angularXDamping);
	var angularYDamping=new UI.NumberButtons("Y Damping",0,200,1,application.angularYDamping,function(v){
		application.angularYDamping=v;
	},[0,1,10,100]);
	springAngularPanel.add(angularYDamping);
	var angularZDamping=new UI.NumberButtons("Z Damping",0,200,1,application.angularZDamping,function(v){
		application.angularZDamping=v;
	},[0,1,10,100]);
	springAngularPanel.add(angularZDamping);
	
	var angularXStiffness=new UI.NumberButtons("X Stiffness",0,200,10,application.angularXStiffness,function(v){
		application.angularXStiffness=v;
	},[0,10,50,100]);
	springAngularPanel.add(angularXStiffness);
	
	var angularYStiffness=new UI.NumberButtons("Y Stiffness",0,200,10,application.angularYStiffness,function(v){
		application.angularYStiffness=v;
	},[0,10,50,100]);
	springAngularPanel.add(angularYStiffness);
	
	var angularZStiffness=new UI.NumberButtons("Z Stiffness",0,200,10,application.angularZStiffness,function(v){
		application.angularZStiffness=v;
	},[0,10,50,100]);
	springAngularPanel.add(angularZStiffness);
	
	var constraintPanel=new UI.Panel();
	container.add(constraintPanel);
	var constraintTitle=new UI.Div().setClass("title").add(new UI.Text("Constraint"));
	constraintPanel.add(constraintTitle);
	
	var linearLimit=new UI.Panel();
	container.add(linearLimit);
	var linearLimitTitle=new UI.Div().setClass("title").add(new UI.Text("Constraint Linear Limit"));
	linearLimit.add(linearLimitTitle);
	
	var linearLimitX=new UI.NumberButtons("Limit X",0,20,5,application.linearLimitX,function(v){
		application.linearLimitX=v;
	},[0,1,5,10]);
	linearLimit.add(linearLimitX);
	var linearLimitY=new UI.NumberButtons("Limit Y",0,20,5,application.linearLimitY,function(v){
		application.linearLimitY=v;
	},[0,1,5,10]);
	linearLimit.add(linearLimitY);
	var linearLimitZ=new UI.NumberButtons("Limit Z",0,20,5,application.linearLimitZ,function(v){
		application.linearLimitZ=v;
	},[0,1,5,10]);
	linearLimit.add(linearLimitZ);
	
	var angularLimit=new UI.Panel();
	container.add(angularLimit);
	var angularLimitTitle=new UI.Div().setClass("title").add(new UI.Text("Constraint Angular Limit"));
	angularLimit.add(angularLimitTitle);
	
	var angularLimitX=new UI.NumberButtons("Limit X",0,1.58,1,application.angularLimitX,function(v){
	application.angularLimitX=v;
	},[0,0.79,1.58]);
	angularLimit.add(angularLimitX);
	var angularLimitY=new UI.NumberButtons("Limit Y",0,1.58,1,application.angularLimitY,function(v){
		application.angularLimitY=v;
	},[0,0.79,1.58]);
	angularLimit.add(angularLimitY);
	var angularLimitZ=new UI.NumberButtons("Limit Z",0,1.58,1,application.angularLimitZ,function(v){
		application.angularLimitZ=v;
	},[0,0.79,1.58]);
	angularLimit.add(angularLimitZ);
	
	var lineLength=new UI.NumberRow("Line Length",0.1,50,10,application.lineLength,function(v){
		application.lineLength=v;
	});
	constraintPanel.add(lineLength);
	
	var setBreakingTh=new UI.CheckboxRow("Set Breaking TH",application.setBreakingImpulseThreshold,function(v){
		application.setBreakingImpulseThreshold=v;
	});
	constraintPanel.add(setBreakingTh);
	
	var breakingImpulseThreshold=new UI.NumberRow("Breaking TH",0,50,10,application.breakingImpulseThreshold,function(v){
		application.breakingImpulseThreshold=v;
	});
	constraintPanel.add(breakingImpulseThreshold);

	
	var disableCollisionRow=new UI.CheckboxRow("Disable Collision",application.disableCollisionsBetweenLinkedBodies,function(v){
		application.disableCollisionsBetweenLinkedBodies=v;
	});
	constraintPanel.add(disableCollisionRow);
	
	var frameInA=new UI.CheckboxRow("FrameInA",application.frameInA,function(v){
		application.frameInA=v;
	});
	constraintPanel.add(frameInA);
	
	
	
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
	

	var mass=new UI.NumberButtons("Mass",0,100,1,application.ballMass,function(v){
		application.ballMass=v;
	},[0.1,1,10,50]);
	p1.add(mass);
	
	

	
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
	
	

	//


	
	container.add(p1);
	

	
	return container;
}
