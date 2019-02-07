var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Rotation Control"));
	
	var transform=new RotationPanel1(application);
	container.add(transform);
	
	//catching RotationPanel1
	ap.signals.objectRotated.add(function(){
		var angleX=transform.getAngleX();
		var angleY=transform.getAngleY();
		var angleZ=transform.getAngleZ();
		var q=BoneUtils.makeQuaternionFromXYZDegree(angleX,angleY,angleZ);
		ap.skinnedMesh.quaternion.copy(q);
	});
	
	
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var importPanel=new Sidebar.Import(ap);
	container.add(importPanel);
	
	var editPanel=new BoneEditPanel2(ap);
	container.add(editPanel);
	
	return container;
}
