(async ()=>{
	const 	icons=await(await fetch`../json/icons.json`).json(),
		extended=await(await fetch`../json/extended.json`).json(),
		other=await(await fetch`../json/other.json`).json(),
		inputs={
			canvas:document.getElementById`canvas`,
			data:document.getElementById`data`,
			overlay:document.getElementById`overlay`,
			colour:document.getElementById`colour`,
			name:document.getElementById`name`,
			action:document.getElementById`action`,
			type:document.getElementById`type`
		},
		span=document.querySelector`figcaption span`,
		text={
			name:document.querySelector`figcaption>p`,
			type:document.querySelector`figcaption>p+p`,
			disclaimer:document.querySelector`figcaption>p+p+p`,
		},
		svg=document.querySelector`figure>svg`,
		path=document.getElementById`path`,
		ghost=document.getElementById`ghost`,
		icon=svg.lastElementChild,
		canvas=document.querySelector`canvas`,
		context=canvas.getContext`2d`,
		width=canvas.width,
		height=canvas.height,
		button=document.querySelector`button`,
		a=document.createElement`a`,
		background=new Image,
		xml=new XMLSerializer,
		image=new Image,
		generate=event=>{
			clearTimeout(timer);
			timer=setTimeout(()=>{
				target=event.target;
				value=target.value;
				delay=0;
				switch(target){
					case inputs.canvas:
						path.setAttribute(`fill`,context.fillStyle=`#`+value);
						icon.setAttribute(`fill`,span.style.background=`#`+value);
						span.classList.toggle(`oz`,value===`616161`);
						for(key in text)
							if(text.hasOwnProperty(key))
								text[key].style.color=`#`+value;
						delay=200;
						break;
					case inputs.data:
						path.setAttribute(`d`,value);
						if(value){
							size=Math.max(...value.match(/(\d|\.)+/g).map(x=>parseFloat(x)));
							transform=inputs.name.value=``;
							for(key in icons)
								if(icons.hasOwnProperty(key))
									if(icons[key].data.regular===value||icons[key].data.light===value){
										inputs.name.value=key;
										transform=`translate(11,10)`;
										break;
									}
							if(!inputs.name.value)
								for(key in extended)
									if(extended.hasOwnProperty(key))
										if(extended[key].data===value){
											inputs.name.value=key;
											transform=`scale(.046875) scale(1,-1) translate(234.66667,-725.33333)`;
											break;
										}
							if(!inputs.name.value)
								for(key in other)
									if(other.hasOwnProperty(key))
										if(other[key].data===value){
											inputs.name.value=key;
											transform=`scale(.05) scale(1,-1) translate(220,-680)`;
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
						text.name.firstChild.nodeValue=value.trim().toLowerCase().replace(/ |_/g,`-`);
						break;
					case inputs.action:
						value&&icon.setAttribute(`d`,value);
						icon.setAttribute(`fill-opacity`,value?1:0);
						delay=200;
						break;
					case inputs.type:
						if(value){
							text.type.firstChild.nodeValue=value;
							text.disclaimer.firstChild.nodeValue=target.options[target.selectedIndex].dataset.disclaimer;
						}
						delay=value?0:200;
						text.type.classList.toggle(`oz`,!target.value);
						text.disclaimer.classList.toggle(`oz`,!target.value);
				}
				timer=setTimeout(()=>{
					target===inputs.overlay&&ghost.setAttribute(`d`,value);
					image.src=URL.createObjectURL(new Blob([xml.serializeToString(svg)],{type:`image/svg+xml;charset=utf-8`}))
				},delay);
			},50);
		};
	let delay,key,size,target,timer,transform,value;
	context.font=`14px Roboto`;
	context.fillStyle=`#`+inputs.canvas.value;
	background.src=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUUAAAEmBAMAAAAHOp+aAAAAKlBMVEX////u7u739/f6+vrx8fHi4uLd3d39/f329vbPz8/f39/09PTp6enY2NjMrDZ4AAACXUlEQVR42u3asUsCURzAcTPBwUXBwaEhHFJoCRze4FJgS3OOLQ3RKN3wXHXI4P6CxqApGkQXB5dWb+7/iQOFd3coN0jv9+59v0VwtHx4b/jpu1ciIqIDabPMP4OelVRCUg26b7umapQkVoNwYKVVQqLPjYeyThn7pbj6//9ZmsZgbjzUVMo4sWVsmcaXa+Oh0kkaT9e2jNGVwRjXjYeTWcp4a8t4jxEjRq+NDUsVbR0xYsSIESNzpvB7nfrOJdIYrIdfu4aREmnUlzeNXc2FFmmMz1LC7c9UjUQaU2dSMo2JMB7JKHLOOLGOel9yjOY5rtlUjcQYt+e42cpajDGY7zHWlBjj9jNFtkpHjHFc32M8mWH0y9iwVNHWESNGjBgxMmd832uMGDFiZM64u44YMWLEiJE54/teY8SIEaO3c8aFd5rmPSmzYSTn3bB5T8qsuZDzjj2+q7AKs7+S7iq4cOfDibszGDFy38y3vcaIESNG5oy764gRI0aMGJkzvu81RowYMTJn3F1HjBgxYsTInPF9rzFixIiROePuOmLEiBEjRuaM73uNESNGjMwZd9cRI0aMGDEyZ3zfa4wYMWJkzri7jhgxYsSIkTnj+15jxIgRI3PG3XXEiBEjRozMGd/3GiNGjBiZM+6uI0aMGDFiZM74vtcYMWIsnHFtyxjlNlYnD+9W+m2Nchv7Z0Mr/SzzG4NwYKWVio350kHPSkqXiIjoYHdPovuMjR/TtuQ2sfG5LbqL2PjYFh1GjJLCiFFSGDFKCiNGSWHEKCmMGCWF8Ti9xsZv0WdS3Y0jZ3t/niRZx+dg9dwAAAAASUVORK5CYII`;
	image.src=URL.createObjectURL(new Blob([xml.serializeToString(svg)],{type:`image/svg+xml;charset=utf-8`}));
	image.addEventListener(`load`,()=>{
		context.clearRect(0,0,width,height);
		context.drawImage(background,0,0);
		if(inputs.canvas.value!==`616161`){
			context.globalCompositeOperation=`overlay`;
			context.fillRect(0,0,width,height);
			context.globalCompositeOperation=`source-over`;
		}
		if(inputs.type.value){
			context.save();
			context.font=`18px Roboto`;
			context.translate(28,250);
			context.rotate(-Math.PI/2);
			context.fillText(text.type.firstChild.nodeValue,0,0);
			context.restore();
			context.save();
			context.globalAlpha=.87;
			context.translate(54,250);
			context.rotate(-Math.PI/2);
			context.fillText(text.disclaimer.firstChild.nodeValue,0,0);
			context.restore();
		}
		context.fillText(inputs.name.value.trim().toLowerCase().replace(/ |_/g,`-`),11,282);
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
		URL.revokeObjectURL(image.src);
	},0);
	document.addEventListener(`input`,generate,1);
})();