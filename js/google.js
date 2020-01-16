(async()=>{const script=document.querySelector(`script`),a=document.createElement(`a`),icons=await(await fetch`../json/google.json`).json(),statuses=[`complete`,`ignore`,`new`];let heading=document.createElement(`h2`),article=document.createElement(`article`),svg=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),path=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),filter=(new URL(location)).searchParams.get(`filter`),count,data,key,status,target,variant;heading.classList.add(`fwm`);article.classList.add(`oh`,`pr`,`tac`);svg.classList.add(`db`);svg.setAttribute(`viewBox`,`0 0 24 24`);path.setAttribute(`transform`,`scale(.046875) scale(1,-1) translate(0,-512)`);for(variant in icons)if(icons.hasOwnProperty(variant)){count=Object.keys(icons[variant]).length;if(count){heading=heading.cloneNode(0);heading.append(document.createTextNode(variant[0].toUpperCase()+variant.slice(1)+` (${count} icons)`));script.before(heading);for(key in icons[variant])if(icons[variant].hasOwnProperty(key)){status=icons[variant][key].status;if(!filter||filter===status){article=article.cloneNode(0);svg=svg.cloneNode(0);path=path.cloneNode(1);path.setAttribute(`d`,data=icons[variant][key].data);Math.max(...data.match(/(\d|\.)+/g).map(x=>parseFloat(x)))>24?path.setAttribute(`transform`,`scale(.046875) scale(1,-1) translate(0,-512)`):path.removeAttribute(`transform`);svg.append(path);article.append(svg,document.createTextNode(key.replace(/_/g," ")));script.before(article);}}}}document.body.addEventListener(`click`,event=>{target=event.target;while(target.nodeName.toLowerCase()!==`article`&&target!==document.body)target=target.parentNode;if(target.nodeName.toLowerCase()===`article`&&!target.classList.contains(`complete`)){a.href=`data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`+target.firstChild.outerHTML.replace(`class="db"`,`xmlns="http://www.w3.org/2000/svg"`);a.download=target.lastChild.nodeValue.replace(/ /g,`-`)+`.svg`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(a.href);}},0);})();