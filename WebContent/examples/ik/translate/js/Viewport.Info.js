/**
 * @author mrdoob / http://mrdoob.com/
 */

Viewport.Info = function ( application ) {

	var signals = application.signals;

	var container = new UI.Panel();
	container.setId( 'info' );
	container.setPosition( 'absolute' );
	container.setRight( '300px' );
	container.setTop( '10px' );
	container.setFontSize( '12px' );
	container.setColor( '#fff' );
	container.setWidth('120px');
	
	container.add(new UI.Text("Many source code come from "),new UI.Break(),new UI.Anchor("https://github.com/mrdoob/three.js","Three.js"));
	

	signals.rendered.add( update );

	//
	var sharedVec=new THREE.Vector3();
	
	function update() {
		
		
	}

	return container;

};
