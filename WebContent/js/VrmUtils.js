var VrmUtils={
		logging:false,
		loadVrm:function(ap,url){
			var scope=this;
			/*
			 * 
			 * code from webgl_loader_vrm.html
			 * 
			 */
			var loader = new THREE.VRMLoader();
			loader.load( '../../../dataset/vrm/Alicia/AliciaSolid.vrm', function ( vrm ) {
				// VRMLoader doesn't support VRM Unlit extension yet so
				// converting all materials to MeshBasicMaterial here as workaround so far.
				vrm.scene.traverse( function ( object ) {

					
					if ( object.material ) {

						if ( Array.isArray( object.material ) ) {

							for ( var i = 0, il = object.material.length; i < il; i ++ ) {

								var material = new THREE.MeshBasicMaterial();
								THREE.Material.prototype.copy.call( material, object.material[ i ] );
								material.color.copy( object.material[ i ].color );
								material.map = object.material[ i ].map;
								material.lights = false;
								material.skinning = object.material[ i ].skinning;
								material.morphTargets = object.material[ i ].morphTargets;
								material.morphNormals = object.material[ i ].morphNormals;
								object.material[ i ] = material;

							}

						} else {

							var material = new THREE.MeshBasicMaterial();
							THREE.Material.prototype.copy.call( material, object.material );
							material.color.copy( object.material.color );
							material.map = object.material.map;
							material.lights = false;
							material.skinning = object.material.skinning;
							material.morphTargets = object.material.morphTargets;
							material.morphNormals = object.material.morphNormals;
							object.material = material;

						}

					}

				} );
				
				vrm.scene.updateMatrixWorld(true);
				var bones=BoneUtils.makeBoneList(vrm.scene);
				var poses=[];
				var rotq=[];
				bones.forEach(function(bone){
					poses.push(bone.position.clone());
					rotq.push(bone.quaternion.clone());
				});
				var skeleton={bones:bones,pose:function(){
					for(var i=0;i<bones.length;i++){
						bones[i].position.copy(poses[i]);
						bones[i].quaternion.copy(rotq[i]);
					}
				},poses:poses,rotq:rotq};
				vrm.scene.skeleton=skeleton;
				
				if(scope.logging){
					console.log(vrm);
					console.log(vrm.userData.gltfExtensions);
					console.log(vrm.parser.json.nodes);
				}
				
				ap.vrm=vrm;
				ap.getSignal("loadingModelFinished").dispatch(vrm.scene);
			} );
		}
}