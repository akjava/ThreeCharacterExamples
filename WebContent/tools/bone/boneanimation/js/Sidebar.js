var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Animation Editor"));
	
	var tab=new UI.Tab();
	container.add(tab);
	tab.addItem("Main").add(
			new Sidebar.MeshTransform(ap));
	

	Logics.loadingModelFinishedForMeshTransform(ap);
	
	tab.addItem("Dataset").add(
			new Sidebar.Model(ap),
			new Sidebar.Hair(ap),
			new Sidebar.Ground(ap)
			);
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.loadingModelFinishedForTranslateControler(ap);
	Logics.loadingModelFinishedForRotationControler(ap);
	Logics.loadingModelFinishedForIkControler(ap);
	Logics.initializeAmmo(ap);
	Logics.loadingModelFinishedForBreastControler(ap);
	
	Logics.loadingHairFinished(ap);
	
	
	tab.addItem("Material").add(
			new Sidebar.TextureMaps(ap),
			new Sidebar.MaterialType(ap)
			
			);
	Logics.materialChangedForTextureMaps(ap);

	tab.addItem("Misc").add(
			new Sidebar.ControlerCheck(ap),new Sidebar.ShadowLight(ap),new Sidebar.OutlineEffect(ap)
			);
	
	tab.addItem("Time").add(
			);
	
	return container;
}
