Sidebar.VrmFaceCamera = function ( application ) {
	var ap=application;
	//ui
	var container=new UI.Panel();
	container.setId( 'camera' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Camera"));
	container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	this.frontPosition=new THREE.Vector3(0, 125, -225);
	this.sidePosition=new THREE.Vector3(60, 150,-80);
	this.zoomPosition=new THREE.Vector3(0, 150, -60);
	var scope=this;
	var bt=new UI.Button("Far").onClick( function () {

		
		application.controls.reset();
		application.camera.position.copy(scope.frontPosition);
		application.controls.target.set(0,90,0);
		application.controls.update();
		

	} );
	row1.add(bt);
	
	
	var bt2=new UI.Button("Quarter").onClick( function () {

		
		application.controls.reset();
		application.camera.position.copy(scope.sidePosition);
		application.controls.target.set(0,scope.sidePosition.y,0);
		application.controls.update();

	} );
	row1.add(bt2);
	
	var bt3=new UI.Button("Front").onClick( function () {

		updateZoom()

	} );
	row1.add(bt3);
	
	function updateZoom(){

		application.controls.reset();
		application.camera.position.copy(scope.zoomPosition);
		application.controls.target.set(0,scope.zoomPosition.y,0);
		application.controls.update();
	}
	updateZoom();
	
	ap.getSignal("cameraControlerChanged").add(function(cpos,tpos){
	
		application.camera.position.copy(cpos);
		application.controls.target.copy(tpos);
		application.controls.update();
	})
	
	
	return container;
	
};