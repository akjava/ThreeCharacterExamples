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
	
	container.add(new UI.Text("3D Character is created by "),new UI.Break(),new UI.Anchor("http://www.manuelbastioni.com/","Manuel Bastioni"));
	container.add( new UI.Break() , new UI.Break() );
	container.add(new UI.Text("Many source code based on "),new UI.Break(),new UI.Anchor("https://github.com/mrdoob/three.js/tree/dev/editor","Three.js Editor"));
	container.add( new UI.Break() , new UI.Break() );

	
	var ikText = new UI.Text( '' ).setMarginLeft( '6px' );
	var boneText = new UI.Text( '' ).setMarginLeft( '6px' );
	var rotXText = new UI.Text( '' ).setMarginLeft( '6px' );
	var rotYText = new UI.Text( '' ).setMarginLeft( '6px' );
	var rotZText = new UI.Text( '' ).setMarginLeft( '6px' );
	
	var boneText2 = new UI.Text( '' ).setMarginLeft( '6px' );
	var rotXText2 = new UI.Text( '' ).setMarginLeft( '6px' );
	var rotYText2 = new UI.Text( '' ).setMarginLeft( '6px' );
	var rotZText2 = new UI.Text( '' ).setMarginLeft( '6px' );
	
	container.add( new UI.Text( 'IkName:' ), ikText, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'BoneName:' ), boneText, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'rot-deg-x:' ), rotXText, new UI.Break() );
	container.add( new UI.Text( 'rot-deg-y:' ), rotYText, new UI.Break() );
	container.add( new UI.Text( 'rot-deg-z:' ), rotZText, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'BoneName2:' ), boneText2, new UI.Break() );
	container.add( new UI.Break());
	container.add( new UI.Text( 'rot-deg-x:' ), rotXText2, new UI.Break() );
	container.add( new UI.Text( 'rot-deg-y:' ), rotYText2, new UI.Break() );
	container.add( new UI.Text( 'rot-deg-z:' ), rotZText2, new UI.Break() );

	signals.rendered.add( update );

	var translate=new THREE.Vector3();
	var rotation=new THREE.Quaternion();
	var euler=new THREE.Euler();
	
	function update() {
		var ikName=(ap.ikTarget==null) || (ap.ikTarget.ikName==undefined)?"":ap.ikTarget.ikName;

		ikText.setValue(ikName);
		if(!ikName==""){
			var lastJoint=ap.ikIndices[ap.ikIndices.length-2];
			var bone=BoneUtils.getBoneList(ap.skinnedMesh)[lastJoint];
			var boneName=bone.name;
			boneText.setValue(boneName);
			
			var rotX=THREE.Math.radToDeg(bone.rotation.x).toFixed(2);
			rotXText.setValue(rotX);
			var rotY=THREE.Math.radToDeg(bone.rotation.y).toFixed(2);
			rotYText.setValue(rotY);
			var rotZ=THREE.Math.radToDeg(bone.rotation.z).toFixed(2);
			rotZText.setValue(rotZ);
			
			
			var lastJoint=ap.ikIndices[ap.ikIndices.length-3];
			var bone=BoneUtils.getBoneList(ap.skinnedMesh)[lastJoint];
			var boneName=bone.name;
			boneText2.setValue(boneName);
			
			var rotX=THREE.Math.radToDeg(bone.rotation.x).toFixed(2);
			rotXText2.setValue(rotX);
			var rotY=THREE.Math.radToDeg(bone.rotation.y).toFixed(2);
			rotYText2.setValue(rotY);
			var rotZ=THREE.Math.radToDeg(bone.rotation.z).toFixed(2);
			rotZText2.setValue(rotZ);
		}
	}

	return container;

};
