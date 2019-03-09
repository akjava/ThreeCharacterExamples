var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("SecondaryAnimation Example on Scale 1"));
	
	var titlePanel=new UI.TitlePanel("Credits");
	container.add(titlePanel);
	var row=new UI.Row();
	titlePanel.add(row);
	var anchor=new UI.Anchor("https://3d.nicovideo.jp/works/td32797","Dwango");
	var license=new UI.Anchor("http://3d.nicovideo.jp/alicia/rule.html","License");
	row.add(new UI.Text("Alicia by ").setMarginRight("6px"),anchor,license.setMarginLeft("6px"));
	row.add(new UI.Description("uploaded models credits see,browser log"));
	
	container.add(new Sidebar.VrmModel(ap));
	
	var titlePanel=new UI.TitlePanel("Model Rotation");
	container.add(titlePanel);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	titlePanel.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z){
		ap.skinnedMesh.rotation.set(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z));
	});
	
	
	ap.ammoVisible=false;
	var panel=new UI.Panel();
	container.add(panel);
	panel.add(new UI.CheckboxRow("Ammo Visible",false,function(v){
		ap.ammoVisible=v;
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	}));
	panel.add(new UI.CheckboxRow("Bone Attach Visible",false,function(v){
		ap.boneAttachControler.setVisible(v);
	}));
	container.add(new Sidebar.SecondaryAnimation(ap));
	
	container.add(new Sidebar.BoneRotate(ap,false,false));
	container.add(new Sidebar.VrmVisible(ap));

	return container;
}
