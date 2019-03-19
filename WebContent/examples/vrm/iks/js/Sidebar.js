var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Vrm Iks Example"));
	
	var tab=new UI.Tab(ap);
	var main=tab.addItem("Ik");
	container.add(tab);
	
	main.add(new Sidebar.IkControl(ap,VrmUtils.getOppositeLRName));
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	var limitInfo=new IkBoneLimitInfoDiv(ap);
	main.add(limitInfo);
	
	main.add(new Sidebar.IkBoneList(ap));
	main.add(new IkRotateRow(ap));
	main.add(new Sidebar.IkLock(ap));
	

	
	
	
	
	
	/*//TODO later
	 * 
	var ikset=tab.addItem("IkSet");
	var ikratio=new UI.TitlePanel("Ik Ratio");
	ikset.add(ikratio);
	ikratio.add(new IkRatioRow(ap));
	ikset.add(new Sidebar.IkRatioIO(ap));
	
	
	ikset.add(new Sidebar.IkBoneLimit(ap));
	ikset.add(new Sidebar.IkLimitImport(ap));
	ikset.add(new Sidebar.IkLimitExport(ap));
	
	ikset.add(new Sidebar.IkPresetIO(ap,true));
	Logics.transformSelectionChangedForIkPresets(ap);
	ikset.add(new Sidebar.IkPreset(ap));
	*/

	
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
	
	var boneRotate=new Sidebar.BoneRotate(ap,true,true);
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
