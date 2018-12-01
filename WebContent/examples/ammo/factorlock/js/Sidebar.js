var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Factor Lock"));
	
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
	
	var frameInAPos=new UI.CheckboxRow("Set FrameInA Pos",application.frameInAPos,function(v){
		application.frameInAPos=v;
	});
	constraintPanel.add(frameInAPos);
	
	var lockRoot=new UI.CheckboxRow("Lock Linear Root Ball",application.lockRoot,function(v){
		application.lockRoot=v;
	});
	constraintPanel.add(lockRoot);
	
	var lockEdge=new UI.CheckboxRow("Lock Angular Edge Ball",application.lockEdge,function(v){
		application.lockEdge=v;
	});
	constraintPanel.add(lockEdge);
	
	var p1=new UI.Panel();
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball"));
	p1.add(titleDiv);
	
	var ballMass=new UI.NumberButtons("Ball mass",0.01,10,1,application.ballMass,function(v){
		application.ballMass=v;
	},[0.1,1,10]);
	p1.add(ballMass);

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
	
	

	

	
	container.add(p1);
	


	
	return container;
}
