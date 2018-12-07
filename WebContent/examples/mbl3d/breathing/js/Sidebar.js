var Sidebar = function ( application ) {
	var ap=application;
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Breathing Animation"));
	
	var scalePanel=new UI.TitlePanel("Animation Control");
	container.add(scalePanel);
	var row=new UI.Row();
	scalePanel.add(row);
	var bt=new UI.Button("Start All").onClick( function () {

		ap.signals.animationStarted.dispatch();

	} );
	row.add(bt);
	var bt=new UI.Button("Stop All").onClick( function () {

		ap.signals.animationStopped.dispatch();

	} );
	row.add(bt);
	
	

	var morph=new Sidebar.Morph(ap);
	container.add(morph);
	
	//for emulate softbody
	var scale=new Sidebar.Scale(ap);
	container.add(scale);
	//for emulate softbody too
	var translate=new Sidebar.Translate(ap);
	container.add(translate);
	var rotate=new Sidebar.Rotate(ap);
	container.add(rotate);
	
	var exportPanel=new Sidebar.Export(ap);
	container.add(exportPanel);
	

	return container;
}
