Sidebar.Skirt=function(ap){
	var panel=new UI.TitlePanel("Ammo Skirt");
	
	ap.ammoVisible=true;
	
	var checkRow=new UI.CheckboxRow("Enabled",true,function(v){
		ap.ammoControler.setEnabled(v);
	});
	panel.add(checkRow);
var buttonRow=new UI.ButtonRow("Step",function(){
		
		ap.ammoControler.update(1.0/60,true);
	});
	panel.add(buttonRow);
	
	var buttonRow=new UI.ButtonRow("New Skirt",function(){
		
		ap.skirtControler.newSkirt();
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	});
	panel.add(buttonRow);
	
	if(!ap.skirtControler){
		ap.skirtControler=new SkirtControler(ap);
	}
	
	var skirtSize=new UI.IntegerButtons("Size",0.1,10,1,ap.skirtControler.size,function(v){
		ap.skirtControler.size=v;
	},[1,5,10]);
	panel.add(skirtSize);
	var skirtMass=new UI.NumberButtons("Mass",0.01,100,1,ap.skirtControler.mass,function(v){
		ap.skirtControler.mass=v;
	},[0.1,1,10]);
	panel.add(skirtMass);
	
	panel.add(new UI.Subtitle("Factor Limit Rotation"));
	var row=new UI.Row();
	panel.add(row);
	var lockX=new UI.CheckboxText("Lock X",ap.skirtControler.lockX,function(v){
		ap.skirtControler.lockX=v;
	});
	row.add(lockX);
	var lockY=new UI.CheckboxText("Lock Y",ap.skirtControler.lockY,function(v){
		ap.skirtControler.lockY=v;
	});
	row.add(lockY);
	var zLock=new UI.CheckboxText("Lock Z",ap.skirtControler.lockZ,function(v){
		ap.skirtControler.lockZ=v;
	});
	row.add(zLock);
	
	panel.add(new UI.Subtitle("Allow Angle"));
	
	var allowAngleX=new UI.IntegerButtons("X",0,180,10,ap.skirtControler.allowAngleX,function(v){
		ap.skirtControler.allowAngleX=v;
	},[45,90,180]);
	panel.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.skirtControler.allowAngleY,function(v){
		ap.skirtControler.allowAngleY=v;
	},[45,90,180]);
	panel.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.skirtControler.allowAngleZ,function(v){
		ap.skirtControler.allowAngleZ=v;
	},[45,90,180]);
	panel.add(allowAngleZ);
	
	var control=new UI.Div();
	panel.add(control);
	
	function springChanged(){
		ap.skirtControler.updateSpringValues();
	}
	
	
	var stiffness=new UI.NumberButtons("stiffness",0,1000,100,ap.skirtControler.stiffness,function(v){
		ap.skirtControler.stiffness=v;
		ap.skirtControler.updateSpringValues();
	},[0,1,10,100,1000]);
	stiffness.text.setWidth("60px");
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1000,100,ap.skirtControler.damping,function(v){
		ap.skirtControler.damping=v;
		ap.skirtControler.updateSpringValues();
	},[0,.1,1,10,100]);
	damping.text.setWidth("60px");
	control.add(damping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,ap.skirtControler.bodyDamping,function(v){
		ap.skirtControler.bodyDamping=v;
		ap.skirtControler.updateSpringValues();
	},[0,.1,.5,.75,1]);
	bodyDamping.number.setWidth("30px");
	control.add(bodyDamping);
	

	
	
	return panel;
}