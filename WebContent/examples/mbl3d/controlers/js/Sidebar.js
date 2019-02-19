var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Controlers"));
	
	container.add(new Sidebar.ControlerCheck(ap));
	container.add(new Sidebar.Model(ap));
	container.add(new Sidebar.Texture(ap));
	container.add(new Sidebar.Hair(ap));
	
	container.add(new Sidebar.MeshTransform(ap));
	
	container.add(new Sidebar.ClipPlayer(ap));
	
	
	
	return container;
}
