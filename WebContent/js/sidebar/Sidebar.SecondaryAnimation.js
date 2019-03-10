Sidebar.SecondaryAnimation=function(ap){
	var panel=new UI.TitlePanel("Ammo SecondaryAnimation");
	
	var checkRow=new UI.CheckboxRow("Enabled",true,function(v){
		ap.ammoControler.setEnabled(v);
	});
	panel.add(checkRow);
var buttonRow=new UI.ButtonRow("Step",function(){
		ap.secondaryAnimationControler.update(true);
		ap.ammoControler.update(1.0/60,true);
	});
	panel.add(buttonRow);
	
	var buttonRow=new UI.ButtonRow("New SecondaryAnimation",function(){
		
		ap.secondaryAnimationControler.newSecondaryAnimation();
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	});
	panel.add(buttonRow);
	
	if(!ap.secondaryAnimationControler){
		ap.secondaryAnimationControler=new SecondaryAnimationControler(ap);
	}
	
	var secondaryAnimationSize=new UI.NumberButtons("baseHitRadius",0.01,500,1,ap.secondaryAnimationControler.baseHitRadius,function(v){
		ap.secondaryAnimationControler.baseHitRadius=v;
	},[0.5,1,5,10]);
	panel.add(secondaryAnimationSize);
	var secondaryAnimationMass=new UI.NumberButtons("Mass",0.01,100,1,ap.secondaryAnimationControler.mass,function(v){
		ap.secondaryAnimationControler.mass=v;
	},[0.1,1,10]);
	panel.add(secondaryAnimationMass);
	
	panel.add(new UI.Subtitle("Factor Limit Rotation"));
	var row=new UI.Row();
	panel.add(row);
	var lockX=new UI.CheckboxText("Lock X",ap.secondaryAnimationControler.lockX,function(v){
		ap.secondaryAnimationControler.lockX=v;
	});
	row.add(lockX);
	var lockY=new UI.CheckboxText("Lock Y",ap.secondaryAnimationControler.lockY,function(v){
		ap.secondaryAnimationControler.lockY=v;
	});
	row.add(lockY);
	var zLock=new UI.CheckboxText("Lock Z",ap.secondaryAnimationControler.lockZ,function(v){
		ap.secondaryAnimationControler.lockZ=v;
	});
	row.add(zLock);
	
	panel.add(new UI.Subtitle("Allow Angle"));
	
	var allowAngleX=new UI.IntegerButtons("X",0,180,10,ap.secondaryAnimationControler.allowAngleX,function(v){
		ap.secondaryAnimationControler.allowAngleX=v;
	},[45,90,180]);
	panel.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.secondaryAnimationControler.allowAngleY,function(v){
		ap.secondaryAnimationControler.allowAngleY=v;
	},[45,90,180]);
	panel.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.secondaryAnimationControler.allowAngleZ,function(v){
		ap.secondaryAnimationControler.allowAngleZ=v;
	},[45,90,180]);
	panel.add(allowAngleZ);
	
	var control=new UI.Div();
	panel.add(control);
	
	function springChanged(){
		ap.secondaryAnimationControler.updateSpringValues();
	}
	
	
	var stiffness=new UI.NumberButtons("baseStiffiness",0,10000,100,ap.secondaryAnimationControler.baseStiffiness,function(v){
		ap.secondaryAnimationControler.baseStiffiness=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,1,10,100]);
	//stiffness.text.setWidth("60px");
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1000,100,ap.secondaryAnimationControler.damping,function(v){
		ap.secondaryAnimationControler.damping=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,.1,1,10,100]);
	damping.text.setWidth("60px");
	control.add(damping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,ap.secondaryAnimationControler.bodyDamping,function(v){
		ap.secondaryAnimationControler.bodyDamping=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,.1,.5,.75,1]);
	bodyDamping.number.setWidth("30px");
	control.add(bodyDamping);
	
	function getCurrentGroup(){
		var v=boneGroupList.getValue();
		return ap.secondaryAnimationControler.boneGroups[v];
	}

	var boneGroupList=new UI.SelectRow("Group",{},function(v){
		var group=null;
		if(v){
			group=ap.secondaryAnimationControler.boneGroups[v];
		}
		updateBoneGroupEditor(group);
	});
	panel.add(boneGroupList)
	
	function updateBoneGroupEditor(group){
		boneNames.clear();
		if(!group){
			groupStiffness.setValue(0);
			groupStiffness.setDisabled(true);
			return;
		}
		groupStiffness.setDisabled(false);
		
		group.boneLinkList.forEach(function(links){
			boneNames.add(new UI.Text(links[0]).setMarginRight("2px"));
		});
		groupStiffness.setValue(group.stiffiness);
	}
	
	var boneNames=new UI.Row();
	panel.add(boneNames);
	
	var groupStiffness=new UI.NumberButtons("stiffness",0,100,1,0,function(v){
		getCurrentGroup().stiffiness=v;
	},[0,0.5,1]);
	panel.add(groupStiffness);
	groupStiffness.text.setWidth("60px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		var v=getCurrentGroup().defaultStiffiness;
		groupStiffness.setValue(v);
		getCurrentGroup().stiffiness=v;
	});
	resetBt.setFontSize("6px");
	groupStiffness.add(resetBt);
	
	
	
	ap.getSignal("secondaryAnimationParsed").add(function(){
		var options={};
		var groups=ap.secondaryAnimationControler.boneGroups;
		for(var i=0;i<groups.length;i++){
			var boneName=groups[i].boneLinkList[0][0];
			options[String(i)]=boneName+" +";
		}
		boneGroupList.select.setOptions(options);
	});
	
	
	return panel;
}