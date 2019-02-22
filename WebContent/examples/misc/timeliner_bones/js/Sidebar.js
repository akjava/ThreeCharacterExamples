var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Timeliner Bones"));
	container.add(new Sidebar.TimelinerVisibleRow(ap));
	
	
	ap.ikControler=new IkControler(undefined,ap);
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	
	var main=tab.addItem("Main");
	main.add(new Sidebar.TimelinerBones(ap));
	main.add(new Sidebar.BoneRootTranslate(ap));
	main.add(new Sidebar.BoneRotate(ap));
	
	var ik=tab.addItem("Ik");
	ik.add(new Sidebar.IkBasic(ap));
	ik.add(new Sidebar.IkReset(ap));
	
	var sub1=tab.addItem("Sub1");
	sub1.add(new Sidebar.ImportPose(ap));
	sub1.add(new Sidebar.ExportPose(ap));
	sub1.add(new Sidebar.CameraControler(ap));
	sub1.add(new Sidebar.ControlerCheck(ap));
	
	tab.addItem("Sub2").add(
			new Sidebar.Model(ap),
			new Sidebar.Texture(ap),
			new Sidebar.Hair(ap),
			new Sidebar.SimpleLight(ap)
			);
	
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	Logics.materialChangedForSimple(ap);
	
	Logics.loadingHairFinished(ap);
	

	
	
	return container;
}
