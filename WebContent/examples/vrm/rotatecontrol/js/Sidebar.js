var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("SecondaryAnimation Example on Scale 100"));
	
	var tab=new UI.Tab(ap);
	var main=tab.addItem("Main");
	container.add(tab);
	
	var titlePanel=new UI.TitlePanel("Credits");
	main.add(titlePanel);
	var row=new UI.Row();
	titlePanel.add(row);
	var anchor=new UI.Anchor("https://3d.nicovideo.jp/works/td32797","Dwango");
	var license=new UI.Anchor("http://3d.nicovideo.jp/alicia/rule.html","License");
	row.add(new UI.Text("Alicia by ").setMarginRight("6px"),anchor,license.setMarginLeft("6px"));
	row.add(new UI.Description("uploaded models credits see,browser log"));
	
	main.add(new Sidebar.VrmModel(ap));
	
	var titlePanel=new UI.TitlePanel("Model Rotation");
	main.add(titlePanel);
	var absoluteRotateDiv=new AbsoluteRotateDiv(ap);
	titlePanel.add(absoluteRotateDiv);
	ap.getSignal("objectRotated").add(function(x,y,z){
		ap.skinnedMesh.rotation.set(THREE.Math.degToRad(x),THREE.Math.degToRad(y),THREE.Math.degToRad(z));
	});
	
	
	ap.ammoVisible=false;
	
	var boneRotate=new Sidebar.BoneRotate(ap,false,false);
	main.add(boneRotate);	
	main.add(new Sidebar.BoneRotateAnimationPanel(ap));
	
	/*boneRotate.setGetBoneList(function(){
		return ap.skinnedMesh.humanoidSkeleton.bones;
	});*/
	
	
	
	var boneFilter=function(bone){
		//initialized on loadingModelFinished#101
		return ap.humanoidBoneNameList.indexOf(bone.name)!=-1;
	}
	
	Logics.loadingModelFinishedForRotationControler(ap,boneFilter);
	
	main.add(new Sidebar.VrmAlphaMap(ap));

	
	var sub=tab.addItem("Sub");
	var panel=new UI.Panel();
	sub.add(panel);
	panel.add(new UI.CheckboxRow("Ammo Visible",false,function(v){
		ap.ammoVisible=v;
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	}));
	
	ap.rotationControlerVisible=true;
	
	panel.add(new UI.CheckboxRow("Rotate Visible",ap.rotationControlerVisible,function(v){
		ap.rotationControlerVisible=v;
		ap.rotationControler.setVisible(v);
	}));
	sub.add(new Sidebar.SecondaryAnimation(ap));
	return container;
}
