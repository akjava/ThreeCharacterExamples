var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Turn Arm"));
	
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
    ikPanel.add(new Sidebar.IkSolve(ap));
    
    
	
	container.add(new Sidebar.IkReset(ap));
	
	container.add(new Sidebar.IkBoneList(ap));
	
	container.add(new Sidebar.TurnArm(ap));
	
	return container;
}
