var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("SecondaryAnimation Example on Scale 100"));
	
	var tab=new UI.Tab(ap);
	var main=tab.addItem("Main");
	container.add(tab);
	
	
	main.add(new Sidebar.VrmLicense(ap));
	main.add(new Sidebar.VrmModel(ap));
	
	main.add(new Sidebar.VrmChangeMaterial(ap));
	
	var titlePanel=new UI.TitlePanel("Model Rotation");
	main.add(titlePanel);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	titlePanel.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z){
		ap.skinnedMesh.rotation.set(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z));
		ap.getSignal("meshTransformChanged").dispatch();
	});
	
	
	ap.ammoVisible=false;
	
	
	
	main.add(new Sidebar.BoneRotate(ap,false,false));
	main.add(new Sidebar.VrmAlphaMap(ap));
	main.add(new Sidebar.VrmTextureDownload(ap));
	main.add(new Sidebar.VrmMorphTarget(ap));
	
	var sub=tab.addItem("Sub");
	var panel=new UI.Panel();
	sub.add(panel);
	panel.add(new UI.CheckboxRow("Ammo Visible",false,function(v){
		ap.ammoVisible=v;
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	}));
	sub.add(new Sidebar.SecondaryAnimation(ap));
	sub.add(new Sidebar.SimpleLight(ap));
	
	
	return container;
}
