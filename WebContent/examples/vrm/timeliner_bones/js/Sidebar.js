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

	
	/*ap.boneAttachControlerVisible=true;
	
	panel.add(new UI.CheckboxRow("Bone Attach Visible",ap.boneAttachControlerVisible,function(v){
		ap.boneAttachControlerVisible=v;
		ap.boneAttachControler.setVisible(v);
	}));*/
	
	sub.add(new Sidebar.VrmControlerCheck(ap));
	
	sub.add(new Sidebar.SecondaryAnimation(ap));
	
	sub.add(new Sidebar.TimelinerAnimationToImage(ap));
	sub.add(new Sidebar.Ground(ap));
	sub.add(new Sidebar.BackgroundImage(ap));
	sub.add(new Sidebar.VrmCameraControler(ap));
	
	var debug=new UI.ButtonRow("debug signals",function(){
		ap.ammoControler.printCount();
		
		AppUtils.printTotalSignalCounts(ap);
	});
	sub.add(debug);
	
	tab.select("Sub");
	
	return container;
}
