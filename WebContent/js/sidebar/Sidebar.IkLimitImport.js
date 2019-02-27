/*
	<script src="../../../js/sidebar/Sidebar.IkLimitImport.js"></script>
	
	<script src="../../../js/ui/ListLoadJsonDiv.js"></script>
	<script src="../../../js/ui/LoadJsonRow.js"></script>
 */
Sidebar.IkLimitImport=function(application){
	var ap=application;
	var container=new UI.TitlePanel("Ik Limit Import");
	
	var listJsonDiv=new ListLoadJsonDiv("../../../dataset/mbl3d/iklimit/",
			["","loose.json","rotatex.json"],
			function(json){
				if(json==null){
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
					if(json.ikLimitMin==undefined || json.ikLimitMax==undefined){
						console.log("need ikLimitMin & ikLimitMax",json);
						return null;
					}
					ap.ikControler.ikLimitMin=json.ikLimitMin;
					ap.ikControler.ikLimitMax=json.ikLimitMax;
				}
				ap.getSignal("boneLimitLoaded").dispatch(ap.ikControler.ikLimitMin,ap.ikControler.ikLimitMax);
			}
			);
	container.add(listJsonDiv);
	
		
		
		

	return container;
}