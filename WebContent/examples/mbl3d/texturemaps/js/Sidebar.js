var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Texture Map"));
	
	container.add(new Sidebar.Model(ap));
	container.add(new Sidebar.TextureMaps(ap));
	
	container.add(new Sidebar.Hair(ap));
	container.add(new Sidebar.ClipPlayer(ap));
	
	return container;
}
