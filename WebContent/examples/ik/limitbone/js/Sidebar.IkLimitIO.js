Sidebar.IkLimitIO=function(application){
	var ap=application;
	var container=new UI.TitlePanel("Ik Limit Import/Export");
	
	
	container.add(new UI.SubtitleRow("Import"));
	//import
	var importRow=new  UI.Row();
	container.add(importRow);
	
	
	var fileInput=new UI.TextFile(".json");
	importRow.add(fileInput);
	
	//cancel not call this
	fileInput.onChange(function(fileName,text){
		
		
		if(text==null){//just Reset
			ap.ikLimitMin={};
			ap.ikLimitMax={};
			Object.keys(ap.ikDefaultLimitMin).forEach(function(key){
				ap.ikLimitMin[key]={};
				ap.ikLimitMin[key].x=ap.ikDefaultLimitMin[key].x;
				ap.ikLimitMin[key].y=ap.ikDefaultLimitMin[key].y;
				ap.ikLimitMin[key].z=ap.ikDefaultLimitMin[key].z;
				ap.ikLimitMax[key]={};
				ap.ikLimitMax[key].x=ap.ikDefaultLimitMax[key].x;
				ap.ikLimitMax[key].y=ap.ikDefaultLimitMax[key].y;
				ap.ikLimitMax[key].z=ap.ikDefaultLimitMax[key].z;
			});
			
		}else{
			var json = JSON.parse( text );//TODO catch
			//check validate
			if(json.ikLimitMin==undefined || json.ikLimitMax==undefined){
				console.log("need ikLimitMin & ikLimitMax");
				return null;
			}
			ap.ikLimitMin=json.ikLimitMin;
			ap.ikLimitMax=json.ikLimitMax;
		}
		
		
		
		ap.signals.boneLimitLoaded.dispatch(ap.ikLimitMin,ap.ikLimitMax);
	});
	
	container.add(new UI.SubtitleRow("Export"));
	//export
	var fileName="iklimit.json";
	var linkName=fileName;
	
	function makeJsonText(){
		var json={ikLimitMin:ap.ikLimitMin,ikLimitMax:ap.ikLimitMax};
		var jsonText=JSON.stringify(json);
		return jsonText;
	}
	
	var exportRow=new UI.Row();
	container.add(exportRow);
	
	var bt=new UI.Button("Make Download").onClick( function () {
		var jsonText=makeJsonText();
		span.dom.innerHTML = ''
		var link=AppUtils.generateTextDownloadLink(jsonText,fileName,linkName,true);
		span.dom.appendChild(link);

	} );
	bt.setMarginRight("6px");
	exportRow.add(bt);
	
	
	var span=new UI.Span();
	exportRow.add(span);

	return container;
}