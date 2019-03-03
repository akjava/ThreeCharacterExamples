var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Morph Test"));
	
	var tab=new UI.Tab();
	container.add(tab);
	var main=tab.addItem("Main");
	main.add(new Sidebar.FaceCamera(ap));
	main.add(new Sidebar.MorphTest(ap));
	
	
	var sub1=tab.addItem("Sub1");
	sub1.add(new Sidebar.Model(ap));
	sub1.add(new Sidebar.TextureMaps(ap));
	sub1.add(new Sidebar.DoubleClipPlayer(ap));
	Logics.loadingModelFinishedForBoneAttachControler(ap);
	Logics.materialChangedForTextureMaps(ap);
	
	var sub2=tab.addItem("Sub2");
	sub2.add(new Sidebar.Hair(ap));
	sub2.add(new Sidebar.ShadowLight(ap));
	sub2.add(new Sidebar.MaterialType(ap));
	sub2.add(new Sidebar.OutlineEffect(ap));
	Logics.loadingHairFinished(ap);
	
	//tab.select("Sub");
	
	return container;
}
