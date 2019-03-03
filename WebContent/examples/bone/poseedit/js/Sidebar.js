var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Pose Edit"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	
	var main=tab.addItem("Main");
	main.add(new Sidebar.ControlerCheck(ap));
	main.add(new Sidebar.Ground(ap));
	
	
	main.add(new Sidebar.BoneRootTranslate(ap));
	var boneRotate=new Sidebar.BoneRotate(ap,true,true);
	boneRotate.add(new LRBoneRow(ap));
	main.add(boneRotate);
	var limitInfo=new IkBoneLimitInfoDiv(ap);
	boneRotate.add(limitInfo);
	
	main.add(new Sidebar.IkBoneList(ap));
	main.add(new Sidebar.RotateArmX(ap));
	
	
	var sub1=tab.addItem("Sub");
	sub1.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	sub1.add(new Sidebar.TextureMaps(ap));
	Logics.materialChangedForTextureMaps(ap);
	
	
	

	
	sub1.add(new Sidebar.DoubleClipPlayer(ap));
	
	var sub2=tab.addItem("Sub2");
	sub2.add(new Sidebar.CameraControler(ap));
	sub2.add(new Sidebar.Hair(ap));
	sub2.add(new Sidebar.ShadowLight(ap));
	sub2.add(new Sidebar.MaterialType(ap));
	sub2.add(new Sidebar.Transparent(ap));
	
	sub2.add(new Sidebar.OutlineEffect(ap));
	Logics.loadingHairFinished(ap);
	
	var importTab=tab.addItem("Import");
	importTab.add(new Sidebar.BackgroundImage(ap));
	
	//dataset.add(new Sidebar.BackgroundVideo(ap));
	importTab.add(new Sidebar.ImportPose(ap));
	
	var exportTab=tab.addItem("Export");
	exportTab.add(new Sidebar.ExportPose(ap));
	
	var finger=tab.addItem("Finger");
	finger.add(new Sidebar.RotateFingers(ap));
	
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
	
	misc.add(new Sidebar.RotateArmX(ap));
	misc.add(new Sidebar.RotateArmXTwist(ap));
	misc.add(new Sidebar.TwistRatio(ap));
	ap.twistUpdateWhenBoneRotationChanged=true;
	misc.add(new Sidebar.Debug(ap));
	
	
	
	
	
	
	return container;
}
