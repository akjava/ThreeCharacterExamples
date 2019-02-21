var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Controlers"));
	
	container.add(new Sidebar.ControlerCheck(ap));
	
	container.add(new Sidebar.Model(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	
	container.add(new Sidebar.Texture(ap));
	Logics.materialChangedForSimple(ap);
	
	container.add(new Sidebar.Hair(ap));
	Logics.loadingHairFinished(ap);
	
	container.add(new Sidebar.MeshTransform(ap));
	Logics.loadingModelFinishedForMeshTransform(ap);
	
	container.add(new Sidebar.ClipPlayer(ap));
	container.add(new Sidebar.SimpleLight(ap));
	
	
	return container;
}
