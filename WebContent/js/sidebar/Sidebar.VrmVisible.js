Sidebar.VrmVisible=function(ap){
	var container=new UI.TitlePanel("Visible");
	

	
	
	
	var itemList=new UI.Select();
	container.add(itemList);
	itemList.onChange(function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		
		checkRow.setValue(target.material.visible);
		wireRow.setValue(target.material.wireframe);
	});
	
	ap.getSignal("loadingModelFinished").add(function(model){
		var keys={};
		model.traverse(function(model){
			if(model.isSkinnedMesh){
				keys[model.id]=model.name;
			}
		});
		itemList.setOptions(keys);
	});
	
	var checkRow=new UI.CheckboxRow("Visible",false,function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		target.material.visible=v;
	});
	
	container.add(checkRow);
	
	var wireRow=new UI.CheckboxRow("Wireframe",false,function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		target.material.wireframe=v;
	});
	
	container.add(wireRow);
	
	
	return container;
}