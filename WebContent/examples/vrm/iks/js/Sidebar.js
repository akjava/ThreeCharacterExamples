var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Vrm Iks Example"));
	
	var tab=new UI.Tab(ap);
	var main=tab.addItem("Ik");
	container.add(tab);
	
	main.add(new Sidebar.IkControl(ap));
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	
	
	

	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.VrmModel(ap));
	
	/*ap.boneAttachControlerVisible=true;
	
	panel.add(new UI.CheckboxRow("Bone Attach Visible",ap.boneAttachControlerVisible,function(v){
		ap.boneAttachControlerVisible=v;
		ap.boneAttachControler.setVisible(v);
	}));*/
	
	ap.rotationControlerVisible=false
	sub.add(new Sidebar.VrmControlerCheck(ap));
	
	var titlePanel=new UI.TitlePanel("Model Rotation");
	sub.add(titlePanel);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	titlePanel.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z){
		ap.skinnedMesh.rotation.set(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z));
	});
	
	var boneRotate=new Sidebar.BoneRotate(ap,false,false);
	sub.add(boneRotate);	
	

	sub.add(new Sidebar.BackgroundImage(ap));
	sub.add(new Sidebar.VrmCameraControler(ap));
	sub.add(new Sidebar.VrmAlphaMap(ap));
	
	var sub2=tab.addItem("Sub2");
	
	sub2.add(new Sidebar.Ground(ap));
	
	tab.select("Sub2");
	
	var vrm=tab.addItem("Vrm");
	vrm.add(new Sidebar.SecondaryAnimation(ap));
	vrm.add(new Sidebar.VrmLicense(ap));
	
	return container;
}
