var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	container.add(new UI.AppName("Simple Restituion"));
	
	//ui
	var p1=new UI.Panel();
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ball"));
	p1.add(titleDiv);
	var bt=new UI.Button("New Ball").onClick( function () {

		Example.newBall(application);

	} );
	p1.add(bt);
	
	var startY=new UI.NumberRow("StartY",0,50,10,application.ballStartY,function(v){
		application.ballStartY=v;
	});
	p1.add(startY);
	
	var ballRestitution=new UI.NumberButtons("Restituion",0,10,1,application.ballRestitution,function(v){
		application.ballRestitution=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.5,1]);
	p1.add(ballRestitution);
	ballRestitution.number.setPrecision(2);
	
	container.add(p1);
	

	var p2=new UI.Panel();
	container.add(p2);
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Ground"));
	p2.add(titleDiv);
	

	
	var groundRestitution=new UI.NumberButtons("Restituion",0,10,1,application.groundRestitution,function(v){
		application.groundRestitution=v;
		application.signals.ammoSettingUpdated.dispatch();
	},[0,0.5,1]);
	p2.add(groundRestitution);
	groundRestitution.number.setPrecision(2);
	
	return container;
}
