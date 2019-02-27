var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Rotate Arm X"));
	
	
	container.add(new Sidebar.RotateArmX(ap));
	container.add(new Sidebar.MeshRotate(ap));
	container.add(new Sidebar.IkControl(ap));
	container.add(new Sidebar.IkBasic(ap));
	container.add(new IkSolveRow(ap));
	container.add(new Sidebar.IkReset(ap));
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	container.add(new Sidebar.SimpleLight(ap));
	return container;
}
