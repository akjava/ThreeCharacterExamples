Sidebar.VrmTimelinerBlendShape=function(ap){
	var container=new UI.TitlePanel("Vrm Timeliner BlendShape");
	
	var clipboard={};
	var scope=this;
	this.logging=false;
	
	
	
	function cutFrame(){
		
	}
	
	function copyFrame(){
		
		}
	
	function pasteFrames(){
		
		if(ap.timeliner.context.playing){
			console.log("can't add frame when playing");
			return;
		}
	}
	
	var row=new UI.Row();
	container.add(row);
	
	var cutBt=new UI.Button("Cut").onClick(function(){
		cutFrame();
	});
	row.add(cutBt);
	
	var copyBt=new UI.Button("Copy").onClick(function(){
		copyFrame();
	});
	row.add(copyBt);
	
	var pasteBt=new UI.Button("Paste").onClick(function(){
		pasteFrames();
	});
	row.add(pasteBt);
	
	

	
	
	
	
	var blendShapeValues={};
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.timeliner!==undefined){
			ap.timeliner.context.dispatcher.fire("time.update",0);//reset,Option not move just update
			return;
		}
		
		
		var onUpdate=function(time){
			ap.getSignal("VrmBlendShapeChanged").remove(onChanged);
			ap.getSignal("VrmBlendShapeChanged").dispatch(blendShapeValues);
			ap.getSignal("VrmBlendShapeChanged").add(onChanged);
			ap.getSignal("timelinerSeeked").dispatch(time);
		}
		
		var onChanged=function(vs){
			console.log(vs);
			Object.keys(blendShapeValues).forEach(function(key){
				blendShapeValues[key]=0;
			});
			
			shapeNames.forEach(function(name){
				blendShapeValues[name]=vs[name]?vs[name]:0;
				console.log("update",name,blendShapeValues[name]);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
			});
			
		}
		ap.getSignal("VrmBlendShapeChanged").add(onChanged);
		
		
		var trackInfo = [
			
		];
		
		
		var shapeNames=VrmUtils.blendShapeNames;
		for(var i=0;i<shapeNames.length;i++){
			var name=shapeNames[i];
			blendShapeValues[name]=0;
			var info={type: THREE.NumberKeyframeTrack,
					label:name,
					propertyPath:"."+name,
					initialValue: [ 0 ],
					interpolation: THREE.InterpolateLinear
					}
			trackInfo.push(info);
	
		}
		
		var timeliner=new Timeliner( new THREE.TimelinerController( blendShapeValues, trackInfo, onUpdate ) );
		ap.timeliner=timeliner;
		
		timeliner.context.dispatcher.fire('totalTime.update',3);
		timeliner.context.timeScale=120;
		timeliner.context.fileName="timeline_mesh_animation";
	});
	
	
	return container;
}