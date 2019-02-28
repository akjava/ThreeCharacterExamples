Sidebar.TextureMaps=function(ap){
	var titlePanel=new UI.TitlePanel("Texture Maps");
	
	ap.color=0xffffff;
	var color=new UI.ColorRow("Color",ap.color,function(v){
		ap.color=v;
		application.signals.materialChanged.dispatch();
	});
	titlePanel.add(color);
	
	if(ap.shininess==undefined)
		ap.shininess=30;
	
	var shininess=new UI.NumberButtons("Shininess",0,1000,100,ap.shininess,function(v){
		ap.shininess=v;
		application.signals.materialChanged.dispatch();
	},[0,30,100,300]);
	titlePanel.add(shininess);
	
	titlePanel.add(new UI.Subtitle("Map"));
	
	//initialize here
	ap.defaultTextureUrls={};
	ap.textureUrls={};
	ap.textures={};
	
	var map=new ListTextureDiv(ap,
			["m_brown.png","m_brown_noeyelight.png","m_brown_gray.png","m_brown_gray2.png","m_brown_male.png","m_brown_male2.png","m_brown_nd.png",
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
	if(ap.displacementScale==undefined)
		ap.displacementScale=0.02;
	var displacementScale=new UI.NumberButtons("Scale",0,1,.01,ap.displacementScale,function(v){
		ap.displacementScale=v;
		application.signals.materialChanged.dispatch();
	},[0,0.01,0.02]);
	displacementScale.number.precision=3;
	titlePanel.add(displacementScale);
	if(ap.displacementBias==undefined)
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
	if(ap.bumpScale==undefined)
	ap.bumpScale=1;
	var bumpScale=new UI.NumberButtons("Scale",0,1,.01,ap.bumpScale,function(v){
		ap.bumpScale=v;
		application.signals.materialChanged.dispatch();
	},[0,0.1,0.5,1]);
	bumpScale.number.precision=3;
	titlePanel.add(bumpScale);
	
	titlePanel.add(new UI.Subtitle("Emissive"));
	var emissive=new ListTextureDiv(ap,
			["","emissive_eye.png","emissive_eye2.png","emissive_eye3.png","bump_cloth.png"]
			,"emissiveMap"
			);
	titlePanel.add(emissive);
	if(ap.emissiveIntensity==undefined)
	ap.emissiveIntensity=0;
	var emissiveIntensity=new UI.NumberButtons("Intensity",0,1,1,ap.emissiveIntensity,function(v){
		ap.emissiveIntensity=v;
		application.signals.materialChanged.dispatch();
	},[0,0.1,0.5,1]);
	titlePanel.add(emissiveIntensity);
	
	if(ap.emissive==undefined)
	ap.emissive=0xffffff;
	var emissiveColor=new UI.ColorRow("color",ap.emissive,function(v){
		ap.emissive=v;
		application.signals.materialChanged.dispatch();
	});
	titlePanel.add(emissiveColor);
	 
	titlePanel.add(new UI.Subtitle("Specular"));
	var specular=new ListTextureDiv(ap,
			["","bump_cloth.png","emissive_eye.png","white.png"]
			,"specularMap"
			);
	titlePanel.add(specular);
	if(ap.specular==undefined)
	ap.specular=0x111111;
	var specularColor=new UI.ColorRow("color",ap.specular,function(v){
		ap.specular=v;
		application.signals.materialChanged.dispatch();
	});
	titlePanel.add(specularColor);
	
	titlePanel.add(new UI.Subtitle("Ambient Occlusion"));
	var ao=new ListTextureDiv(ap,
			["","ao.jpg","aogaus2.jpg","aogaus5.jpg","aogaus10.jpg"]
			,"aoMap"
			);
	titlePanel.add(ao);
	if(ap.aoIntensity==undefined)
	ap.aoIntensity=1.0;
	
	var aoIntensity=new UI.NumberButtons("Intensity",0,10,1,ap.aoIntensity,function(v){
		ap.aoIntensity=v;
		application.signals.materialChanged.dispatch();
	},[0,0.5,1.0,1.5]);
	titlePanel.add(aoIntensity);
	
	//TODO normalmap
	
	ap.signals.loadingModelFinished.add(function(){
		application.signals.loadingTextureStarted.dispatch(ap.textureUrls.map,"map");
	});
	
	return titlePanel;
}