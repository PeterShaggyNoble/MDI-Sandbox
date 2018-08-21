(async()=>{
	const 	icons=Object.assign(...Object.entries(await(await fetch`../json/icons.json`).json()).filter(([key,value])=>
			!value.rejected&&!value.retired&&!value.categories.includes(`google`)&&!value.categories.includes(`logos`)
		).map(([key,value])=>
			({[key]:value})
		));
		body=document.querySelector`tbody`,
		variants=[`outline`,`rounded`,`sharp`];
	let exists,key,svg,tr,td,use;
	for(key in icons)
		if(icons.hasOwnProperty(key)&&!key.endsWith`-outline`&&!key.endsWith`-rounded`&&!key.endsWith`-sharp`){
			tr=tr?tr.cloneNode(0):document.createElement`tr`;
			if(td)
				td=td.cloneNode(0);
			else{
				td=document.createElement`td`;
				td.classList.add(`oh`,`toe`,`wsnw`);
			}
			td.append(document.createTextNode(key));
			tr.append(td);
			variants.forEach(name=>{
				td=td.cloneNode(0);
				if(svg){
					svg=svg.cloneNode(0);
					use=use.cloneNode(0);
				}else{
					svg=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),
					use=document.createElementNS(`http://www.w3.org/2000/svg`,`use`),
					svg.classList.add`vam`;
					svg.setAttribute(`viewBox`,`0 0 24 24`);
				}
				exists=icons.hasOwnProperty(key+`-`+name);
				svg.classList.toggle(`done`,exists);
				use.setAttribute(`href`,`#${exists?`check`:`close`}`);
				svg.append(use);
				td.append(svg);
				tr.append(td);
			});
			body.appendChild(tr);
		}
})();