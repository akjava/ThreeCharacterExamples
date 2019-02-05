var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("TimeLinear Bones"));
	
	
	ap.ikControler.maxAngle=5;//change because of ikratio
	
	var meshTransform=new Sidebar.MeshTransform(ap);
	container.add(meshTransform);
	
	var exportPanel=new Sidebar.Export(ap);
	var importPanel=new Sidebar.Import(ap);
	
	container.add(exportPanel);
	container.add(importPanel);
	
	var texture=new Sidebar.Texture(application);
	container.add(texture);
	
	var timelinear=new Sidebar.TimelinearBones(application);
	container.add(timelinear);
	
	return container;
}
