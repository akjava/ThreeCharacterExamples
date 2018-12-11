var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Bone Rotation Control  with Twist"));
	
	//TODO later
	var ik=new Sidebar.Ik(ap);
	//container.add(ik);
	
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	
	var importPanel=new Sidebar.Import(ap);
	container.add(importPanel);
	
	var editPanel=new BoneEditPanel2(ap);
	container.add(editPanel);
	
	
	var twistPanel=new Sidebar.TwistSwitch(ap);
	container.add(twistPanel);
	var twistEditor=new Sidebar.TwistEditor(ap);
	container.add(twistEditor);
	
	var twistAutoupdate=new Sidebar.TwistAutoupdate(ap);
	container.add(twistAutoupdate);
	
	return container;
}
