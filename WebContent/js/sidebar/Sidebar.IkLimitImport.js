Sidebar.IkLimitImport=function(application){
	var ap=application;
	var container=new UI.TitlePanel("Ik Limit Import");
	
	
	//import
	var importRow=new  UI.Row();
	container.add(importRow);
	
	
	var fileInput=new UI.TextFile(".json");
	importRow.add(fileInput);
	
	//cancel not call this
	fileInput.onChange(function(fileName,text){
		
		
		if(text==null){//just Reset
			ap.ikControler.ikLimitMin={};
			ap.ikControler.ikLimitMax={};
			Object.keys(ap.ikControler.ikDefaultLimitMin).forEach(function(key){
				ap.ikControler.ikLimitMin[key]={};
				ap.ikControler.ikLimitMin[key].x=ap.ikControler.ikDefaultLimitMin[key].x;
				ap.ikControler.ikLimitMin[key].y=ap.ikControler.ikDefaultLimitMin[key].y;
				ap.ikControler.ikLimitMin[key].z=ap.ikControler.ikDefaultLimitMin[key].z;
				ap.ikControler.ikLimitMax[key]={};
				ap.ikControler.ikLimitMax[key].x=ap.ikControler.ikDefaultLimitMax[key].x;
				ap.ikControler.ikLimitMax[key].y=ap.ikControler.ikDefaultLimitMax[key].y;
				ap.ikControler.ikLimitMax[key].z=ap.ikControler.ikDefaultLimitMax[key].z;
			});
			
		}else{
			var json = JSON.parse( text );//TODO catch
			//check validate
			if(json.ikLimitMin==undefined || json.ikLimitMax==undefined){
				console.log("need ikLimitMin & ikLimitMax");
				return null;
			}
			ap.ikControler.ikLimitMin=json.ikLimitMin;
			ap.ikControler.ikLimitMax=json.ikLimitMax;
		}
		
		
		
		ap.signals.boneLimitLoaded.dispatch(ap.ikControler.ikLimitMin,ap.ikControler.ikLimitMax);
	});

	return container;
}