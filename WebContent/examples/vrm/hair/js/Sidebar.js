var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Hair Example"));
	
	var titlePanel=new UI.TitlePanel("Credits");
	container.add(titlePanel);
	var row=new UI.Row();
	titlePanel.add(row);
	var anchor=new UI.Anchor("https://3d.nicovideo.jp/works/td32797","Dwango");
	var license=new UI.Anchor("http://3d.nicovideo.jp/alicia/rule.html","License");
	row.add(new UI.Text("Alicia by ").setMarginRight("6px"),anchor,license.setMarginLeft("6px"));
	
	
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
	container.add(new Sidebar.Hair(ap));
	
	container.add(new Sidebar.BoneRotate(ap,false,false));
	
	var test=new UI.ButtonRow("debug",function(){
		["hair1_R","hair2_R","hair3_R","hair4_R","hair5_R","hair6_R","hair7_R","hair8_R"];
		var index=ap.boneSelectedIndex;
		var list=BoneUtils.getBoneList(ap.skinnedMesh);
		var bone=list[index];
		var sphere=ap.hairControler.findSphereByName(bone.name);
		console.log(sphere);
		AppUtils.printDeg(sphere.getMesh().rotation,"sphere:"+bone.name);
		AppUtils.printDeg(bone.rotation,bone.name);
	});
	container.add(test);
	return container;
}
