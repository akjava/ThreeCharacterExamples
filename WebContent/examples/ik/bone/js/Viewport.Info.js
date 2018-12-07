/**
 * @author mrdoob / http://mrdoob.com/
 */

Viewport.Info = function ( application ) {
	var ap=application;
	var signals = application.signals;

	var container = new UI.Panel();
	container.setId( 'info' );
	container.setPosition( 'absolute' );
	container.setRight( '300px' );
	container.setTop( '10px' );
	container.setFontSize( '12px' );
	container.setColor( '#fff' );
	container.setWidth('180px');
	
	

	signals.rendered.add( update );

	var translate=new THREE.Vector3();
	var rotation=new THREE.Quaternion();
	var euler=new THREE.Euler();
	
	function update() {
		
		
	}

	return container;

};
