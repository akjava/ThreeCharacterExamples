Sidebar.Breast=function(ap){
	var panel=new UI.TitlePanel("Ammo Breast");
	var buttonRow=new UI.ButtonRow("New Breast",function(){
		
		ap.breastControler.newBreast();
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	});
	panel.add(buttonRow);
	
	if(!ap.breastControler){
		ap.breastControler=new BreastControler();
	}
	
	var breastSize=new UI.IntegerButtons("Size",0.1,10,1,ap.breastControler.breastSize,function(v){
		ap.breastControler.breastSize=v;
	},[1,5,10]);
	panel.add(breastSize);
	var breastMass=new UI.NumberButtons("Mass",0.01,100,1,ap.breastControler.breastMass,function(v){
		ap.breastControler.breastMass=v;
	},[0.1,1,10]);
	panel.add(breastMass);
	var breastPosX=new UI.NumberButtons("X-Pos",0,25,10,ap.breastControler.breastPosX,function(v){
		ap.breastControler.breastPosX=v;
	},[0,2.5,5]);
	panel.add(breastPosX);
	var breastPosY=new UI.NumberButtons("Y-Pos",-25,25,10,ap.breastControler.breastPosY,function(v){
		ap.breastControler.breastPosY=v;
	},[-5,-2,0,2,5]);
	panel.add(breastPosY);
	var breastPosZ=new UI.NumberButtons("Z-Pos",0,25,10,ap.breastControler.breastPosZ,function(v){
		ap.breastControler.breastPosZ=v;
	},[0,5,10,20]);
	panel.add(breastPosZ);
	
	panel.add(new UI.Subtitle("Factor Limit Rotation"));
	var row=new UI.Row();
	panel.add(row);
	var lockX=new UI.CheckboxText("Lock X",ap.breastControler.lockX,function(v){
		ap.breastControler.lockX=v;
	});
	row.add(lockX);
	var lockY=new UI.CheckboxText("Lock Y",ap.breastControler.lockY,function(v){
		ap.breastControler.lockY=v;
	});
	row.add(lockY);
	var zLock=new UI.CheckboxText("Lock Z",ap.breastControler.lockZ,function(v){
		ap.breastControler.lockZ=v;
	});
	row.add(zLock);
	
	panel.add(new UI.Subtitle("Allow Angle"));
	
	var allowAngleX=new UI.IntegerButtons("X",0,180,10,ap.breastControler.allowAngleX,function(v){
		ap.breastControler.allowAngleX=v;
	},[45,90,180]);
	panel.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.breastControler.allowAngleY,function(v){
		ap.breastControler.allowAngleY=v;
	},[45,90,180]);
	panel.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.breastControler.allowAngleZ,function(v){
		ap.breastControler.allowAngleZ=v;
	},[45,90,180]);
	panel.add(allowAngleZ);
	
	var control=new UI.Div();
	panel.add(control);
	
	function springChanged(){
		ap.breastControler.updateSpringValues();
	}
	
	var autoResetPosition=new UI.CheckboxRow("Auto Reset Position",ap.breastControler.autoResetPosition,function(v){
		ap.breastControler.autoResetPosition=v;
	});
	control.add(autoResetPosition);
	
	var stiffness=new UI.NumberButtons("stiffness",0,1000,100,ap.breastControler.stiffness,function(v){
		ap.breastControler.stiffness=v;
		ap.breastControler.updateSpringValues();
	},[0,1,10,100,1000]);
	stiffness.text.setWidth("60px");
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1000,100,ap.breastControler.damping,function(v){
		ap.breastControler.damping=v;
		ap.breastControler.updateSpringValues();
	},[0,.1,1,10,100]);
	damping.text.setWidth("60px");
	control.add(damping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,ap.breastControler.bodyDamping,function(v){
		ap.breastControler.bodyDamping=v;
		ap.breastControler.updateSpringValues();
	},[0,.1,.5,.75,1]);
	bodyDamping.number.setWidth("30px");
	control.add(bodyDamping);
	
	return panel;
}