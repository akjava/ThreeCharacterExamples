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
	
	
	function update(){
		var scale=100;
		var y1=ypos.getValue();
		var y2=ypos2.getValue();
		ap.camera.position.set( 0, y1*scale, 2.5*scale );
		ap.controls.target.set(0,y2*scale,0);
		ap.controls.update();
	}
	
	var ypos=new UI.NumberRow("y1",0,10,1,1,function(){
		update();
	});
	container.add(ypos);
	var ypos2=new UI.NumberRow("y2",0,10,1,1,function(){
		update();
	});
	container.add(ypos2);
	
	
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
