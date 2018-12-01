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
	
	var posXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var posYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var posZText = new UI.Text( '0' ).setMarginLeft( '6px' );

	container.add( new UI.Text( 'Pos-X' ), posXText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Y' ), posYText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Z' ), posZText, new UI.Break() );
	

	signals.rendered.add( update );

	//
	var sharedVec=new THREE.Vector3();
	
	function update() {
		if(application.ball==undefined){
			return;
		}
		var x=application.ball.getMesh().position.x;
		var y=application.ball.getMesh().position.y;
		var z=application.ball.getMesh().position.z;
		
		posXText.setValue( x.toFixed(2) );
		posYText.setValue( y.toFixed(2) );
		posZText.setValue( z.toFixed(2) );
		
	}

	return container;

};
