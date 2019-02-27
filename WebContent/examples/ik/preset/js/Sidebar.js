var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik Preset"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	main.add(new Sidebar.IkControl(ap));
	main.add(new IkRotateRow(ap));
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	main.add(new Sidebar.IkBoneList(ap));
	var boneRotate=new Sidebar.BoneRotate(ap,false);
	boneRotate.add(new LRBoneRow(ap));
	main.add(boneRotate);
	
	
	
	
	main.add(new Sidebar.IkPresetIO(ap));
	
	

	
	

	
	main.add(new Sidebar.IkPreset(ap));
	
	ap.ikControler.logging=true;
	

	Logics.transformSelectionChangedForIkPresets(ap);
	

	
	
	
	
	var sub2=tab.addItem("Sub");
	
	sub2.add(new Sidebar.MeshRotate(ap));
	sub2.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	
	
	sub2.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);

	sub2.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub2.add(new Sidebar.SimpleLight(ap));
	
	var debug=tab.addItem("Debug");
	debug.add(new Sidebar.Debug(ap));
	
	return container;
}
