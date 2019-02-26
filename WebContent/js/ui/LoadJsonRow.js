var LoadJsonRow=function(onLoad,onReset,accepts){
	if(onLoad==undefined){
		console.error("LoadJsonRow need onLoad");
		return;
	}
	if(accepts==undefined){
		accepts=".json";
	}
	if(onReset==undefined){
		onReset=onLoad;
	}
	var row=new UI.Row();
	row.json=null;
	var fileInput=new UI.TextFile(accepts);
	row.add(fileInput);
	
	fileInput.onChange(function(fileName,text){
		if(text==null){//just Reset
			if(onReset!==undefined){
				row.json=null;
				onReset(null);
			}else{
				console.error("LoadJsonRow:onReset is undefined")
			}
			return;
		}
		
		var json = JSON.parse( text );
		row.json=json;
		
		onLoad(json);
		
	});
	row.fileInput=fileInput;
	
	return row;
}