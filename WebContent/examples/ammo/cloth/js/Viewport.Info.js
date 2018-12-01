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
	container.setWidth('140px');
	
	var bodyText=new UI.Text( '0' ).setMarginLeft( '6px' );
	var constraintText=new UI.Text( '0' ).setMarginLeft( '6px' );


	var gravityText= new UI.Text( '0,-10,0' ).setMarginLeft( '6px' );//TODO modify
	
	var posXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var posYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var posZText = new UI.Text( '0' ).setMarginLeft( '6px' );
	
	
	var linearXText=new UI.Text( '0' ).setMarginLeft( '6px' );
	var linearYText=new UI.Text( '0' ).setMarginLeft( '6px' );
	var linearZText=new UI.Text( '0' ).setMarginLeft( '6px' );
	
	var angularXText=new UI.Text( '0' ).setMarginLeft( '6px' );
	var angularYText=new UI.Text( '0' ).setMarginLeft( '6px' );
	var angularZText=new UI.Text( '0' ).setMarginLeft( '6px' );
	
	container.add( new UI.Text( 'Body-Count' ), bodyText, new UI.Break() );
	container.add( new UI.Text( 'Constraint-Count' ), constraintText, new UI.Break() );
	container.add( new UI.Break());
	
	container.add( new UI.Text( 'Gravity' ), gravityText, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'Pos-X' ), posXText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Y' ), posYText, new UI.Break() );
	container.add( new UI.Text( 'Pos-Z' ), posZText, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'Linear-X' ), linearXText, new UI.Break() );
	container.add( new UI.Text( 'Linear-Y' ), linearYText, new UI.Break() );
	container.add( new UI.Text( 'Linear-Z' ), linearZText, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'Angular-X' ), angularXText, new UI.Break() );
	container.add( new UI.Text( 'Angular-Y' ), angularYText, new UI.Break() );
	container.add( new UI.Text( 'Angular-Z' ), angularZText, new UI.Break() );

	signals.rendered.add( update );

	//
	var sharedVec=new THREE.Vector3();
	
	function update() {
		if(application.lastParticle==undefined){
			return;
		}
		var x=application.lastParticle.getMesh().position.x;
		var y=application.lastParticle.getMesh().position.y;
		var z=application.lastParticle.getMesh().position.z;
		
		posXText.setValue( x.toFixed(2) );
		posYText.setValue( y.toFixed(2) );
		posZText.setValue( z.toFixed(2) );
		
		var linear=AmmoUtils.getLinearVelocity(application.lastParticle.getBody(),sharedVec);
		
		linearXText.setValue( linear.x.toFixed(2) );
		linearYText.setValue( linear.y.toFixed(2) );
		linearZText.setValue( linear.z.toFixed(2) );
		
		var angular=AmmoUtils.getAngularVelocity(application.lastParticle.getBody(),sharedVec);
		
		angularXText.setValue( angular.x.toFixed(2) );
		angularYText.setValue( angular.y.toFixed(2) );
		angularZText.setValue( angular.z.toFixed(2) );
		
		bodyText.setValue(application.ammoControler.autoSyncingBodies.length);
		constraintText.setValue(application.ammoControler.autoSyncingConstraints.length);
		
		gravityText.setValue("0,"+application.gravityY+",0");
	}

	return container;

};
