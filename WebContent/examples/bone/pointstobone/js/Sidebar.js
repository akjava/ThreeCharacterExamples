var Sidebar = function ( application ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );
	container.add(new UI.AppName("Points To Bone"));
	
	//ui
	var p1=new UI.Panel();
	var bt=new UI.Button("hello").onClick( function () {

		console.log("hello")

	} );
	p1.add(bt);
	container.add(p1);
	
	return container;
}
