Sidebar.MorphSimpleEditor = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.Panel();
	container.setId( 'Morph' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Morph"));
	//container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	var morphList=new UI.Select();
	morphList.onChange(function(){
		application.morphAnimationIndex=morphList.getValue();
		application.signals.morphAnimationSelectionChanged.dispatch();
		
	})
	row1.add(morphList);
	
	application.signals.morphAnimationSelectionChanged.add(function(){
		var index=Number(morphList.getValue());
		var v=ap.skinnedMesh.morphTargetInfluences[index];
		morphValue.number.setValue(v);
	});

	function getKeyByValue(object, value) {
		  return Object.keys(object).find(key => object[key] === value);
		}
	
	var morphValue=new UI.NumberButtons("value",0,1,1,0,function(v){
		var index=Number(morphList.getValue());
		ap.skinnedMesh.morphTargetInfluences[index]=v;
		
		
		
		var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,index);
		
		//mbl3d base
		var header="Expressions_";
		var name=key.substring(header.length,key.length);
		ap.timeliner.context.dispatcher.fire('keyframe',name,true);
		
	},[0,0.5,1]); 
	container.add(morphValue);
	
	
	
	//hook
	application.signals.loadingModelFinished.add(function(){
		var header="Expressions_";
		
		
		//swap and shorten
		var options={};
		
		for ( var key in application.skinnedMesh.morphTargetDictionary ) {
			options[application.skinnedMesh.morphTargetDictionary[key]]=key.substring(header.length,key.length);	
		}
		
		morphList.setOptions(options);
		morphList.setValue(0);//TODO keep value?
	})
	
	var resetBt=new UI.ButtonRow("Insert 0 All",function(){
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			var v=application.skinnedMesh.morphTargetInfluences[i];
			//if(v!=0){ //for after edit
				var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,i);
				application.skinnedMesh.morphTargetInfluences[i]=0;
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
			//}
		}
	});
	container.add(resetBt);
	var replaceBt=new UI.Button("Replace 0 ").onClick(function(){
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			var v=application.skinnedMesh.morphTargetInfluences[i];
			if(v!=0){ //for after edit
				var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,i);
				application.skinnedMesh.morphTargetInfluences[i]=0;
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
			}
		}
	});
	resetBt.add(replaceBt);
	
	var copyBt=new UI.Button("Copy Not 0 Value").onClick(function(){
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			var v=application.skinnedMesh.morphTargetInfluences[i];
			if(v!=0){ //for after edit
				var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,i);
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
			}
		}
	});
	resetBt.add(copyBt);
	var clearAllBt=new UI.ButtonRow("Clear 0 keys",function(){
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			var v=application.skinnedMesh.morphTargetInfluences[i];
			if(v==0){ //for after edit
				var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,i);
				application.skinnedMesh.morphTargetInfluences[i]=0;
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
				ap.timeliner.context.dispatcher.fire('keyframe',name);
			}
		}
	});
	container.add(clearAllBt);
	var clearBt=new UI.Button("Clear Keys").onClick(function(){
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			var v=application.skinnedMesh.morphTargetInfluences[i];
			//if(v!=0){ //for after edit
				var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,i);
				application.skinnedMesh.morphTargetInfluences[i]=0;
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
				ap.timeliner.context.dispatcher.fire('keyframe',name);
			//}
		}
	});
	clearAllBt.add(clearBt);
	
	return container;
};
