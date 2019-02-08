Sidebar.Breast=function(ap){
	var panel=new UI.TitlePanel("Ammo Breast");
	var buttonRow=new UI.ButtonRow("New Breast",function(){
		ap.signals.newBreast.dispatch();
	});
	panel.add(buttonRow);
	
	var breastSize=new UI.IntegerButtons("Size",0.1,10,1,ap.breastSize,function(v){
		ap.breastSize=v;
	},[1,5,10]);
	panel.add(breastSize);
	var breastPosX=new UI.NumberButtons("X-Pos",0,25,10,ap.breastPosX,function(v){
		ap.breastPosX=v;
	},[0,2.5,5]);
	panel.add(breastPosX);
	var breastPosY=new UI.NumberButtons("Y-Pos",-25,25,10,ap.breastPosY,function(v){
		ap.breastPosY=v;
	},[-5,-2,0,2,5]);
	panel.add(breastPosY);
	var breastPosZ=new UI.NumberButtons("Z-Pos",0,25,10,ap.breastPosZ,function(v){
		ap.breastPosZ=v;
	},[0,5,10,20]);
	panel.add(breastPosZ);
	
	panel.add(new UI.Subtitle("Factor Limit Rotation"));
	var row=new UI.Row();
	panel.add(row);
	var lockX=new UI.CheckboxText("Lock X",ap.lockX,function(v){
		ap.lockX=v;
	});
	row.add(lockX);
	var lockY=new UI.CheckboxText("Lock Y",ap.lockY,function(v){
		ap.lockY=v;
	});
	row.add(lockY);
	var zLock=new UI.CheckboxText("Lock Z",ap.lockZ,function(v){
		ap.lockZ=v;
	});
	row.add(zLock);
	
	panel.add(new UI.Subtitle("Allow Angle"));
	
	var allowAngleX=new UI.IntegerButtons("X",0,180,10,ap.allowAngleX,function(v){
		ap.allowAngleX=v;
	},[45,90,180]);
	panel.add(allowAngleX);
	var allowAngleY=new UI.IntegerButtons("Y",0,180,10,ap.allowAngleY,function(v){
		ap.allowAngleY=v;
	},[45,90,180]);
	panel.add(allowAngleY);
	var allowAngleZ=new UI.IntegerButtons("Z",0,180,10,ap.allowAngleZ,function(v){
		ap.allowAngleZ=v;
	},[45,90,180]);
	panel.add(allowAngleZ);
	
	return panel;
}