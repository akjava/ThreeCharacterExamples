Sidebar.TimelinerFingerPresets=function(ap){
	var scope=this;
	var container=new UI.TitlePanel("Timeliner Finger Presets");
	
	var controlRow=new UI.Row();
	container.add(controlRow);
	
	function clearFrame(key){
		ap.timeliner.context.dispatcher.fire('keyframe',key,true);
		ap.timeliner.context.controller.setDisplayTime(0);
		ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
		ap.timeliner.context.dispatcher.fire('keyframe',key);
		ap.timeliner.context.controller.setDisplayTime(0);
		ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
	}
	
	var cutBt=new UI.Button("Cut").onClick(function(){
		var target=targetList.getValue();
		if(target=="Both" || target=='Left'){
			clearFrame("Left PresetName");
			clearFrame("Left Intensity");
		}
		if(target=="Both" || target=='Right'){
			clearFrame("Right PresetName");
			clearFrame("Right Intensity");
		}
	});
	controlRow.add(cutBt);
	
	var copyBt=new UI.Button("Copy").onClick(function(){
		var target=targetList.getValue();
		var clipboard={};
		//if(target=="Both" || target=='Left'){
			clipboard.presetNameL=ap.fingerPresetsControler.presetNameL;
			clipboard.intensityL=ap.fingerPresetsControler.intensityL;
		//}
		//if(target=="Both" || target=='Right'){
			clipboard.presetNameR=ap.fingerPresetsControler.presetNameR;
			clipboard.intensityR=ap.fingerPresetsControler.intensityR;
		//}
		scope.clipboard=clipboard;
	});
	controlRow.add(copyBt);
	
	var pasteBt=new UI.Button("Paste").onClick(function(){
		var target=targetList.getValue();
		
		if(!scope.clipboard){
			return
		}
		var clipboard=scope.clipboard;

		if(target=="Both" || target=='Left'){
			if(clipboard.presetNameL)
			ap.fingerPresetsControler.presetNameL=clipboard.presetNameL;
			
			if(clipboard.intensityL)
			ap.fingerPresetsControler.intensityL=clipboard.intensityL;
		}
		if(target=="Both" || target=='Right'){
			if(clipboard.presetNameR)
			ap.fingerPresetsControler.presetNameR=clipboard.presetNameR;
			if(clipboard.intensityR)
			ap.fingerPresetsControler.intensityR=clipboard.intensityR;
		}
		ap.fingerPresetsControler.update();
		
	});
	controlRow.add(pasteBt);
	
	var targetList=new UI.List(["Both","Left","Right"],function(v){
		
	});
	targetList.setMarginLeft("8px");
	
	controlRow.add(targetList);
	
	
	
	//mesh must be same bone structure.
	//timeliner controller target is ap.fingerPresetsControler ,that is always directlly call ap.skinnedMesh,so no need change target.
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.timeliner!==undefined){
			ap.timeliner.context.dispatcher.fire("time.update",0);
			return;
		}
		
		var trackInfo = [];
		var leftPreset={type: THREE.StringKeyframeTrack,
				label:"Left PresetName",
				propertyPath:".presetNameL",
				initialValue: ["default"]
				};
		trackInfo.push(leftPreset);
		var leftIntensity={type: THREE.NumberKeyframeTrack,
				label:"Left Intensity",
				propertyPath:".intensityL",
				initialValue: [1.0],
				interpolation: THREE.InterpolateLinear
				};
		trackInfo.push(leftIntensity);
		
		var rightPreset={type: THREE.StringKeyframeTrack,
				label:"Right PresetName",
				propertyPath:".presetNameR",
				initialValue: ["default"]
				};
		trackInfo.push(rightPreset);
		var rightIntensity={type: THREE.NumberKeyframeTrack,
				label:"Right Intensity",
				propertyPath:".intensityR",
				initialValue: [1.0],
				interpolation: THREE.InterpolateLinear
				};
		trackInfo.push(rightIntensity);
		
		function onUpdate(time){
			ap.fingerPresetsControler.update(false);
			ap.getSignal("timelinerSeeked").dispatch(time);
		}
		
		
		var timeliner=new Timeliner( new THREE.TimelinerController( ap.fingerPresetsControler, trackInfo, onUpdate ) );
		ap.timeliner=timeliner;
		timeliner.setVisible(true);
		
		timeliner.context.dispatcher.fire('totalTime.update',3);
		timeliner.context.timeScale=120;
		timeliner.context.fileName="fingerAnimation";
	});
	
	
	function getBoneName(index){
		return BoneUtils.getBoneList(ap.skinnedMesh)[index];
	}
	
	ap.getSignal("fingerPresetChanged").add(function(isL,fireEvent){
		fireEvent=fireEvent==undefined?true:fireEvent;
		
		if(!fireEvent){
			return;
		}
		if(isL){
			ap.timeliner.context.dispatcher.fire('keyframe',"Left PresetName",true);
			ap.timeliner.context.dispatcher.fire('keyframe',"Left Intensity",true);
		}else{
			ap.timeliner.context.dispatcher.fire('keyframe',"Right PresetName",true);
			ap.timeliner.context.dispatcher.fire('keyframe',"Right Intensity",true);
		}
	});
	
	
	var dummy=new FingerPresetsDummyControler();
	
	var dummyMixer=new THREE.AnimationMixer(dummy);
	container.add(new UI.Subtitle("Timeliner to Clip"));
	
	var btRow=new UI.ButtonRow("Preview",function(){
		
		var updateMixer=function (){
			var delta = ap.clock.getDelta();
			ap.mixer.update(delta);
		};
		
		if(ap.mixer==undefined){
			console.info("ap.mixer is undefined,mixer created,warn signals calling oeder is not sure.if frame dropped make mixer update first");
			ap.mixer=new THREE.AnimationMixer(ap.skinnedMesh);
			ap.clock=new THREE.Clock();
			
			ap.signals.rendered.add(updateMixer);
		}
		var mixer=ap.mixer;
		mixer.stopAllAction();
		
		var tclip=ap.timeliner.context.controller._clip;
		dummyMixer.stopAllAction();
		var action=dummyMixer.clipAction(tclip ).play();
		
		//L
		
		//TODO merge name & intensity times,
		
		function mergeTime(time,itime){
			var tall={};
			for(var i=0;i<time.length;i++){
				tall[time[i]]="";
			}
			for(var i=0;i<itime.length;i++){
				tall[itime[i]]="";
			}
			var totalTime=Object.keys(tall).sort(function(a, b) {
				  return a - b;
			});
			return totalTime;
		}
		
	
		
		function makeClip(isL){
			var tindex=isL?0:2;
			var time=tclip.tracks[tindex].times;
			var itime=tclip.tracks[tindex+1].times;
			
			var totalTime=mergeTime(time,itime);
			var indices=ap.fingerPresetsControler.getFingerBoneIndices(isL);
			
			var times=[];
			var values=[];
			indices.forEach(function(index){
				times.push([]);
				values.push([]);
			});
			
			for(var i=0;i<totalTime.length;i++){
				var t=totalTime[i];
				action.time=t;
				dummyMixer.update(0);
				
				var preset=isL?dummy.presetNameL:dummy.presetNameR;
				var intensity=isL?dummy.intensityL:dummy.intensityR;
				
				//console.log(t,preset,intensity,"total-length:",totalTime.length);
				
				for(var j=0;j<indices.length;j++){
					var index=indices[j];
					var q=ap.fingerPresetsControler.convertToQuaternion(index,preset,intensity,isL);
					times[j].push(t);
					values[j]=values[j].concat(q.toArray());
				}
			}
			var tracks=[];
			for(var j=0;j<indices.length;j++){
				var index=indices[j];
				var track=new THREE.QuaternionKeyframeTrack(".bones["+index+"].quaternion",times[j],values[j]);
				tracks.push(track);
			}
			var clip = new THREE.AnimationClip( 'clip', -1, tracks );
			return clip;
		}
		
		var leftClip=makeClip(true);
		var rightClip=makeClip(false);
	
		//TODO set duration
		var mixedClip=AnimeUtils.concatClips([leftClip,rightClip],"FingerTimelinerClip");
	
		
		mixedClip.duration=tclip.duration;
			
		
		//TODO
		mixer.clipAction( mixedClip ).play();
		ap.clip=mixedClip;
	});
	container.add(btRow);
	
	var stopBt=new UI.Button("Stop").onClick(function(){
		if(ap.mixer)
		ap.mixer.stopAllAction();
	});
	btRow.add(stopBt);
	this.fileName="";
	var bt=new UI.Button("Download").onClick( function () {
		if(!ap.clip){
			console.log("TODO click preview first");
			return;
		}
			
		
		
		var defaultName=ap.timelinerClipExportName==undefined?"timeliner_finger_clip":ap.timelinerClipExportName;
		var fileName=scope.fileName == ""?defaultName:scope.fileName;
		
		fileName=fileName+".json";
		var jsonText=AnimeUtils.clipToJsonText(ap.clip);
		var link=AppUtils.generateTextDownloadLink(jsonText,fileName,fileName,false);
		
		link.click();

	} );
	btRow.add(bt);
	
	
	
	return container;
}