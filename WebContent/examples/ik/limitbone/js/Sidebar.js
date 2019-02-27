var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Limit Ik Bone"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("Main");
	
	main.add(new Sidebar.IkControl(ap));
	main.add(new IkRotateRow(ap));
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	var boneLimit=new Sidebar.IkBoneLimit(ap);
	boneLimit.logging=true;
	main.add(boneLimit);
	
	main.add(new Sidebar.IkLimitImport(ap));
	
	main.add(new Sidebar.IkBoneList(ap));
	var boneRotate=new Sidebar.BoneRotate(ap);
	boneRotate.add(new LRBoneRow(ap));
	main.add(boneRotate);
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.IkLimitList(ap));
	
	sub.add(new Sidebar.IkLimitExport(ap));
	
	
	var sub2=tab.addItem("Sub2");
	
	sub2.add(new Sidebar.MeshRotate(ap));
	sub2.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	
	
	sub2.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);

	sub2.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub2.add(new Sidebar.SimpleLight(ap));
	return container;
}
