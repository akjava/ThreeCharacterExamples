/**
 * based Three.js Editor
 * @author mrdoob / http://mrdoob.com/
 */

//Swap Options version
UI.Select2 = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'select' );
	dom.className = 'Select';
	dom.style.padding = '2px';

	this.dom = dom;

	return this;

};

UI.Select2.prototype = Object.create( UI.Element.prototype );
UI.Select2.prototype.constructor = UI.Select2;

UI.Select2.prototype.setMultiple = function ( boolean ) {

	this.dom.multiple = boolean;

	return this;

};

UI.Select2.prototype.setOptions = function ( options ) {

	var selected = this.dom.value;

	while ( this.dom.children.length > 0 ) {

		this.dom.removeChild( this.dom.firstChild );

	}

	for ( var key in options ) {

		var option = document.createElement( 'option' );
		option.value = options[ key ];
		option.innerHTML = key;
		this.dom.appendChild( option );

	}

	this.dom.value = selected;

	return this;

};

UI.Select2.prototype.getValue = function () {

	return this.dom.value;

};

UI.Select2.prototype.setValue = function ( value ) {

	value = String( value );

	if ( this.dom.value !== value ) {

		this.dom.value = value;

	}

	return this;

};
/*
 * to dispose
 * URL.revokeObjectURL(url);
 */
UI.BlobFile = function ( accepts) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'span' );

	var form = document.createElement( 'form' );
    
	var input = document.createElement( 'input' );
	input.type = 'file';
	input.accept=accepts;
	input.addEventListener( 'change', function ( event ) {
		scope.blobUrl=URL.createObjectURL(event.target.files[ 0 ]);
		scope.fileName=event.target.files[ 0 ].name;
		//console.log(scope.blobUrl,scope.fileName);
		
		scope.name.value=scope.fileName;
		
		if ( scope.onChangeCallback ) scope.onChangeCallback(scope.fileName,scope.blobUrl);
		form.reset();
		
	} );
	form.appendChild( input );


	var name = document.createElement( 'input' );
	name.disabled = true;
	name.style.width = '160px';
	name.style.border = '1px solid #ccc';
	dom.appendChild( name );
	this.name=name;
	
	this.dom = dom;
	this.blobUrl = null;
	this.fileName=null;
	this.onChangeCallback = null;
	
	var input3 = document.createElement( 'input' );
	input3.addEventListener( 'click', function ( event ) {
		scope.fileName=null;
		scope.name.value=null;
		
		if ( scope.onChangeCallback ) scope.onChangeCallback(null,null);
	}, false );
	input3.type = 'button';
	input3.value='Reset';
	dom.appendChild( input3 );
	
	
	var input2 = document.createElement( 'input' );
	input2.addEventListener( 'click', function ( event ) {
		input.click();
	}, false );
	input2.type = 'button';
	input2.value='Upload';
	dom.appendChild( input2 );
	
	

	
	return this;

};



UI.BlobFile.prototype = Object.create( UI.Element.prototype );
UI.BlobFile.prototype.constructor = UI.BlobFile;

UI.BlobFile.prototype.getValue = function () {

	return this.blobUrl;

};

UI.BlobFile.prototype.setFileName = function (fileName) {
	this.fileName=fileName;
	this.name.value=fileName;
};

//Nullable
UI.BlobFile.prototype.getFileName = function () {
	return this.fileName;
};


UI.BlobFile.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};


UI.DataUrlFile = function ( accepts) {

	UI.Element.call( this );

	var scope = this;

	this.dataUrl=null;
	var dom = document.createElement( 'span' );

	var form = document.createElement( 'form' );
    
	var input = document.createElement( 'input' );
	input.type = 'file';
	input.accept=accepts;
	input.addEventListener( 'change', function ( event ) {
		
		var reader = new FileReader();
		
		reader.addEventListener( 'load', function ( event ) {

			scope.dataUrl=event.target.result;
			if ( scope.onChangeCallback ) 
				scope.onChangeCallback(scope.fileName,event.target.result);

		}, false );

		var file=event.target.files[ 0 ];
		scope.fileName=event.target.files[ 0 ].name;
		scope.name.value=scope.fileName;
		reader.readAsDataURL( file );
		
		
		form.reset();
		
	} );
	form.appendChild( input );


	var name = document.createElement( 'input' );
	name.disabled = true;
	name.style.width = '160px';
	name.style.border = '1px solid #ccc';
	dom.appendChild( name );
	this.name=name;
	
	this.dom = dom;
	this.blobUrl = null;
	this.fileName=null;
	this.onChangeCallback = null;
	
	var input3 = document.createElement( 'input' );
	input3.addEventListener( 'click', function ( event ) {
		scope.fileName=null;
		scope.name.value=null;
		
		if ( scope.onChangeCallback ) scope.onChangeCallback(null,null);
	}, false );
	input3.type = 'button';
	input3.value='Reset';
	dom.appendChild( input3 );
	
	
	var input2 = document.createElement( 'input' );
	input2.addEventListener( 'click', function ( event ) {
		input.click();
	}, false );
	input2.type = 'button';
	input2.value='Upload';
	dom.appendChild( input2 );
	
	

	
	return this;

};



UI.DataUrlFile.prototype = Object.create( UI.Element.prototype );
UI.DataUrlFile.prototype.constructor = UI.DataUrlFile;

UI.DataUrlFile.prototype.getValue = function () {

	return this.dataUrl;

};

UI.DataUrlFile.prototype.setFileName = function (fileName) {
	this.fileName=fileName;
	this.name.value=fileName;
};

//Nullable
UI.DataUrlFile.prototype.getFileName = function () {
	return this.fileName;
};


UI.DataUrlFile.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};

UI.TextFile = function ( accepts) {

	UI.Element.call( this );

	var scope = this;

	this.text=null;
	this.textEncoding="UTF-8";
	
	var dom = document.createElement( 'span' );

	var form = document.createElement( 'form' );
    
	var input = document.createElement( 'input' );
	input.type = 'file';
	input.accept=accepts;
	input.addEventListener( 'change', function ( event ) {
		
		var reader = new FileReader();
		
		reader.addEventListener( 'load', function ( event ) {

			scope.Text=event.target.result;
			if ( scope.onChangeCallback ) 
				scope.onChangeCallback(scope.fileName,event.target.result);

		}, false );

		var file=event.target.files[ 0 ];
		scope.fileName=event.target.files[ 0 ].name;
		scope.name.value=scope.fileName;
		reader.readAsText( file );
		
		
		form.reset();
		
	} );
	form.appendChild( input );


	var name = document.createElement( 'input' );
	name.disabled = true;
	name.style.width = '160px';
	name.style.border = '1px solid #ccc';
	dom.appendChild( name );
	this.name=name;
	
	this.dom = dom;
	this.blobUrl = null;
	this.fileName=null;
	this.onChangeCallback = null;
	
	var input3 = document.createElement( 'input' );
	input3.addEventListener( 'click', function ( event ) {
		scope.fileName=null;
		scope.name.value=null;
		
		if ( scope.onChangeCallback ) scope.onChangeCallback(null,null);
	}, false );
	input3.type = 'button';
	input3.value='Reset';
	dom.appendChild( input3 );
	
	
	var input2 = document.createElement( 'input' );
	input2.addEventListener( 'click', function ( event ) {
		input.click();
	}, false );
	input2.type = 'button';
	input2.value='Upload';
	dom.appendChild( input2 );
	
	

	
	return this;

};



UI.TextFile.prototype = Object.create( UI.Element.prototype );
UI.TextFile.prototype.constructor = UI.TextFile;

UI.TextFile.prototype.getValue = function () {

	return this.text;

};

UI.TextFile.prototype.setFileName = function (fileName) {
	this.fileName=fileName;
	this.name.value=fileName;
};

//Nullable
UI.TextFile.prototype.getFileName = function () {
	return this.fileName;
};


UI.TextFile.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};


//move to builder?

UI.ColorRow=function(label,color,onChange){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth( '90px' );
	row.add(text);
	
	var colorBox=new UI.Color();
	row.add(colorBox);
	
	colorBox.setHexValue(color);
	
	colorBox.onChange(function(e){
		hexText.setValue(e.target.value);
		onChange(e);
	});
	
	var hexText=new UI.Text(colorBox.getValue()).setWidth( '90px' );
	row.add(hexText);
	
	return row;
};

UI.CheckboxRow=function(label,value,onChange){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('180px');
	row.add(text);
	
	var checkbox=new UI.Checkbox();
	checkbox.setValue(value);

	checkbox.onChange(function(e){
		onChange(checkbox.getValue());
	});
	row.add(checkbox);
	
	//add ref
	row.text=text;
	row.checkbox=checkbox;
	return row;
}

UI.SwitchRow=function(trueLabel,falseLabel,value,onChange){
	var row=new UI.Row();
	var text=new UI.Text(value?trueLabel:falseLabel).setWidth('180px');
	row.add(text);
	
	var checkbox=new UI.Checkbox();
	checkbox.setValue(value);

	checkbox.onChange(function(e){
		var v=checkbox.getValue();
		if(v){
			text.setValue(trueLabel);
		}else{
			text.setValue(falseLabel);
		}
		onChange(v);
	});
	row.add(checkbox);
	
	//add ref
	row.text=text;
	row.checkbox=checkbox;
	return row;
}

UI.CheckboxText=function(label,value,onChange){
	var span=new UI.Span();
	
	
	var checkbox=new UI.Checkbox();
	checkbox.setValue(value);

	checkbox.onChange(function(e){
		onChange(checkbox.getValue());
	});
	span.add(checkbox);
	
	var text=new UI.Text(label).setWidth('45px');
	span.add(text);
	//add ref
	span.text=text;
	span.checkbox=checkbox;
	return span;
}

UI.ListRow=function(label,values,onChange,current){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	
	row.setList=function(values){
		var options={};
		for(var i=0;i<values.length;i++){
			var value=String(values[i]);
			options[value]=value;
		}
		select.setOptions(options);
	}
	
	
	
	var select=new UI.Select();
	row.setList(values);
	if(current){
		select.setValue(current);	
	}else{
		if(values.length>0){
			select.setValue(values[0]);
		}
	}
	select.onChange(function(e){
		onChange(select.getValue());
	});
	row.add(select);
	
	row.text=text;
	row.select=select;
	
	return row;
}

UI.SelectRow=function(label,options,onChange,current){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	
	
	
	var select=new UI.Select();
	select.setOptions(options);
	if(current){
		select.setValue(current);	
	}else{
		if(Object.keys(options).length>0){
			select.setValue(values[0]);
		}
	}
	select.onChange(function(e){
		onChange(select.getValue());
	});
	row.add(select);
	row.select=select;
	return row;
}
UI.Select2Row=function(label,options,onChange,current){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	
	
	
	var select=new UI.Select2();
	select.setOptions(options);
	if(current){
		select.setValue(current);	
	}else{
		if(Object.keys(options).length>0){
			select.setValue(values[0]);
		}
	}
	select.onChange(function(e){
		onChange(select.getValue());
	});
	row.add(select);
	row.select=select;
	return row;
}



UI.List=function(values,onChange,current){
	var options={};
	for(var i=0;i<values.length;i++){
		options[values[i]]=values[i];
	}
	
	var select=new UI.Select();
	select.setOptions(options);
	if(current){
		select.setValue(current);	
	}else{
		select.setValue(values[0]);
	}
	select.onChange(function(e){
		onChange(select.getValue());
	});
	
	return select;
}

UI.NumberRow=function(label,min,max,step,value,onChange){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	
	var number=new UI.Number().setWidth('60px');
	number.min=min;
	number.max=max;
	number.step=step;
	number.setValue(value);
	row.number=number;
	
	function update(){
		onChange(number.getValue());
	}
	
	number.onChange(function(){
		update();
	});
	row.add(number);
	
	return row;
}

UI.IntegerRow=function(label,min,max,step,value,onChange){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	
	var number=new UI.Integer().setWidth('60px');
	number.min=min;
	number.max=max;
	number.step=step;
	number.setValue(value);
	row.number=number;
	
	function update(){
		onChange(number.getValue());
	}
	
	number.onChange(function(){
		update();
	});
	row.add(number);
	
	return row;
}

UI.AppName=function(text){
	
	var div=new UI.Div();
	div.setClass("appname");

	var title=new UI.Span();
	title.dom.textContent=text;
	div.add(title);
	return div;
}

UI.NumberButtons=function(label,min,max,step,value,onChange,buttonValues){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	row.text=text;
	
	var number=new UI.Number().setWidth('60px');
	number.min=min;
	number.max=max;
	number.step=step;
	number.setValue(value);
	row.number=number;
	
	function update(){
		onChange(number.getValue());
	}
	
	number.onChange(function(){
		update();
	});
	row.add(number);
	
	if(buttonValues){
		for(var i=0;i<buttonValues.length;i++){
			var v=buttonValues[i];
			row.add(new UI.Button(String(v)).onClick(function(e){number.setValue(Number(e.target.innerText));update()}));
		}
	}
	
	row.getValue=function(){
		return number.getValue();
	}
	row.setValue=function(v){
		return number.setValue(v);
	}
	return row;
}

UI.NumberPlusMinus=function(label,min,max,step,value,onChange,buttonValues,resetValue){
	resetValue=resetValue!==undefined?resetValue:0;
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('80px');
	row.add(text);
	row.text=text;
	
	if(buttonValues){
		for(var i=buttonValues.length-1;i>=0;i--){
			var v=-buttonValues[i];
			row.add(new UI.Button(String(v)).onClick(function(e){number.setValue(number.getValue()+Number(e.target.innerText));update()}));
		}
	}
	
	var number=new UI.Number().setWidth('45px');
	number.min=min;
	number.max=max;
	number.step=step;
	number.setValue(value);
	row.number=number;
	
	function update(){
		onChange(number.getValue());
	}
	
	number.onChange(function(){
		update();
	});
	row.add(number);
	
	if(buttonValues){
		for(var i=0;i<buttonValues.length;i++){
			var v=buttonValues[i];
			row.add(new UI.Button(String(v)).onClick(function(e){number.setValue(number.getValue()+Number(e.target.innerText));update()}));
		}
	}
	
	row.add(new UI.Button("reset").setFontSize("6px").onClick(function(e){number.setValue(resetValue);update()}));
	
	row.getValue=function(){
		return number.getValue();
	}
	
	row.setValue=function(v){
		return number.setValue(v);
	}
	return row;
}

UI.IntegerButtons=function(label,min,max,step,value,onChange,buttonValues){
	var row=new UI.Row();
	var text=new UI.Text(label).setWidth('90px');
	row.add(text);
	row.text=text;
	
	var number=new UI.Integer().setWidth('60px');
	number.min=min;
	number.max=max;
	number.step=step;
	number.setValue(value);
	row.number=number;
	
	function update(){
		onChange(number.getValue());
	}
	
	number.onChange(function(){
		update();
	});
	row.add(number);
	
	if(buttonValues){
		for(var i=0;i<buttonValues.length;i++){
			var v=buttonValues[i];
			row.add(new UI.Button(String(v)).onClick(function(e){number.setValue(Number(e.target.innerText));update()}));
		}
	}
	row.getValue=function(){
		return number.getValue();
	}
	
	row.setValue=function(v){
		return number.setValue(v);
	}
	return row;
}

UI.TitlePanel=function(label){
	var panel=new UI.Panel();
	panel.add(new UI.TitleRow(label));
	return panel;
}
UI.TitleRow=function(label){
	return new UI.Div().setClass("title").add(new UI.Text(label));
}
UI.TextRow=function(label){
	var text=new UI.Text(label);
	text.setWidth("90px");
	var row=new UI.Row().add(text);
	row.text=text;
	return row;
}

UI.Subtitle=function(label){
	console.log("Use SubtitleRow");
	return UI.SubtitleRow(label);
}
UI.SubtitleRow=function(label){
	return new UI.Row().add(new UI.Text(label).setClass("subtitle"));
}

UI.ButtonRow=function(label,onclick){
	var bt=new UI.Button(label).onClick(onclick);
	var row= new UI.Row().add(bt);
	row.button=bt;
	return row;
};

//TODO
UI.Anchor = function (href,text) {

	UI.Element.call( this );

	this.dom = document.createElement( 'a' );
	if(href!==undefined){
		this.dom.href=href;
	}
	if(text!==undefined){
		this.dom.textContent=text;
	}else{
		if(href!==undefined){
			this.textContent.src=src;
		}
	}
	
	return this;

};
UI.Anchor.prototype = Object.create( UI.Element.prototype );
UI.Anchor.prototype.constructor = UI.Anchor;