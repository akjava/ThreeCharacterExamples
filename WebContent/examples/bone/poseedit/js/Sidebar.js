var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Pose Edit"));
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
    ikPanel.add(new Sidebar.IkSolve(ap));
    
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var importPanel=new Sidebar.Import(ap);
	container.add(importPanel);
	
	container.add(new Sidebar.RootTranslate(ap));
	
	var editPanel=new BoneEditPanel2(ap);
	editPanel.buttons.setDisplay("none");
	container.add(editPanel);
	
	container.add(new Sidebar.IkReset(ap));
	
	container.add(new Sidebar.IkBoneList(ap));
	
	var backgroundImagePanel=new BackgroundImagePanel(ap);
	container.add(backgroundImagePanel);
	
	var transparent=new Sidebar.Transparent(ap);
	container.add(transparent);
	
	var ground=new Sidebar.Ground(ap);
	container.add(ground);
	
	var buttonRow=new UI.ButtonRow("test",function(){
		ap.skinnedMesh.skeleton.bones[0].rotation.y=THREE.Math.degToRad(90);
		ap.skinnedMesh.skeleton.bones[1].rotation.y=THREE.Math.degToRad(90);
		ap.signals.boneRotationChanged.dispatch(0);
		ap.skinnedMesh.skeleton.bones[0].updateMatrixWorld(true);
		
		var list=ap.ikControler.boneAttachControler.containerList;
		var euler=new THREE.Euler();
		var q=new THREE.Quaternion();
		list.forEach(function(container){
			var bone=container.userData.bone;
			euler.setFromQuaternion(bone.getWorldQuaternion(q));
			//AppUtils.printDeg(euler,bone.name);
		});
	});
	container.add(buttonRow);
	
	return container;
}
