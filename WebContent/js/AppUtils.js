var AppUtils={
		loadMesh:function(url,callback,fileName){
			fileName=fileName==undefined?url:fileName;
			if(fileName.toLowerCase().endsWith(".fbx")){
				AppUtils.loadFbxMesh(url,function(mesh){
					mesh.isFbx=true;
					callback(mesh);
				});
				
			}else{
				AppUtils.loadGltfMesh(url,function(mesh){
					mesh.isGltf=true;
					callback(mesh);
				});
			}
		},
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
						mesh.add(bone);//I'm not sure why add bone.
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
						if(mesh.skeleton.bones[0].scale.x>1.01)
							console.log("Scale is not 1,on Blender2.79-mbl3d1.61 FBX Scale Option should be 0.01 for compatible",mesh.skeleton.bones[0].scale);
					}
					
					if(mesh.scale.x!=1){
						console.error("fbx usually scale is 1,if this  model is invalid ,Use -Z Foward Y Up,Experimental apply transform")
					}
					
					callback(mesh);
				}else{
					console.log("loadFbxMesh:No Mesh Containe."+url);
				}
		});
		},
		createBase64Blob:function(dataURI,type){
		 var BASE64_MARKER = ';base64,';
		  var index=dataURI.indexOf(BASE64_MARKER);
		  var base64Index=0;
		  if(index!=-1){
		  	 base64Index=index  + BASE64_MARKER.length
		  }
		  var base64 = dataURI.substring(base64Index);
		  var raw = atob(base64);
		  var rawLength = raw.length;
		  var uInt8Array = new Uint8Array(rawLength);

		  for (var i = 0; i < rawLength; ++i) {
		    uInt8Array[i] = raw.charCodeAt(i);
		  }
	    return new Blob([uInt8Array],{type:type});
	  	},
		generateBase64DownloadLink:function(urlData,mimeType,fileName,anchorText,autoRemove){
			var link=document.createElement( 'a' );
			link.textContent=anchorText;
			
			var url=window.URL.createObjectURL(AppUtils.createBase64Blob(urlData,mimeType));
			
			link.href=url;
			link.download=fileName;
			link.dataset.downloadurl="mimeType"+":"+fileName+":"+url;
			if(autoRemove){
				link.addEventListener( 'click', function ( event ) {
					link.parentNode.removeChild(link);

				} );
			}
			return link;
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
		},
		//for vector3 or euler
		printDeg:function(xyz,text){
			text=text!==undefined?text:"";
			console.log(THREE.Math.radToDeg(xyz.x),THREE.Math.radToDeg(xyz.y),THREE.Math.radToDeg(xyz.z),text)
		},
		degToRad:function(xyz){
			return {x:THREE.Math.degToRad(xyz.x),y:THREE.Math.degToRad(xyz.y),z:THREE.Math.degToRad(xyz.z)};
		},radToDeg:function(xyz){
			return {x:THREE.Math.radToDeg(xyz.x),y:THREE.Math.radToDeg(xyz.y),z:THREE.Math.radToDeg(xyz.z)};
		},
		printVec:function(xyz,text){
			text=text==undefined?"":text;
			console.log(xyz.x.toFixed(2),xyz.y.toFixed(2),xyz.z.toFixed(2),text)
		}
		,clearAllChildren:function(parent){
			for(var i=parent.children.length-1;i>=0;i--){
				var obj=parent.children[i];
				parent.removeChild(obj);
				
			}
		},clearObject:function(object){
			Object.keys(object).forEach(function (key) {
				  delete object[key];
				});
		},removeAllFromArray:function(array,removes){
			removes.forEach(function(remove){
				var index=array.indexOf(remove);
				if(index==-1){
					//TODO logging
					//console.log("removeAllFromArray:not contain",remove);
				}else{
					array.splice(index,1);
				}
				
			});
			return array;
		},
		/*
		not support minus
		max length 6+1
		*/
		padNumber:function(number,length){
			return ('000000' + number).slice(-length);
		},
		//need renderer initialize option {preserveDrawingBuffer: true}
		toPngDataUrl:function (renderer){
		return renderer.domElement.toDataURL("image/png");
		},
		lineTo:function(mesh1,mesh2){
			var geo = new THREE.Geometry();
			geo.vertices.push( new THREE.Vector3(  ));
			geo.vertices.push( mesh2.position.clone());
			var material=new THREE.LineBasicMaterial({color:0xaaaacc});
			
			var joint = new THREE.Line( geo,material);
			mesh1.add(joint);
			return joint;
		}
		

};