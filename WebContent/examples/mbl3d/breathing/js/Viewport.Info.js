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
	container.setWidth('160px');
	
	var morphText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var scaleText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var translateText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var rotateText = new UI.Text( '0' ).setMarginLeft( '6px' );

	container.add( new UI.Text( 'Morph Duration' ).setWidth("100px"), morphText, new UI.Break() );
	container.add( new UI.Text( 'Scale Duration' ).setWidth("100px"), scaleText, new UI.Break() );
	container.add( new UI.Text( 'Translate Duration' ).setWidth("100px"), translateText, new UI.Break() );
	container.add( new UI.Text( 'Rotate Duration' ).setWidth("100px"), rotateText, new UI.Break() );
	container.add( new UI.Break() , new UI.Break() );
	container.add(new UI.Text("3D Character is created by "),new UI.Break(),new UI.Anchor("http://www.manuelbastioni.com/","Manuel Bastioni"));
	container.add( new UI.Break() , new UI.Break() );
	container.add(new UI.Text("Many source code based on "),new UI.Break(),new UI.Anchor("https://github.com/mrdoob/three.js/tree/dev/editor","Three.js Editor"));
	

	signals.rendered.add( update );

	//
	var sharedVec=new THREE.Vector3();
	
	function update() {
		
		
		morphText.setValue( ap.morphClipDuration.toFixed(2) );
		scaleText.setValue( ap.scaleClipDuration.toFixed(2) );
		translateText.setValue( ap.translateClipDuration.toFixed(2) );
		rotateText.setValue( ap.rotateClipDuration.toFixed(2) );
		
	}

	return container;

};
