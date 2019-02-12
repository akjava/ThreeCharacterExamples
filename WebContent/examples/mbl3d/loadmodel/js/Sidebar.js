var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Load Model"));
	
	container.add(new Sidebar.Model(ap));
	container.add(new Sidebar.Texture(ap));
	container.add(new Sidebar.Hair(ap));
	container.add(new Sidebar.ClipPlayer(ap));
	
	return container;
}
