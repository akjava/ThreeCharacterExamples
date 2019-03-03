Sidebar.Camera = function ( application ) {
	
	//ui
	var container=new UI.Panel();
	container.setId( 'camera' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Camera"));
	container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var bt=new UI.Button("Front").onClick( function () {

		
		application.controls.reset();
		application.camera.position.copy(application.frontPosition);
		application.controls.target.set(0,application.frontPosition.y,0);
		application.controls.update();
		

	} );
	row1.add(bt);
	
	var bt2=new UI.Button("Side").onClick( function () {

		
		application.controls.reset();
		application.camera.position.copy(application.sidePosition);
		application.controls.target.set(0,application.sidePosition.y,0);
		application.controls.update();

	} );
	row1.add(bt2);
	
	var bt3=new UI.Button("Zoom").onClick( function () {

		
		application.controls.reset();
		application.camera.position.copy(application.zoomPosition);
		application.controls.target.set(0,application.zoomPosition.y,0);
		application.controls.update();

	} );
	row1.add(bt3);
	
	return container;
	
};