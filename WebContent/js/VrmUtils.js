var VrmUtils={
		logging:false,
		blendShapeNames:["A","I","U","E","O","Blink","Blink_L","Blink_R","Angry","Fun","Joy","Sorrow","Surprised"],
		getHasMorphTargets:function(mesh){
			var hasMorphTargets=[];
			mesh.traverse(function(obj){
				if(obj.isSkinnedMesh){
					if(obj.morphTargetInfluences){
						hasMorphTargets.push(obj);
					}
				}
			});
			return hasMorphTargets;
		}
		,
		
		getBlendShapeByName:function(blendShapes,name){
			for(var i=0;i<blendShapes.length;i++){
				var bs=blendShapes[i];
				if(bs.name==name){
					return bs;
				}
			}
			return null;
		},
		applyBlendShape:function(rootMesh,blendShape,intensity){
			
			function set(target,bind,intensity){
				intensity=intensity==undefined?1:intensity;
				if(target.morphTargetInfluences){
					
					target.morphTargetInfluences[bind.index]=bind.weight/100*intensity;
				}
					
			}
			blendShape.binds.forEach(function(bind){
				
				var target=rootMesh.getObjectByName(bind.name);
				if(!target){
					console.error("bind not resolved",bind.name,rootMesh,bind);
				}else{
					//TODO cache
					target.traverse(function(model){
						if(model.morphTargetInfluences){
							set(model,bind,intensity);
						}
					});
					
					
				}
				
				
			});
		},
		clearMorphs:function(meshs){
			meshs.forEach(function(mesh){
				if(mesh.morphTargetInfluences){
					for(var i=0;i<mesh.morphTargetInfluences.length;i++){
						mesh.morphTargetInfluences[i]=0;
					}
				}
			});
		},
		parseBlendShapes:function(vrm){
			var scope=this;
			var groups=[];
			var blendShapeMaster=vrm.userData.gltfExtensions.VRM.blendShapeMaster;
			blendShapeMaster.blendShapeGroups.forEach(function(group){
				var blenShapeGroup={raw:group,binds:[]};
				blenShapeGroup.name=group.name;
				group.binds.forEach(function(bind){
					var bd={
						index:bind.index,
						weight:bind.weight
					};
					
					bd.name=scope.getNodeName(vrm,bind.mesh);
					blenShapeGroup.binds.push(bd);
				});
				//TODO materialValues
				groups.push(blenShapeGroup);
			});
			return groups;
		},
		getNodes:function(vrm){
			return vrm.parser.json.nodes;
		},
		 getNodeName:function(vrm,index){
			var nodes=vrm.parser.json.nodes;
			var node= nodes[index];
			if(!node){
				return null;
			}
			return node.name;
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
				
				//somewhere's bug 
				if(vrm.userData.gltfExtensions.VRM.meta.title=="Alicia Solid"){
					//version: "0.27"
					var waist=vrm.scene.getObjectByName("waist");
					if(waist){
						waist.isBone=true;
					}
				}
				
				
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
			
			
			//fix
			
			
			
			var list=BoneUtils.getBoneList(vrm.scene); //vrm.scene is same as ap.skinnedMesh
			
			humanoid.humanBones.forEach(function(hb){
				var name=scope.getNodeBoneName(vrm,hb.node);
				var bone=BoneUtils.findBoneByEndsName(list,name);
				if(bone==null){
					console.error("not found",hb.bone,name,list);
					if(name=="waist"){
						var bone=BoneUtils.findBoneByEndsName(list,"upperbody01");
						//bones.push(bone);
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
		getHumanoidFingerBoneNames:function(){
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
			return this.humanoidFingerBoneNames;
		}
		,
		isFingerBoneNameByHumanBoneName:function(humanBoneName){
			
			
			if(this.getHumanoidFingerBoneNames().indexOf(humanBoneName)!=-1){
				return true;
			}
			
			return false;
		},isFingerBoneNameByGeneralBoneName:function(name,generalMap){
			
			var humanBoneName=generalMap[name];
			return this.isFingerBoneNameByHumanBoneName(humanBoneName);
			
		}
		,changeBoneEulerOrders:function(ap,skinnedMesh){
			
			var bones=BoneUtils.getBoneList(skinnedMesh);
			var arms=["Shoulder","UpperArm","LowerArm","Hand"];

			var generalBoneMap=this.createGeneralBoneNameToHumanBoneNameMap(ap);
			//TODO
			for(var i=0;i<bones.length;i++){
				var name=bones[i].name;
				if(this.isFingerBoneNameByGeneralBoneName(name,generalBoneMap)){
					
					bones[i].rotation.order="ZYX";
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
							
							bones[index].rotation.order="ZYX";//better arm close body
							//bones[index].rotation.order="YZX";//zyx is littlebit better.
						}else{
							console.log("changeBoneEulerOrders not found",humanBoneName,boneName);
						}
					
				});
			});
		}
}