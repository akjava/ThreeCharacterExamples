var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Get Bone Position"));
	
	var transform=new RotationPanel1(application);
	container.add(transform);
	
	ap.signals.objectRotate.add(function(){
		var angleX=transform.getAngleX();
		var angleY=transform.getAngleY();
		var angleZ=transform.getAngleZ();
		var q=BoneUtils.makeQuaternionFromXYZDegree(angleX,angleY,angleZ);
		ap.container.quaternion.copy(q);
	});
	
	return container;
}
