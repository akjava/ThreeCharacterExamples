var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Rotation with Euler-Order"));
	
	//TODO later
	var ik=new Sidebar.Ik(ap);
	//container.add(ik);
	
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var importPanel=new Sidebar.Import(ap);
	container.add(importPanel);
	
	var editPanel=new BoneEditPanel3(ap);
	container.add(editPanel);
	
	return container;
}
