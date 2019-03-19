var VrmUtils={
		logging:false,
		getNodes:function(vrm){
			return vrm.parser.json.nodes;
		},
		getHumanoid:function(vrm){
			return vrm.userData.gltfExtensions.VRM.humanoid;
		},
		getSkinnedMeshes:function(parent){
			var models=[];
			parent.traverse(function(model){
				if(model.isSkinnedMesh){
					models.push(model);
				}
			});
			return models;
		},
		getHumanoidOppositeLRName:function(humanoidBoneName){
			
			if(humanoidBoneName.indexOf("left")!=-1){
				return humanoidBoneName.replace("left","right");
			}
			if(humanoidBoneName.indexOf("right")!=-1){
				return humanoidBoneName.replace("right","left");
			}
			return null;
		},
		getGeneralOppositeLRName:function(humanBoneMap,
				generalBoneMap,generalBoneName){
			var humanBoneName=generalBoneMap[generalBoneName];
		
			if(humanBoneName){
				var humanOpposite=this.getHumanoidOppositeLRName(humanBoneName);
				
				if(humanOpposite){
					var opposite=humanBoneMap[humanOpposite];
					if(opposite){
						return opposite;
					}else{
						return null;
					}
				}
			}
			return null;
		},
		sceneToSkinnedMeshOptions:function(scene,isVroid){
			var keys={};
			var maxFace=0;
			var maxFaceModel=null;
			var maxBody=0;
			var maxBodyModel=null;
			
			
			
			scene.traverse(function(model){
				if(model.isSkinnedMesh){
					var name=model.name
					var count=model.geometry.index?model.geometry.index.count:0;
					if(count>0){
						name=name+"("+count+")";
					}
					keys[model.id]=name;
					if(isVroid){
						if(name.startsWith("Face")){
							
								//console.log(model.name,value);
								if(maxFace<count){
									
									maxFace=count
									maxFaceModel=model;
								}
							
						}
						else if(name.startsWith("Body")){
							
								if(maxBody<count){
									
									maxBody=count
									maxBodyModel=model;
								}
							
						}
					}
					
				}
			});
			
			function countedName(model){
				var name=model.name;
				var count=model.geometry.index?model.geometry.index.count:0;
				if(count>0){
					name=name+"("+count+")";
				}
				return name;
			}
			if(isVroid){//indicate large one
				
				
				if(maxFaceModel){
					keys[maxFaceModel.id]=countedName(maxFaceModel)+"*";
				}
					
				if(maxBodyModel)
					keys[maxBodyModel.id]=countedName(maxBodyModel)+"*";
			}
			
			return keys;
		},
		loadVrm:function(ap,url){
			var scope=this;
			/*
			 * 
			 * code from webgl_loader_vrm.html
			 * 
			 */
			var loader = new THREE.VRMLoader();
			loader.load( url, function ( vrm ) {
				// VRMLoader doesn't support VRM Unlit extension yet so
				// converting all materials to MeshBasicMaterial here as workaround so far.
				vrm.scene.traverse( function ( object ) {

					
					if ( object.material ) {

						if ( Array.isArray( object.material ) ) {
							
							for ( var i = 0, il = object.material.length; i < il; i ++ ) {

								var material = new THREE.MeshBasicMaterial();
								THREE.Material.prototype.copy.call( material, object.material[ i ] );
								
								material.vertexColors=0;//in my case alway faild
								
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
							
							material.vertexColors=0;//in my case alway faild
							
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
				
				/*var poses=[];
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
				},poses:poses,rotq:rotq};*/
				
				skeleton=new THREE.Skeleton(bones);
				
				vrm.scene.skeleton=skeleton;//
				vrm.scene.humanoidSkeleton=VrmUtils.humanoidToSkeleton(vrm);
				if(scope.logging){
					console.log(vrm);
					console.log(vrm.userData.gltfExtensions);
					console.log(vrm.parser.json.nodes);
				}
				
				
				
				ap.vrm=vrm;
				ap.getSignal("loadingModelFinished").dispatch(vrm.scene);
			} );
		},
		humanoidToSkeleton:function(vrm){
			var scope=this;
			var bones=[];
			var poses=[];
			var rotq=[];
			var humanoid=vrm.userData.gltfExtensions.VRM.humanoid;
			var nodes=vrm.parser.json.nodes;
			
			function getBoneName(index){
				return nodes[index].name;
			}
			
			var list=BoneUtils.getBoneList(vrm.scene); //vrm.scene is same as ap.skinnedMesh
			
			humanoid.humanBones.forEach(function(hb){
				var name=scope.getNodeBoneName(vrm,hb.node);
				var bone=BoneUtils.findBoneByEndsName(list,name);
				if(bone==null){
					console.error("not found",hb.bone,name,list);
					if(name=="waist"){
						var bone=BoneUtils.findBoneByEndsName(list,"upperbody01");
						bones.push(bone);
					}
				}else{
					bones.push(bone);
				}
				
			});
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
			return skeleton;
		},
		getNodeBoneName:function(vrm,index){
			var nodes=vrm.parser.json.nodes;
			var node= nodes[index];
			if(!node){
				return null;
			}
			var name=node.name.replace(".","");//seems
			name=node.name.replace(" ","_");//seems
			return name;
		}
		,createHumanBoneNameToGeneralBoneNameMap:function(ap){
			var nodes=ap.vrm.parser.json.nodes;
			var humanBones=ap.vrm.userData.gltfExtensions.VRM.humanoid.humanBones;
			
			function getBoneName(index){
				return VrmUtils.getNodeBoneName(ap.vrm,index);
			}

			var humanBoneMap={};
			humanBones.forEach(function(humanBone){
				//TODO check
				humanBoneMap[humanBone.bone]=getBoneName(humanBone.node);
			});
			return humanBoneMap;
		},createGeneralBoneNameToHumanBoneNameMap:function(ap){
			var generalBoneMap={};
			var humanBoneMap=this.createHumanBoneNameToGeneralBoneNameMap(ap);
			Object.keys(humanBoneMap).forEach(function(key){
				generalBoneMap[humanBoneMap[key]]=key;
			})
			return generalBoneMap;
		},
		isFingerBoneName:function(name,generalMap){
			if(!this.humanoidFingerBoneNames){
				this.humanoidFingerBoneNames=[];
				var scope=this;
				
				var lrs=["left","right"];
				var parts=["Thumb","Index","Middle","Ring","Little"];
				var levels=["Proximal","Intermediate","Distal"];
				lrs.forEach(function(lr){
					parts.forEach(function(part){
						levels.forEach(function(level){
							scope.humanoidFingerBoneNames.push(lr+part+level);
						});
					});
				});
			}
			var humanBoneName=generalMap[name];
			if(this.humanoidFingerBoneNames.indexOf(humanBoneName)!=-1){
				return true;
			}
			
			return false;
		}
		,changeBoneEulerOrders:function(ap,skinnedMesh){
			
			var bones=BoneUtils.getBoneList(skinnedMesh);
			var arms=["Shoulder","UpperArm","LowerArm","Hand"];

			var generalBoneMap=this.createGeneralBoneNameToHumanBoneNameMap(ap);
			//TODO
			for(var i=0;i<bones.length;i++){
				var name=bones[i].name;
				if(this.isFingerBoneName(name,generalBoneMap)){
					bones[i].rotation.order="XYZ";
				}else{
					bones[i].rotation.order="XZY";
				}
			}
			var humanBoneMap=this.createHumanBoneNameToGeneralBoneNameMap(ap);
			
			arms.forEach(function(name){
				var lrs=["left","right"];
				lrs.forEach(function(lr){
					var humanBoneName=lr+name;
					var boneName=humanBoneMap[humanBoneName];
					
					var index=BoneUtils.findBoneIndexByEndsName(bones,boneName);
						if(index!=-1){
							console.log("set order ZYX",humanBoneName,boneName);
							bones[index].rotation.order="ZYX";//better arm close body
							//bones[index].rotation.order="YZX";//zyx is littlebit better.
						}else{
							console.log("changeBoneEulerOrders not found",humanBoneName,boneName);
						}
					
				});
			});
		}
}