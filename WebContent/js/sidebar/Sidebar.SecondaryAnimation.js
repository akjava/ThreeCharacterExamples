Sidebar.SecondaryAnimation=function(ap){
	var panel=new UI.TitlePanel("Ammo SecondaryAnimation");
	
	var checkRow=new UI.CheckboxRow("Ammo Enabled",true,function(v){
		ap.ammoControler.setEnabled(v);
		stepBt.button.setDisabled(v);
	});
	panel.add(checkRow);
	checkRow.text.setWidth("100px");
var stepBt=new UI.ButtonSpan("Step",function(){
	    ap.boneAttachControler.update(true);
		ap.secondaryAnimationControler.update(true);
		ap.ammoControler.update(1.0/60,true);
	});
	checkRow.add(stepBt);
	stepBt.button.setDisabled(true);
	
	var stepSEBt=new UI.ButtonSpan("Step SE",function(){
	    ap.boneAttachControler.update(true);
		ap.secondaryAnimationControler.update(true);
	});
	checkRow.add(stepSEBt);
	
	var buttonRow=new UI.ButtonRow("New SecondaryAnimation",function(){
		ap.getSignal("objectRotated").dispatch(0,0,0);
		ap.secondaryAnimationControler.newSecondaryAnimation();
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	});
	panel.add(buttonRow);
	
	var tab=new UI.Tab(ap);
	panel.add(tab);
	var bodyGroup=tab.addItem("BodyGroup");
	var dynamics=tab.addItem("Dynaics");
	var settings=tab.addItem("Settings");
	
	
	if(!ap.secondaryAnimationControler){
		ap.secondaryAnimationControler=new SecondaryAnimationControler(ap);
	}
	
	
	dynamics.add(new UI.Description("Effect change immidiately"));
	
	var stiffness=new UI.NumberButtons("baseStiffiness",0,10000,100,ap.secondaryAnimationControler.baseStiffiness,function(v){
		ap.secondaryAnimationControler.baseStiffiness=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,1,10,100]);
	dynamics.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1,1,ap.secondaryAnimationControler.damping,function(v){
		ap.secondaryAnimationControler.damping=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,.25,.5,.75,1]);
	damping.number.setWidth("40px");
	damping.text.setWidth("60px");
	dynamics.add(damping);
	
	var effectBodyDamping=new UI.CheckboxRow("Effect bodyDamping to DragForce",ap.secondaryAnimationControler.isEffectDragForceBodyDamping,function(v){
		ap.secondaryAnimationControler.isEffectDragForceBodyDamping=v;
		ap.secondaryAnimationControler.updateSpringValues();
	});
	effectBodyDamping.text.setWidth("240px");
	dynamics.add(effectBodyDamping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,ap.secondaryAnimationControler.bodyDamping,function(v){
		ap.secondaryAnimationControler.bodyDamping=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,.5,.75,1]);
	bodyDamping.number.setWidth("30px");
	dynamics.add(bodyDamping);
	
	var secondaryAnimationSize=new UI.NumberButtons("baseHitRadius",0.01,500,10,ap.secondaryAnimationControler.baseHitRadius,function(v){
		ap.secondaryAnimationControler.baseHitRadius=v;
	},[10,50,100]);
	settings.add(secondaryAnimationSize);
	
	
	
	var secondaryAnimationMass=new UI.NumberButtons("Mass",0.01,100,1,ap.secondaryAnimationControler.mass,function(v){
		ap.secondaryAnimationControler.mass=v;
	},[0.1,1,10]);
	settings.add(secondaryAnimationMass);
	

	var isSyncPosition=new UI.CheckboxRow("sync-pos",ap.secondaryAnimationControler.isSyncPosition,function(v){
		ap.secondaryAnimationControler.isSyncPosition=v;
	});
	isSyncPosition.text.setWidth("70px");
	isSyncPosition.checkbox.setMarginRight("20px");
	settings.add(isSyncPosition);
	
	var connectHCheck=new UI.CheckboxSpan("connect-h",ap.secondaryAnimationControler.connectHorizontal,function(v){
		ap.secondaryAnimationControler.connectHorizontal=v;
	});
	connectHCheck.text.setWidth("70px");
	isSyncPosition.add(connectHCheck);

	
	
	settings.add(new UI.Subtitle("Factor Limit Rotation"));
	var row=new UI.Row();
	settings.add(row);
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
	
	settings.add(new UI.Subtitle("Allow Angle"));
	
	var effectDragForce=new UI.CheckboxRow("Effect DragForce Value",ap.secondaryAnimationControler.isEffectDragForceAngle,function(v){
		ap.secondaryAnimationControler.isEffectDragForceAngle=v;
	});
	settings.add(effectDragForce);
	
	var allowAngleX=new UI.IntegerButtons("X",0,180,10,ap.secondaryAnimationControler.allowAngleX,function(v){
		ap.secondaryAnimationControler.allowAngleX=v;
	},[1,15,45,90,180]);
	allowAngleX.text.setWidth("30px");
	settings.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.secondaryAnimationControler.allowAngleY,function(v){
		ap.secondaryAnimationControler.allowAngleY=v;
	},[1,15,45,90,180]);
	allowAngleY.text.setWidth("30px");
	settings.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.secondaryAnimationControler.allowAngleZ,function(v){
		ap.secondaryAnimationControler.allowAngleZ=v;
	},[1,15,45,90,180]);
	allowAngleZ.text.setWidth("30px");
	settings.add(allowAngleZ);
	
	
	
	function springChanged(){
		ap.secondaryAnimationControler.updateSpringValues();
	}
	
	
	

	

	

	
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
	boneGroupList.text.setWidth("60px");
	bodyGroup.add(boneGroupList)
	
	function updateBoneGroupEditor(group){
		
		boneNames.clear();
		collisonNames.clear();
		
		if(!group){
			groupStiffness.setValue(NaN);
			groupDragForce.setValue(NaN);
			groupHitRadius.setValue(NaN);
			ammoMass.setValue(NaN);
			groupStiffness.setDisabled(true);
			groupDragForce.setDisabled(true);
			groupHitRadius.setDisabled(true);
			ammoMass.setDisabled(true);
			
			
			return;
		}
		
		
		group.boneLinkList.forEach(function(links){
			var name;
			if(links.length>0){
				name=links[0]+"("+(links.length)+")";
			}else{
				name="EMPTY";
			}
			boneNames.add(new UI.Text(name).setMarginRight("2px"));
		});
		group.colliderGroups.forEach(function(index){
			var name=ap.secondaryAnimationControler.getColliderGroupName(index);
			collisonNames.add(new UI.Text(name).setMarginRight("2px"));
		});
		
		
		groupStiffness.setValue(group.stiffiness);
		groupDragForce.setValue(group.dragForce);
		groupHitRadius.setValue(group.hitRadius);
		ammoMass.setValue(group.AMMO_mass?group.AMMO_mass:NaN);
		
		groupStiffness.setDisabled(false);
		groupDragForce.setDisabled(false);
		groupHitRadius.setDisabled(false);
		ammoMass.setDisabled(false);
	}
	
	
	
	var groupStiffness=new UI.NumberButtons("stiffness",0,100,1,NaN,function(v){
		getCurrentGroup().stiffiness=v;
		
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,0.5,1]);
	bodyGroup.add(groupStiffness);
	groupStiffness.text.setWidth("75px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		if(!getCurrentGroup())
			return;
		var v=getCurrentGroup().defaultStiffiness;
		groupStiffness.setValue(v);
		getCurrentGroup().stiffiness=v;
		
		ap.secondaryAnimationControler.updateSpringValues();
	});
	resetBt.setFontSize("6px");
	groupStiffness.add(resetBt);
	groupStiffness.setDisabled(true);
	
	var groupHitRadius=new UI.NumberButtons("hitRadius",0.001,1,0.01,NaN,function(v){
		getCurrentGroup().hitRadius=v;
	},[0.01,0.1]);
	groupHitRadius.number.precision=3;
	bodyGroup.add(groupHitRadius);
	groupHitRadius.text.setWidth("75px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		if(!getCurrentGroup())
			return;
		var v=getCurrentGroup().defaultHitRadius;
		groupHitRadius.setValue(v);
		getCurrentGroup().hitRadius=v;
		
	});
	resetBt.setFontSize("6px");
	groupHitRadius.add(resetBt);
	groupHitRadius.setDisabled(true);
	
	var groupDragForce=new UI.NumberButtons("dragForce",0,1,.1,NaN,function(v){
		getCurrentGroup().dragForce=v;
		//no effect
		//ap.secondaryAnimationControler.updateSpringValues();
	},[0,0.5,1]);
	bodyGroup.add(groupDragForce);
	groupDragForce.text.setWidth("75px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		if(!getCurrentGroup())
			return;
		var v=getCurrentGroup().defaultDragForce;
		groupDragForce.setValue(v);
		getCurrentGroup().dragForce=v;
		
		ap.secondaryAnimationControler.updateSpringValues();
	});
	resetBt.setFontSize("6px");
	groupDragForce.add(resetBt);
	groupDragForce.setDisabled(true);
	
	
	var ammoMass=new UI.NumberButtons("AmmoMass",0,10,.1,NaN,function(v){
		getCurrentGroup().AMMO_mass=v;
		//no effect
		//ap.secondaryAnimationControler.updateSpringValues();
	},[0,0.01,0.1]);
	bodyGroup.add(ammoMass);
	ammoMass.text.setWidth("75px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		if(!getCurrentGroup())
			return;
		var v=NaN;
		ammoMass.setValue(v);
		getCurrentGroup().AMMO_mass=v;
		
	});
	resetBt.setFontSize("6px");
	ammoMass.add(resetBt);
	ammoMass.setDisabled(true);
	
	bodyGroup.add(new UI.Subtitle("Bones"));
	var boneNames=new UI.Row();
	bodyGroup.add(boneNames);
	
	var cdiv=new UI.Subtitle("Collisions");
	bodyGroup.add(cdiv);
	var collisonNames=new UI.Row();
	cdiv.add(collisonNames);
	
	
	
	ap.getSignal("secondaryAnimationParsed").add(function(){
		var options={};
		var groups=ap.secondaryAnimationControler.boneGroups;
		for(var i=0;i<groups.length;i++){
			var group=groups[i];
			if(groups[i].boneLinkList.length>0){
				if(groups[i].boneLinkList[0].length>0){
					var boneName=groups[i].boneLinkList[0][0];
					options[String(i)]=boneName+" +";
				}else{
					console.log("empty boneLinkList",group);
				}
			}else{
				console.log("empty boneLinkList",group);
			}
			
		}
		boneGroupList.select.setOptions(options);
		boneGroupList.select.setValue("");
		updateBoneGroupEditor(null);
	});
	
	var div=new UI.Subtitle("Limit Distance");
	settings.add(div);
	var enableReset=new UI.CheckboxRow("Enable Reset",ap.secondaryAnimationControler.enableLimitDistance,function(v){
		ap.secondaryAnimationControler.enableLimitDistance=v;
	});
	div.add(enableReset);
	
	var distanceRatio=new UI.NumberButtons("ratio",1,10,1,ap.secondaryAnimationControler.maxDistanceRatio,function(v){
		ap.secondaryAnimationControler.maxDistanceRatio=v;
	},[1,1.1,1.5,2]);
	div.add(distanceRatio);
	var clearForceWhenResetted=new UI.CheckboxRow("Clear Force",ap.secondaryAnimationControler.clearForceWhenResetted,function(v){
		ap.secondaryAnimationControler.clearForceWhenResetted=v;
	});
	div.add(clearForceWhenResetted);
	
	return panel;
}