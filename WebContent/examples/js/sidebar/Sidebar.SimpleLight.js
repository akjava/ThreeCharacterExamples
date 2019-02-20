Sidebar.SimpleLight=function(ap){
	
	var titlePanel=new UI.TitlePanel("Simple Light");
	
	var color1=0xaaaaaa;
	var color2=0xaaaaaa;
	var ambientColor=0x666666;
	
	var light1 = new THREE.DirectionalLight(color1);
	light1.position.set(100, 100, 100);
	ap.scene.add(light1);
	
	var lightColor=new UI.ColorRow("Light1",color1,function(v){
		light1.color.set(v);
	});
	titlePanel.add(lightColor);
	
	var light2 = new THREE.DirectionalLight(color2);
	light2.position.set(-100, -100, -100);
	ap.scene.add(light2);
	
	var light2Color=new UI.ColorRow("Light2",color2,function(v){
		light2.color.set(v);
	});
	titlePanel.add(light2Color);
	
	var ambientLight = new THREE.AmbientLight(ambientColor);
	
	ap.scene.add(ambientLight);
	
	var ambient=new UI.ColorRow("Ambient",ambientColor,function(v){
		ambientLight.color.set(v);
	});
	titlePanel.add(ambient);
	
	return titlePanel;
}