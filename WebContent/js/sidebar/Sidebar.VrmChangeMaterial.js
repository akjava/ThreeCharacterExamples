Sidebar.VrmChangeMaterial=function(ap){
	var container=new UI.TitlePanel("Vrm ChangeMaterial");
	

	
	
	
	var itemList=new UI.Select();
	container.add(itemList);
	itemList.onChange(function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		
		checkRow.setValue(target.material.visible);
		wireRow.setValue(target.material.wireframe);
		buttonRow.button.setDisabled(false);
		convrtCancelBt.button.setDisabled(false);
		
		
		transparentBt.button.setDisabled(false);
		transparentCancelBt.button.setDisabled(false);
	});
	
	var models=[];
	ap.getSignal("loadingModelFinished").add(function(model){
		var keys=VrmUtils.sceneToSkinnedMeshOptions(model,true);
		itemList.setOptions(keys);
		models=VrmUtils.getSkinnedMeshes(model);
	});
	
	
	function getMaterial(){
		var value=itemList.getValue();
		if(value==""){
			return null;
		}
		var target=ap.skinnedMesh.getObjectById(Number(value));
		return target.material
	}
	
	var row=new UI.Row();
	container.add(row);
	var checkRow=new UI.CheckboxSpan("Visible",false,function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		target.material.visible=v;
	});
	checkRow.text.setWidth("50px");
	checkRow.checkbox.setMarginRight("16px");
	row.add(checkRow);
	

	
	var wireRow=new UI.CheckboxSpan("Wireframe",false,function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		target.material.wireframe=v;
	});
	wireRow.text.setWidth("70px");
	
	row.add(wireRow);
	
	function getMaterial(target){
		target.userData.oldMaterial=target.material;
		return new THREE.MeshStandardMaterial({skinning:true,color:target.material.color.getHex(),map:target.material.map,roughness:scope.roughness,metalness:scope.metalness});
	}
	
	var standardMaterial=new UI.Subtitle("Convert Hair to Standard Material");
	container.add(standardMaterial);
	
	var row=new UI.Row();
	standardMaterial.add(row);
	var buttonRow=new UI.ButtonSpan("Change",function(){
		
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		console.log(target.material);
		
		var map=target.material.map;
		target.material=getMaterial(target);
	});
	row.add(buttonRow);
	buttonRow.button.setDisabled(true);
	
	var convrtCancelBt=new UI.ButtonSpan("Cancel",function(){
		
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		if(target.userData.oldMaterial)
			target.material=target.userData.oldMaterial;
	});
	row.add(convrtCancelBt);
	convrtCancelBt.button.setDisabled(true);
	
	
	var changeAll=new UI.ButtonSpan("ChangeAll",function(){
		
		models.forEach(function(model){
			if(model.name.startsWith("Hair")){
				model.material=getMaterial(model);
				console.log(model.material);
			}
		});
		});
	row.add(changeAll);
	
	var cancelAll=new UI.ButtonSpan("CancelAll",function(){
		
		models.forEach(function(model){
			if(model.name.startsWith("Hair")){
				if(model.userData.oldMaterial)
					model.material=model.userData.oldMaterial;
			}
		});
		});
	row.add(cancelAll);
	
	var scope=this;
	scope.roughness=0.25;
	scope.metalness=0.25;
	var roughness=new UI.NumberButtons("roughness",0,1,1,scope.roughness,function(v){
		scope.roughness=v;
	},[0,0.25,0.5,1]);
	roughness.number.setWidth("40px");
	container.add(roughness);
	
	var metalness=new UI.NumberButtons("metalness",0,1,1,scope.metalness,function(v){
		scope.metalness=v;
	},[0,0.25,0.5,1]);
	metalness.number.setWidth("40px");
	container.add(metalness);
	
	
	var faceTransparent=new UI.Subtitle("Face transparent");
	container.add(faceTransparent);
	
	var row=new UI.Row();
	faceTransparent.add(row);
	
	
	var transparentBt=new UI.ButtonSpan("Change",function(){
		
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		console.log(target.material);
		
		target.material.transparent=true;
	});
	row.add(transparentBt);
	transparentBt.button.setDisabled(true);
   var transparentCancelBt=new UI.ButtonSpan("Cancel",function(){
		
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		console.log(target.material);
		
		target.material.transparent=false;
	});
	row.add(transparentCancelBt);
	transparentCancelBt.button.setDisabled(true);
	
	var changeAllTransparent=new UI.ButtonSpan("ChangeAll ",function(){
		
		models.forEach(function(model){
			if(model.name.startsWith("Face")){
				model.material.transparent=true;
			}
		});
		});
	row.add(changeAllTransparent);
	var cancel=new UI.ButtonSpan("CancelAll",function(){
		
		models.forEach(function(model){
			if(model.name.startsWith("Face")){
				model.material.transparent=false;
			}
		});
		});
	row.add(cancel);


	
	
	return container;
}