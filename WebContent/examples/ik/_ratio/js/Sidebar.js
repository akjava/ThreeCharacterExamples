var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Ik Ratio"));
	

	
	
    var ikPanel=new Sidebar.IkLBasic(application);
    container.add(ikPanel);
    ikPanel.add(new Sidebar.IkSolve(ap));
	
	
	
	
	
	

	
	
	container.add(new Sidebar.IkReset(ap));
	
	
	var boneSelectionPanel=new Sidebar.IkRatio(ap);
	container.add(boneSelectionPanel);
	
	var IkBoneList=new Sidebar.IkBoneList(ap);
	container.add(IkBoneList);

	var iks=new Sidebar.Iks(ap);
	container.add(iks);
	
	return container;
}
