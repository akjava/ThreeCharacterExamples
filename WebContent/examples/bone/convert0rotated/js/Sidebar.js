var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Convert 0 Rotated Bone"));
	
	var visiblePanel=new UI.TitlePanel("Visible");
	container.add(visiblePanel);
	var visibleOrigin=new UI.CheckboxRow("Origin Bone",ap.visibleOriginBone,function(v){
		ap.visibleOriginBone=v;
		ap.signals.boxVisibleChanged.dispatch();
	});
	visiblePanel.add(visibleOrigin);
	var visibleBone=new UI.CheckboxRow("Zero Rotated Bone",ap.visibleBone,function(v){
		ap.visibleBone=v;
		ap.signals.boxVisibleChanged.dispatch();
	});
	visiblePanel.add(visibleBone);
	
	var titleRow=new UI.TitleRow("Container Rotation");
	container.add(titleRow);
	
	var transform=new RotationPanel1(application);
	container.add(transform);
	
	ap.signals.objectRotate.add(function(){
		var angleX=transform.getAngleX();
		var angleY=transform.getAngleY();
		var angleZ=transform.getAngleZ();
		var q=BoneUtils.makeQuaternionFromXYZDegree(angleX,angleY,angleZ);
		ap.container.quaternion.copy(q);
	});
	
	
	var boneAnimation=new BoneRotateAnimationPanel(application);
	container.add(boneAnimation);
	
	return container;
}
