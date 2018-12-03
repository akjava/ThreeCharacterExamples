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
	
	
	var name = new UI.Text( '' ).setMarginLeft( '6px' );
	
	var posXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var posYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var posZText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var wtranslateXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var wtranslateYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var wtranslateZText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var rotateXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var rotateYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var rotateZText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var wrotateXText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var wrotateYText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var wrotateZText = new UI.Text( '0' ).setMarginLeft( '6px' );

	container.add( new UI.Text( 'Bone' ), name, new UI.Break() );
	container.add(new UI.Break());
	
	container.add( new UI.Text( 'Local' ) );
	container.add(new UI.Break(),new UI.Break());
	
	container.add( new UI.Text( 'Position-X' ), posXText, new UI.Break() );
	container.add( new UI.Text( 'Position-Y' ), posYText, new UI.Break() );
	container.add( new UI.Text( 'Position-Z' ), posZText, new UI.Break() );
	
	container.add(new UI.Break(),new UI.Break());
	container.add(new UI.Text("Degree Angle"),new UI.Break());
	container.add( new UI.Text( 'Rotate-X' ), rotateXText, new UI.Break() );
	container.add( new UI.Text( 'Rotate-Y' ), rotateYText, new UI.Break() );
	container.add( new UI.Text( 'Rotate-Z' ), rotateZText, new UI.Break() );
	
	container.add(new UI.Break(),new UI.Break());
	container.add( new UI.Text( 'World' ) );
	container.add(new UI.Break(),new UI.Break());
	container.add(new UI.Text("Degree Angle"),new UI.Break());
	container.add( new UI.Text( 'Rotate-X' ), wrotateXText, new UI.Break() );
	container.add( new UI.Text( 'Rotate-Y' ), wrotateYText, new UI.Break() );
	container.add( new UI.Text( 'Rotate-Z' ), wrotateZText, new UI.Break() );
	container.add(new UI.Break(),new UI.Break());
	container.add(new UI.Text("3D Character is created by "),new UI.Break(),new UI.Anchor("http://www.manuelbastioni.com/","Manuel Bastioni"));
/*
	container.add( new UI.Text( 'World' ) );
	container.add(new UI.Break());
	
	container.add( new UI.Text( 'Transform-X' ), wtranslateXText, new UI.Break() );
	container.add( new UI.Text( 'Transform-Y' ), wtranslateYText, new UI.Break() );
	container.add( new UI.Text( 'Transofrm-Z' ), wtranslateZText, new UI.Break() );*/

	signals.rendered.add( update );

	var translate=new THREE.Vector3();
	var rotation=new THREE.Quaternion();
	var euler=new THREE.Euler();
	
	function update() {
		if(ap.selectedBone==null){
			
			return;
		}
		
		//name.setValue(Mbl3dUtils.shortenMbl3dBoneName(ap.selectedBone.name));
		name.setValue(ap.selectedBone.name);
		
		
		translate.setFromMatrixPosition(ap.selectedBone.matrix);
		
		/*var x=application.ball.getMesh().position.x;
		var y=application.ball.getMesh().position.y;
		var z=application.ball.getMesh().position.z;
		*/
		posXText.setValue( translate.x.toFixed(2) );
		posYText.setValue( translate.y.toFixed(2) );
		posZText.setValue( translate.z.toFixed(2) );
		
		//rotation.setFromRotationMatrix(ap.selectedBone.matrix);
		euler.setFromRotationMatrix(ap.selectedBone.matrix);
		
		rotateXText.setValue( THREE.Math.radToDeg(euler.x).toFixed(2) );
		rotateYText.setValue( THREE.Math.radToDeg(euler.y).toFixed(2) );
		rotateZText.setValue( THREE.Math.radToDeg(euler.z).toFixed(2) );
		
		
		euler.setFromRotationMatrix(ap.selectedBone.matrixWorld);
		
		wrotateXText.setValue( THREE.Math.radToDeg(euler.x).toFixed(2) );
		wrotateYText.setValue( THREE.Math.radToDeg(euler.y).toFixed(2) );
		wrotateZText.setValue( THREE.Math.radToDeg(euler.z).toFixed(2) );
		
		/*translate.setFromMatrixPosition(ap.selectedBone.matrixWorld);
		wtranslateXText.setValue( translate.x.toFixed(2) );
		wtranslateYText.setValue( translate.y.toFixed(2) );
		wtranslateZText.setValue( translate.z.toFixed(2) );*/
		
	}

	return container;

};
