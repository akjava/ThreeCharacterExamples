Sidebar.TextureMaps=function(ap){
	var titlePanel=new UI.TitlePanel("Texture Maps");
	titlePanel.add(new UI.Subtitle("Map"));
	
	//initialize here
	ap.defaultTextureUrls={};
	ap.textureUrls={};
	ap.textures={};
	
	var map=new ListTextureDiv(ap,
			["m_brown.png","m_brown_gray.png","m_brown_gray2.png","m_brown_male.png","m_brown_male2.png","m_brown_nd.png",
				"bikini.png","sox.png","uv_2048.png"]
			,"map"
			);
	titlePanel.add(map);
	titlePanel.add(new UI.Subtitle("Displacement"));
	
	var displacement=new ListTextureDiv(ap,
			["","displacement.png","displacement2.png","displacement3.png","displacement_bikini.png",
				"displacement_sox.png","displacement_pelvis.png","displacement_pelvis2.png"]
			,"displacementMap"
			);
	titlePanel.add(displacement);
	
	ap.displacementScale=0.02;
	var displacementScale=new UI.NumberButtons("Scale",0,1,.01,ap.displacementScale,function(v){
		ap.displacementScale=v;
		application.signals.materialChanged.dispatch();
	},[0,0.01,0.02]);
	displacementScale.number.precision=3;
	titlePanel.add(displacementScale);
	
	ap.displacementBias=0;
	var displacementBias=new UI.NumberButtons("Bias",-10,10,.1,ap.displacementBias,function(v){
		ap.displacementBias=v;
		application.signals.materialChanged.dispatch();
	},[-0.01,0,0.01]);
	displacementBias.number.precision=3;
	titlePanel.add(displacementBias);
	
	titlePanel.add(new UI.Subtitle("Bump"));
	var bump=new ListTextureDiv(ap,
			["","bump.png","bump2.png","bump3.png","bump_cloth.png"]
			,"bumpMap"
			);
	titlePanel.add(bump);
	ap.bumpScale=1;
	var bumpScale=new UI.NumberButtons("Scale",0,1,.01,ap.bumpScale,function(v){
		ap.bumpScale=v;
		application.signals.materialChanged.dispatch();
	},[0,0.1,0.5,1]);
	bumpScale.number.precision=3;
	titlePanel.add(bumpScale);
	
	titlePanel.add(new UI.Subtitle("Emissive"));
	var emissive=new ListTextureDiv(ap,
			["","bump.png","bump2.png","bump3.png","bump_cloth.png"]
			,"emissiveMap"
			);
	titlePanel.add(emissive);
	ap.emissiveIntensity=0;
	var emissiveIntensity=new UI.NumberButtons("Intensity",0,10,1,ap.emissiveIntensity,function(v){
		ap.emissiveIntensity=v;
		application.signals.materialChanged.dispatch();
	},[0,0.1,0.5,1]);
	titlePanel.add(emissiveIntensity);
	
	ap.emissive=0xffffff;
	var emissiveColor=new UI.ColorRow("color",ap.emissive,function(v){
		ap.emissive=v;
		application.signals.materialChanged.dispatch();
	});
	titlePanel.add(emissiveColor);
	 
	
	ap.signals.loadingModelFinished.add(function(){
		application.signals.loadingTextureStarted.dispatch(ap.textureUrls.map,"map");
	});
	
	return titlePanel;
}