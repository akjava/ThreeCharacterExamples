Sidebar.VrmTextureDownload=function(ap){
	var container=new UI.TitlePanel("Vrm TextureDownload");
	

	
	
	
	var itemList=new UI.Select();
	container.add(itemList);
	itemList.onChange(function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		
		checkRow.setValue(target.material.visible);
		wireRow.setValue(target.material.wireframe);
	});
	
	ap.getSignal("loadingModelFinished").add(function(model){
		var keys={};
		model.traverse(function(model){
			if(model.isSkinnedMesh){
				keys[model.id]=model.name;
			}
		});
		itemList.setOptions(keys);
	});
	
	var row=new UI.Row();
	container.add(row);
	var checkRow=new UI.CheckboxSpan("Visible",false,function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		target.material.visible=v;
	});
	checkRow.text.setWidth("50px");
	checkRow.checkbox.setMarginRight("16px");
	row.add(checkRow);
	

	
	var wireRow=new UI.CheckboxSpan("Wireframe",false,function(v){
		var value=itemList.getValue();
		var target=ap.skinnedMesh.getObjectById(Number(value));
		target.material.wireframe=v;
	});
	wireRow.text.setWidth("70px");
	
	row.add(wireRow);
	
	function getMaterial(){
		var value=itemList.getValue();
		if(value==""){
			return null;
		}
		var target=ap.skinnedMesh.getObjectById(Number(value));
		return target.material
	}
	
	
	
	var download=new UI.ButtonRow("Download Selected Texture",function(){
		var material=getMaterial();
		console.log(material);
		var image=material.map.image;
		var canvas = document.createElement('canvas');
		canvas.width=image.width;
		canvas.height=image.height;
		var ctx=canvas.getContext('2d');
		ctx.drawImage(image,0,0);
		//TODO draw UV
		var a=AppUtils.generateBase64DownloadLink(canvas.toDataURL(),"image/png","texture.png","texture.png",false);
		a.click();
	});
	container.add(download);
	


	
	
	return container;
}