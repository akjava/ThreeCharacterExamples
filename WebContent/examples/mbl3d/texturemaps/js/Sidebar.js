var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Texture Map"));
	
	var tab=new UI.Tab();
	container.add(tab);
	
	var main=tab.addItem("Main");
	main.add(new Sidebar.Model(ap));
	main.add(new Sidebar.TextureMaps(ap));
	main.add(new Sidebar.DoubleClipPlayer(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.materialChangedForTextureMaps(ap);
	
	var sub=tab.addItem("Sub");
	sub.add(new Sidebar.CameraControler(ap));
	sub.add(new Sidebar.Hair(ap));
	sub.add(new Sidebar.ShadowLight(ap));
	sub.add(new Sidebar.MaterialType(ap));
	sub.add(new Sidebar.OutlineEffect(ap));
	Logics.loadingHairFinished(ap);
	
	//tab.select("Sub");
	
	return container;
}
