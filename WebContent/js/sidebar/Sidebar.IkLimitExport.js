Sidebar.IkLimitExport=function(application){
	var ap=application;
	var container=new UI.TitlePanel("Ik Limit Export");
	//export
	var fileName="iklimit.json";
	var linkName=fileName;
	
	function makeJsonText(){
		var diffMin={};
		Object.keys(ap.ikControler.ikLimitMin).forEach(function(key){
			var cmin=ap.ikControler.ikLimitMin[key];
			var def=ap.ikControler.ikDefaultLimitMin[key];
			if(def==undefined){
				def={x:-180,y:-180,z:-180};
			}
			if(cmin.x!=def.x||cmin.y!=def.y||cmin.z!=def.z){
				diffMin[key]=cmin;
			}
		});
		var diffMax={};
		Object.keys(ap.ikControler.ikLimitMax).forEach(function(key){
			var cmax=ap.ikControler.ikLimitMax[key];
			var def=ap.ikControler.ikDefaultLimitMax[key];
			if(def==undefined){
				def={x:180,y:180,z:180};
			}
			if(cmax.x!=def.x||cmax.y!=def.y||cmax.z!=def.z){
				diffMax[key]=cmax;
			}
		});
		
		var json={ikLimitMin:diffMin,ikLimitMax:diffMax};
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
		link.click();

	} );
	bt.setMarginRight("6px");
	exportRow.add(bt);
	
	
	var span=new UI.Span();
	exportRow.add(span);

	return container;
}