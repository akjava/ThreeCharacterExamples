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

	var morphValue=new UI.NumberButtons("value",0,1,1,0,function(v){
		var index=Number(morphList.getValue());
		ap.skinnedMesh.morphTargetInfluences[index]=v;
		
		function getKeyByValue(object, value) {
			  return Object.keys(object).find(key => object[key] === value);
			}
		
		var key=getKeyByValue(application.skinnedMesh.morphTargetDictionary,index);
		
		//mbl3d base
		var header="Expressions_";
		var name=key.substring(header.length,key.length);
		ap.timeliner.context.dispatcher.fire('keyframe',name);
		
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
	
	
	return container;
};
