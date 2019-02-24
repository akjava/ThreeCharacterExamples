var ObjectTransformControler=function(ap){
	this.ap=ap;
	this.helper=null;
	var scope=this;
	
	this.logging=false;
	this.started=false;
	function onMeshTransformed(mode){
		if(scope.helper!=null){
			scope.helper.update();
		}
		var log="call";
		//TODO switch signal?
		if(ap.boneAttachControler){
			ap.boneAttachControler.update(true);	
			if(scope.logging){
				log+=" boneAttachControler.update";
			};
		}
		
		if(ap.ikControler){
			ap.ikControler.resetAllIkTargets();
			if(scope.logging){
				log+=" ikControler.resetAllIkTargets";
			};
		}
		
		if(ap.translateControler){
			ap.translateControler.updatePosition();
			if(scope.logging){
				log+=" translateControler.updatePosition";
			};
		}
		if(scope.logging){
			console.log(log+"("+mode+")");
		};
	}
	
	this.onMeshTransformed=onMeshTransformed;
	ap.getSignal("meshTransformChanged").add(onMeshTransformed);
}

ObjectTransformControler.prototype.dispose=function(){
	var ap=this.ap;
	ap.getSignal("meshTransformChanged").remove(this.onMeshTransformed);
	if(this.logging){
		console.log("ObjectTransformControler disposed");
	};
};


ObjectTransformControler.prototype.onTransformSelectionChanged=function(target){
	
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		if(target.userData.transformMode=="translate"){
			ap.transformControls.setMode( "translate" );
		}else{
			ap.transformControls.setMode( "rotate" );
		}
		
		if(this.logging){
			console.log("ObjectTransform selected mode=",ap.transformControls.getMode());
		};
		
		ap.transformControls.attach(target);
		if(this.helper==null){
			this.helper=new THREE.BoxHelper(target);
			ap.scene.add(this.helper);
			if(this.logging){
				console.log("ObjectTransformControler helper initialized");
			};
		}
		
		if(this.helper!=null){
			this.helper.material.visible=true;
			this.helper.update();
		}
		
		
	}else{
		if(this.helper!=null){
			this.helper.material.visible=false;
		}
	}
}
ObjectTransformControler.prototype.onTransformStarted=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		if(this.logging){
			console.log("ObjectTransformControler:started");
		};
		ap.getSignal("meshTransformChanged").add(this.onMeshTransformed);
		this.started=true;
	}
}

ObjectTransformControler.prototype.onTransformChanged=function(target){
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		if(!this.started){
			return;
		}
		if(this.logging){
			console.log("ObjectTransformControler:changed.dispatch meshTransformChanged");
		};
		this.ap.getSignal("meshTransformChanged").dispatch(target.userData.transformMode);
	}
}

ObjectTransformControler.prototype.onTransformFinished=function(target){
	var ap=this.ap;
	if(target!=null && target.userData.transformSelectionType=="ObjectTransform"){
		ap.getSignal("meshTransformChanged").remove(this.onMeshTransformed);
		
		if(this.logging){
			console.log("ObjectTransformControler:changed.dispatch meshTransformFinished");
		};
		ap.getSignal("meshTransformFinished").dispatch(target.userData.transformMode);
		
		
		if(this.helper!=null){
			this.helper.update();
		}
		this.started=false;
	}
}