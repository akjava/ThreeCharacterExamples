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
	
	var rotXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var rotYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var rotZText = new UI.Text( '0' ).setMarginLeft( '6px' );

	container.add( new UI.Text( 'Breast' ),  new UI.Break() , new UI.Break() );
	container.add( new UI.Text( 'Pos-X' ), posXText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Y' ), posYText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Z' ), posZText, new UI.Break() );
	
	container.add( new UI.Text( 'Rot-X' ), rotXText, new UI.Break() );
	container.add( new UI.Text( 'Rot-Y' ), rotYText, new UI.Break() );
	container.add( new UI.Text( 'Rot-Z' ), rotZText, new UI.Break() );
	
	var sprineposXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var sprineposYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var sprineposZText = new UI.Text( '0' ).setMarginLeft( '6px' );
	
	var sprinerotXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var sprinerotYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var sprinerotZText = new UI.Text( '0' ).setMarginLeft( '6px' );
	
	var distanceText = new UI.Text( '0' ).setMarginLeft( '6px' );
	
	container.add( new UI.Break() , new UI.Break() );
	
	container.add( new UI.Text( 'Sprine' ),  new UI.Break() , new UI.Break() );
	container.add( new UI.Text( 'Pos-X' ), sprineposXText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Y' ), sprineposYText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Z' ), sprineposZText, new UI.Break() );
	
	container.add( new UI.Text( 'Rot-X' ), sprinerotXText, new UI.Break() );
	container.add( new UI.Text( 'Rot-Y' ), sprinerotYText, new UI.Break() );
	container.add( new UI.Text( 'Rot-Z' ), sprinerotZText, new UI.Break() );
	container.add( new UI.Break() , new UI.Break() );
	container.add( new UI.Text( 'Distance' ), distanceText, new UI.Break() );
	container.add( new UI.Break() , new UI.Break() );
	container.add(new UI.Text("3D Character is created by "),new UI.Break(),new UI.Anchor("http://www.manuelbastioni.com/","Manuel Bastioni"));
	container.add( new UI.Break() , new UI.Break() );
	container.add(new UI.Text("Many source code based on "),new UI.Break(),new UI.Anchor("https://github.com/mrdoob/three.js/tree/dev/editor","Three.js Editor"));
	
	
	
	

	signals.rendered.add( update );

	//
	var sharedVec=new THREE.Vector3();
	
	function update() {
		if(application.breastBox==undefined){
			return;
		}
		var x=application.breastBox.getMesh().position.x;
		var y=application.breastBox.getMesh().position.y;
		var z=application.breastBox.getMesh().position.z;
		
		posXText.setValue( x.toFixed(2) );
		posYText.setValue( y.toFixed(2) );
		posZText.setValue( z.toFixed(2) );
		
		var x=THREE.Math.radToDeg(application.breastBox.getMesh().rotation.x);
		var y=THREE.Math.radToDeg(application.breastBox.getMesh().rotation.y);
		var z=THREE.Math.radToDeg(application.breastBox.getMesh().rotation.z);
	
		rotXText.setValue( x.toFixed(2) );
		rotYText.setValue( y.toFixed(2) );
		rotZText.setValue( z.toFixed(2) );
		
		var x=application.sprineBox.getMesh().position.x;
		var y=application.sprineBox.getMesh().position.y;
		var z=application.sprineBox.getMesh().position.z;
		
		sprineposXText.setValue( x.toFixed(2) );
		sprineposYText.setValue( y.toFixed(2) );
		sprineposZText.setValue( z.toFixed(2) );
		
		var x=THREE.Math.radToDeg(application.sprineBox.getMesh().rotation.x);
		var y=THREE.Math.radToDeg(application.sprineBox.getMesh().rotation.y);
		var z=THREE.Math.radToDeg(application.sprineBox.getMesh().rotation.z);
	
		sprinerotXText.setValue( x.toFixed(2) );
		sprinerotYText.setValue( y.toFixed(2) );
		sprinerotZText.setValue( z.toFixed(2) );
		
		
		var distance=application.sprineBox.getMesh().position.distanceTo(application.breastBox.getMesh().position);
		
		distanceText.setValue( distance.toFixed(2) );
	}

	return container;

};
