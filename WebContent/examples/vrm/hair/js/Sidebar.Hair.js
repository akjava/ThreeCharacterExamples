Sidebar.Hair=function(ap){
	var panel=new UI.TitlePanel("Ammo Hair");
	
	ap.ammoVisible=true;
	
	var checkRow=new UI.CheckboxRow("Enabled",true,function(v){
		ap.ammoControler.setEnabled(v);
	});
	panel.add(checkRow);
var buttonRow=new UI.ButtonRow("Step",function(){
		
		ap.ammoControler.update(1.0/60,true);
	});
	panel.add(buttonRow);
	
	var buttonRow=new UI.ButtonRow("New Hair",function(){
		
		ap.hairControler.newHair();
		ap.ammoControler.setVisibleAll(ap.ammoVisible);
	});
	panel.add(buttonRow);
	
	if(!ap.hairControler){
		ap.hairControler=new HairControler(ap);
	}
	
	var hairSize=new UI.NumberButtons("Size",0.01,10,1,ap.hairControler.size,function(v){
		ap.hairControler.size=v;
	},[0.5,1,5,10]);
	panel.add(hairSize);
	var hairMass=new UI.NumberButtons("Mass",0.01,100,1,ap.hairControler.mass,function(v){
		ap.hairControler.mass=v;
	},[0.1,1,10]);
	panel.add(hairMass);
	
	panel.add(new UI.Subtitle("Factor Limit Rotation"));
	var row=new UI.Row();
	panel.add(row);
	var lockX=new UI.CheckboxText("Lock X",ap.hairControler.lockX,function(v){
		ap.hairControler.lockX=v;
	});
	row.add(lockX);
	var lockY=new UI.CheckboxText("Lock Y",ap.hairControler.lockY,function(v){
		ap.hairControler.lockY=v;
	});
	row.add(lockY);
	var zLock=new UI.CheckboxText("Lock Z",ap.hairControler.lockZ,function(v){
		ap.hairControler.lockZ=v;
	});
	row.add(zLock);
	
	panel.add(new UI.Subtitle("Allow Angle"));
	
	var allowAngleX=new UI.IntegerButtons("X",0,180,10,ap.hairControler.allowAngleX,function(v){
		ap.hairControler.allowAngleX=v;
	},[45,90,180]);
	panel.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.hairControler.allowAngleY,function(v){
		ap.hairControler.allowAngleY=v;
	},[45,90,180]);
	panel.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.hairControler.allowAngleZ,function(v){
		ap.hairControler.allowAngleZ=v;
	},[45,90,180]);
	panel.add(allowAngleZ);
	
	var control=new UI.Div();
	panel.add(control);
	
	function springChanged(){
		ap.hairControler.updateSpringValues();
	}
	
	
	var stiffness=new UI.NumberButtons("stiffness",0,10000,100,ap.hairControler.stiffness,function(v){
		ap.hairControler.stiffness=v;
		ap.hairControler.updateSpringValues();
	},[0,1,10,100,1000]);
	stiffness.text.setWidth("60px");
	control.add(stiffness);
	
	var damping=new UI.NumberButtons("damping",0,1000,100,ap.hairControler.damping,function(v){
		ap.hairControler.damping=v;
		ap.hairControler.updateSpringValues();
	},[0,.1,1,10,100]);
	damping.text.setWidth("60px");
	control.add(damping);
	
	var bodyDamping=new UI.NumberButtons("bodyDamping",0,1,1,ap.hairControler.bodyDamping,function(v){
		ap.hairControler.bodyDamping=v;
		ap.hairControler.updateSpringValues();
	},[0,.1,.5,.75,1]);
	bodyDamping.number.setWidth("30px");
	control.add(bodyDamping);
	

	
	
	return panel;
}