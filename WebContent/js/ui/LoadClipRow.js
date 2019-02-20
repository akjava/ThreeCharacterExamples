var LoadClipRow=function(onLoad,onReset,accepts){
	if(accepts==undefined){
		accepts=".json";
	}
	if(onReset==undefined){
		onReset=onLoad;
	}
	var clipRow=new UI.Row();
	var fileInput=new UI.TextFile(accepts);
	clipRow.add(fileInput);
	
	fileInput.onChange(function(fileName,text){
		if(text==null){//just Reset
			if(onReset!==undefined){
				clipRow.clip=null;
				onReset(null);
			}else{
				console.error("LoadPosePanel:onReset is undefined")
			}
			return;
		}
		
		var json = JSON.parse( text );
		var clip=THREE.AnimationClip.parse(json);
		if(json.boneNames!==undefined){
			clip.boneNames=json.boneNames;
		}
		
		clipRow.clip=clip;
		if(onLoad!==undefined){
			onLoad(clip);
		}else{
			console.error("LoadPosePanel:onLoad is undefined")
		}
		
	});
	
	return clipRow;
}