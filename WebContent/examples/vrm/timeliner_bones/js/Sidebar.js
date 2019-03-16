var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Vrm TimeLiner Example"));
	container.add(new Sidebar.TimelinerVisibleRow(ap));
	
	var tab=new UI.Tab(ap);
	var main=tab.addItem("Main");
	container.add(tab);
	
	main.add(new Sidebar.VrmLicense(ap));
	main.add(new Sidebar.VrmTimelinerBones(ap));
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
	
	//Logics.loadingModelFinishedForRotationControler(ap,boneFilter);
	
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
	
	if(ap.ikControlerVisible==undefined)
		ap.ikControlerVisible=true;
	panel.add(new UI.CheckboxRow("Ik Visible",ap.ikControlerVisible,function(v){
		ap.ikControlerVisible=v;
		ap.ikControler.setVisible(v);
	}));
	if(ap.translateControlerVisible==undefined)
		ap.translateControlerVisible=true;
	panel.add(new UI.CheckboxRow("Translate Visible",ap.translateControlerVisible,function(v){
		ap.translateControlerVisible=v;
		ap.translateControler.setVisible(v);
	}));
	
	var debug=new UI.ButtonRow("debug",function(){
		ap.ammoControler.printCount();
		
		AppUtils.printTotalSignalCounts(ap);
	});
	sub.add(debug);
	
	return container;
}
