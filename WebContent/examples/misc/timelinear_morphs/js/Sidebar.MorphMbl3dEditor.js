Sidebar.MorphMbl3dEditor = function ( application ) {
	var ap=application;
	var scope=this;
	var container = new UI.Panel();
	
	this.eyeCheck=true;
	this.browCheck=true;
	this.mouthCheck=true;
	this.tongueCheck=true;
	this.otherCheck=true;
	this.minCheck=true;
	this.maxCheck=true;
	this.directionOtherCheck=true;
	container.setId( 'Morph' );
	
	var titleDiv=new UI.Div().setClass("title").add(new UI.Text("Morph"));
	//container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	var listRow=new UI.Row();
	var morphList=new UI.Select();
	function morphListOnChange(){
		application.morphAnimationIndex=morphList.getValue();
		application.signals.morphAnimationSelectionChanged.dispatch();
		
	}
	morphList.onChange(function(){
		morphListOnChange();
	})
	row1.add(morphList);
	row1.add(listRow);
	
	var morphValue=new UI.NumberButtons("value",0,1,1,0,function(v){
		var index=Number(morphList.getValue());
		ap.skinnedMesh.morphTargetInfluences[index]=v;
		
		
		
		var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,index);
		
		//mbl3d base
		var header="Expressions_";
		var name=key.substring(header.length,key.length);
		ap.timeliner.context.dispatcher.fire('keyframe',name,true);
		
	},[0,0.25,0.5,0.75,1]);
	morphValue.text.setWidth("50px");
	container.add(morphValue);
	
	var typeRow=new UI.Row();
	container.add(typeRow);
	var eyeBt=new UI.Button("Eye").onClick(function(){
		scope.eyeCheck=true;
		scope.browCheck=false;
		scope.mouthCheck=false;
		scope.tongueCheck=false;
		scope.otherCheck=false;
		updateMorphList();
	});
	typeRow.add(eyeBt);
	var browBt=new UI.Button("Brow").onClick(function(){
		scope.eyeCheck=false;
		scope.browCheck=true;
		scope.mouthCheck=false;
		scope.tongueCheck=false;
		scope.otherCheck=false;
		updateMorphList();
	});
	typeRow.add(browBt);
	var mouthBt=new UI.Button("Mouth").onClick(function(){
		scope.eyeCheck=false;
		scope.browCheck=false;
		scope.mouthCheck=true;
		scope.tongueCheck=false;
		scope.otherCheck=false;
		updateMorphList();
	});
	typeRow.add(mouthBt);
	var tongueBt=new UI.Button("Tongue").onClick(function(){
		scope.eyeCheck=false;
		scope.browCheck=false;
		scope.mouthCheck=false;
		scope.tongueCheck=true;
		scope.otherCheck=false;
		updateMorphList();
	});
	typeRow.add(tongueBt);
	var otherBt=new UI.Button("Other").onClick(function(){
		scope.eyeCheck=false;
		scope.browCheck=false;
		scope.mouthCheck=false;
		scope.tongueCheck=false;
		scope.otherCheck=true;
		updateMorphList();
	});
	typeRow.add(otherBt);
	var allBt=new UI.Button("All").onClick(function(){
		scope.eyeCheck=true;
		scope.browCheck=true;
		scope.mouthCheck=true;
		scope.tongueCheck=true;
		scope.otherCheck=true;
		updateMorphList();
	});
	typeRow.add(allBt);
	
	var row=new UI.Row();//testing
	//container.add(row);
	var eyeCheck=new UI.CheckboxText("Eye",scope.eyeCheck,function(v){
		scope.eyeCheck=v;
		updateMorphList();
	});
	eyeCheck.text.setWidth("25px");
	row.add(eyeCheck);
	var browCheck=new UI.CheckboxText("Brow",scope.browCheck,function(v){
		scope.browCheck=v;
		updateMorphList();
	});
	browCheck.text.setWidth("35px");
	row.add(browCheck);
	var mouthCheck=new UI.CheckboxText("Mouth",scope.mouthCheck,function(v){
		scope.mouthCheck=v;
		updateMorphList();
	});
	mouthCheck.text.setWidth("40px");
	row.add(mouthCheck);
	var tongueCheck=new UI.CheckboxText("Tongue",scope.tongueCheck,function(v){
		scope.tongueCheck=v;
		updateMorphList();
	});
	row.add(tongueCheck);
	var otherCheck=new UI.CheckboxText("Other",scope.otherCheck,function(v){
		scope.otherCheck=v;
		updateMorphList();
	});
	row.add(otherCheck);
	
	var row2=new UI.Row();
	container.add(row2);
	
	var minBt=new UI.Button("Min Only").onClick(function(){
		scope.minCheck=true;
		scope.maxCheck=false;
		updateMorphList();
	});
	row2.add(minBt);
	var maxBt=new UI.Button("Max Only").onClick(function(){
		scope.minCheck=false;
		scope.maxCheck=true;
		updateMorphList();
	});
	row2.add(maxBt);
	var bothBt=new UI.Button("Both").onClick(function(){
		scope.minCheck=true;
		scope.maxCheck=true;
		updateMorphList();
	});
	row2.add(bothBt);
	
	var bothBt=new UI.Button("SW Min/Max").onClick(function(){
		var current=morphList.getValue();
		scope.minCheck=true;
		scope.maxCheck=true;
		updateMorphList();
		
		var list=Object.keys(scope.options);
		var index=list.indexOf(current);
		var values=Object.values(scope.options);
		var value=values[index];
		var minmax=null;
		if(value.indexOf("_min")!=-1){
			minmax=value.replace("_min","_max");
		}else if(value.indexOf("_max")!=-1){
			minmax=value.replace("_max","_min");
		}
		if(minmax!=null){
			var ind=values.indexOf(minmax);
			var minmaxIndex=list[ind];
			morphList.setValue(minmaxIndex);
			morphListOnChange();
		}else{
			morphList.setValue(current);
			morphListOnChange();
		}
		
		
	});
	row2.add(bothBt);
	

	
	application.signals.morphAnimationSelectionChanged.add(function(){
		var index=Number(morphList.getValue());
		var v=ap.skinnedMesh.morphTargetInfluences[index];
		morphValue.number.setValue(v);
	});

	function getKeyByValue(object, value) {
		  return Object.keys(object).find(key => object[key] === value);
		}
	

	
	
	function updateMorphList(){
		var header="Expressions_";
		
		
		//swap and shorten
		var options={};
		var firstOne=null;
		for ( var key in application.skinnedMesh.morphTargetDictionary ) {
			var name=key.substring(header.length,key.length);
			var type=Mbl3dUtils.getMorphTargetTypeName(name);
			var add=false;
			switch(type){
			case "eye":
				if(scope.eyeCheck)
					add=true;
				break;
			case "brow":
				if(scope.browCheck)
					add=true;
				break;
			case "mouth":
				if(scope.mouthCheck)
					add=true;
				break;
			case "tongue":
				if(scope.tongueCheck)
					add=true;
				break;
			case "other":
				if(scope.otherCheck)
					add=true;
				break;
			}
			if(add){
				var dtype=Mbl3dUtils.getMorphDirectionTypeName(name);
				add=false;
				switch(dtype){
				case "min":
					if(scope.minCheck)
						add=true;
					break;
				case "max":
					if(scope.maxCheck)
						add=true;
					break;
				case "other":
					if(scope.otherDirectionCheck)
						add=true;
					break;
				}
				if(add){
					var index=application.skinnedMesh.morphTargetDictionary[key];
					if(firstOne==null){
						firstOne=index;
					}
					options[index]=key.substring(header.length,key.length);	
				}
				
			}
				
		}
		scope.options=options;
		morphList.setOptions(options);
		morphList.setValue(firstOne);//TODO keep value?
	}
	
	var prevBt=new UI.Button("Prev").onClick(function(){
		var v=morphList.getValue();
		var list=Object.keys(scope.options);
		var index=list.indexOf(v);
		var next=index-1;
		if(next<0){
			next=list.length-1;
		}
		morphList.setValue(list[next]);
		morphListOnChange();
	});
	listRow.add(prevBt);
	
	var nextBt=new UI.Button("Next").onClick(function(){
		var v=morphList.getValue();
		var list=Object.keys(scope.options);
		var index=list.indexOf(v);
		var next=index+1;
		if(next>=list.length){
			next=0;
		}
		morphList.setValue(list[next]);
		morphListOnChange();
	});
	listRow.add(nextBt);
	
	var switchLR=new UI.Button("Switch LR").onClick(function(){
		var v=morphList.getValue();
		var list=Object.keys(scope.options);
		var index=list.indexOf(v);
		var values=Object.values(scope.options);
		var value=values[index];
		var lr=null;
		if(value.indexOf("R_")!=-1){
			lr=value.replace("R_","L_");
		}else if(value.indexOf("L_")!=-1){
			lr=value.replace("L_","R_");
		}
		if(lr!=null){
			var ind=values.indexOf(lr);
			var lrIndex=list[ind];
			morphList.setValue(lrIndex);
			morphListOnChange();
		}
	});
	listRow.add(switchLR);
	
	var copyLR=new UI.Button("Copy to LR").onClick(function(){
		var v=morphList.getValue();
		var list=Object.keys(scope.options);
		var index=list.indexOf(v);
		var values=Object.values(scope.options);
		var value=values[index];
		var lr=null;
		if(value.indexOf("R_")!=-1){
			lr=value.replace("R_","L_");
		}else if(value.indexOf("L_")!=-1){
			lr=value.replace("L_","R_");
		}
		if(lr!=null){
			var ind=values.indexOf(lr);
			var lrIndex=list[ind];
			
			var fromV=application.skinnedMesh.morphTargetInfluences[Number(v)];
			application.skinnedMesh.morphTargetInfluences[Number(lrIndex)]=fromV;
			
			ap.timeliner.context.dispatcher.fire('keyframe',lr,true);
		}
	});
	listRow.add(copyLR);
	
	//hook
	application.signals.loadingModelFinished.add(function(){
		updateMorphList();
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
				//application.skinnedMesh.morphTargetInfluences[i]=0;//seems not set 0
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
				ap.timeliner.context.dispatcher.fire('keyframe',name);
			}
		}
		ap.timeliner.context.controller.setDisplayTime(0);
		ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
	});
	container.add(clearAllBt);
	var clearBt=new UI.Button("Clear Keys").onClick(function(){
		for(var i=0;i<application.skinnedMesh.morphTargetInfluences.length;i++){
			var v=application.skinnedMesh.morphTargetInfluences[i];
			//if(v!=0){ //for after edit
				var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,i);
				//application.skinnedMesh.morphTargetInfluences[i]=0;//seems not set 0
				//mbl3d base
				var header="Expressions_";
				var name=key.substring(header.length,key.length);
				ap.timeliner.context.dispatcher.fire('keyframe',name,true);
				ap.timeliner.context.dispatcher.fire('keyframe',name);
				
				//ap.timeliner.context.currentTime=0;//not fixed
				
			//}
		}
		ap.timeliner.context.controller.setDisplayTime(0);
		ap.timeliner.context.controller.setDisplayTime(ap.timeliner.context.currentTime);
	});
	clearAllBt.add(clearBt);
	
	return container;
};
