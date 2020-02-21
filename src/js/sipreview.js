(async()=>{
	const 	inputs={
			data:document.getElementById(`data`),
			overlay:document.getElementById(`overlay`),
			colour:document.getElementById(`colour`),
			name:document.getElementById(`name`),
			action:document.getElementById(`action`)
		},
		text={
			type:document.getElementById(`type`),
			file:document.getElementById(`filename`),
			brand:document.getElementById(`brand`),
			color:document.getElementById(`color`)
		},
		svg=document.querySelector(`figure>svg`),
		background=document.getElementById(`background`),
		path=document.querySelector(`#path>path`),
		compare=document.getElementById(`compare`),
		icon=document.querySelector(`figure>svg>path:last-of-type`),
		canvas=document.querySelector(`canvas`),
		context=canvas.getContext(`2d`),
		width=canvas.width,
		height=canvas.height,
		button=document.querySelector(`button`),
		a=document.createElement(`a`),
		xml=new XMLSerializer,
		image=new Image,
		draw=()=>image.src=URL.createObjectURL(new Blob([xml.serializeToString(svg)],{type:`image/svg+xml;charset=utf-8`})),
		setfill=hex=>parseInt(hex.substr(0,2),16)*.299+parseInt(hex.substr(2,2),16)*.587+parseInt(hex.substr(4,2),16)*.114<128?`#fff`:`#000`,
		generate=event=>{
			clearTimeout(timer);
			timer=setTimeout(()=>{
				target=event.target;
				value=target.value;
				delay=0;
				ind=-1;
				switch(target){
					case inputs.colour:
						if(target.validity.valid){
							if(inputs.overlay.value)
								value=`111111`;
							value=value.replace(/^#/,``);
							background.setAttribute(`fill`,`#`+value);
							svg.setAttribute(`fill`,setfill(value));
							text.color.textContent=value.toUpperCase();
						}
						delay=200;
						break;
					case inputs.data:
						path.setAttribute(`d`,value);
						break;
					case inputs.overlay:
						compare.setAttribute(`fill-opacity`,value?`.5`:`0`);
						text.type.textContent=value?`Comparison`:`Preview`;
						inputs.colour.dispatchEvent(new Event(`input`));
						delay=value?0:200;
						break;
					case inputs.name:
						value=value.trim();
						text.file.textContent=value.toLowerCase().replace(/\+/g,`plus`).replace(/^\./,`dot-`).replace(/\.$/,`-dot`).replace(/\./g,`-dot-`).replace(/^&/,`and-`).replace(/&$/,`-and`).replace(/&/g,`-and-`).replace(/[ !:’']/g, "").replace(/à|á|â|ã|ä/g,`a`).replace(/ç|č|ć/g,`c`).replace(/è|é|ê|ë/g,`e`).replace(/ì|í|î|ï/g,`i`).replace(/ñ|ň|ń/g,`n`).replace(/ò|ó|ô|õ|ö/g,`o`).replace(/š|ś/g,`s`).replace(/ù|ú|û|ü/g,`u`).replace(/ý|ÿ/g,`y`).replace(/ž|ź/g,`z`);
						text.brand.textContent=value;
						break;
					case inputs.action:
						value&&icon.setAttribute(`d`,value);
						icon.setAttribute(`fill-opacity`,value?1:0);
						delay=200;
						break;
				}
				timer=setTimeout(()=>{
					target===inputs.overlay&&compare.setAttribute(`d`,value);
					draw();
				},delay);
			},50);
		};
	let color,delay,ind,key,set,size,target,timer,transform,value;
	image.addEventListener(`load`,()=>{
		context.clearRect(0,0,width,height);
		context.drawImage(image,0,0);
		URL.revokeObjectURL(image.src);
	},0);
	button.addEventListener(`click`,()=>{
		canvas.toBlob(blob=>{
			a.href=URL.createObjectURL(blob);
			a.download=text.file.firstChild.nodeValue+`.png`;
			document.body.append(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(a.href);
		});
	},0);
	document.addEventListener(`input`,generate,1);
	draw();
})();