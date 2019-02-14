Sidebar.TextureMaps=function(ap){
	var titlePanel=new UI.TitlePanel("Texture Maps");
	titlePanel.add(new UI.Subtitle("Map"));
	
	//initialize here
	ap.defaultTextureUrls={};
	ap.textureUrls={};
	ap.textures={};
	
	var map=new ListTextureDiv(ap,
			["m_brown.png","m_brown_gray.png","m_brown_male.png","m_brown_male2.png","m_brown_nd.png","uv_2048.png"]
			,"map"
			);
	titlePanel.add(map);
	titlePanel.add(new UI.Subtitle("Displacement"));
	
	var displacement=new ListTextureDiv(ap,
			["","displacement.png","displacement2.png","displacement3.png"]
			,"displacementMap"
			);
	titlePanel.add(displacement);
	
	ap.displacementScale=0.02;
	var displacementScale=new UI.NumberButtons("Scale",0,1,1,ap.displacementScale,function(v){
		ap.displacementScale=v;
		application.signals.materialChanged.dispatch();
	},[0.01,0.02,0.03]);
	titlePanel.add(displacementScale);
	
	
	ap.signals.loadingModelFinished.add(function(){
		application.signals.loadingTextureStarted.dispatch(ap.textureUrls.map,"map");
	});
	
	return titlePanel;
}