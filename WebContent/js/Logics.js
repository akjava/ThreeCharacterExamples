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
		initializeAmmo:function(ap,x,y,z){
			//ammo
			var world=AmmoUtils.initWorld(x,y,z);
			var ammoControler=new AmmoControler(ap.scene,world);
			ap.ammoControler=ammoControler;
			ap.getSignal("ammoInitialized").dispatch();
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
			
			if(ap.mixer){
				return;
			}
			
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
		},loadingModelStartedForGltfFbxLoader:function(ap){
			ap.signals.loadingModelStarted.add(function(url,fileName){
				if(ap.skinnedMesh!=null && ap.skinnedMesh.parent!=null){
					ap.skinnedMesh.parent.remove(ap.skinnedMesh);
				}
				if(fileName){
					ap.modelFileName=fileName;
				}else{
					ap.modelFileName=url;
				}
				AppUtils.loadMesh(url,function(mesh){
					try{
					var isGltf=mesh.isGltf;//set before convert
					ap.isGltf=isGltf;
					
					if(ap.convertToZeroRotatedBoneMesh){
						mesh=BoneUtils.convertToZeroRotatedBoneMesh(mesh);
					}
					
					
					//TODO check and set
					mesh.scale.set(100,100,100);
					if(ap.convertBoneEulerOrders){
						Mbl3dUtils.changeBoneEulerOrders(mesh);//Euler XYZ	
					}
					
					
					ap.root.add(mesh);
					ap.skinnedMesh=mesh;
					ap.signals.loadingModelFinished.dispatch(mesh);
					}catch(e){
						console.log(e);
					}
					
				},fileName);
			});
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
					
					//TODO support all bone
					ap.getSignal("boneRotationChanged").add(function(index){
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
				
				if(ap.translateControlerVisible!==undefined)
					translateControler.setVisible(ap.translateControlerVisible);
			
			});
		},
		loadingModelFinishedForRotationControler:function(ap,boneFilter){
			if(!boneFilter){
				boneFilter=function(bone){
					return !Mbl3dUtils.isFingerBoneName(bone.name) && !Mbl3dUtils.isTwistBoneName(bone.name) && !Mbl3dUtils.isRootBoneName(bone.name);
				}
			}
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
				rotationControler.initialize(boneFilter);
				ap.rotationControler=rotationControler;
				
				
				ap.rotationControler.setVisible(ap.rotationControlerVisible);
			});
			

		},
		loadingModelFinishedForIkControler:function(ap,ikSettingClassName){
			
			//Ik
			var initialized=false;
			ap.signals.loadingModelFinished.add(function(mesh){
				
				
				if(ap.ikControlerVisible==undefined)
					ap.ikControlerVisible=true;
				//Possible Ik initialize on Sidebar for keep value
				if(ap.ikControler==null){
					ap.ikControler=new IkControler(undefined,ap);
					
				}
				
				//if do dispose,remove event & ikTargets
				if(ikSettingClassName){
					if(ap.ikControler)
						ap.ikControler.dispose();
					
					//recreate
					
					ap.ikControler.initialize(new window[ikSettingClassName](ap));
					ap.getSignal("ikSettingChanged").dispatch();
					
					
					
					if(!initialized){
						
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
						initialized=true;
						if(ap.ikControler.logging)
							console.log("Ik initialized");
					}
					
					
				}else{
					//on
					if(!ap.ikControler.isInitialized()){
						if(ikSettingClassName){
							ap.ikControler.initialize(new window[ikSettingClassName](ap));
						}else{
							ap.ikControler.initialize(new Mbl3dIk(ap));
							//default bone ratio
							ap.ikControler.maxAngle=5;
							ap.ikControler.setBoneRatio("clavicle_L",0.01);
							ap.ikControler.setBoneRatio("upperarm_L",0.5);
							ap.ikControler.setBoneRatio("lowerarm_L",1);
							ap.ikControler.setBoneRatio("hand_L",0.1);
							ap.ikControler.setBoneRatio("clavicle_R",0.01);
							ap.ikControler.setBoneRatio("upperarm_R",0.5);
							ap.ikControler.setBoneRatio("lowerarm_R",1);
							ap.ikControler.setBoneRatio("hand_R",0.1);
						}
						
						
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
				}
				
				
				
				
				ap.ikControler.setBoneAttachControler(ap.boneAttachControler);
				
				
				ap.ikControler.setVisible(ap.ikControlerVisible);
				
				//reference boneAttachControler
				
				if(!ikSettingClassName){//for mbl3d
					ap.ikControler.setEndSiteEnabled("Head",true);
					ap.ikControler.setEndSiteEnabled("LeftArm",true);
					ap.ikControler.setEndSiteEnabled("RightArm",true);
				}
				
				
				
				
			},undefined,50);
			

		},
		loadingModelFinishedForBreastControler:function(ap){
			ap.signals.loadingModelFinished.add(function(mesh){
				if(!ap.breastControler){
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
					boneAttachControlerInitialized=true;
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
				var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,map:ap.texture,transparent:true,alphaTest:0.2});
				ap.skinnedMesh.material=material;
			});
		},
		materialChangedForTextureMaps:function(ap){
			ap.signals.materialChanged.add(function(){
				
				//var material=new THREE.MeshPhongMaterial({skinning:true,morphTargets:true,transparent:true,alphaTest:0.2});
				 var material = new window['THREE'][application.materialType](
						 {skinning: true,morphTargets:true ,transparent:true,alphaTest:0.2,wireframe:application.materialWireframe} 
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
			
		},transformSelectionChangedForIkPresets:function(ap){
			
			ap.signals.transformSelectionChanged.add(function(target){
				if(!ap.ikControler.getPresets()){
					return;
				}
				
				if(target!=null && target.userData.transformSelectionType=="IkPreset"){
					target.userData.IkPresetOnClick(target);
					
					var ikName=target.userData.IkPresetIkName;
					var newTarget=ap.ikControler.getIkTargetFromName(ikName);
					
					//after bone changed reselect  ik
					ap.signals.transformSelectionChanged.dispatch(newTarget);
				}
				if(ap.ikControler.logging){
					console.log("IkPresets.updateVisibleAll() on transformSelectionChanged<-1>")
				}
				ap.ikControler.getPresets().updateVisibleAll();
			},undefined,-1);//after ikcontroler
		},
		loadingModelFinishedForSecondaryAnimationControler:function (ap){
			ap.signals.loadingModelFinished.add(function(mesh){
				
				//set order
				VrmUtils.changeBoneEulerOrders(ap,mesh);
				
				
				if(!ap.secondaryAnimationControler){
					ap.secondaryAnimationControler=new SecondaryAnimationControler(ap);
				}else{
					ap.secondaryAnimationControler.dispose();
				}
				
				ap.secondaryAnimationControler.initialize(ap.ammoControler,ap.boneAttachControler);
				
				ap.secondaryAnimationControler.parse(ap.vrm);
				
				ap.secondaryAnimationControler.newSecondaryAnimation();
				
				//ap.ammoControler.setVisibleAll(true);
			},undefined,-1);
			
			ap.signals.rendered.add(function(){
				if(ap.secondaryAnimationControler){
					ap.secondaryAnimationControler.update();
					ap.ammoControler.update(1.0/(ap.ammoFps?ap.ammoFps:60));
					
				}
			},undefined,-2);//call later boneAttach
		},
		loadingModelStartedForVrm:function (ap){
			ap.getSignal("loadingModelStarted").add(function(url){
				VrmUtils.loadVrm(ap,url);
			});
			
			ap.getSignal("loadingModelFinished").add(function(model){
				
				if(ap.skinnedMesh){
					ap.skinnedMesh.parent.remove(ap.skinnedMesh);
				}
				ap.skinnedMesh=model;
				ap.scene.add(model);
				model.scale.set(100,100,100);
				
				var boneNameList=[];
				ap.skinnedMesh.humanoidSkeleton.bones.forEach(function(bone){
					boneNameList.push(bone.name);
				});
				ap.humanoidBoneNameList=boneNameList;
				
			},undefined,101);//before bone attach
		}
		
		
		
}
