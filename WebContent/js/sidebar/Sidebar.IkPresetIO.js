/*
<script src="../../../js/IkPresets.js"></script>

<script src="../../../js/sidebar/Sidebar.IkPresetIO.js"></script>
 
<script src="../../../js/ui/ListLoadJsonDiv.js"></script>
<script src="../../../js/ui/LoadJsonRow.js"></script>
<script src="../../../js/ui/ExportJsonDiv.js"></script>
 */
Sidebar.IkPresetIO=function(ap,enableExport){
	enableExport=enableExport==undefined?true:enableExport;
	var title=enableExport?"IkPreset Load & Export":"IkPreset Load"
	var titlePanel=new UI.TitlePanel(title);
	
	
	
	var jsonList=new ListLoadJsonDiv("../../../dataset/mbl3d/ikpreset/",
			["","order.json","simple.json","touch.json"],function(json){
		
		if(json==null){
			ap.ikControler.setPresets(new IkPresets(ap.ikControler));
		}else{
			var presets=IkPresets.parse(json,ap.ikControler);
			
			ap.ikControler.setPresets(presets);
		}
		
		ap.signals.transformSelectionChanged.dispatch(null);//refresh table
	});
	titlePanel.add(jsonList);
	
	if(enableExport){
		var exportDiv=new ExportJsonDiv(ap,function(fileName){
			var ikPresets=ap.ikControler.getPresets();
			var json=ikPresets.toJSON();
			return JSON.stringify(json);
		});
		titlePanel.add(exportDiv);
	}
	
	return titlePanel;
}