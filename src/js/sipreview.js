(async()=>{
	const 	data=await(await fetch(`https://houseofdesign.ie/data/icons/simpleicons.json`)).json(),
		meta=(await(await fetch(`https://raw.githubusercontent.com/simple-icons/simple-icons/develop/_data/simple-icons.json`)).json()).icons,
		buttons={
			download:document.getElementById(`download`),
			save:document.getElementById(`save`),
			upload:document.getElementById(`upload`)
		},
		holder=document.getElementById(`holder`),
		inputs={
			action:document.getElementById(`action`),
			colour:document.getElementById(`colour`),
			data:document.getElementById(`data`),
			name:document.getElementById(`name`),
			overlay:document.getElementById(`overlay`),
			upload:document.createElement(`input`)
		},
		list=document.getElementById(`list`),
		text={
			type:document.getElementById(`type`),
			file:document.getElementById(`filename`),
			brand:document.getElementById(`brand`),
			color:document.getElementById(`color`)
		},
		a=document.createElement(`a`),
		svg=document.querySelector(`figure>svg`),
		background=document.getElementById(`background`),
		path=document.querySelector(`#path>path`),
		compare=document.getElementById(`compare`),
		action=document.querySelector(`figure>svg>path:last-of-type`),
		canvas=document.querySelector(`canvas`),
		context=canvas.getContext(`2d`),
		width=canvas.width,
		height=canvas.height,
		parser=new DOMParser,
		reader=new FileReader,
		xml=new XMLSerializer,
		image=new Image,
		autocomplete=value=>{
			if(autocomplete.timer)
				clearTimeout(autocomplete.timer);
			autocomplete.timer=setTimeout(search,50,value.trim().toLowerCase());
		},
		download=(data,type)=>{
			a.href=data;
			a.download=(text.file.textContent||`icon`)+`.`+type;
			document.body.append(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(a.href);
		},
		draw=()=>image.src=URL.createObjectURL(new Blob([xml.serializeToString(svg)],{
			type:`image/svg+xml;charset=utf-8`
		})),
		finddata=value=>{
			if(icon=meta.find(o=>o.data===value)){
				text.file.textContent=sanitise(text.brand.textContent=inputs.name.value=icon.title);
				inputs.colour.value=icon.hex;
				inputs.colour.dispatchEvent(new Event(`input`));
			}
		},
		keydown=event=>{
			document.body.classList.toggle(`ctrl`,event.ctrlKey);
			if(event.ctrlKey)
				switch(event.key){
					case`d`:
						event.preventDefault();
						buttons.download.dispatchEvent(new Event(`click`));
						keyup();
						break;
					case`s`:
						event.preventDefault();
						buttons.save.dispatchEvent(new Event(`click`));
						keyup();
						break;
					case`u`:
						event.preventDefault();
						buttons.upload.dispatchEvent(new Event(`click`));
						keyup();
						break;
				}
		},
		keyup=event=>document.body.classList.toggle(`ctrl`,event&&event.ctrlKey),
		load=event=>{
			let 	parsed=parser.parseFromString(event.target.result,`image/svg+xml`),
				paths=parsed.querySelectorAll(`path`),
				d=``,x;
			title=parsed.querySelector(`title`);
			if(paths.length){
				for(x of paths)
					d+=x.getAttribute(`d`);
				if(d){
					path.setAttribute(`d`,inputs.data.value=d);
					finddata(d);
					if(title){
						title=title.firstChild.nodeValue.replace(/ icon$/,``);
						if(title)
							text.file.textContent=sanitise(inputs.name.value=text.brand.textContent=title);
					}
				}
				else alert(`No path data detcted`);
			}else alert(`No path tag detcted`);
		},
		populate=event=>{
			let target=event.target;
			if(target.nodeName.toLowerCase()===`li`){
				text.file.textContent=sanitise(text.brand.textContent=inputs.name.value=target.lastChild.nodeValue);
				inputs.data.value=target.dataset.data;
				inputs.colour.value=target.dataset.colour;
				inputs.colour.dispatchEvent(new Event(`input`));
				setTimeout(()=>inputs.data.dispatchEvent(new Event(`input`)));
				inputs.name.focus();
				list.classList.add(`oz`,`pen`);
				list.scrollTo(0,0);
			}
		},
		read=()=>{
			let file=inputs.upload.files[0];
			if(file)
				if(file.type===`image/svg+xml`)
					reader.readAsText(inputs.upload.files[0]);
				else alert(`Invalid file type`);
			inputs.upload.remove();
		},
		sanitise=value=>value.toLowerCase().replace(/\+/g,`plus`).replace(/^\./,`dot-`).replace(/\.$/,`-dot`).replace(/\./g,`-dot-`).replace(/^&/,`and-`).replace(/&$/,`-and`).replace(/&/g,`-and-`).replace(/[ !:’']/g, "").replace(/à|á|â|ã|ä/g,`a`).replace(/ç|č|ć/g,`c`).replace(/è|é|ê|ë/g,`e`).replace(/ì|í|î|ï/g,`i`).replace(/ñ|ň|ń/g,`n`).replace(/ò|ó|ô|õ|ö/g,`o`).replace(/š|ś/g,`s`).replace(/ù|ú|û|ü/g,`u`).replace(/ý|ÿ/g,`y`).replace(/ž|ź/g,`z`),
		save=event=>{
			switch(event.target){
				case buttons.download:
					download(`data:image/svg+xml;utf8,<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${(text.brand.textContent||`Unknown`)} icon</title><path d="${path.getAttribute(`d`)}"/></svg>`,`svg`);
					break;
				case buttons.save:
					canvas.toBlob(blob=>download(URL.createObjectURL(blob),`png`));
					break;
			}
		},
		search=value=>{
			let 	count=0,
				show;
			if(holder.innerText=value){
				for(obj of meta){
					show=obj.title.toLowerCase().startsWith(value);
					obj.li.classList.toggle(`dn`,!show);
					count+=show;
					if(count===50)
						break;
				}
				list.style.left=`${Math.min(91+holder.scrollWidth,91+inputs.name.offsetWidth-list.offsetWidth)}px`;
			}
			list.classList.toggle(`oz`,!count);
			list.classList.toggle(`pen`,!count);
			if(!count)
				list.scrollTo(0,0);
		},
		setfill=hex=>parseInt(hex.substr(0,2),16)*.299+parseInt(hex.substr(2,2),16)*.587+parseInt(hex.substr(4,2),16)*.114<160?`#fff`:`#000`,
		upload=()=>{
			document.body.append(inputs.upload);
			inputs.upload.click();
		},
		generate=event=>{
			if(generate.timer)
				clearTimeout(generate.timer);
			generate.timer=setTimeout(()=>{
				target=event.target;
				value=target.value.trim();
				delay=0;
				switch(target){
					case inputs.action:
						value&&action.setAttribute(`d`,value);
						action.setAttribute(`fill-opacity`,value?1:0);
						delay=200;
						break;
					case inputs.colour:
						if(!inputs.overlay.value){
							if(!target.validity.valid)
								value=`111111`;
							value=value.replace(/^#/,``).replace(/^(.)(.)(.)$/,`$1$1$2$2$3$3`);
							text.color.parentNode.setAttribute(`fill-opacity`,target.validity.valid?`1`:`0`);
							if(target.validity.valid)
								text.color.textContent=value.toUpperCase();
							background.setAttribute(`fill`,`#`+value);
							svg.setAttribute(`fill`,setfill(value));
							delay=200;
						}
						break;
					case inputs.data:
						path.setAttribute(`d`,value);
						if(event.isTrusted)
							finddata(value);
						break;
					case inputs.name:
						text.file.textContent=sanitise(text.brand.textContent=value);
						autocomplete(value);
						break;
					case inputs.overlay:
						compare.setAttribute(`fill-opacity`,value?`.5`:`0`);
						text.color.parentNode.setAttribute(`fill-opacity`,value||!inputs.colour.validity.valid?`0`:`1`);
						text.type.textContent=value?`Comparison`:`Preview`;
						if(value){
							background.setAttribute(`fill`,`#111111`);
							svg.setAttribute(`fill`,setfill(`111111`));
						}else inputs.colour.dispatchEvent(new Event(`input`));
						delay=value?0:200;
						break;
				}
				generate.timer=setTimeout(()=>{
					target===inputs.overlay&&compare.setAttribute(`d`,value);
					draw();
				},event.isTrusted*delay);
			},event.isTrusted*50);
		};
	let 	bullet={},
		color,delay,icon,obj,target,title,value;
	document.getElementById(`count`).textContent=Object.keys(data).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g,`,`);
	image.addEventListener(`load`,()=>{
		context.clearRect(0,0,width,height);
		context.drawImage(image,0,0);
		URL.revokeObjectURL(image.src);
	});
	draw();
	buttons.download.addEventListener(`click`,save);
	buttons.save.addEventListener(`click`,save);
	buttons.upload.addEventListener(`click`,upload);
	inputs.upload.accept=`.svg,image/svg+xml`;
	inputs.upload.classList.add(`ln`,`pa`);
	inputs.upload.type=`file`;
	inputs.upload.addEventListener(`change`,read,false);
	reader.addEventListener(`load`,load,false);
	document.addEventListener(`input`,generate,true);
	document.body.addEventListener(`keydown`,keydown);
	document.body.addEventListener(`keyup`,keyup);
	for(obj of meta){
		title=obj.title;
		if(bullet.li){
			bullet.li=bullet.li.cloneNode(false);
			bullet.svg=bullet.svg.cloneNode(false);
			bullet.path=bullet.path.cloneNode(false);
		}else{
			bullet.li=document.createElement(`li`);
			bullet.li.classList.add(`cp`,`dn`,`fwm`,`oh`,`toe`,`wsnw`);
			bullet.svg=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);
			bullet.svg.classList.add(`pen`,`vat`);
			bullet.svg.setAttribute(`viewBox`,`0 0 24 24`);
			bullet.path=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);
		}
		bullet.li.append(bullet.svg,document.createTextNode(title));
		bullet.data=data[title=sanitise(title)];
		if(!bullet.data)
			bullet.data=parser.parseFromString(await(await fetch(`https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${title}.svg`)).text(),`text/xml`).querySelector(`path`).getAttribute(`d`);
		bullet.path.setAttribute(`d`,obj.data=bullet.li.dataset.data=bullet.data);
		bullet.li.dataset.colour=obj.hex;
		bullet.svg.append(bullet.path);
		list.append(obj.li=bullet.li);
	}
	list.addEventListener(`click`,populate,false);
})();