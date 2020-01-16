(async()=>{
	const 	script=document.querySelector(`script`),
		a=document.createElement(`a`),
		icons=await(await fetch`../json/google.json`).json(),
		statuses=[`complete`,`ignore`,`new`];
	let 	section=document.createElement(`section`),
		heading=document.createElement(`h2`),
		article=document.createElement(`article`),
		svg=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),
		path=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),
		filter=(new URL(location)).searchParams.get(`filter`),
		count,data,key,status,target,variant;
	section.classList.add(`dg`,`pr`);
	heading.classList.add(`fwm`,`ps`);
	article.classList.add(`oh`,`pr`,`tac`);
	svg.classList.add(`db`);
	svg.setAttribute(`viewBox`,`0 0 512 512`);
	for(variant in icons)
		if(icons.hasOwnProperty(variant)){
			count=Object.keys(icons[variant]).length;
			if(count){
				section=section.cloneNode(0);
				section.id=variant;
				heading=heading.cloneNode(0);
				heading.append(document.createTextNode(variant[0].toUpperCase()+variant.slice(1)+` (${count} icons)`));
				section.append(heading);
				for(key in icons[variant])
					if(icons[variant].hasOwnProperty(key)){
						status=icons[variant][key].status;
						if(!filter||filter===status){
							article=article.cloneNode(0);
							if(status&&filter!==status)
								statuses.forEach(x=>article.classList.toggle(x,status===x));
							else article.classList.remove(...statuses);
							svg=svg.cloneNode(0);
							path=path.cloneNode(1);
							path.setAttribute(`d`,data=icons[variant][key].data);
							svg.append(path);
							article.append(svg,document.createTextNode(key.replace(/_/g," ")));
							section.append(article);
						}
					}
				script.before(section);
			}
		}
	document.body.addEventListener(`click`,event=>{
		target=event.target;
		while(target.nodeName.toLowerCase()!==`article`&&target!==document.body)
			target=target.parentNode;
		if(target.nodeName.toLowerCase()===`article`&&!target.classList.contains(`complete`)){
			a.href=`data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`+target.firstChild.outerHTML.replace(`class="db"`,`xmlns="http://www.w3.org/2000/svg"`);
			a.download=target.lastChild.nodeValue.replace(/ /g,`-`)+`.svg`;
			document.body.append(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(a.href);
		}
	},0);
})();