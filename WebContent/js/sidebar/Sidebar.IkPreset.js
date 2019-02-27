Sidebar.IkPreset=function(ap){
	
	if(ap.ikControler==undefined){
		console.error("initialize ap.ikControler first");
	}
	
	var ikPresets=new IkPresets(ap.ikControler);
	ap.ikControler.setPresets(ikPresets);
	
	ap.signals.loadingModelFinished.add(function(mesh){
		ap.ikControler.ikPresets.updateAll();
	});
	
	
	var title=new UI.TitlePanel("Ik Presets")
	
	var container=new UI.Div();
	title.add(container);
	
	var inputRow=new UI.InputRow("name","",function(){
		
	});
	inputRow.text.setWidth("60px");
	inputRow.input.setWidth("120px");
	container.add(inputRow);
	
	var button=new UI.Button("Add").onClick(function(){
		var selection=presetList.getValue();
		if(selection==""){
			var ikName=ap.ikControler.getSelectedIkName();
			var name=inputRow.input.getValue();
			var ikPresets=ap.ikControler.getPresets();
			var result=ikPresets.addRotationsFromBone(name);
			
			ikPresets.setVisible(ikName,true);
			if(result){
				inputRow.input.setValue("");
			}
		}else{//update
			var ikName=ap.ikControler.getSelectedIkName();
			var index=parseInt(selection);
			var ikRot=ap.ikControler.getPresets().getIkPresetRotations(ikName)[index];
			ikRot.name=inputRow.input.getValue();
			
			presetList.setValue("");
		}
		var ikName=ap.ikControler.getSelectedIkName();
		updateOptions(ikName);
		
	});
	inputRow.add(button);
	
	
	var presetList=new UI.Select();
	presetList.setWidth("260px");
	presetList.onClick(function(){
		var ikName=ap.ikControler.getSelectedIkName();
		button.setTextContent("Update");
		var selection=presetList.getValue();
		if(!selection==""){
			var index=parseInt(selection);
			
			var ikRot=ap.ikControler.getPresets().getIkPresetRotations(ikName)[index];
			inputRow.input.setValue(ikRot.name);
			
		}else{
			inputRow.input.setValue("");
		}
	});
	//sort
	presetList.setMultiple(true);
	container.add(presetList);
	
	function eulersToLabel(rotations){
		var rots=[];
		rotations.forEach(function(euler){
			deg=AppUtils.radToDeg(euler);
			rots.push("("+deg.x.toFixed(0)+","+deg.y.toFixed(0)+","+deg.z.toFixed(0)+")");
		});
		return rots.join(" ");
	}
	
	function ikPresetRotationsToOptions(ikPresetRotations){
		var options={};
		var index=0;
		if(ikPresetRotations){
			ikPresetRotations.forEach(function(v){
				var name=v.name;
				if(name==""){
					name=eulersToLabel(v.rotations);
				}
				options[String(index)]=name;
				index++;
			});
		}
		return options;
	}
	
	function updateOptions(ikName){
		presetList.setValue("");
		if(ikName==null){
			container.setDisplay("none");
			
			return;
		}else{
			container.setDisplay("");
		}
			button.setTextContent("Add");
		
			var rots=ap.ikControler.getPresets().getIkPresetRotations(ikName);
			
			var options=ikPresetRotationsToOptions(rots);
			presetList.setOptions(options);
			//console.log("update options",options);
		
	}
	
	ap.signals.ikSelectionChanged.add(updateOptions);
	
	var buttonRow=new UI.ButtonRow("Exec",function(){
		var ikName=ap.ikControler.getSelectedIkName();
		var rots=ap.ikControler.getPresets().getIkPresetRotations(ikName);
		var selected=presetList.getValue();
		
		var object=rots[selected].getDeepestObject();
		if(object){
			object.userData.IkPresetOnClick(object);
		}else{
			console.error("Exec this has not object,");
		}
	});
	container.add(buttonRow);
	var newBt=new UI.Button("New").onClick(function(){
		presetList.setValue("");
		button.setTextContent("Add");
	});
	buttonRow.add(newBt);
	var newBt=new UI.Button("Delete").onClick(function(){
		var ikName=ap.ikControler.getSelectedIkName();
		var confirm=window.confirm("Delete selection?");
		if(!confirm){
			return;
		}
		var selected=presetList.getValue();
		var rots=ap.ikControler.getPresets().getIkPresetRotations(ikName);
		var rot=rots[selected];
		
		ap.ikControler.getPresets().removeIkPresetRotation(ikName,rot);
		
		var ikName=ap.ikControler.getSelectedIkName();
		updateOptions(ikName);
	});
	buttonRow.add(newBt);
	
	var visible=true;
	var visibleBt=new UI.CheckboxText("Visible",true,function(v){
		var preset=ap.ikControler.getPresets();
		visible=v;
		preset.setVisible(ap.ikControler.getSelectedIkName(),v);
	});
	
	ap.signals.transformSelectionChanged.add(function(v){
		var preset=ap.ikControler.getPresets();
		if(ap.ikControler.logging){
			console.log("Sidebar.IkPreset overwrite visible",ap.ikControler.getSelectedIkName(),visible);
		}
		preset.setVisible(ap.ikControler.getSelectedIkName(),visible);
	},undefined,-2);
	
	
	visibleBt.text.setWidth("40px");
	buttonRow.add(visibleBt);
	return title;
}