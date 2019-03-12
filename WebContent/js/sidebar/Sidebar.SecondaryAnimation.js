Sidebar.SecondaryAnimation=function(ap){
	var panel=new UI.TitlePanel("Ammo SecondaryAnimation");
	
	var checkRow=new UI.CheckboxRow("Ammo Enabled",true,function(v){
		ap.ammoControler.setEnabled(v);
	});
	panel.add(checkRow);
var buttonRow=new UI.ButtonRow("Step",function(){
	    ap.boneAttachControler.update(true);
		ap.secondaryAnimationControler.update(true);
		ap.ammoControler.update(1.0/60,true);
	});
	panel.add(buttonRow);
	
	var buttonRow=new UI.ButtonRow("New SecondaryAnimation",function(){
		ap.getSignal("objectRotated").dispatch(0,0,0);
		ap.secondaryAnimationControler.newSecondaryAnimation();
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	});
	panel.add(buttonRow);
	
	if(!ap.secondaryAnimationControler){
		ap.secondaryAnimationControler=new SecondaryAnimationControler(ap);
	}
	
	var secondaryAnimationSize=new UI.NumberButtons("baseHitRadius",0.01,500,1,ap.secondaryAnimationControler.baseHitRadius,function(v){
		ap.secondaryAnimationControler.baseHitRadius=v;
	},[1,10,100]);
	panel.add(secondaryAnimationSize);
	var secondaryAnimationMass=new UI.NumberButtons("Mass",0.01,100,1,ap.secondaryAnimationControler.mass,function(v){
		ap.secondaryAnimationControler.mass=v;
	},[0.1,1,10]);
	panel.add(secondaryAnimationMass);
	
	var endSiteCheck=new UI.CheckboxRow("Endsite",ap.secondaryAnimationControler.addEndsite,function(v){
		ap.secondaryAnimationControler.addEndsite=v;
	});
	panel.add(endSiteCheck);
	
	var sphere2Check=new UI.CheckboxRow("rot-sphere2",ap.secondaryAnimationControler.targetSphere2,function(v){
		ap.secondaryAnimationControler.targetSphere2=v;
	});
	sphere2Check.text.setWidth("90px");
	panel.add(sphere2Check);
	var rootStaticCheck=new UI.CheckboxSpan("root-static",ap.secondaryAnimationControler.isRootStatic,function(v){
		ap.secondaryAnimationControler.isRootStatic=v;
	});
	sphere2Check.add(rootStaticCheck);
	rootStaticCheck.text.setWidth("90px");
	
	var connectHCheck=new UI.CheckboxRow("connect-h",ap.secondaryAnimationControler.connectHorizontal,function(v){
		ap.secondaryAnimationControler.connectHorizontal=v;
	});
	connectHCheck.text.setWidth("90px");
	panel.add(connectHCheck);
	var autoSetUpCheck=new UI.CheckboxSpan("autoSetUp",ap.secondaryAnimationControler.autoSetUp,function(v){
		ap.secondaryAnimationControler.autoSetUp=v;
	});
	autoSetUpCheck.text.setWidth("90px");
	connectHCheck.add(autoSetUpCheck);
	
	
	
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
	},[1,15,45,90,180]);
	allowAngleX.text.setWidth("60px");
	panel.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.secondaryAnimationControler.allowAngleY,function(v){
		ap.secondaryAnimationControler.allowAngleY=v;
	},[1,15,45,90,180]);
	allowAngleY.text.setWidth("60px");
	panel.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.secondaryAnimationControler.allowAngleZ,function(v){
		ap.secondaryAnimationControler.allowAngleZ=v;
	},[1,15,45,90,180]);
	allowAngleZ.text.setWidth("60px");
	panel.add(allowAngleZ);
	
	var control=new UI.Div();
	panel.add(control);
	
	function springChanged(){
		ap.secondaryAnimationControler.updateSpringValues();
	}
	
	control.add(new UI.Subtitle("Dynamic Updateable"));
	
	var stiffness=new UI.NumberButtons("baseStiffiness",0,10000,100,ap.secondaryAnimationControler.baseStiffiness,function(v){
		ap.secondaryAnimationControler.baseStiffiness=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,1,10,100]);
	//stiffness.text.setWidth("60px");
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1,1,ap.secondaryAnimationControler.damping,function(v){
		ap.secondaryAnimationControler.damping=v;
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,.25,.5,.75,1]);
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
		groupDragForce.setValue(group.dragForce);
		groupHitRadius.setValue(group.hitRadius);
	}
	
	var boneNames=new UI.Row();
	panel.add(boneNames);
	
	var groupStiffness=new UI.NumberButtons("stiffness",0,100,1,0,function(v){
		getCurrentGroup().stiffiness=v;
		
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,0.5,1]);
	panel.add(groupStiffness);
	groupStiffness.text.setWidth("70px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		var v=getCurrentGroup().defaultStiffiness;
		groupStiffness.setValue(v);
		getCurrentGroup().stiffiness=v;
		
		ap.secondaryAnimationControler.updateSpringValues();
	});
	resetBt.setFontSize("6px");
	groupStiffness.add(resetBt);
	
	var groupHitRadius=new UI.NumberButtons("hitRadius",0.001,1,0.01,0,function(v){
		getCurrentGroup().hitRadius=v;
	},[0.01,0.1]);
	groupHitRadius.number.precision=3;
	panel.add(groupHitRadius);
	groupHitRadius.text.setWidth("70px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		var v=getCurrentGroup().defaultHitRadius;
		groupHitRadius.setValue(v);
		getCurrentGroup().hitRadius=v;
		
	});
	resetBt.setFontSize("6px");
	groupHitRadius.add(resetBt);
	
	var groupDragForce=new UI.NumberButtons("dragForce",0,1,1,0,function(v){
		getCurrentGroup().dragForce=v;
		//no effect
		ap.secondaryAnimationControler.updateSpringValues();
	},[0,0.5,1]);
	panel.add(groupDragForce);
	groupDragForce.text.setWidth("70px");
	var resetBt=new UI.Button("Rest").onClick(function(){
		var v=getCurrentGroup().defaultDragForce;
		groupDragForce.setValue(v);
		getCurrentGroup().dragForce=v;
		
		ap.secondaryAnimationControler.updateSpringValues();
	});
	resetBt.setFontSize("6px");
	groupDragForce.add(resetBt);
	
	
	
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
	});
	
	panel.add(new UI.Subtitle("Limit Distance"));
	var enableReset=new UI.CheckboxRow("Enable Reset",ap.secondaryAnimationControler.enableLimitDistance,function(v){
		ap.secondaryAnimationControler.enableLimitDistance=v;
	});
	panel.add(enableReset);
	
	var distanceRatio=new UI.NumberButtons("ratio",1,10,1,ap.secondaryAnimationControler.maxDistanceRatio,function(v){
		ap.secondaryAnimationControler.maxDistanceRatio=v;
	},[1,1.5,2]);
	panel.add(distanceRatio);
	
	return panel;
}