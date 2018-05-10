(async()=>{
	const 	sets=[
			await(await fetch`../json/icons.json`).json(),
			await(await fetch`../json/stock.json`).json(),
			await(await fetch`../json/extended.json`).json(),
			await(await fetch`../json/other.json`).json()
		],
		inputs={
			canvas:document.getElementById`canvas`,
			data:document.getElementById`data`,
			overlay:document.getElementById`overlay`,
			colour:document.getElementById`colour`,
			name:document.getElementById`name`,
			action:document.getElementById`action`,
			type:document.getElementById`type`
		},
		text={
			name:document.querySelector`text`,
			type:document.querySelector`text+text`,
			disclaimer:document.querySelector`text:last-of-type`,
		},
		svg=document.querySelector`figure>svg`,
		shadow=document.querySelector`feDropShadow`,
		grid=document.querySelector`#grid>path`,
		path=document.getElementById`path`,
		ghost=document.getElementById`ghost`,
		caption=document.querySelector`g>rect:last-of-type`,
		icon=document.querySelector`figure>svg>path:last-of-type`,
		canvas=document.querySelector`canvas`,
		context=canvas.getContext`2d`,
		width=canvas.width,
		height=canvas.height,
		button=document.querySelector`button`,
		a=document.createElement`a`,
		xml=new XMLSerializer,
		image=new Image,
		transforms=[`translate(11,10)`,`scale(.046875) scale(1,-1) translate(234.66667,-725.33333)`,`scale(.046875) scale(1,-1) translate(234.66667,-725.33333)`,`scale(.05) scale(1,-1) translate(220,-680)`],
		draw=()=>image.src=URL.createObjectURL(new Blob([xml.serializeToString(svg)],{type:`image/svg+xml;charset=utf-8`})),
		/*draw=async()=>context.transferFromImageBitmap(await createImageBitmap(new Blob([xml.serializeToString(svg)],{type:`image/svg+xml;charset=utf-8`})).catch(console.log)),*/
		generate=event=>{
			clearTimeout(timer);
			timer=setTimeout(()=>{
				target=event.target;
				value=target.value;
				delay=0;
				ind=-1;
				switch(target){
					case inputs.canvas:
						shadow.setAttribute(`flood-color`,`#`+value);
						grid.setAttribute(`stroke`,`#`+value);
						path.setAttribute(`fill`,`#`+value);
						caption.setAttribute(`fill`,`#`+value);
						caption.setAttribute(`stroke`,`#`+value);
						icon.setAttribute(`fill`,`#`+value);
						for(key in text)
							if(text.hasOwnProperty(key))
								text[key].setAttribute(`fill`,`#`+value);
						delay=200;
						break;
					case inputs.data:
						path.setAttribute(`d`,value);
						if(value){
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
								transform=size>24?size>48?size>480?`scale(.046875) scale(1,-1) translate(234.66667,-725.33333)`:`scale(.05) scale(1,-1) translate(220,-680)`:`scale(.5) translate(22,20)`:`translate(11,10)`;
							path.setAttribute(`transform`,transform);
							inputs.name.dispatchEvent(new Event(`input`));
						}
						break;
					case inputs.overlay:
						ghost.setAttribute(`fill-opacity`,value?`.4375`:`0`);
						delay=value?0:200;
						if(value){
							size=Math.max(...value.match(/(\d|\.)+/g).map(x=>parseFloat(x)));
							ghost.setAttribute(`transform`,size>24?size>48?`scale(.046875) scale(1,-1) translate(234.66667,-725.33333)`:`scale(.5) translate(22,20)`:`translate(11,10)`);
						}
						break;
					case inputs.colour:
						ghost.setAttribute(`fill`,`#`+value);
						delay=200;
						break;
					case inputs.name:
						text.name.textContent=value.trim().toLowerCase().replace(/ |_/g,`-`);
						break;
					case inputs.action:
						value&&icon.setAttribute(`d`,value);
						icon.setAttribute(`fill-opacity`,value?1:0);
						delay=200;
						break;
					case inputs.type:
						if(value){
							text.type.textContent=value;
							text.disclaimer.textContent=target.options[target.selectedIndex].dataset.disclaimer;
						}
						delay=value?0:200;
						text.type.setAttribute(`fill-opacity`,value?1:0);
						text.disclaimer.setAttribute(`fill-opacity`,value?1:0);
				}
				timer=setTimeout(()=>{
					target===inputs.overlay&&ghost.setAttribute(`d`,value);
					draw();
				},delay);
			},50);
		};
	let delay,ind,key,set,size,target,timer,transform,value;
	image.addEventListener(`load`,()=>{
		context.clearRect(0,0,width,height);
		context.drawImage(image,0,0);
		URL.revokeObjectURL(image.src);
	},0);
	button.addEventListener(`click`,()=>{
		canvas.toBlob(blob=>{
			a.href=URL.createObjectURL(blob);
			a.download=text.name.firstChild.nodeValue+`.png`;
			document.body.append(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(a.href);
		});
	},0);
	document.addEventListener(`input`,generate,1);
	draw();
})();