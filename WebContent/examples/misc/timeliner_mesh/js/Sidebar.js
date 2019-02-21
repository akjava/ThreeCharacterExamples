var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Timeliner Mesh"));
	container.add(new Sidebar.TimelinerVisibleRow(ap));
	container.add(new Sidebar.TimelinerMesh(ap));
	
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	

	
	container.add(new Sidebar.MeshTransform(ap));
	Logics.loadingModelFinishedForMeshTransform(ap);
	
	container.add(new Sidebar.SimpleLight(ap));
	
	return container;
}
