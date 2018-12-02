var AppUtils={
		decoderPath:'js/libs/draco/gltf/',
		loadGltfMesh:function(url,callback,loader){
			loader=loader!==undefined?loader: new THREE.GLTFLoader();
			if(THREE.DRACOLoader){
			THREE.DRACOLoader.setDecoderPath( AppUtils.decoderPath );
			loader.setDRACOLoader(new THREE.DRACOLoader());
			}
			loader.load( url, function ( gltf ) {
				var mesh=null;
				var bone=null;
				gltf.scene.traverse( function ( child ) {
					if ( child.isMesh ) {
						mesh=child;
						
					}
					if ( child.isBone ) {
						if(bone==null){
							bone=child;
						}
					}
					
				});
				
				//add object inside traverse() change index and make error
				if(mesh!=null){
					if(bone!=null){
						mesh.add(bone);
					}else{
						console.log("loadGltfMesh:No Bone Containe."+url);
					}
					
					
					callback(mesh);
				}else{
					console.log("loadGltfMesh:No Mesh Containe."+url);
				}
		});
		},
		loadFbxMesh:function(url,callback,loader){
			loader=loader!==undefined?loader: new THREE.FBXLoader();
			
			loader.load( url, function ( object ) {
				var mesh=null;
				var bone=null;
				
				object.traverse( function ( child ) {
					
					if ( child.isMesh ) {
						mesh=child;
						
					}
					if ( child.isBone ) {
						if(bone==null){
							bone=child;
						}
					}
					
				});
				
				//add object inside traverse() change index and make error
				if(mesh!=null){
					if(bone!=null){
						mesh.add(bone);
					}else{
						console.log("loadFbxMesh:No Bone Containe."+url);
					}
					if(mesh.skeleton!==undefined){
						mesh.skeleton.pose();
						console.log("Some how FBXModle Root-Bone scale is",mesh.skeleton.bones[0].scale);
					}
					
					callback(mesh);
				}else{
					console.log("loadFbxMesh:No Mesh Containe."+url);
				}
		});
		},
		//String text,String fileName,String anchorText,boolean autoRemove
		generateTextDownloadLink:function(text,fileName,anchorText,autoRemove){
			var mimeType="text/plain;charset=UTF-8";
			/*
			DownloadBlobBuilder bb=BlobBuilder();
			
			bb.append(text);
			*/
			
			var link=document.createElement( 'a' );
			link.textContent=anchorText;
			
			var url=window.URL.createObjectURL(new Blob([text],{type:"text/plain;charset=UTF-8"}));
			link.href=url;
			link.download=fileName;
			link.dataset.downloadurl="mimeType"+":"+fileName+":"+url;
			if(autoRemove){
				link.addEventListener( 'click', function ( event ) {

					link.parentNode.removeChild(link);

				} );
			}
			return link;
		}

};