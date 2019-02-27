/*
	<script src="../../../js/sidebar/Sidebar.IkLimitImport.js"></script>
	
	<script src="../../../js/ui/ListLoadJsonDiv.js"></script>
	<script src="../../../js/ui/LoadJsonRow.js"></script>
 */
Sidebar.IkLimitImport=function(application){
	var ap=application;
	var container=new UI.TitlePanel("Ik Limit Import");
	
	
	function mergeIkLimit(newMin,newMax){
		ap.ikControler.ikLimitMin={};
		ap.ikControler.ikLimitMax={};
		
		Object.keys(ap.ikControler.ikDefaultLimitMin).forEach(function(key){
			ap.ikControler.ikLimitMin[key]={};
			if(newMin[key]==undefined){
				ap.ikControler.ikLimitMin[key].x=ap.ikControler.ikDefaultLimitMin[key].x;
				ap.ikControler.ikLimitMin[key].y=ap.ikControler.ikDefaultLimitMin[key].y;
				ap.ikControler.ikLimitMin[key].z=ap.ikControler.ikDefaultLimitMin[key].z;
			}else{
				ap.ikControler.ikLimitMin[key].x=newMin[key].x;
				ap.ikControler.ikLimitMin[key].y=newMin[key].y;
				ap.ikControler.ikLimitMin[key].z=newMin[key].z;
			}
		});
		
		Object.keys(ap.ikControler.ikDefaultLimitMax).forEach(function(key){
			ap.ikControler.ikLimitMax[key]={};
			if(newMax[key]==undefined){
				ap.ikControler.ikLimitMax[key].x=ap.ikControler.ikDefaultLimitMax[key].x;
				ap.ikControler.ikLimitMax[key].y=ap.ikControler.ikDefaultLimitMax[key].y;
				ap.ikControler.ikLimitMax[key].z=ap.ikControler.ikDefaultLimitMax[key].z;
			}else{
				ap.ikControler.ikLimitMax[key].x=newMax[key].x;
				ap.ikControler.ikLimitMax[key].y=newMax[key].y;
				ap.ikControler.ikLimitMax[key].z=newMax[key].z;
			}
			
			
			
		});
	}
	
	
	var listJsonDiv=new ListLoadJsonDiv("../../../dataset/mbl3d/iklimit/",
			["","loose.json","rotatex.json","hand.json"],
			function(json){
				if(json==null){
					mergeIkLimit({},{});
				}else{
					if(json.ikLimitMin==undefined || json.ikLimitMax==undefined){
						console.log("need ikLimitMin & ikLimitMax",json);
						return null;
					}
					mergeIkLimit(json.ikLimitMin,json.ikLimitMax);
				}
				ap.getSignal("boneLimitLoaded").dispatch(ap.ikControler.ikLimitMin,ap.ikControler.ikLimitMax);
			}
			);
	container.add(listJsonDiv);
	
		
		
		

	return container;
}