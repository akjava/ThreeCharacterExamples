Sidebar.TimelinerMesh=function(ap){
	var container=new UI.TitlePanel("Timeliner Mesh");
	
	
	ap.signals.loadingModelFinished.add(function(mesh){
		if(ap.timeliner!==undefined){
			//
			ap.timeliner.context.controller.setScene(mesh);
			ap.timeliner.context.dispatcher.fire("time.update",0);//reset,Option not move just update
			return;
		}
		
		
		var onUpdate=function(){
			//ap.skinnedMesh.updateMatrixWorld(true);
			ap.signals.rendered.dispatch();//Timeliner mixer and default mixer conflicted and it make fps slow.
		}
		
		//initial
		var trackInfo = [

			{
				type: THREE.VectorKeyframeTrack,
				label:"Mesh Position",
				propertyPath: '.position',
				initialValue: [ 0, 0, 0 ],
				interpolation: THREE.InterpolateSmooth
			},

			{
				type: THREE.QuaternionKeyframeTrack,
				label:"Mesh Quaternion",
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
				ap.timeliner.context.dispatcher.fire('keyframe',"Mesh Position",true);
			}else{
				ap.timeliner.context.dispatcher.fire('keyframe',"Mesh Quaternion",true);
			}
		});
	});
	
	
	return container;
}