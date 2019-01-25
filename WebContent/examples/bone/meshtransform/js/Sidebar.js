var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Mesh Transform"));
	
	
	ap.ikControler.maxAngle=5;//change because of ikratio
	
	var meshTransform=new Sidebar.MeshTransform(ap);
	container.add(meshTransform);
	
	
	return container;
}
