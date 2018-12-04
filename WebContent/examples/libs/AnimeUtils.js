var AnimeUtils={
		resetPose:function(mesh){
			if(mesh.skeleton!==undefined){
			mesh.skeleton.pose();
		}else{
			console.log("Mesh has no skeleton");
		}
		},
		resetMorph:function(mesh){
			if(mesh.morphTargetInfluences!==undefined){
				for(var i=0;i<mesh.morphTargetInfluences.length;i++){
					mesh.morphTargetInfluences[i]=0;
				}
			}else{
				console.log("Mesh has no morphtargets");
			}
			
		},
		startClip:function(mixer,clip){
			mixer.uncacheClip(clip);
			return mixer.clipAction(clip).play();
		},
		stopAndReset:function(mixer,skinnedMesh){
			mixer.stopAllAction();
			AnimeUtils.resetPose(skinnedMesh);
			AnimeUtils.resetMorph(skinnedMesh);
		},
		/*
		 * 
		 * 
		 * 
		 */
		//For 0 Bone,generated bone
		//int boneIndex,double x,double y,double z(xyz is radiant),boolean both,double duration(second)
		//x,y,z,w radiant use convert from degree,THREE.Math.degToRad()
		makeSingleRotateBoneAnimation:function(boneIndex,x,y,z,oppositeSide,duration,pauseTime){
			pauseTime=pauseTime==undefined?0:pauseTime;
			var q=new THREE.Quaternion();
			var xq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), x);
			q.multiply(xq);
			var yq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), y);
			q.multiply(yq);
			var zq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), z);
			q.multiply(zq);
			
			var q2=new THREE.Quaternion();
			var xq2=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -x);
			q2.multiply(xq2);
			var yq2=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -y);
			q2.multiply(yq2);
			var zq2=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -z);
			q2.multiply(zq2);
			
			var tracks=[];
			var times=[];
			times.push(0);
			times.push(pauseTime);
			times.push(duration);
			times.push(duration+pauseTime);
			times.push(duration*2);
			times.push(duration*2+pauseTime);
			if(oppositeSide){
				times.push(duration*3);
				times.push(duration*3+pauseTime);
				times.push(duration*4);
				times.push(duration*4+pauseTime);
				}
			
			var values=[];
			values=values.concat(new THREE.Quaternion().toArray());
			values=values.concat(new THREE.Quaternion().toArray());
			values=values.concat(q.toArray());
			values=values.concat(q.toArray());
			values=values.concat(new THREE.Quaternion().toArray());
			values=values.concat(new THREE.Quaternion().toArray());
			
			if(oppositeSide){
				values=values.concat(q2.toArray());
				values=values.concat(q2.toArray());
				values=values.concat(new THREE.Quaternion().toArray());
				values=values.concat(new THREE.Quaternion().toArray());
				}
			


			var track=new THREE.QuaternionKeyframeTrack(".bones["+boneIndex+"].quaternion", times, values);
			tracks.push(track);
			
			var clip=new THREE.AnimationClip("SingleRotateBoneAnimation", -1, tracks);
			
			return clip;
		},
		makeSimpleScaleBoneAnimation:function(boneIndies,startScale,endScale,both,duration){
			var tracks=[];
			boneIndies.forEach(function(boneIndex){
				var times=[];
				times.push(0);
				times.push(duration);
				
				if(both){
					times.push(duration*2);
					}
				
				var values=[];
				values=values.concat(new THREE.Vector3().setScalar(startScale).toArray());
				values=values.concat(new THREE.Vector3().setScalar(endScale).toArray());
				
				if(both){
					values=values.concat(new THREE.Vector3().setScalar(startScale).toArray());
					}
				
		
		
				var track=new THREE.VectorKeyframeTrack(".bones["+boneIndex+"].scale", times, values);
				tracks.push(track);
			});
			
			
			
			var clip=new THREE.AnimationClip("makeMultiScaleBoneAnimation", -1, tracks);
			
			return clip;
		},
		makeRandomScaleBoneAnimation:function(boneIndies,minScale,maxScale,duration,randomCount,randomContinue,useSameValue){
			useSameValue=useSameValue!==undefined?useSameValue:false;
			
			var tracks=[];
			var randValues=[];
			var randValuesAdded=false;
			boneIndies.forEach(function(boneIndex){
				
				
				
				var values=[];
				
				function rand(min,max){
					return Math.random() * (max - min) + min;
				}
				var defaultValue=new THREE.Vector3(1,1,1);
				values=values.concat(defaultValue.toArray());
				for(var i=0;i<randomCount;i++){
					
					var r=randValuesAdded && useSameValue ?randValues[i]:rand(minScale,maxScale);
					var vec=new THREE.Vector3().setScalar(r);
					if(randValuesAdded==false){
						randValues.push(r);
					}
					
					for(var j=0;j<randomContinue;j++){
						values=values.concat(vec.toArray());
						values=values.concat(defaultValue.toArray());
					}
					
				}
				
				
				
				var times=[];
				var tsize=values.length/3;
				for(var i=0;i<tsize;i++){
					times.push(duration*i);
				}
				
				
		
				var track=new THREE.VectorKeyframeTrack(".bones["+boneIndex+"].scale", times, values);
				tracks.push(track);
				
				randValuesAdded=true;
			});
			
			
			
			var clip=new THREE.AnimationClip("makeRandomScaleBoneAnimation", -1, tracks);
			
			return clip;
		},
		makeTwoMorphAnimation:function(index1,index2,value1,value2,intime,outtime){
			var trackName1=".morphTargetInfluences["+index1+"]";
			var trackName2=".morphTargetInfluences["+index2+"]";
			
			
			var values1=[0,value1,0,0,0];
			var values2=[0,0,0,value2,0];
			
			var times1=[0,intime,intime+outtime,intime*2+outtime,intime*2+outtime*2];
			var times2=[0,intime,intime+outtime,intime*2+outtime,intime*2+outtime*2];
			
			var track1=new THREE.NumberKeyframeTrack(trackName1,times1,values1);
			var track2=new THREE.NumberKeyframeTrack(trackName2,times2,values2);
			var tracks=[track1,track2];
		
			
			var clip=new THREE.AnimationClip("makeTwoMorphAnimation", -1, tracks);
			return clip
		},
		makeMorphAnimation:function(index1,value1,intime,outtime){
			var trackName1=".morphTargetInfluences["+index1+"]";
			
			
			
			var values1=[0,value1,0];
			
			var times1=[0,intime,intime+outtime];
			
			var track1=new THREE.NumberKeyframeTrack(trackName1,times1,values1);
			var tracks=[track1];
		
			
			var clip=new THREE.AnimationClip("makeMorphAnimation", -1, tracks);
			return clip
		},
		//start -(intime)> end -(outtime)> start
		makeTranslateBoneAnimation:function(indices,startPts,endPts,intime,outtime){
			var tracks=[];
			for(var i=0;i<indices.length;i++){
				var index=indices[i];
				var start=startPts[i];
				var end=endPts[i];
				var values=[];
				values=values.concat(start.toArray());
				values=values.concat(end.toArray());
				values=values.concat(start.toArray());
				
				var times=[0,intime,intime+outtime];
				var track=new THREE.VectorKeyframeTrack(".bones["+index+"].position", times, values);
				tracks.push(track);
			}
			
			var clip=new THREE.AnimationClip("makeTranslateBoneAnimation", -1, tracks);
			return clip
		},
		makeRotateBoneAnimation:function(indices,startRotates,endRotates,intime,outtime){
			var tracks=[];
			for(var i=0;i<indices.length;i++){
				var index=indices[i];
				var start=startRotates[i];
				var end=endRotates[i];
				var values=[];
				values=values.concat(start.toArray());
				values=values.concat(end.toArray());
				values=values.concat(start.toArray());
				
				var times=[0,intime,intime+outtime];
				var track=new THREE.QuaternionKeyframeTrack(".bones["+index+"].quaternion", times, values);
				tracks.push(track);
			}
			
			var clip=new THREE.AnimationClip("makeRotateBoneAnimation", -1, tracks);
			return clip
		},
		makeQuaternionAnimation:function(start,end,intime,outtime){
			intime=intime!==undefined?intime:1;
			outtime=outtime!==undefined?outtime:intime;
			
			var tracks=[];
				var values=[];
				values=values.concat(start.toArray());
				values=values.concat(end.toArray());
				values=values.concat(start.toArray());
				
				var times=[0,intime,intime+outtime];
				var track=new THREE.QuaternionKeyframeTrack(".quaternion", times, values);
				tracks.push(track);
			
			
			var clip=new THREE.AnimationClip("makeRotateAnimation", -1, tracks);
			return clip
		},
		/*
		 * not support interporation
		 */
		makeLoopedTrack:function(track,loopTime){
			var times=[];
			var values=[];
			
			var json=THREE.KeyframeTrack.toJSON(track);
			
			var stime=0;
			for(var i=0;i<loopTime;i++){
				for(var j=0;j<json.values.length;j++){
					values.push(json.values[j]);
				}
				
				for(var j=0;j<json.times.length;j++){
					times.push(json.times[j]+stime);
				}
				stime+=track.times[json.times.length-1];
			}
			
			json.times=times;
			json.values=values;
			var jsonObject={name:"dummy",duration:-1,tracks:[json]};
			return THREE.AnimationClip.parse(jsonObject).tracks[0];
		},
		/*
		 * cant merge difference name track
		 */
		mergeTracks:function(tracks){
	
			var times=[];
			var values=[];
			
			
			var stime=0;
			for(var i=0;i<tracks.length;i++){
				var json=THREE.KeyframeTrack.toJSON(tracks[i]);
				for(var j=0;j<json.values.length;j++){
					values.push(json.values[j]);
				}
				for(var j=0;j<json.times.length;j++){
					times.push(json.times[j]+stime);
				}
				stime+=tracks[i].times[json.times.length-1];
			}
			json.times=times;
			json.values=values;
			var jsonObject={name:"dummy",duration:-1,tracks:[json]};
			return THREE.AnimationClip.parse(jsonObject).tracks[0];
		},
		/* key is index */
		makeRotationPose:function(object){
			var tracks=[];
			Object.keys(object).forEach(function(key){
				var boneIndex=key;
				var q=object[key];
				if((q==undefined) || !q.isQuaternion){
					console.error("makeRotationPose:q is not quaternion",q);
					return null;
				}
				var track=new THREE.QuaternionKeyframeTrack(".bones["+boneIndex+"].quaternion", [0], q.toArray());
				tracks.push(track);
			});
			var clip=new THREE.AnimationClip("makeRotationPose", -1, tracks);
			return clip
		}
		
		
		
}

