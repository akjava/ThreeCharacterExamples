Sidebar.Transparent=function(ap){
	var titlePanel=new UI.TitlePanel("Mesh Transparent Plus");
	var transparent=new UI.CheckboxRow("transparent",true,function(v){
		ap.skinnedMesh.material.transparent=v;
		if(!v){
			opacity.setDisabled(true);
		}else{
			alphaTest.setDisabled(false);
		}
	});
	titlePanel.add(transparent);
	var opacity=new UI.NumberButtons("Opacity",0,1,1,1,function(v){
		ap.skinnedMesh.material.opacity=v;
	},[0,0.5,0.75,1]);
	titlePanel.add(opacity);
	var alphaTest=new UI.NumberButtons("AlphaTest",0,1,1,0.2,function(v){
		ap.skinnedMesh.material.alphaTest=v;
		ap.skinnedMesh.material.needsUpdate=true;
		console.log(ap.skinnedMesh.material);
	},[0,0.5,0.75,1]);
	titlePanel.add(alphaTest);
	
	
	ap.getSignal("materialChanged").add(function(){
		ap.skinnedMesh.material.transparent=transparent.getValue();
		ap.skinnedMesh.material.opacity=opacity.getValue();
		ap.skinnedMesh.material.alphaTest=alphaTest.getValue();
	},undefined,-1);
	
	return titlePanel;
}