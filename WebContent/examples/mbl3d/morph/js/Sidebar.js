var Sidebar = function ( application ) {
	var container = new UI.Panel();
	container.setId( 'sidebar' );
	
	var div=new UI.Div();
	div.setClass("appname");
	container.add(div);
	var title=new UI.Span();
	title.dom.textContent="Test Simple Morph Animation ver 0.1";
	div.add(title);
	
	var animation=new Sidebar.Animation(application);
	container.add(animation);
	
	var camera=new Sidebar.Camera(application);
	container.add(camera);
	
	var texture=new Sidebar.Texture(application);
	container.add(texture);
	
	/*
	 * TODO support glb
	 */
	//var model=new Sidebar.Model(application);
	//container.add(model);
	
	var hair=new Sidebar.Hair(application);
	container.add(hair);
	
	var material=new Sidebar.Material(application);
	container.add(material);
	
	var light=new Sidebar.BasicLightShadow(application);
	container.add(light);
	
	return container;
}
