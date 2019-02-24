var Logics={
		loadTextureAtOnce:function(ap,url,type){
			var loaded=false;
			ap.signals.loadingModelFinished.add(function(){
				if(!loaded){
					var texture=Mbl3dUtils.loadTexture(url);
					ap.signals.loadingTextureFinished.dispatch(texture,type);
					loaded=true;
				}
			});
		},
		initializeAmmo:function(ap){
			//ammo
			var world=AmmoUtils.initWorld();
			var ammoControler=new AmmoControler(ap.scene,world);
			ap.ammoControler=ammoControler;
		},
		disposeSkinnedMeshMixer:function(ap){
			if(ap.onUpdateMixer){
				ap.signals.rendered.remove(ap.onUpdateMixer);
			}
			if(ap.mixer){
				ap.mixer.stopAllAction();
				ap.mixer=undefined;
			}
		},
		initializeSkinnedMeshMixer:function(ap){
			var updateMixer=function (){
				var delta = ap.clock.getDelta();
				ap.mixer.update(delta);
			};
			ap.onUpdateMixer=updateMixer;
			
			ap.mixer=new THREE.AnimationMixer(ap.skinnedMesh);
			ap.clock=new THREE.Clock();
			ap.signals.rendered.add(updateMixer);
		},
		timeliner_clearFrame:function(ap,key){
			ap.timeliner.context.dispatcher.fire('keyframe',key,true);
			ap.timeliner.context.controller.setDisplayTime(0);
			ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
			ap.timeliner.context.dispatcher.fire('keyframe',key);
			ap.timeliner.context.controller.setDisplayTime(0);
			ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
		},
		loadingModelFinishedForTranslateControler:function(ap){
			var translateControlerInitialized=false;
			
			ap.signals.loadingModelFinished.add(function(mesh){
				if(!translateControlerInitialized){
					
					ap.signals.transformSelectionChanged.add(function(target){
						ap.translateControler.onTransformSelectionChanged(target);
					});
					
					ap.signals.transformStarted.add( function (target) {
						ap.translateControler.onTransformStarted(target);
					});
					
					ap.signals.transformFinished.add( function (target) {
						ap.translateControler.onTransformFinished(target);
					});
					ap.signals.transformChanged.add( function (target) {
						ap.translateControler.onTransformChanged(target);
					});
					
					//mbl3d specific & somehow ik rotate target index changed from 0 to 1;
					ap.signals.boneRotationChanged.add(function(index){
						if(index==0){
							ap.signals.boneTranslateChanged.dispatch(index);
						}
					});
					
					translateControlerInitialized=true;
				}
				if(ap.translateControler!=null){
					ap.translateControler.dispose();
				}
				
				var translateControler=new TranslateControler(ap,ap.boneAttachControler);
				translateControler.initialize();
				ap.translateControler=translateControler;
				
			
			});
		},
		loadingModelFinishedForRotationControler:function(ap){
			var rotationControlerInitialized=false;
			ap.signals.loadingModelFinished.add(function(mesh){
				
				if(!rotationControlerInitialized){
					//move to initialize?
					ap.signals.transformSelectionChanged.add(function(target){
						ap.rotationControler.onTransformSelectionChanged(target);
					});
					/*ap.signals.transformChanged.add( function (target) {
						ap.rotationControler.onTransformChanged(target);
					});*/
					
					ap.signals.transformFinished.add( function (target) {
						ap.rotationControler.onTransformFinished(target);
					});
					ap.signals.transformStarted.add( function (target) {
						//console.log(ap.objects);
						ap.rotationControler.onTransformStarted(target);
					});
					rotationControlerInitialized=true;
				}
				
				
				
				if(ap.rotationControler!=null){
					ap.rotationControler.dispose();
				}
				
				var rotationControler=new RotationControler(ap,ap.boneAttachControler);
				rotationControler.initialize(function(bone){
					return !Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name) && !Mbl3dUtils.isRootBoneName(bone.name);
				});
				ap.rotationControler=rotationControler;
				
				
				
			});
			

		},
		loadingModelFinishedForIkControler:function(ap){
			//Ik
			ap.signals.loadingModelFinished.add(function(mesh){
				
				//Possible Ik initialize on Sidebar for keep value
				if(ap.ikControler==null){
					ap.ikControler=new IkControler(undefined,ap);
					
				}
				
				//if do dispose,remove event & ikTargets
				
				//on
				if(!ap.ikControler.isInitialized()){
					ap.ikControler.initialize(new Mbl3dIk(ap));
					
					//
					ap.ikControler.maxAngle=5;
					ap.ikControler.setBoneRatio("clavicle_L",0.01);
					ap.ikControler.setBoneRatio("upperarm_L",0.1);
					ap.ikControler.setBoneRatio("lowerarm_L",1);
					ap.ikControler.setBoneRatio("hand_L",0.1);
					ap.ikControler.setBoneRatio("clavicle_R",0.01);
					ap.ikControler.setBoneRatio("upperarm_R",0.1);
					ap.ikControler.setBoneRatio("lowerarm_R",1);
					ap.ikControler.setBoneRatio("hand_R",0.1);
					
					ap.getSignal("ikSettingChanged").dispatch();
					
					ap.signals.transformSelectionChanged.add(function(target){
						ap.ikControler.onTransformSelectionChanged(target);
					});
					
					ap.signals.transformStarted.add( function (target) {
						ap.ikControler.onTransformStarted(target);
					});
					
					ap.signals.transformFinished.add( function (target) {
						ap.ikControler.onTransformFinished(target);
					});
					ap.signals.transformChanged.add( function (target) {
						ap.ikControler.onTransformChanged(target);
					});
					
					ap.getSignal("boneTranslateChanged").add(function(){
						ap.ikControler.resetAllIkTargets();
					});
				}
				
				
				ap.ikControler.setBoneAttachControler(ap.boneAttachControler);
				//reference boneAttachControler
				ap.ikControler.setEndSiteEnabled("Head",true);
				ap.ikControler.setEndSiteEnabled("LeftArm",true);
				ap.ikControler.setEndSiteEnabled("RightArm",true);
				
				
				
			},undefined,50);
			

		},
		loadingModelFinishedForBreastControler:function(ap){
			ap.signals.loadingModelFinished.add(function(mesh){
				if(ap.breastControler==undefined){
					ap.breastControler=new BreastControler();
				}else{
					ap.breastControler.dispose();
				}
				ap.breastControler.logging=false;
				ap.breastControler.initialize(ap.ammoControler,ap.boneAttachControler);
				ap.breastControler.newBreast();
				
				ap.ammoControler.setVisibleAll(false);
			});
			
			ap.signals.rendered.add(function(){
				if(ap.breastControler){
					ap.ammoControler.update();
					ap.breastControler.update();
				}
			},undefined,-2);//call later boneAttach
		},
		loadingHairFinished:function(ap){
			application.signals.loadingHairFinished.add(function(hair){
				//initialized when loadingModelFinished
				ap.boneAttachControler.getContainerByBoneEndName("head").add(hair);
			});	
		},loadingModelFinishedForBoneAttachControler:function(ap){
			var boneAttachControlerInitialized=false;
			//boneAttachControler
			ap.signals.loadingModelFinished.add(function(mesh){
				
				if(!boneAttachControlerInitialized){
					ap.getSignal("poseChanged").add(function(){
						ap.boneAttachControler.update(true);
					});
				}
				
				if(ap.boneAttachControler!=null){
					ap.boneAttachControler.dispose();
				}
				ap.boneAttachControler=new BoneAttachControler(mesh);
				ap.boneAttachControler.setParentObject(ap.root);
				
				ap.mixer=undefined;
				
			},undefined,100);//call at first
			
			ap.signals.rendered.add(function(){
				if(ap.boneAttachControler){
					ap.boneAttachControler.update(true);
				}
			},undefined,-1);//call later
		},
		loadingModelFinishedForMeshTransform:function(ap){
			try{
				var objectTransformControlerInitialized=false;
				ap.signals.loadingModelFinished.add(function(mesh){
					
					mesh.userData.transformSelectionType="ObjectTransform";
					
					if(!objectTransformControlerInitialized){
						ap.signals.transformSelectionChanged.add(function(target){
							
							ap.objectTransformControler.onTransformSelectionChanged(target);
						});
						
						ap.signals.transformStarted.add( function (target) {
							ap.objectTransformControler.onTransformStarted(target);
						});
						
						ap.signals.transformFinished.add( function (target) {
							ap.objectTransformControler.onTransformFinished(target);
						});
						ap.signals.transformChanged.add( function (target) {
							ap.objectTransformControler.onTransformChanged(target);
						});
						objectTransformControlerInitialized=true;
					}
					
					if(ap.objectTransformControler!=null){
						
						ap.objectTransformControler.dispose();
					}
					
					var objectTransformControler=new ObjectTransformControler(ap);
					ap.objectTransformControler=objectTransformControler;
					
				});
			}catch(e){
				console.error(e);
			}
	
		},
		materialChangedForSimple:function(ap){
			ap.signals.materialChanged.add(function(){
				var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,map:ap.texture,transparent:true,alphaTest:0.6});
				ap.skinnedMesh.material=material;
			});
		},
		materialChangedForTextureMaps:function(ap){
			ap.signals.materialChanged.add(function(){
				
				//var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,transparent:true,alphaTest:0.6});
				 var material = new window['THREE'][application.materialType](
						 {skinning: true,morphTargets:true ,transparent:true,alphaTest:0.6,wireframe:application.materialWireframe} 
						 );
				
				material.color.set(ap.color);
				material.shininess=ap.shininess;
				
				material.displacementScale=ap.displacementScale;
				material.bumpScale=ap.bumpScale;
				material.displacementBias=ap.displacementBias;
				material.emissiveIntensity=ap.emissiveIntensity;
				material.emissive.set(ap.emissive);
				material.specular.set(ap.specular);
				material.aoMapIntensity=ap.aoIntensity;
				//TODO normalmap
				
				Object.keys(ap.textures).forEach(function(key){
					
					var texture=ap.textures[key];
					//reset here
					if(texture!=null && texture!==undefined){
						if(ap.isGltf){
							texture.flipY = false;
						}else{
							texture.flipY = true;//FBX
						}
						
						if(texture.image!=undefined)
							texture.needsUpdate=true;
					}
					
					
					material[key]=texture;
				});
				
				
				material.needsUpdate=true;
				
				ap.skinnedMesh.material=material;
			});
			
			//for material aoMap
			ap.signals.loadingModelFinished.add(function(mesh){
				var geometry=mesh.geometry;
				
				if(geometry.isGeometry){
					geometry.faceVertexUvs.push(geometry.faceVertexUvs[0]);
				}else{
					geometry.attributes.uv2 = geometry.attributes.uv
				}
			});
			
		}
		
		
		
}
