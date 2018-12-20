var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Pose Edit"));
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
    ikPanel.add(new Sidebar.IkSolve(ap));
    
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var importPanel=new Sidebar.Import(ap);
	container.add(importPanel);
	
	container.add(new Sidebar.RootTranslate(ap));
	
	var editPanel=new BoneEditPanel2(ap);
	editPanel.buttons.setDisplay("none");
	container.add(editPanel);
	
	container.add(new Sidebar.IkReset(ap));
	
	container.add(new Sidebar.IkBoneList(ap));
	
	var backgroundImagePanel=new BackgroundImagePanel(ap);
	container.add(backgroundImagePanel);
	
	var transparent=new Sidebar.Transparent(ap);
	container.add(transparent);
	
	var ground=new Sidebar.Ground(ap);
	container.add(ground);
	
	
	return container;
}
