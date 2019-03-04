var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Animation Editor"));
	
	container.add(new Sidebar.TimelinerVisibleRow(ap));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	
	var main=tab.addItem("Main");
	main.add(new Sidebar.ControlerCheck(ap));
	main.add(new Sidebar.Ground(ap));
	

	main.add(new Sidebar.TimelinerBones(ap));
	
	var boneRotate=new Sidebar.BoneRotate(ap,true,true);
	boneRotate.add(new LRBoneRow(ap));
	main.add(boneRotate);
	var limitInfo=new IkBoneLimitInfoDiv(ap);
	boneRotate.add(limitInfo);
	
	main.add(new Sidebar.IkBoneList(ap));
	
	
	
	var sub1=tab.addItem("Mat");
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	sub1.add(new Sidebar.TextureMaps(ap));
	Logics.materialChangedForTextureMaps(ap);
	
	sub1.add(new Sidebar.MaterialType(ap));
	sub1.add(new Sidebar.OutlineEffect(ap));

	
	//sub1.add(new Sidebar.DoubleClipPlayer(ap));
	
	var sub2=tab.addItem("Sub2");
	sub2.add(new Sidebar.CameraControler(ap));
	sub2.add(new Sidebar.Hair(ap));
	sub2.add(new Sidebar.ShadowLight(ap));
	
	sub2.add(new Sidebar.Transparent(ap));
	
	
	Logics.loadingHairFinished(ap);
	
	var importTab=tab.addItem("Import");
	importTab.add(new Sidebar.Model(ap));
	importTab.add(new Sidebar.BackgroundVideo(ap));
	
	//dataset.add(new Sidebar.BackgroundVideo(ap));
	importTab.add(new Sidebar.ImportPose(ap));
	
	var exportTab=tab.addItem("Export");
	exportTab.add(new Sidebar.ExportPose(ap));
	
	//var finger=tab.addItem("Finger");
	//finger.add(new Sidebar.RotateFingers(ap));
	
	var ik=tab.addItem("Ik");
	ik.add(new Sidebar.IkControl(ap));
	ik.add(new IkRotateRow(ap));
	ik.add(new Sidebar.IkBasic(ap));
	ik.add(new IkSolveRow(ap));
	ik.add(new Sidebar.IkReset(ap));
	ik.add(new Sidebar.IkLock(ap));
	
	
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
	
	var misc=tab.addItem("Misc");
	misc.add(new Sidebar.MeshTransform(ap));
	Logics.loadingModelFinishedForMeshTransform(ap);
	
	misc.add(new Sidebar.BoneRootTranslate(ap));
	
	
	
	misc.add(new Sidebar.RotateArmX(ap));
	misc.add(new Sidebar.RotateArmXTwist(ap));
	ap.twistUpdateWhenBoneRotationChanged=true;
	misc.add(new Sidebar.TwistRatio(ap));

	var misc2=tab.addItem("Misc2");
	misc2.add(new Sidebar.Grid(ap));
	misc2.add(new Sidebar.Guide(ap));
	
	sub2.add(new Sidebar.Debug(ap));
	
	var time=tab.addItem("Time");
	time.add(new Sidebar.TimelinerControl(ap));
	
	
	return container;
}
