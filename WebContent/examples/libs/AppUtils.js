var AppUtils={
		loadGltfMesh:function(url,callback,loader){
			loader=loader!==undefined?loader: new THREE.GLTFLoader();
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