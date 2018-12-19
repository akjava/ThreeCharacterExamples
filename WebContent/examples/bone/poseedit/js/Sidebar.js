var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Pose Edit"));
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
    
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var importPanel=new Sidebar.Import(ap);
	container.add(importPanel);
	
	var editPanel=new BoneEditPanel2(ap);
	container.add(editPanel);
	
	var backgroundImagePanel=new BackgroundImagePanel(ap);
	container.add(backgroundImagePanel);
	
	var transparent=new Sidebar.Transparent(ap);
	container.add(transparent);
	
	return container;
}
