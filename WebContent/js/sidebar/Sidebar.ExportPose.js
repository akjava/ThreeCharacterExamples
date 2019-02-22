Sidebar.ExportPose=function(ap){
	var scope=this;
	
	function makeClip(){
		var clip=AnimeUtils.makePoseClip(ap.skinnedMesh);
		return clip;
	}
	
	this.fileName="";
	var exportPanel=new UI.TitlePanel("Export Single Pose Frame Clip");
	var nameRow=new UI.InputRow("Name","",function(v){scope.fileName=v});
	nameRow.text.setWidth("110px");
	nameRow.text.setMarginRight("6px");

	nameRow.input.setWidth("140px");
	exportPanel.add(nameRow);
	
	var bt=new UI.Button("Download").onClick( function () {
		span.dom.innerHTML = ''
		var clip=makeClip(ap);
		var fileName=scope.fileName == ""?"pose":scope.fileName;
		fileName=fileName+".json";
		var jsonText=AnimeUtils.clipToJsonText(clip);
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