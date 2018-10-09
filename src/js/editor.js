(async()=>{
	const 	sets=[
			await(await fetch`../json/icons.json`).json(),
			await(await fetch`../json/stock.json`).json(),
			await(await fetch`../json/extended.json`).json(),
			await(await fetch`../json/other.json`).json()
		],
		figure=document.querySelector(`figure`),
		inputs={
			data:document.getElementById(`data`),
			size:document.getElementById(`size`),
			fill:document.getElementById(`fill`),
			opacity:document.getElementById(`opacity`),
			helper:document.getElementById(`helper`),
			colour:document.getElementById(`colour`),
			fade:document.getElementById(`fade`),
			padding:document.getElementById(`padding`),
			background:document.getElementById(`background`),
			alpha:document.getElementById(`alpha`),
			radius:document.getElementById(`radius`),
			name:document.getElementById(`name`)
		},
		values={
			size:24,
			opacity:1,
			fade:1,
			padding:0,
			background:"fff",
			alpha:0,
			radius:0,
			name:"vector-square"
		},
		button=document.querySelector(`button`),
		canvas=document.querySelector(`canvas`),
		context=canvas.getContext(`2d`),
		a=document.createElement(`a`),
		background=document.createElement(`span`),
		horizontal=background.cloneNode(0),
		path=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),
		helper=path.cloneNode(1),
		vertical=background.cloneNode(0),
		svg=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),
		event=new Event(`input`),
		image=new Image,
		xml=new XMLSerializer,
		storage=localStorage,
		transforms=[``,`scale(.046875) scale(1,-1) translate(0,-512)`,`scale(.046875) scale(1,-1) translate(0,-512)`,`scale(.05) scale(1,-1) translate(0,-480)`],
		convert=hex=>[((hex=parseInt(hex.length===3?hex.replace(/./g,c=>c+c):hex,16))>>16)&255,(hex>>8)&255,hex&255],
		test=([r,g,b])=>(r*299+g*587+b*114)/1000,
		draw=()=>{
			context.clearRect(0,0,canvas.width,canvas.height);
			canvas.height=canvas.width=dimensions;
			if(values.alpha){
				context.fillStyle=`rgba(${convert(values.background)},${values.alpha/100})`;
				context.beginPath();
				context.moveTo(values.radius,0);
				context.arcTo(dimensions,0,dimensions,dimensions,values.radius);
				context.arcTo(dimensions,dimensions,0,dimensions,values.radius);
				context.arcTo(0,dimensions,0,0,values.radius);
				context.arcTo(0,0,dimensions,0,values.radius);
				context.closePath();
				context.fill();
			}
			image.src=URL.createObjectURL(new Blob([xml.serializeToString(svg)],{type:`image/svg+xml;charset=utf-8`}));
		};
	let 	dimensions=24,
		luminance,size,timer,transform;
	data.style.height=data.scrollHeight+1+`px`;
	background.classList.add(`oz`,`pa`,`pen`);
	canvas.classList.add(`oz`,`pr`);
	horizontal.classList.add(`pa`,`pen`);
	vertical.classList.add(`pa`,`pen`);
	svg.classList.add(`pa`,`pen`);
	svg.setAttribute(`height`,24);
	svg.setAttribute(`viewBox`,`0 0 24 24`);
	svg.setAttribute(`width`,24);
	path.setAttribute(`d`,values.data=inputs.data.value);
	path.setAttribute(`fill`,`#${values.fill=inputs.fill.value}`);
	helper.setAttribute(`d`,values.helper=``);
	helper.setAttribute(`fill`,`#${values.colour=inputs.colour.value}`);
	helper.setAttribute(`fill-opacity`,0);
	svg.append(path,helper);
	figure.prepend(background,horizontal,vertical,svg);
	image.addEventListener(`load`,()=>{
		context.drawImage(image,values.padding,values.padding);
		URL.revokeObjectURL(image.src);
	},0);
	document.body.addEventListener(`input`,event=>{
		let 	target=event.target,
			value=target.value,
			ind=-1,
			set;
		if(target.validity.valid){
			switch(target){
				case inputs.data:
					target.style.height=`24px`;
					target.style.height=target.scrollHeight+1+`px`;
					path.setAttribute(`d`,values.data=value);
					size=Math.max(...value.match(/(\d|\.)+/g).map(x=>parseFloat(x)));
					transform=inputs.name.value=``;
					while(!inputs.name.value&&sets[++ind])
						for(key in (set=sets[ind]))
							if(set.hasOwnProperty(key))
								if(set[key].data===value){
									inputs.name.value=key;
									transform=transforms[ind];
									break;
								}
					if(!transform)
						transform=size>48?size>480?`scale(.046875) scale(1,-1) translate(0,-512)`:`scale(.05) scale(1,-1) translate(0,-480)`:`scale(.5)`;
					size>24?path.setAttribute(`transform`,transform):path.removeAttribute(`transform`);
					inputs.name.dispatchEvent(new Event(`input`));
					break;
				case inputs.size:
					svg.setAttribute(`height`,values.size=parseInt(value));
					svg.setAttribute(`width`,value);
					if(values.padding>(inputs.padding.max=(320-value)/2))
						values.padding=inputs.padding.value=parseInt(inputs.padding.max);
					background.style.height=background.style.width=horizontal.style.height=vertical.style.width=`${dimensions=values.size+2*values.padding}px`;
					if(values.radius>(inputs.radius.max=Math.floor(dimensions/2)))
						background.style.borderRadius=`${values.radius=inputs.radius.value=parseInt(inputs.radius.max)}px`;
					break;
				case inputs.fill:
					path.setAttribute(`fill`,`#${values.fill=value.toLowerCase()}`);
					figure.classList.toggle(`light`,(luminance=test(convert(value)))>=128&&values.alpha<31);
					break;
				case inputs.opacity:
					path.setAttribute(`fill-opacity`,(values.opacity=parseInt(value))/100);
					break;
				case inputs.helper:
					values.helper=value;
					value&&helper.setAttribute(`d`,value);
					helper.setAttribute(`fill-opacity`,value?values.fade:0);
					break;
				case inputs.colour:
					helper.setAttribute(`fill`,`#${values.colour=value}`);
					break;
				case inputs.fade:
					helper.setAttribute(`fill-opacity`,(values.fade=parseInt(value))/100);
					break;
				case inputs.padding:
					background.style.height=background.style.width=horizontal.style.height=vertical.style.width=`${dimensions=values.size+2*(values.padding=parseInt(value))}px`;
					if(values.radius>(inputs.radius.max=Math.floor(dimensions/2)))
						background.style.borderRadius=`${values.radius=inputs.radius.value=inputs.radius.max}px`;
					break;
				case inputs.background:
					background.style.backgroundColor=`#${values.background=value}`;
					break;
				case inputs.alpha:
					background.style.opacity=(values.alpha=parseInt(value))/100;
					figure.classList.toggle(`light`,luminance>=128&&value<31);
					break;
				case inputs.radius:
					background.style.borderRadius=`${values.radius=parseInt(value)}px`;
					break;
				case inputs.name:
					values.name=value;
					break;
			}
			if(target!==inputs.name){
				clearTimeout(timer);
				setTimeout(()=>draw(),200);
			}
			storage.setItem(`aie-`+target.id,value);
		}
	},1);
	for(let key in inputs)
		if(inputs.hasOwnProperty(key)&&storage[`aie-`+key]){
			inputs[key].value=storage[`aie-`+key];
			inputs[key].dispatchEvent(event);
		}
	button.addEventListener(`click`,()=>{
		canvas.toBlob(blob=>{
			a.href=URL.createObjectURL(blob);
			a.download=`${values.name||`mdi-icon`}.png`;
			document.body.append(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(a.href);
		});
	},0);
})();