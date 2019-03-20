var VrmFingerPresets=function(){
	
	function registPreset(key,x,y,z){
		current[key]=new THREE.Vector3(x,y,z);
	}
	
	var presets={};
	presets["default"]={};
	
	//finger order is ZYX
	
	var current={};
	current={};
	registPreset("leftMiddleProximal",0.00,6.80,74.56);
	registPreset("leftMiddleIntermediate",0.00,0.00,89.98);
	registPreset("leftMiddleDistal",0.00,0.00,82.10);
	registPreset("leftIndexProximal",0.00,14.40,79.00);
	registPreset("leftIndexIntermediate",0.00,0.00,90.00);
	registPreset("leftIndexDistal",0.00,0.00,90.00);
	registPreset("leftLittleProximal",0.00,-5.80,89.64);
	registPreset("leftLittleIntermediate",0.00,0.00,89.92);
	registPreset("leftLittleDistal",0.00,0.00,81.55);
	registPreset("leftThumbProximal",-56.89,-0.59,-12.67);
	registPreset("leftThumbIntermediate",-25.77,23.08,33.08);
	registPreset("leftThumbDistal",-24.47,39.03,18.92);
	registPreset("leftRingProximal",0.00,0.00,82.20);
	registPreset("leftRingIntermediate",0.00,0.00,89.99);
	registPreset("leftRingDistal",0.00,0.00,78.87);
	presets["goo1"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,6.80,66.76);
	registPreset("leftMiddleIntermediate",0.00,0.00,89.98);
	registPreset("leftMiddleDistal",0.00,0.00,82.10);
	registPreset("leftIndexProximal",0.00,13.60,61.60);
	registPreset("leftIndexIntermediate",0.00,0.00,90.00);
	registPreset("leftIndexDistal",0.00,0.00,90.00);
	registPreset("leftLittleProximal",0.00,-5.80,73.84);
	registPreset("leftLittleIntermediate",0.00,0.00,89.92);
	registPreset("leftLittleDistal",0.00,0.00,81.55);
	registPreset("leftThumbProximal",4.74,14.32,-4.03);
	registPreset("leftThumbIntermediate",-26.38,25.04,17.96);
	registPreset("leftThumbDistal",-0.08,39.03,10.91);
	registPreset("leftRingProximal",0.00,0.00,70.00);
	registPreset("leftRingIntermediate",0.00,0.00,89.99);
	registPreset("leftRingDistal",0.00,0.00,78.87);
	presets["goo2"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,0.00,48.43);
	registPreset("leftMiddleIntermediate",0.00,0.00,89.99);
	registPreset("leftMiddleDistal",0.00,0.00,39.00);
	registPreset("leftIndexProximal",0.00,5.60,50.28);
	registPreset("leftIndexIntermediate",0.00,0.00,89.95);
	registPreset("leftIndexDistal",0.00,0.00,52.65);
	registPreset("leftLittleProximal",0.00,-13.20,47.72);
	registPreset("leftLittleIntermediate",0.00,0.00,89.17);
	registPreset("leftLittleDistal",0.00,0.00,67.85);
	registPreset("leftThumbProximal",-24.64,17.74,-13.37);
	registPreset("leftThumbIntermediate",-77.05,29.21,4.08);
	registPreset("leftThumbDistal",-54.74,29.76,23.14);
	registPreset("leftRingProximal",0.00,-5.60,58.26);
	registPreset("leftRingIntermediate",0.00,0.00,90.00);
	registPreset("leftRingDistal",0.00,0.00,73.34);
	presets["goo3"]=current;
	
	current={};
	registPreset("leftIndexProximal",0.00,8.03,0.00);
	registPreset("leftIndexIntermediate",0.00,0.00,0.01);
	registPreset("leftIndexDistal",0.00,0.00,0.10);
	registPreset("leftLittleProximal",0.00,-11.17,0.00);
	registPreset("leftLittleDistal",0.00,0.00,0.00);
	registPreset("leftThumbProximal",-12.14,26.87,-10.72);
	registPreset("leftThumbIntermediate",2.63,7.00,7.69);
	registPreset("leftThumbDistal",7.01,10.59,5.25);
	registPreset("leftRingProximal",0.00,-6.08,0.00);
	registPreset("leftRingDistal",0.00,0.00,0.00);
	presets["flat"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,-2.89,-5.25);
	registPreset("leftMiddleIntermediate",0.00,0.00,28.22);
	registPreset("leftMiddleDistal",0.00,0.00,44.67);
	registPreset("leftIndexProximal",0.00,10.73,9.00);
	registPreset("leftIndexIntermediate",0.00,0.00,14.92);
	registPreset("leftIndexDistal",0.00,0.00,42.46);
	registPreset("leftLittleProximal",0.00,-29.77,31.36);
	registPreset("leftLittleIntermediate",0.00,0.00,0.00);
	registPreset("leftLittleDistal",0.00,0.00,8.31);
	registPreset("leftThumbProximal",-76.01,3.46,-35.84);
	registPreset("leftThumbIntermediate",2.47,-4.06,2.82);
	registPreset("leftThumbDistal",6.24,0.14,5.57);
	registPreset("leftRingProximal",0.00,-15.74,9.47);
	registPreset("leftRingIntermediate",0.00,0.00,26.51);
	registPreset("leftRingDistal",0.00,0.00,24.59);
	presets["kosaji"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,6.80,74.56);
	registPreset("leftMiddleIntermediate",0.00,0.00,89.98);
	registPreset("leftMiddleDistal",0.00,0.00,82.10);
	registPreset("leftIndexProximal",0.00,14.40,79.00);
	registPreset("leftIndexIntermediate",0.00,0.00,90.00);
	registPreset("leftIndexDistal",0.00,0.00,90.00);
	registPreset("leftLittleProximal",0.00,-5.80,89.64);
	registPreset("leftLittleIntermediate",0.00,0.00,89.92);
	registPreset("leftLittleDistal",0.00,0.00,81.55);
	registPreset("leftThumbProximal",9.56,-27.55,-5.06);
	registPreset("leftThumbIntermediate",0.07,-4.20,0.48);
	registPreset("leftThumbDistal",0.25,0.02,0.23);
	registPreset("leftRingProximal",0.00,0.00,82.20);
	registPreset("leftRingIntermediate",0.00,0.00,89.99);
	registPreset("leftRingDistal",0.00,0.00,78.87);
	presets["thumbup"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,0.00,7.79);
	registPreset("leftMiddleIntermediate",0.00,0.00,0.13);
	registPreset("leftMiddleDistal",0.00,0.00,0.03);
	registPreset("leftIndexProximal",0.00,-12.00,11.89);
	registPreset("leftIndexIntermediate",0.00,0.00,0.09);
	registPreset("leftIndexDistal",0.00,0.00,0.09);
	registPreset("leftLittleProximal",6.20,-13.00,50.12);
	registPreset("leftLittleIntermediate",0.00,0.00,89.17);
	registPreset("leftLittleDistal",0.00,0.00,67.85);
	registPreset("leftThumbProximal",-28.84,19.54,0.00);
	registPreset("leftThumbIntermediate",-68.05,24.01,-20.92);
	registPreset("leftThumbDistal",-1.94,27.96,19.74);
	registPreset("leftRingProximal",0.00,-5.60,58.26);
	registPreset("leftRingIntermediate",0.00,0.00,90.00);
	registPreset("leftRingDistal",0.00,0.00,73.34);
	presets["peace"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,0.00,7.79);
	registPreset("leftMiddleIntermediate",0.00,0.00,0.13);
	registPreset("leftMiddleDistal",0.00,0.00,0.03);
	registPreset("leftIndexProximal",0.00,9.20,11.89);
	registPreset("leftIndexIntermediate",0.00,0.00,0.09);
	registPreset("leftIndexDistal",0.00,0.00,0.09);
	registPreset("leftLittleProximal",6.20,-13.00,50.12);
	registPreset("leftLittleIntermediate",0.00,0.00,89.17);
	registPreset("leftLittleDistal",0.00,0.00,67.85);
	registPreset("leftThumbProximal",-28.84,19.54,0.00);
	registPreset("leftThumbIntermediate",-68.05,24.01,-20.92);
	registPreset("leftThumbDistal",-1.94,27.96,19.74);
	registPreset("leftRingProximal",0.00,-5.60,58.26);
	registPreset("leftRingIntermediate",0.00,0.00,90.00);
	registPreset("leftRingDistal",0.00,0.00,73.34);
	presets["two"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,0.00,58.26);
	registPreset("leftMiddleIntermediate",0.00,0.00,90.00);
	registPreset("leftMiddleDistal",0.00,0.00,73.34);
	registPreset("leftIndexProximal",0.00,9.20,11.89);
	registPreset("leftIndexIntermediate",0.00,0.00,0.09);
	registPreset("leftIndexDistal",0.00,0.00,0.09);
	registPreset("leftLittleProximal",6.20,-13.00,50.12);
	registPreset("leftLittleIntermediate",0.00,0.00,89.17);
	registPreset("leftLittleDistal",0.00,0.00,67.85);
	registPreset("leftThumbProximal",-27.80,15.67,-3.94);
	registPreset("leftThumbIntermediate",-66.50,11.86,-24.02);
	registPreset("leftThumbDistal",1.65,16.51,14.35);
	registPreset("leftRingProximal",0.00,-5.60,58.26);
	registPreset("leftRingIntermediate",0.00,0.00,90.00);
	registPreset("leftRingDistal",0.00,0.00,73.34);
	presets["one"]=current;
	
	current={};
	registPreset("leftIndexProximal",0.00,0.62,24.87);
	registPreset("leftIndexIntermediate",0.00,0.00,55.85);
	registPreset("leftIndexDistal",0.00,0.00,57.75);
	registPreset("leftThumbProximal",-12.48,8.66,6.03);
	registPreset("leftThumbIntermediate",-14.69,29.38,6.30);
	registPreset("leftThumbDistal",-13.62,30.00,5.67);
	presets["ring"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,0.00,-10.00);
	registPreset("leftIndexProximal",0.00,-12.60,-10.00);
	registPreset("leftLittleProximal",0.00,20.00,-5.00);
	registPreset("leftThumbProximal",6.40,-5.80,2.00);
	registPreset("leftRingProximal",0.00,12.40,-5.00);
	presets["paa"]=current;
	
	current={};
	registPreset("leftMiddleProximal",0.00,0.00,48.23);
	registPreset("leftMiddleIntermediate",0.00,0.00,21.30);
	registPreset("leftMiddleDistal",0.00,0.00,6.13);
	registPreset("leftLittleProximal",0.00,-5.80,89.64);
	registPreset("leftLittleIntermediate",0.00,0.00,89.92);
	registPreset("leftLittleDistal",0.00,0.00,81.55);
	registPreset("leftThumbProximal",9.56,-27.55,-5.06);
	registPreset("leftThumbIntermediate",0.07,-4.20,0.48);
	registPreset("leftThumbDistal",0.25,0.02,0.23);
	registPreset("leftRingProximal",0.00,0.00,82.20);
	registPreset("leftRingIntermediate",0.00,0.00,89.99);
	registPreset("leftRingDistal",0.00,0.00,78.87);
	presets["bang"]=current;
	return presets;
}