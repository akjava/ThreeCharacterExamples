var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik EndSite"));
	

	
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
    ikPanel.add(new Sidebar.IkSolve(ap));
	
	
	
	
	
	

	
	
	container.add(new Sidebar.IkReset(ap));
	

	var iks=new Sidebar.Iks(ap);
	container.add(iks);
	
	return container;
}
