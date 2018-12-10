Sidebar.Export=function(ap){
	function makeClip(){

		var clip=AnimeUtils.makePoseClip(ap.skinnedMesh);
		return clip;
	}
	
	var exportPanel=new UI.TitlePanel("Export");

	var bt=new UI.Button("Make Download").onClick( function () {
		span.dom.innerHTML = ''
		var clip=makeClip(ap);
		var jsonText=AnimeUtils.clipToJsonText(clip);
		var link=AppUtils.generateTextDownloadLink(jsonText,"pose.json","pose.json",true);
		span.dom.appendChild(link);

	} );
	exportPanel.add(bt);
	bt.setMarginRight("6px");
	var span=new UI.Span();
	exportPanel.add(span);
	return exportPanel;
}