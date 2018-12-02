Sidebar.Clip=function(ap){
	var container=new UI.Panel();
	
	container.setId( 'clip' );
	
	//container.add(titleDiv);
	
	var row1=new UI.Row();
	container.add(row1);
	
	function play(){
		
	}
	
	var fileInput=new UI.TextFile(".json");
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,text){
		ap.signals.morphAnimationFinished.dispatch();
		
		var json = JSON.parse( text );//TODO catch
		
		console.log(json);
		
		var clip=THREE.AnimationClip.parse(json);
		console.log(clip);
		
		var mixer=ap.mixer;
		mixer.stopAllAction();
		mixer.uncacheClip(clip.name);
		mixer.clipAction(clip).play();
	});
	
	return container;
}