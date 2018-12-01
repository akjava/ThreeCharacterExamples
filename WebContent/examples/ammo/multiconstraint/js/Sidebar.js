var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Multi constraint"));
	
	var p1=new UI.Panel();
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball"));
	p1.add(titleDiv);

	
	
	var p3=new UI.Panel();
	container.add(p3);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Constraint"));
	p3.add(titleDiv);
	
	var disableCollisionRow=new UI.CheckboxRow("Disable Collision",application.disableCollisionsBetweenLinkedBodies,function(v){
		application.disableCollisionsBetweenLinkedBodies=v;
	});
	p3.add(disableCollisionRow);
	
	var frameInA=new UI.CheckboxRow("FrameInA",application.frameInA,function(v){
		application.frameInA=v;
	});
	p3.add(frameInA);
	
	var startY=new UI.NumberRow("Line Length",0.1,50,10,application.lineLength,function(v){
		application.lineLength=v;
	});
	p3.add(startY);
	
	
	
	var limitValue=new UI.NumberButtons("Linear Limit",0,10,5,application.linearLimitValue,function(v){
		application.linearLimitValue=v;
	},[0,1,2.5,5]);
	p3.add(limitValue)
	
	

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
	
	var bt=new UI.Button("New Ball").onClick( function () {

		Example.newBall(application);

	} );
	p1.add(bt);
	
	var xForce=new UI.NumberButtons("Force X",0,50,10,application.xForce,function(v){
		application.xForce=v;
	},[0,10,25,50]);
	p1.add(xForce);
	var yForce=new UI.NumberButtons("Force Y",0,50,10,application.yForce,function(v){
		application.yForce=v;
	},[0,10,25,50]);
	p1.add(yForce);
	var zForce=new UI.NumberButtons("Force Z",0,50,10,application.zForce,function(v){
		application.zForce=v;
	},[0,10,25,50]);
	p1.add(zForce);
	

	
	
	

	
	
	
	

	
	var ballFriction=new UI.NumberButtons("Friction",0,10,1,application.ballFriction,function(v){
		application.ballFriction=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	p1.add(ballFriction);
	
	var ballRestitution=new UI.NumberButtons("Restituion",0,10,1,application.ballRestitution,function(v){
		application.ballRestitution=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.5,1]);
	p1.add(ballRestitution);
	


	container.add(p1);
	
	var p2=new UI.Panel();
	container.add(p2);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ground"));
	p2.add(titleDiv);
	

	var groundFriction=new UI.NumberButtons("Friction",0,10,1,application.groundFriction,function(v){
		application.groundFriction=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.1,0.5,1]);
	p2.add(groundFriction);
	
	var groundRestitution=new UI.NumberButtons("Restituion",0,10,1,application.groundRestitution,function(v){
		application.groundRestitution=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.5,1]);
	p2.add(groundRestitution);


	
	return container;
}
