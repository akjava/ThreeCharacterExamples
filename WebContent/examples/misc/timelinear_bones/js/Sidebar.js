var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("TimeLiner Bones"));
	
	
	ap.ikControler.maxAngle=5;//change because of ikratio
	
	var visible=true;
	var bt=new UI.ButtonRow("TimeLiner Switch Show/Hide",function(){
		visible=!visible;
		ap.timeliner.setVisible(visible);
	});
	container.add(bt);
	
	
	container.add(new Sidebar.CameraControler(ap));
	
	
	
	var meshTransform=new Sidebar.MeshTransform(ap);
	container.add(meshTransform);
	
	var exportPanel=new Sidebar.Export(ap);
	var importPanel=new Sidebar.Import(ap);
	
	container.add(exportPanel);
	container.add(importPanel);
	
	var texture=new Sidebar.Texture(application);
	container.add(texture);
	
	var timeliner=new Sidebar.TimelinerBones(application);
	container.add(timeliner);
	
	var timelinerClipExport=new Sidebar.TimelinerClipExport(application);
	container.add(timelinerClipExport);
	
	return container;
}
