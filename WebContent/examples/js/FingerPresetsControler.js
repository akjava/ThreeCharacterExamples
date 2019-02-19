var FingerPresetsControler=function(ap,presets){
	this.ap=ap;
	var scope=this;
	this.presets=presets;
	
	this._presetNameL="default";
	this._presetNameR="default";
	this._intensityL=1.0;
	this._intensityR=1.0;
	
	this.test="";
	
	this.needsUpdateL=false;
	this.needsUpdateR=false;
	
	this.boneList=null;
	this.fingerBoneIndicesL=[];
	this.fingerBoneIndicesR=[];
	
	this._presetsL={};
	this._presetsR={};
	
	this._quaternion=new THREE.Quaternion();
	this._euler=new THREE.Euler();
	
	function convertPresets(isL){
		var result={};
		Object.keys(scope.presets).forEach(function(presetName){
			var obj=scope.presets[presetName];
			var converted={};
			
			Object.keys(obj).forEach(function(key){
				var boneName=isL?key:key.replace("_L","_R");
				var index=BoneUtils.findBoneIndexByEndsName(scope.boneList,boneName);
				var rads=AppUtils.degToRad(obj[key]);
				if(!isL){
					rads.y=rads.y*-1;
					rads.z=rads.z*-1;
				}
				converted[String(index)]=rads;
			});
			result[presetName]=converted;
		});
		return result;
	}
	
	function updateFingerBoneIndices(){
		scope.fingerBoneIndicesL=[];
		scope.fingerBoneIndicesR=[];
		var boneList=scope.boneList;
		for(var i=0;i<boneList.length;i++){
			var name=boneList[i].name;
			if(Mbl3dUtils.isFingerBoneName(name)){
				if(name.endsWith("_L")){
					scope.fingerBoneIndicesL.push(i);
				}else{
					scope.fingerBoneIndicesR.push(i);
				}
			}
		}
	}
	
	ap.signals.loadingModelFinished.add(function(mesh){
		scope.boneList=BoneUtils.getBoneList(mesh);
		updateFingerBoneIndices();
		
		scope._presetsL=convertPresets(true);
		scope._presetsR=convertPresets(false);
		
		scope.update(true);
	},undefined,100);//call first
	
}

FingerPresetsControler.prototype.getFingerBoneIndices=function(isL){
	return isL?this.fingerBoneIndicesL:this.fingerBoneIndicesR;
}


FingerPresetsControler.prototype.constructor =FingerPresetsControler;
Object.defineProperty(FingerPresetsControler.prototype, 'intensityL', {
	  get() {
	    return this._intensityL;
	  },
	 
	  set(value) {
	    this._intensityL = value;
	    this.needsUpdateL=true;
	  },
	});
Object.defineProperty(FingerPresetsControler.prototype, 'intensityR', {
	  get() {
	    return this._intensityR;
	  },
	 
	  set(value) {
	    this._intensityR = value;
	    this.needsUpdateR=true;
	  },
	});

Object.defineProperty(FingerPresetsControler.prototype, 'presetNameL', {
	  get() {
	    return this._presetNameL;
	  },
	 
	  set(value) {
	    this._presetNameL = value;
	    this.needsUpdateL=true;
	  },
	});
Object.defineProperty(FingerPresetsControler.prototype, 'presetNameR', {
	  get() {
	    return this._presetNameR;
	  },
	 
	  set(value) {
	    this._presetNameR = value;
	    this.needsUpdateR=true;
	  },
	});

FingerPresetsControler.prototype.convertToQuaternion=function(boneIndex,presetName,intensicy,isL){
	var scope=this;
	var bone=scope.boneList[boneIndex];
	var obj=isL?scope._presetsL[presetName]:scope._presetsR[presetName];
	var rads=obj[boneIndex];
	if(rads==undefined){
		//console.log("no rad",bone.name,obj,scope._presetsL,presetName);
		rads={x:0,y:0,z:0};
	}
	var v=intensicy;
	
	this._euler.set(rads.x*v,rads.y*v,rads.z*v,bone.rotation.order);
	this._quaternion.setFromEuler(this._euler);
	return this._quaternion;
}

FingerPresetsControler.prototype.update=function(fireEvent){
	fireEvent=fireEvent==undefined?true:fireEvent;
	if(this.boneList==null){
		console.log("FingerPresetsControler.update() not ready,need load mesh.");
		return;
	}
	if(!this.needsUpdateL && !this.needsUpdateR){
		return;
	}
	var scope=this;
	
	function getRotation(index){
		var rotation=scope.boneList[index].rotation;
	
		return rotation;
	}
	
	function resetRotation(index){
		getRotation(index).set(0,0,0);//TODO get default matrix from somewhere
	}
	
	function resetRotationAll(isL){
		var indices=isL?scope.fingerBoneIndicesL:scope.fingerBoneIndicesR;

		indices.forEach(function(index){
			resetRotation(index);
		});
	}
	
	if(this.needsUpdateL){
		resetRotationAll(true);
		
		var obj=scope._presetsL[scope._presetNameL];
		var v=scope._intensityL;
		
		Object.keys(obj).forEach(function(key){
			var rads=obj[key];
			var index=Number(key);
			scope.boneList[index].rotation.set(rads.x*v,rads.y*v,rads.z*v);	
		});
		
			this.ap.getSignal("fingerPresetChanged").dispatch(true,fireEvent);
			this.needsUpdateL=false;
	}
	
	if(this.needsUpdateR){
		resetRotationAll(false);
		
		var obj=scope._presetsR[scope._presetNameR];
		var v=scope._intensityR;
		
		Object.keys(obj).forEach(function(key){
			var rads=obj[key];
			var index=Number(key);
			scope.boneList[index].rotation.set(rads.x*v,rads.y*v,rads.z*v);	
		});
		
			this.ap.getSignal("fingerPresetChanged").dispatch(false,fireEvent);
			this.needsUpdateR=false;
	}
	
}

FingerPresetsControler.prototype.getPresetKeys=function(){
	return Object.keys(this.presets);
}

var  FingerPresetsDummyControler=function(){
	this.presetNameL="default";
	this.presetNameR="default";
	this.intensityL=1.0;
	this.intensityR=1.0;
};