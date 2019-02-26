Sidebar.IkLimitExport=function(application){
	var ap=application;
	var container=new UI.TitlePanel("Ik Limit Export");
	//export
	var fileName="iklimit.json";
	var linkName=fileName;
	
	function makeJsonText(){
		var json={ikLimitMin:ap.ikControler.ikLimitMin,ikLimitMax:ap.ikControler.ikLimitMax};
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