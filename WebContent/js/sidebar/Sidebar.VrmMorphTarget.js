Sidebar.VrmMorphTarget=function(ap){
	var container=new UI.TitlePanel("Vrm MorphTarget");
	

	
	function getMesh(){
		var value=itemList.getValue();
		if(value==""){
			return null;
		}
		var target=ap.skinnedMesh.getObjectById(Number(value));
		return target
	}
	
	var itemList=new UI.Select();
	container.add(itemList);
	itemList.onChange(function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		var options={};
		if(target.morphTargetDictionary){
			morphList.setDisabled(false);
			morphValue.setDisabled(false);
			
			Object.keys(target.morphTargetDictionary).forEach(function(key){
				options[target.morphTargetDictionary[key]]=key;
			});
		}else{
			morphList.setDisabled(true);
			morphValue.setDisabled(true);
		}
		morphList.select.setOptions(options);
		morphList.select.setValue("");
		
	});
	
	ap.getSignal("loadingModelFinished").add(function(model){
		var keys={};
		model.traverse(function(model){
			if(model.isSkinnedMesh){
				keys[model.id]=model.name;
			}
		});
		itemList.setOptions(keys);
		itemList.setValue("");
		morphList.select.setValue("");
	});
	
	var morphList=new UI.SelectRow("morph",{},function(v){
		var mesh=getMesh();
		
		var value=mesh.morphTargetInfluences[v];
		morphValue.setValue(value);
	});
	container.add(morphList);
	

	var morphValue=new UI.NumberButtons("morphValue",0,1,1,0,function(v){
		var mesh=getMesh();
		var morphIndex=morphList.getValue();
		mesh.morphTargetInfluences[morphIndex]=v;
	},[0,0.5,1])
	container.add(morphValue);
	

	
	
	return container;
}