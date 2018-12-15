var LoadClipPanel=function(title,onLoad,onReset,accepts){
	if(accepts==undefined){
		accepts=".json";
	}
	if(onReset==undefined){
		onReset=onLoad;
	}
	var container=new UI.TitlePanel(title);
	container.clip=null;
	
	var row1=new UI.Row();
	container.add(row1);
	
	container.pose=null;
	
	var fileInput=new UI.TextFile(accepts);
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,text){
		if(text==null){//just Reset
			if(onReset!==undefined){
				container.clip=null;
				onReset(null);
			}else{
				console.error("LoadPosePanel:onReset is undefined")
			}
			return;
		}
		
		var json = JSON.parse( text );//TODO catch
		
		
		
		
		var clip=THREE.AnimationClip.parse(json);
		if(json.boneNames!==undefined){
			clip.boneNames=json.boneNames;
		}
		
		container.clip=clip;
		if(onLoad!==undefined){
			onLoad(clip);
		}else{
			console.error("LoadPosePanel:onLoad is undefined")
		}
		
	});
	

	
	return container;
}