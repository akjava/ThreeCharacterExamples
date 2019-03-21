var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Vrm Multi Character Example(not working)"));
	
	var tab=new UI.Tab(ap);
	var main=tab.addItem("Main");
	container.add(tab);
	main.add(new Sidebar.TimelinerAnimationToImage(ap));
	main.add(new Sidebar.VrmCameraControler(ap));
	main.add(new Sidebar.VrmSimpleBlendShape(ap));
	
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.VrmModel(ap));

	ap.rotationControlerVisible=false
	sub.add(new Sidebar.VrmControlerCheck(ap));
	
	var titlePanel=new UI.TitlePanel("Model Rotation");
	sub.add(titlePanel);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	titlePanel.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z){
		ap.skinnedMesh.rotation.set(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z));
	});
	
	var boneRotate=new Sidebar.BoneRotate(ap,true,true);
	sub.add(boneRotate);	
	

	sub.add(new Sidebar.BackgroundImage(ap));
	sub.add(new Sidebar.VrmCameraControler(ap));
	sub.add(new Sidebar.VrmAlphaMap(ap));
	
	
	var vrm=tab.addItem("Vrm");
	vrm.add(new Sidebar.SecondaryAnimation(ap));
	vrm.add(new Sidebar.VrmLicense(ap));
	vrm.add(new Sidebar.SimpleLight(ap));
	return container;
}
