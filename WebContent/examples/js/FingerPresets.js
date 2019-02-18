var FingerPresets=function(){
	
	function registPreset(key,x,y,z){
		current[key]=new THREE.Vector3(x,y,z);
	}
	
	var presets={};
	presets["default"]={};
	
	
	
	var current={};
	registPreset("index03_L",0,0,-80);
	registPreset("index02_L",0,0,-75);
	registPreset("index01_L",0,0,-60);
	registPreset("middle03_L",0,0,-85);
	registPreset("middle02_L",0,0,-75);
	registPreset("middle01_L",0,0,-60);
	registPreset("ring03_L",0,0,-90);
	registPreset("ring02_L",0,0,-75);
	registPreset("ring01_L",0,0,-60);
	registPreset("pinky03_L",0,0,-95);
	registPreset("pinky02_L",0,0,-75);
	registPreset("pinky01_L",0,0,-60);
	registPreset("thumb03_L",45,30,-45);
	registPreset("thumb02_L",90,0,0);
	registPreset("thumb01_L",0,0,25);
	presets["goo"]=current;
	
	current={};
	registPreset("thumb01_L",1.80,-4.60,14.60);
	registPreset("thumb02_L",11.20,20.20,-17.40);
	registPreset("thumb03_L",40.80,70.40,2.80);
	registPreset("index01_L",0.00,0.00,-85.00);
	registPreset("index02_L",0.00,0.00,-100.00);
	registPreset("index03_L",0.00,0.00,-120.00);
	registPreset("middle01_L",0.00,0.00,-85.00);
	registPreset("middle02_L",0.00,0.00,-100.00);
	registPreset("middle03_L",0.00,0.00,-120.00);
	registPreset("ring01_L",0.00,0.00,-85.00);
	registPreset("ring02_L",0.00,0.00,-100.00);
	registPreset("ring03_L",0.00,0.00,-120.00);
	registPreset("pinky01_L",0.00,0.00,-85.00);
	registPreset("pinky02_L",0.00,0.00,-100.00);
	registPreset("pinky03_L",0.00,0.00,-120.00);
	presets["goo2"]=current;
	
	current={};
	registPreset("thumb01_L",6.00,0.80,-8.20);
	registPreset("thumb02_L",64.00,18.60,-6.60);
	registPreset("thumb03_L",35.40,54.20,-8.00);
	registPreset("index01_L",0.00,0.00,-65.00);
	registPreset("index02_L",0.00,0.00,-93.20);
	registPreset("index03_L",0.00,0.00,-115.20);
	registPreset("middle01_L",0.00,0.00,-70.00);
	registPreset("middle02_L",0.00,0.00,-100.00);
	registPreset("middle03_L",0.00,0.00,-120.00);
	registPreset("ring01_L",0.00,0.00,-75.00);
	registPreset("ring02_L",0.00,0.00,-100.00);
	registPreset("ring03_L",0.00,0.00,-111.40);
	registPreset("pinky01_L",0.00,0.00,-85.00);
	registPreset("pinky02_L",0.00,0.00,-100.00);
	registPreset("pinky03_L",0.00,0.00,-109.80);
	presets["goo3"]=current;
	
	current={};
	registPreset("thumb01_L",0,-15,0);
	registPreset("index00_L",0,-10,0);
	registPreset("index01_L",0,-15,0);
	registPreset("middle00_L",0,-5,0);
	registPreset("middle01_L",0,-5,0);
	registPreset("ring01_L",0,5,0);
	registPreset("pinky00_L",0,10,0);
	registPreset("pinky01_L",0,10,0);
	presets["paa"]=current;
	
	current={};
	registPreset("thumb01_L",0.00,17.00,10.00);
	registPreset("thumb02_L",0.00,20.00,15.00);
	registPreset("thumb03_L",0.00,20.00,-25.00);
	registPreset("index00_L",0.00,2.00,0.00);
	registPreset("ring00_L",0.00,-2.00,0.00);
	registPreset("pinky00_L",0.00,-5.00,0.00);
	presets["flat"]=current;
	
	current={};
	registPreset("thumb01_L",0.00,7.00,10.00);
	registPreset("thumb02_L",0.00,20.00,15.00);
	registPreset("thumb03_L",0.00,20.00,-25.00);
	registPreset("index00_L",0.00,2.00,0.00);
	registPreset("index01_L",0.00,0.00,-65.00);
	registPreset("middle01_L",0.00,0.00,-65.00);
	registPreset("ring00_L",0.00,-2.00,0.00);
	registPreset("ring01_L",0.00,0.00,-65.00);
	registPreset("pinky00_L",0.00,-5.00,0.00);
	registPreset("pinky01_L",0.00,0.00,-65.00);
	presets["flatdown"]=current;
	
	current={};
	registPreset("thumb01_L",3.80,-3.40,16.20);
	registPreset("thumb02_L",88.00,0.00,0.00);
	registPreset("thumb03_L",45.20,18.40,-40.40);
	registPreset("index00_L",0.00,-5.00,0.00);
	registPreset("index01_L",0.00,-15.00,0.00);
	registPreset("middle00_L",0.00,5.00,0.00);
	registPreset("ring01_L",0.00,0.00,-60.00);
	registPreset("ring02_L",0.00,0.00,-75.00);
	registPreset("ring03_L",0.00,0.00,-90.00);
	registPreset("pinky01_L",0.00,0.00,-60.00);
	registPreset("pinky02_L",0.00,0.00,-75.00);
	registPreset("pinky03_L",0.00,0.00,-95.00);
	presets["choki"]=current;
	
	current={};
	registPreset("thumb01_L",0.00,-15.00,0.00);
	registPreset("thumb02_L",0.00,15.00,-15.00);
	registPreset("thumb03_L",0.00,30.00,0.00);
	registPreset("index00_L",0.00,-10.00,0.00);
	registPreset("index01_L",0.00,-15.00,0.00);
	registPreset("index02_L",0.00,0.00,-30.00);
	registPreset("index03_L",0.00,0.00,-30.00);
	registPreset("middle00_L",0.00,-5.00,0.00);
	registPreset("middle01_L",0.00,-5.00,0.00);
	registPreset("middle02_L",0.00,0.00,-30.00);
	registPreset("middle03_L",0.00,0.00,-30.00);
	registPreset("ring01_L",0.00,5.00,0.00);
	registPreset("ring02_L",0.00,0.00,-30.00);
	registPreset("ring03_L",0.00,0.00,-30.00);
	registPreset("pinky00_L",0.00,10.00,0.00);
	registPreset("pinky01_L",0.00,10.00,0.00);
	registPreset("pinky02_L",0.00,0.00,-30.00);
	registPreset("pinky03_L",0.00,0.00,-30.00);
	presets["crow"]=current;
	
	current={};
	registPreset("thumb01_L",0.00,-15.00,0.00);
	registPreset("thumb02_L",15.00,30.00,-15.00);
	registPreset("thumb03_L",0.00,30.00,0.00);
	registPreset("index00_L",0.00,-10.00,0.00);
	registPreset("index01_L",0.00,-15.00,-30.00);
	registPreset("index02_L",0.00,0.00,-45.00);
	registPreset("index03_L",0.00,0.00,-60.00);
	registPreset("middle00_L",0.00,-5.00,0.00);
	registPreset("middle01_L",0.00,-5.00,-30.00);
	registPreset("middle02_L",0.00,0.00,-45.00);
	registPreset("middle03_L",0.00,0.00,-60.00);
	registPreset("ring01_L",0.00,5.00,-30.00);
	registPreset("ring02_L",0.00,0.00,-45.00);
	registPreset("ring03_L",0.00,0.00,-60.00);
	registPreset("pinky00_L",0.00,10.00,0.00);
	registPreset("pinky01_L",0.00,10.00,-30.00);
	registPreset("pinky02_L",0.00,0.00,-45.00);
	registPreset("pinky03_L",0.00,0.00,-60.00);
	presets["hold"]=current;
	
	current={};
	registPreset("thumb01_L",15.00,2.40,17.20);
	registPreset("thumb02_L",59.40,0.00,0.00);
	registPreset("thumb03_L",43.60,13.20,-48.80);
	registPreset("index00_L",0.00,0.00,10.00);
	registPreset("middle00_L",0.00,5.00,0.00);
	registPreset("middle01_L",0.00,0.00,-60.00);
	registPreset("middle02_L",0.00,0.00,-75.00);
	registPreset("middle03_L",0.00,0.00,-90.00);
	registPreset("ring01_L",0.00,0.00,-60.00);
	registPreset("ring02_L",0.00,0.00,-75.00);
	registPreset("ring03_L",0.00,0.00,-90.00);
	registPreset("pinky01_L",0.00,0.00,-60.00);
	registPreset("pinky02_L",0.00,0.00,-75.00);
	registPreset("pinky03_L",0.00,0.00,-95.00);
	presets["one"]=current;
	
	current={};
	registPreset("thumb01_L",15.60,-7.40,14.60);
	registPreset("thumb02_L",90.00,-2.40,7.60);
	registPreset("thumb03_L",22.20,26.80,-63.60);
	registPreset("index00_L",0.00,0.00,10.00);
	registPreset("middle00_L",0.00,0.00,10.00);
	registPreset("ring01_L",0.00,0.00,-60.00);
	registPreset("ring02_L",0.00,0.00,-75.00);
	registPreset("ring03_L",0.00,0.00,-90.00);
	registPreset("pinky01_L",0.00,0.00,-60.00);
	registPreset("pinky02_L",0.00,0.00,-75.00);
	registPreset("pinky03_L",0.00,0.00,-95.00);
	presets["two"]=current;
	
	current={};
	registPreset("thumb01_L",-25.00,4.80,-8.00);
	registPreset("index00_L",0.00,0.00,5.00);
	registPreset("index01_L",0.00,0.00,20.00);
	registPreset("middle00_L",0.00,0.00,5.00);
	registPreset("middle01_L",0.00,0.00,20.00);
	registPreset("ring00_L",0.00,0.00,5.00);
	registPreset("ring01_L",0.00,0.00,20.00);
	registPreset("pinky00_L",0.00,0.00,5.00);
	registPreset("pinky01_L",0.00,0.00,20.00);
	presets["warp"]=current;
	
	current={};
	registPreset("thumb01_L",-24.20,-9.80,-8.20);
	registPreset("thumb02_L",0.00,-13.60,-7.80);
	registPreset("index00_L",0.00,0.00,-20.00);
	registPreset("index01_L",0.00,0.00,-85.00);
	registPreset("index02_L",0.00,0.00,-100.00);
	registPreset("index03_L",0.00,0.00,-120.00);
	registPreset("middle00_L",0.00,0.00,-20.00);
	registPreset("middle01_L",0.00,0.00,-85.00);
	registPreset("middle02_L",0.00,0.00,-100.00);
	registPreset("middle03_L",0.00,0.00,-120.00);
	registPreset("ring00_L",0.00,0.00,-20.00);
	registPreset("ring01_L",0.00,0.00,-85.00);
	registPreset("ring02_L",0.00,0.00,-100.00);
	registPreset("ring03_L",0.00,0.00,-120.00);
	registPreset("pinky00_L",0.00,0.00,-20.00);
	registPreset("pinky01_L",0.00,0.00,-85.00);
	registPreset("pinky02_L",0.00,0.00,-100.00);
	registPreset("pinky03_L",0.00,0.00,-120.00);
	presets["thumb"]=current;
	
	return presets;
}