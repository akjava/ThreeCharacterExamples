/*
	<script src="../../../js/ui/ListJsonDiv.js"></script>
	<script src="../../../js/ui/LoadJsonRow.js"></script>
 */
/*
 * maybe itemList first item empty(null) is better.
 */
var ListLoadJsonDiv=function(baseDir,itemList,onLoad,onReset,accepts){
	onReset=onReset==undefined?onLoad:onReset;
	var div=new UI.Div();
	
	function loadItem(v){
		var url;
		if(v==""){
			url=null;
		}else{
			url=baseDir+v;
		}
		
		
		
		var json=null;
		
		if(url!=null){
			var loader = new THREE.FileLoader();
			loader.load( url, function ( text ) {
				var json = JSON.parse( text );
				onLoad(json);
			});
		}else{
			onReset(null);
		}
	}
	var list=new UI.List(itemList,function(v){
		loadItem(v);
	});
	
	div.add(list);
	
	var loader=new LoadJsonRow(function(json){
		list.setValue(itemList[0]);
		
		if(json==null){
			btRow.button.setDisabled(true);
			loadItem(itemList[0]);
		}else{
			btRow.button.setDisabled(false);
			onLoad(json);
		}
	},undefined,accepts);
	div.add(loader);
	
	var btRow=new UI.ButtonRow("Re select uploaded",function(){
		if(loader.json==null){
			return;
		}
		onLoad(loader.json);
	});
	btRow.button.setDisabled(true);
	div.add(btRow);
	
	return div;
}