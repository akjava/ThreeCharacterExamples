Sidebar.TimelinerMesh=function(ap){
	var container=new UI.TitlePanel("Timeliner Mesh");
	
	
	//maybe should use binding,I dont know how to do.
	
	var clipboard={};
	function copyFrame(key){
		var value;
		if(key==keyMeshPosition){
			value=ap.skinnedMesh.position;
		}else{
			value=ap.skinnedMesh.quaternion;
		}
		clipboard[key]=value.clone();
	}
	function pasteFrames(){
		Object.keys(clipboard).forEach(function(key){
			var value=clipboard[key];
			if(key==keyMeshPosition){
				ap.skinnedMesh.position.copy(value);
			}else{
				ap.skinnedMesh.quaternion.copy(value);
			}
			
			ap.timeliner.context.dispatcher.fire('keyframe',key,true);
		});
	}
	
	var keyMeshPosition="Mesh Position";
	var keyMeshQuaternion="Mesh Quaternion";
	
	var keyGroups={};
	keyGroups["Both"]=[keyMeshPosition,keyMeshQuaternion];
	keyGroups["Position"]=[keyMeshPosition];
	keyGroups["Quaternion"]=[keyMeshQuaternion];
	
	var row=new UI.Row();
	container.add(row);
	var commandList=new UI.List(["Cut","Copy","Paste"],function(v){
		//do nothing
		if(v=="Paste"){
			targetList.setDisabled(true);
		}else{
			targetList.setDisabled(false);
		}
	});
	//row.add(commandList);
	
	var cutBt=new UI.Button("Cut").onClick(function(){
		var targets=keyGroups[targetList.getValue()];
		
			clipboard={};
			targets.forEach(function(target){
				copyFrame(target);
				Logics.timeliner_clearFrame(ap,target);
			});
	});
	row.add(cutBt);
	var copyBt=new UI.Button("Copy").onClick(function(){
		var targets=keyGroups[targetList.getValue()];
			clipboard={};
			targets.forEach(function(target){
				copyFrame(target);
			});
	});
	row.add(copyBt);
	var pasteBt=new UI.Button("Paste(No care target)").onClick(function(){
			pasteFrames();
	});
	row.add(pasteBt);
	
	
	var targetList=new UI.ListRow("Target",Object.keys(keyGroups),function(v){
		//do nothing
	});
	
	container.add(targetList);
	

	
	ap.getSignal("poseChanged").add(function(){
		keyGroups["Both"].forEach(function(key){
			ap.timeliner.context.dispatcher.fire('keyframe',key,true);
		});
	});
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.timeliner!==undefined){
			//
			ap.timeliner.context.controller.setScene(mesh);
			ap.timeliner.context.dispatcher.fire("time.update",0);//reset,Option not move just update
			return;
		}
		
		
		var onUpdate=function(){
			ap.getSignal("meshTransformChanged").dispatch("translate");
			ap.getSignal("meshTransformChanged").dispatch("rotate");
			//ap.skinnedMesh.updateMatrixWorld(true);
			ap.signals.rendered.dispatch();//Timeliner mixer and default mixer conflicted and it make fps slow.
		}
		
		//initial
		
		var trackInfo = [

			{
				type: THREE.VectorKeyframeTrack,
				label:keyMeshPosition,
				propertyPath: '.position',
				initialValue: [ 0, 0, 0 ],
				interpolation: THREE.InterpolateSmooth
			},

			{
				type: THREE.QuaternionKeyframeTrack,
				label:keyMeshQuaternion,
				propertyPath: '.quaternion',
				initialValue: [ 0, 0, 0, 1 ],
				interpolation: THREE.InterpolateLinear

			}

		];
		var timeliner=new Timeliner( new THREE.TimelinerController( ap.skinnedMesh, trackInfo, onUpdate ) );
		ap.timeliner=timeliner;
		
		timeliner.context.dispatcher.fire('totalTime.update',3);
		timeliner.context.timeScale=120;
		timeliner.context.fileName="timeline_mesh_animation";
		
		ap.getSignal("meshTransformFinished").add(function(mode){
			if(mode=="translate"){
				ap.timeliner.context.dispatcher.fire('keyframe',keyMeshPosition,true);
			}else{
				ap.timeliner.context.dispatcher.fire('keyframe',keyMeshQuaternion,true);
			}
		});
	});
	
	
	return container;
}