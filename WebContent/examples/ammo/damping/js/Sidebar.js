var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Simple Damping"));
	
	//ui
	var p0=new UI.Panel();
	p0.add(new UI.Div().setClass("title").add(new UI.Text("Ball Damping")));
	container.add(p0);
	
	var bt=new UI.Button("New Ball").onClick( function () {

		Example.newBall(application);

	} );
	p0.add(bt);
	
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
	
	
	var p1=new UI.Panel();
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball"));
	p1.add(titleDiv);
	
	
	var zForce=new UI.NumberButtons("Force Z",0,50,10,application.zForce,function(v){
		application.zForce=v;
	},[10,25,50]);
	p1.add(zForce);
	
	var startY=new UI.NumberRow("Start Y",1,50,10,application.ballStartY,function(v){
		application.ballStartY=v;
	});
	p1.add(startY);
	
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
