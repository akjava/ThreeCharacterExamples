var ExportJsonDiv=function(ap,jsonFunction,fileNameFunction,buttonLabel){
	var exportPanel=new UI.Div();
	var scope=this;
	buttonLabel=buttonLabel==undefined?"Download Json":buttonLabel;
	if(fileNameFunction==undefined){
		fileNameFunction=function(base){
			if(base==""){
				base="data";
			}
			return base+".json";
		}
	}
	this.fileName="";
	var nameRow=new UI.InputRow("Name","",function(v){scope.fileName=v});
	nameRow.text.setWidth("110px");
	nameRow.text.setMarginRight("6px");

	nameRow.input.setWidth("140px");
	exportPanel.add(nameRow);
	
	var bt=new UI.Button(buttonLabel).onClick( function () {
		span.dom.innerHTML = ''
		var fileName=fileNameFunction(scope.fileName);
		var jsonText=jsonFunction(fileName);
		var link=AppUtils.generateTextDownloadLink(jsonText,fileName,fileName,true);
		span.dom.appendChild(link);
		link.click();
	} );
	exportPanel.add(bt);
	bt.setMarginRight("6px");
	var span=new UI.Span();
	exportPanel.add(span);
	return exportPanel;
}