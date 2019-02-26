Sidebar.JSONImport=function(ap,jsonFunction,accepts){
	if(accepts==undefined){
		accepts=".json";
	}
	var container=new UI.TitlePanel("Import");
	
	var row1=new UI.Row();
	container.add(row1);
	
	
	var fileInput=new UI.TextFile(accepts);
	row1.add(fileInput);
	
	fileInput.onChange(function(fileName,text){
		
		if(text==null){//just Reset
			jsonFunction(json);
			return;
		}
		
		var json = JSON.parse( text );//TODO catch
		jsonFunction(json);
	});
	
	return container;
}