var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Rotation with Euler-Order"));
	
	container.add(new Sidebar.BoneRotateWithOrder(ap));
	
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
