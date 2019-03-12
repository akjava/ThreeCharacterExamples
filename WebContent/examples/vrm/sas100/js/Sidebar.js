var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("SecondaryAnimation Example on Scale 100"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	
	main.add(new Sidebar.VrmLicense(ap));
	main.add(new Sidebar.VrmModel(ap));
	
	var titlePanel=new UI.TitlePanel("Model Rotation");
	main.add(titlePanel);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	titlePanel.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z){
		ap.skinnedMesh.rotation.set(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z));
	});
	
	
	ap.ammoVisible=false;
	var panel=new UI.Panel();
	main.add(panel);
	panel.add(new UI.CheckboxRow("Ammo Visible",false,function(v){
		ap.ammoVisible=v;
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	}));
	panel.add(new UI.CheckboxRow("Bone Attach Visible",false,function(v){
		ap.boneAttachControler.setVisible(v);
	}));
	main.add(new Sidebar.SecondaryAnimation(ap));
	
	var sub=tab.addItem("Sub");
	
	sub.add(new Sidebar.Ammo(ap));
	sub.add(new Sidebar.BoneRotate(ap,false,false));
	sub.add(new Sidebar.VrmVisible(ap));

	return container;
}
