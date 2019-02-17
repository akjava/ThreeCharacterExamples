var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Texture Map"));
	
	var tab=new UI.Tab();
	container.add(tab);
	tab.addItem("Main").add(
			new Sidebar.Model(ap),
			new Sidebar.TextureMaps(ap),
			new Sidebar.ClipPlayer(ap)
			);
	
	
	tab.addItem("Sub").add(
			new Sidebar.CameraControler(ap),
			new Sidebar.Hair(ap),
			new Sidebar.ShadowLight(ap),
			new Sidebar.MaterialType(ap),
			new Sidebar.OutlineEffect(ap)
			);
	
	//tab.select("Sub");
	
	return container;
}
