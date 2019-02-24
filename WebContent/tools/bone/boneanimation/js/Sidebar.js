var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Animation Editor"));
	
	container.add(new Sidebar.TimelinerVisibleRow(ap));
	
	var tab=new UI.Tab();
	container.add(tab);
	var main=tab.addItem("Main");
	main.add(
			new Sidebar.MeshTransform(ap));
	
	main.add(new Sidebar.TimelinerBones(ap));
	main.add(new Sidebar.BoneRootTranslate(ap));
	main.add(new Sidebar.BoneRotate(ap));
	

	Logics.loadingModelFinishedForMeshTransform(ap);
	
	var dataset=tab.addItem("Dataset");
	dataset.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	dataset.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	dataset.add(new Sidebar.Ground(ap));
	dataset.add(new Sidebar.BackgroundVideo(ap));
	dataset.add(new Sidebar.ImportPose(ap));
	dataset.add(new Sidebar.ExportPose(ap));
	
	
	

	
	
	tab.addItem("Material").add(
			new Sidebar.TextureMaps(ap),
			new Sidebar.MaterialType(ap)
			
			);
	Logics.materialChangedForTextureMaps(ap);

	tab.addItem("Misc").add(
			new Sidebar.ControlerCheck(ap),new Sidebar.ShadowLight(ap),new Sidebar.OutlineEffect(ap)
			);
	
	var time=tab.addItem("Time");
	time.add(new Sidebar.TimelinerControl(ap));
	
	var ik=tab.addItem("Ik");
	ik.add(new Sidebar.IkControl(ap));
	
	return container;
}
