Sidebar.MorphTest = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.Panel();
	container.setId( 'Morph' );
	
	
	
	ap.morphAnimationIndex=0;
	ap.animationTime=1.0
	ap.animationDirection=true;
	ap.animationMaxValue=1.0;
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Morph Test"));
	//container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var morphList=new UI.Select();
	morphList.onChange(function(){
		application.morphAnimationIndex=morphList.getValue();
		application.signals.morphAnimationSelectionChanged.dispatch();
		if(scope.autoPlay){
			application.signals.morphAnimationStarted.dispatch();
		}
	})
	row1.add(morphList);
	
	
	var row2=new UI.Row();
	container.add(row2);
	
	var row2text=new UI.Text("Time").setWidth( '90px' );
	row2.add(row2text);
	
	var timeNumber=new UI.Number().setWidth('60px');;
	timeNumber.min=0;
	timeNumber.max=10;
	timeNumber.step=0.5;
	timeNumber.unit=" sec";
	timeNumber.setValue(application.animationTime);
	
	
	function updateAnimationTime(){
		application.animationTime=timeNumber.getValue();
		if(scope.autoPlay){
		application.signals.morphAnimationStarted.dispatch();
		}
	}
	timeNumber.onChange(function(){
		updateAnimationTime();
	});
	row2.add(timeNumber);
	
	row2.add(new UI.Button("0.1").onClick(function(){timeNumber.setValue(0.1);updateAnimationTime()}));
	row2.add(new UI.Button("0.5").onClick(function(){timeNumber.setValue(0.5);updateAnimationTime()}));
	row2.add(new UI.Button("1.0").onClick(function(){timeNumber.setValue(1.0);updateAnimationTime()}));
	
	
	var row3=new UI.Row();
	container.add(row3);
	var row3text=new UI.Text("Both Direction").setWidth( '90px' );
	row3.add(row3text);
	
	var directionCheck=new UI.Checkbox();
	directionCheck.setValue(application.animationDirection);
	
	
	
	directionCheck.onChange(function(){
		application.animationDirection=directionCheck.getValue();
		if(scope.autoPlay){
		application.signals.morphAnimationStarted.dispatch();
		}
	});
	row3.add(directionCheck);
	
	var row4=new UI.Row();
	container.add(row4);
	var row4text=new UI.Text("Max Value").setWidth( '90px' );
	row4.add(row4text);
	
	var maxNumber=new UI.Number().setWidth('60px');
	maxNumber.min=0;
	maxNumber.max=1;
	maxNumber.step=0.5;
	maxNumber.setValue(application.animationMaxValue);
	
	function updateAnimationMaxValue(){
		application.animationMaxValue=maxNumber.getValue();
		application.signals.morphAnimationSelectionChanged.dispatch();
		
		if(scope.autoPlay){
		application.signals.morphAnimationStarted.dispatch();
		}
	}
	
	maxNumber.onChange(function(){
		updateAnimationMaxValue();
	});
	row4.add(maxNumber);
	
	row4.add(new UI.Button("0.5").onClick(function(){maxNumber.setValue(0.5);updateAnimationMaxValue()}));
	row4.add(new UI.Button("0.7").onClick(function(){maxNumber.setValue(0.7);updateAnimationMaxValue()}));
	row4.add(new UI.Button("1.0").onClick(function(){maxNumber.setValue(1.0);updateAnimationMaxValue()}));
	
	
	var row5=new UI.Row();
	container.add(row5);
	var bt1=new UI.Button("Play");
	bt1.onClick(function(){
		application.signals.morphAnimationStarted.dispatch();
	})
	row5.add(bt1);
	
	var bt2=new UI.Button("Stop");
	bt2.onClick(function(){
		application.signals.morphAnimationFinished.dispatch();
		application.signals.morphAnimationSelectionChanged.dispatch();
	})
	row5.add(bt2);
	bt2.setDisabled(true);
	
	application.getSignal("morphAnimationStarted").add(function(){
		bt1.setDisabled(true);
		bt2.setDisabled(false);
	});
	application.getSignal("morphAnimationFinished").add(function(){
		bt1.setDisabled(false);
		bt2.setDisabled(true);
	});
	
	
	this.autoPlay=false;
	row5.add(new UI.Text("Auto play"));
	var autoPlayCheck=new UI.Checkbox();
	row5.add(autoPlayCheck);
	autoPlayCheck.setValue(this.autoPlay);
	autoPlayCheck.onChange(function(){
		scope.autoPlay=autoPlayCheck.getValue();
	});
	
	//hook
	application.signals.loadingModelFinished.add(function(){
		var header="Expressions_";
		
		Logics.disposeSkinnedMeshMixer(ap);
		
		
		
		//swap and shorten
		var options={};
		
		for ( var key in application.skinnedMesh.morphTargetDictionary ) {
			options[application.skinnedMesh.morphTargetDictionary[key]]=key.substring(header.length,key.length);	
		}
		
		morphList.setOptions(options);
		morphList.setValue(0);//TODO keep value?
		
		application.signals.morphAnimationFinished.dispatch();
	});
	
	function stopAnimation(){
		clearmorphTargetInfluences();
		if(ap.mixer)
			ap.mixer.stopAllAction();
	}
	function clearmorphTargetInfluences(){
		//reset morphtargets.
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			application.skinnedMesh.morphTargetInfluences[i]=0;
		}
	}
	application.morphAnimationIndex=0;
	function startAnimation(){
			
			Logics.initializeSkinnedMeshMixer(ap);
			var mixer=ap.mixer;
			
			var index=application.morphAnimationIndex;
			var skinnedMesh=application.skinnedMesh;
			
			
			
			var name="animation";
			mixer.stopAllAction();
			mixer.uncacheClip(name);
			
			clearmorphTargetInfluences();
			
			
			
			var trackName=".morphTargetInfluences["+index+"]";
			
			var duration=application.animationTime;
			var max=application.animationMaxValue;
			var values=application.animationDirection?[0,max,0]:[0,max];
			var times=application.animationDirection?[0,duration,duration*2]:[0,duration];
			
			var track=new THREE.NumberKeyframeTrack(trackName,times,values);
			var tracks=[track];
			
			var clip=new THREE.AnimationClip(name, -1, tracks);
			
			
			
			
			mixer.clipAction(clip).play();
			
	}
	
	ap.getSignal("morphAnimationStarted").add(function(){
		startAnimation();
	});
	
	ap.getSignal("morphAnimationFinished").add(function(){
		stopAnimation();
	});
	
	ap.getSignal("morphAnimationSelectionChanged").add(function(){
		var index=application.morphAnimationIndex;
		var skinnedMesh=application.skinnedMesh;
		var max=application.animationMaxValue;
		clearmorphTargetInfluences();
		skinnedMesh.morphTargetInfluences[index]=max;
	});
	
	
	return container;
};
