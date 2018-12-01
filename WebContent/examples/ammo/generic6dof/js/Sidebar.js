var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Simple Generic6dof"));
	
	
	
	var constraintPanel=new UI.Panel();
	container.add(constraintPanel);
	var constraintTitle=new UI.Div().setClass("title").add(new UI.Text("Constraint"));
	constraintPanel.add(constraintTitle);
	
	var lineLength=new UI.NumberRow("Line Length",0.1,50,10,application.lineLength,function(v){
		application.lineLength=v;
	});
	constraintPanel.add(lineLength);
	
	var limitValue=new UI.NumberButtons("Linear Limit",0,10,5,application.linearLimitValue,function(v){
		application.linearLimitValue=v;
	},[0,1,2.5,5]);
	constraintPanel.add(limitValue)
	
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
	
	var startY=new UI.NumberRow("Line Length",0.1,50,10,application.lineLength,function(v){
		application.lineLength=v;
	});
	p1.add(startY);
	
	
	

	
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
