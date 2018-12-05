var Sidebar = function ( application ) {
	var ap=application
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Simple IK"));
	
	//ui
	var p1=new UI.Panel();
	var bt=new UI.Button("Do Step").onClick( function () {
		var lastJointPos=ap.mesh2.getWorldPosition(new THREE.Vector3());
		var jointPos=ap.mesh.getWorldPosition(new THREE.Vector3());
		var jointRotQ=ap.mesh.quaternion;
		var targetPos=ap.target.getWorldPosition(new THREE.Vector3());
		
		var newQ=IkUtils.stepCalculate(lastJointPos,jointPos,jointRotQ,targetPos,5);
		ap.mesh.quaternion.copy(newQ);
	} );
	p1.add(bt);
	container.add(p1);
	
	return container;
}
