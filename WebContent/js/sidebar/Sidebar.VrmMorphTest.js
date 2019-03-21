Sidebar.VrmMorphTest=function(ap){
	var container=new UI.TitlePanel("Vrm MorphTest");
	
	container.add(new UI.Subtitle("BlendShapes"));
	var intensityBts=new UI.NumberButtons("Intensity",0,1,1,1,function(v){
		updateBlendShapes();
	},[0.1,0.5,1]);
	container.add(intensityBts);
	
	var blendShapeDiv=new UI.Div();
	container.add(blendShapeDiv);
	
	function updateBlendShapes(){
		VrmUtils.clearMorphs(hasMorphTargets);
		var intensity=intensityBts.getValue();
		for(var i=0;i<blendShapeChecks.length;i++){
			var checked=blendShapeChecks[i].getValue();
			if(checked){
				VrmUtils.applyBlendShape(ap.skinnedMesh,blendShapes[i],intensity);
				ap.getSignal("applyBlendShape").dispatch(blendShapes[i]);
			}
		}
	}
	
	function createBlendShapeCheckbox(blendShape){
		var check=new UI.CheckboxRow(blendShape.name,false,function(){updateBlendShapes()});
		blendShapeChecks.push(check);
		blendShapeDiv.add(check);
	}
	
	var blendShapeChecks=[];
	
	var hasMorphTargets=[];
	var blendShapes=[];
	ap.getSignal("loadingModelFinished").add(function(mesh){
		hasMorphTargets=[]
		mesh.traverse(function(obj){
			if(obj.isSkinnedMesh){
				if(obj.morphTargetInfluences){
					hasMorphTargets.push(obj);
				}
			}
		});
		
		blendShapes=VrmUtils.parseBlendShapes(ap.vrm);
		
		blendShapeDiv.clear();
		blendShapeChecks=[];
		for(var i=0;i<blendShapes.length;i++){
			createBlendShapeCheckbox(blendShapes[i]);
		}
		
		updateBlendShapes();
	});
	
	return container;
}