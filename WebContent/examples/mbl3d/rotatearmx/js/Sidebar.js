var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Rotate Arm X"));
	
	var tab=new UI.Tab(ap);
	container.add(tab);
	var main=tab.addItem("main");
	main.add(new Sidebar.RotateArmX(ap));
	main.add(new Sidebar.RotateArmXTwist(ap));
	
	main.add(new Sidebar.MeshRotate(ap));
	main.add(new Sidebar.IkControl(ap));
	main.add(new Sidebar.IkBasic(ap));
	main.add(new IkSolveRow(ap));
	main.add(new Sidebar.IkReset(ap));
	
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	
	
	sub.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	sub.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	sub.add(new Sidebar.SimpleLight(ap));
	return container;
}
