{
	/** VERSION **/
	let 	version;
	const 	versions={
			light:`0.2.63`,
			regular:`2.0.46`
		},
	/** FUNCTIONS **/
		$=i=>d.getElementById(i),
		Q=s=>d.querySelector(s),
	/** CONSTANTS **/
		w=window,
		d=document,
		b=d.body,
	/** PAGE **/
		page={
			url:new URL(w.location),
			header:$`header`,
			main:$`content`,
			section:$`icons`,
			message:$`message`,
			anchor:d.createElement`a`,
			textarea:d.createElement`textarea`,
		/** SET UP **/
			init(){
				this.address=`${this.url.protocol}\/\/${this.url.host+this.url.pathname}`;
				this.params=this.url.searchParams;
				this.light=false;
				/*this.params.get`font`===`light`;*/
				this.font=this.light?`light`:`regular`;
				b.classList.add(this.prefix=this.light?`mdil`:`mdi`);
				version=versions[this.font];
				try{
					this.storage=localStorage;
				}catch(e){
					console.log(`localStorage not available. Favourites disabled`);
					page.alert`Favourites not available.`;
					for(let key in favourites)
						delete favourites[key];
					info.actions.favourite.remove();
					delete info.actions.favourite;
				}
				if(this.light)
					$`fab`.remove();
				this.textarea.classList.add(`ln`,`pa`);
				categories.init();
				version=+version.replace(/\./g,``);
				contributors.init();
				if(this.storage)
					favourites.init();
				icons.init();
				menu.init();
				filter.init();
				info.init();
				this.main.addEventListener(`click`,event=>{
					let 	target=event.target,
						parent=target.parentNode,
						current=this.main.querySelector`article.active`;
					switch(target.nodeName.toLowerCase()){
						case`h2`:
							if(parent!==this.section)
								page.copy(`${page.address}?${page.light?`font=light&`:``}section=${parent.dataset.name}`,`Link`);
							break;
						case`article`:
							if(current)
								current.classList.remove`active`;
							icons.ripple(target,event.clientX,event.offsetY+target.offsetTop);
							info.open(target.lastChild.nodeValue);
							target.classList.add`active`;
							break;
					}
				},0);
				setTimeout(_=>{
					let loader=$`load`;
					loader.classList.add`oz`;
					loader.classList.add`pen`;
					this.main.classList.remove`oz`;
					setTimeout(_=>
						loader.remove()
					,375);
				},10);
			},
		/** TOAST NOTIFICATIONS **/
			alert(msg){
				clearTimeout(this.timer);
				this.message.firstChild.nodeValue=msg;
				this.message.classList.remove`oz`;
				this.timer=setTimeout(_=>
					this.message.classList.add`oz`
				,5000);
			},
		/** DOWNLOAD FILE **/
			download(data,name){
				this.anchor.href=data;
				this.anchor.download=name;
				this.anchor.click();
			},
		/** COPY TO CLIPBOARD **/
			copy(str,msg){
				b.append(this.textarea);
				this.textarea.value=str;
				this.textarea.select();
				d.execCommand`copy`;
				this.textarea.remove();
				this.alert(`${msg} copied to clipboard.`);
			},
		/** GET JSON **/
			getjson:(file,data)=>fetch(`json/${file}.json`).then(response=>
						response.json()
					).catch(error=>{
						console.log(error);
						page.alert(`Failed to load ${data}.`);
					})
		},
	/** MENU **/
		menu={
			show:0,
			functions:{},
			nav:$`nav`,
			header:$`navicon`,
			menu:$`menu`,
			switch:d.createElement`p`,
			sections:$`sections`,
			categories:$`categories`,
			contributors:$`contributors`,
			init(){
				this.switch.classList.add`cp`;
				this.switch.dataset.icon=page.light?`\uf335`:`\uf6e8`;
				this.switch.tabIndex=-1;
				this.switch.append(d.createTextNode(`View ${page.light?`Regular`:`Light`} Icons`));
				/*this.sections.before(this.switch);*/
				let section=page.params.get`section`;
				if(section&&(section=categories.list[section].section))
					this.goto(section);
				this.nav.addEventListener(`click`,event=>{
					let target=event.target;
					target.blur();
					switch(target){
						case this.nav:
						case this.header:
							this.toggle();
							break;
						case this.switch:
							w.location.href=page.light?`./`:`?font=light`;
							break;
						case this.import:
							favourites.import();
							break;
						case this.export:
							page.download(`data:text/plain;base64,${btoa(btoa(Object.keys(page.storage).join`,`))}`,`mdi-favourites.txt`);
							break;
						case this.categories.previousElementSibling:
						case this.contributors.previousElementSibling:
							target.classList.toggle`open`;
							break;
						default:
							if(target.nodeName.toLowerCase()===`li`){
								let 	category=target.dataset.category,
									contributor=target.dataset.contributor;
								switch(target.parentNode){
									case this.sections:
										if(category=categories.list[category].section){
											this.goto(category);
											this.toggle()
										}
										break;
									case this.categories:
										if(categories.list[category]){
											target.classList.toggle`active`;
											filter.categories[filter.categories.has(category)?`delete`:`add`](category);
											filter.apply();
										}
										break;
									case this.contributors:
										if(contributors.list[contributor]){
											target.classList.toggle`active`;
											filter.contributors[filter.contributors.has(contributor)?`delete`:`add`](contributor);
											filter.apply();
										}
										break;
									default:break;
								}
							}
							break;
					}
				},0);
				d.addEventListener(`touchstart`,event=>{
					this.width=this.menu.offsetWidth;
					this.clientx=event.touches[0].clientX;
					if(([page.main,b].includes(event.target)&&!this.show&&this.clientx<=50)||(this.show&&this.clientx>this.width)){
						this.touchstart();
						d.addEventListener(`touchmove`,this.functions.move=event=>{
							let clientx=event.touches[0].clientX-this.clientx;
							this.nav.style.background=`rgba(0,0,0,${Math.min((clientx+(this.show?285.185:0))/285.185*.54,.54)})`;
							this.menu.style.left=`${this.show?Math.min(Math.max(clientx,-this.width),0):Math.min(Math.max(clientx,this.width-this.width)-this.width,0)}px`;
							this.menu.style.boxShadow=`0 14px 28px rgba(0,0,0,${Math.min((clientx+(this.show?500:0))/500*.25,.25)}),0 10px 10px rgba(0,0,0,${Math.min((clientx+(this.show?545.545:0))/545.545*.22,.22)})`;
							event.stopPropagation();
						},0);
						d.addEventListener(`touchend`,this.functions.end=event=>
							this.touchend(this.show?this.clientx-event.changedTouches[0].clientX:event.changedTouches[0].clientX-this.clientx),0
						);
						event.stopPropagation();
					}
				},0);
			},
			toggle(){
				this.nav.dataset.show=(this.show=!this.show).toString();
				this.show?b.addEventListener(`keydown`,this.functions.close=event=>{
					if(event.keyCode===27)
						this.toggle();
				},0):b.removeEventListener(`keydown`,this.functions.close);
			},
			goto(section){
				clearInterval(this.timer);
				let 	to=section.offsetTop-page.header.offsetHeight,
					top=page.main.scrollTop,
					step=(to-top)/20;
				this.timer=setInterval(_=>
					Math.round(top)===Math.round(to)?clearInterval(this.timer):page.main.scrollTop=(top+=step)
				,10);
			},
			touchstart(){
				b.classList.add`dragging`;
				this.nav.style.transition=this.menu.style.transition=`none`;
			},
			touchend(clientx){
				d.removeEventListener(`touchmove`,this.functions.move);
				d.removeEventListener(`touchend`,this.functions.end);
				this.nav.removeAttribute`style`;
				this.menu.removeAttribute`style`;
				if(clientx>=this.width/2)
					this.toggle();
				b.classList.remove`dragging`;
			}
		},
	/** FILTERS **/
		filter={
			input:$`filter`,
			heading:page.section.firstElementChild,
			error:page.section.querySelector`p`,
			init(){
				this.button=this.input.nextElementSibling;
				this.categories=new Set(this.categories=page.params.get`categories`?this.categories.split`,`:[]);
				if(this.categories.size){
					menu.categories.previousElementSibling.classList.add`open`;
					for(let key of this.categories)
						categories.list[key].item.classList.add`active`;
				}
				this.contributors=new Set(this.contributors=page.params.get`contributors`?this.contributors.split`,`:[]);
				if(this.contributors.size){
					menu.contributors.previousElementSibling.classList.add`open`;
					for(let key of this.contributors)
						contributors.list[key].item.classList.add`active`;
				}
				if(this.text=page.params.get`filter`)
					this.text=(this.input.value=this.text.toLowerCase()).replace(/\+/g,`%2b`);
				if(this.categories.size&&this.contributors.size&&this.text)
					filter.apply();
				this.input.addEventListener(`input`,_=>{
					clearTimeout(this.timer);
					this.timer=setTimeout(_=>{
						this.text=this.input.value.toLowerCase().replace(/\+/g,`%2b`);
						this.apply();
					},50);
				},0);
				this.button.addEventListener(`click`,_=>{
					this.input.focus();
					if(this.text){
						this.input.value=``;
						this.input.dispatchEvent(new Event(`input`));
					}
				},0);
				this.heading.addEventListener(`click`,_=>
					page.copy(this.url,`Link`)
				,0);
			},
			apply(){
				if(page.main.scrollTop<page.section.offsetTop-page.header.offsetHeight)
					menu.goto(page.section);
				page.section.dataset.filtered=(this.filtered=!!this.text||!!this.categories.size||!!this.contributors.size).toString();
				this.heading.firstChild.nodeValue=this.filtered?`Search Results`:`All Icons`;
				let 	words=this.text&&this.text.split(/[\s\-]/),
					match=0,
					check,icon,article;
				for(let key in icons.list)
					if(icons.list.hasOwnProperty(key)){
						icon=icons.list[key];
						check=true;
						if(this.categories.size)
							check=icon.categories&&icon.categories.some(category=>
								this.categories.has(category)
							);
						if(this.contributors.size)
							check=check&&icon.contributor&&this.contributors.has(icon.contributor[page.font]);
						if(this.text)
							check=check&&words.every(word=>
								icon.keywords.some(item=>
									item.startsWith(word)
								)
							);
						icon.article.classList.toggle(`dn`,!check);
						match=match||check;
					}
				this.error.classList.toggle(`dn`,match);
				this.heading.classList.toggle(`pen`,!this.filtered||!match);
				if(this.filtered){
					this.url=`${page.address}?`;
					if(page.light)
						this.url+=`font=light&`;
					if(this.categories.size){
						this.url+=`categories=${[...this.categories].sort().join`,`}`;
						if(this.contributors.size||this.text)
							this.url+=`&`;
					}
					if(this.contributors.size){
						this.url+=`contributors=${[...this.contributors].sort().join`,`}`;
						if(this.text)
							this.url+=`&`;
					}
					if(this.text)
						this.url+=`filter=${encodeURIComponent(this.text)}`;
					if(page.main.scrollTop<page.section.offsetTop-page.header.offsetHeight)
						page.main.scrollTop=page.section.offsetTop-page.header.offsetHeight
				}
			}
		},
	/** FAVOURITES **/
		favourites={
			input:d.createElement`input`,
			reader:new FileReader(),
			init(){
				this.input.accept=`.txt,text/plain`;
				this.input.classList.add(`ln`,`pa`);
				this.input.type=`file`;
				this.input.addEventListener(`change`,_=>{
					if(this.input.files[0].type===`text/plain`)
						this.reader.readAsText(this.input.files[0]);
				},0);
				this.reader.addEventListener(`load`,event=>
					this.load(event)
				,0);
				this.section=categories.list.favourites.section;
				this.heading=this.section.firstElementChild;
				this.articles=this.section.getElementsByTagName`article`;
			},
			set(name){
				this.icon=icons.list[name];
				info.actions.favourite.dataset.icon=this.icon.favourite?`\uf0c5`:`\uf0c6`;
				info.actions.favourite.firstChild.nodeValue=`${this.icon.favourite?`Add to`:`Remove from`} Favourites`;
				let msg=`added to`;
				if(this.icon.favourite){
					page.storage.removeItem(`mdi-${name}`);
					this.icon.favourite.remove();
					delete this.icon.favourite;
					msg=`removed from`;
				}else{
					page.storage.setItem(`mdi-${name}`,1);
					this.section.append(this.icon.favourite=this.icon.article.cloneNode(1));
					this.icon.favourite.classList.remove`active`;
					if(this.articles.length>1)
						this.sort();
				}
				page.alert(`${name} ${msg} favourites.`);
			},
			sort(){
				let articles=[...this.articles];
				articles.sort((first,second)=>
					first.lastChild.nodeValue<second.lastChild.nodeValue?1:-1
				);
				while(this.heading.nextElementSibling)
					this.section.lastChild.remove();
				articles.forEach(article=>
					this.section.insertBefore(article,this.heading.nextElementSibling)
				);
			},
			import(){
				b.append(this.input);
				this.input.click();
			},
			load(event){
				let msg=`complete`;
				try{
					let array=atob(event.target.result).split`,`;
					array.forEach(item=>{
						let name=item.substr(4);
						this.icon=icons.list[name];
						if(this.icon){
							if(this.icon.article&&!this.icon.favourite){
								page.storage.setItem(item,1);
								this.section.append(this.icon.favourite=this.icon.article.cloneNode(1));
								if(info.current===name){
									info.actions.favourite.dataset.icon=`\uf0c6`;
									info.actions.favourite.firstChild.nodeValue=`Remove from Favourites`;
								}
							}
						}else if(!page.light)
							page.storage.removeItem(item);
					});
					if(this.articles.length>1)
						this.sort();
				}catch(error){
					console.log(error);
					msg=`failed`;
				}
				page.alert(`Import ${msg}.`);
				this.input.value=``;
				this.input.remove();
			}
		},
	/** SIDEBAR **/
		info={
			color:Q`meta[name=theme-color]`,
			aside:$`info`,
			heading:$`name`,
			figure:$`preview`,
			img:d.createElement`img`,
			input:$`slider`,
			copy:1,
			actions:{
				favourite:Q`#actions>:first-child`,
				path:Q`#actions>[data-confirm=Path]`,
				icon:Q`#actions>[data-confirm=Icon]`,
				codepoint:Q`#actions>[data-confirm="Code point"]`,
				entity:Q`#actions>[data-confirm=Entity]`,
				css:Q`#actions>[data-confirm=CSS]`,
				js:Q`#actions>[data-confirm=JavaScript]`,
				html:Q`#actions>[data-confirm=HTML]`,
				url:Q`#actions>[data-confirm=Link]`,
				link:Q`#actions>:last-child`
			},
			downloads:{},
			show:0,
			init(){
				this.img.classList.add`dib`;
				this.img.height=this.img.width=56;
				this.figure.append(this.img);
				let icon=page.params.get`icon`;
				if(icon){
					if(icons.list[icon]){
						this.open(icon);
						icons.list[icon].article.classList.add`active`;
					}
				}else for(let key in icons.list)
					if(icons.list.hasOwnProperty(key)&&icons.list[key].path[page.font]){
						this.set(key);
						break;
					}
				this.aside.addEventListener(`click`,event=>{
					let target=event.target;
					switch(target){
						case this.aside:
						case this.heading:
							this.toggle();
							break;
						case this.actions.favourite:
							favourites.set(this.name);
							break;
						case this.actions.path:
							if(this.path)
								page.copy(target.dataset.copy,target.dataset.confirm);
							else page.alert`Not yet available.`;
							break;
						case this.actions.link:
							if(this.aside.dataset.retired===`false`)
								w.location.href=target.dataset.url;
							else page.alert`No longer available.`;
							break;
						default:
							if(this.type=target.dataset.type)
								this.download();
							else if(target.parentNode===this.actions.link.parentNode)
								if(this.copy||target===this.actions.url)
									page.copy(target.dataset.copy,target.dataset.confirm);
								else page.alert(`No${this.aside.dataset.retired===`false`?`t yet`:` longer`} available.`);
							break;
					}
				},0);
				this.input.addEventListener(`input`,_=>
					this.img.style.height=this.img.style.width=`${this.input.value}px`
				,0);
			},
			open(icon){
				this.set(icon);
				this.current=icon;
				this.figure.classList.add`oz`;
				setTimeout(_=>
					this.figure.classList.remove`oz`
				,10);
				this.toggle();
			},
			set(name){
				this.icon=icons.list[name];
				this.name=this.heading.firstChild.nodeValue=name;
				this.path=this.icon.path[page.font];
				let codepoint=this.icon.codepoint;
				if(page.storage){
					this.actions.favourite.dataset.icon=this.icon.favourite?`\uf0c6`:`\uf0c5`;
					this.actions.favourite.firstChild.nodeValue=`${this.icon.favourite?`Remove from`:`Add to`} Favourites`;
				}
				this.actions.url.dataset.copy=`${page.address}?icon=${name}`;
				this.actions.html.dataset.copy=`<span class="${page.prefix}-${name}"></span>`;
				this.actions.link.dataset.url=`https://materialdesignicons.com/icon/${name}`;
				if(page.light)
					this.actions.link.dataset.url+=`light/`;
				this.img.src=`data:image/svg+xml;utf8,${icons.svgheader+this.path}"/></svg>`;
				this.aside.dataset.nocopy=(!(this.copy=!!codepoint)).toString();
				this.aside.dataset.nodownload=(!this.path).toString();
				this.aside.dataset.retired=(!!this.icon.retired).toString();
				this.actions.path.dataset.copy=this.path;
				if(codepoint){
					this.actions.icon.dataset.copy=String.fromCharCode(`0x${codepoint}`);
					this.actions.codepoint.dataset.copy=codepoint;
					this.actions.entity.dataset.copy=`&#x${codepoint};`;
					this.actions.css.dataset.copy=`\\${codepoint}`;
					this.actions.js.dataset.copy=`\\u${codepoint}`;
				}
				this.downloads={
					svg:`data:text/svg+xml;utf8,${icons.svgheader+this.path}"/></svg>`,
					xaml:`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="24" Height="24"><Path Data="${this.path}"/></Canvas>`,
					xml:`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="24dp" android:width="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#000" android:pathData="${this.path}"/></vector>`
				};
			},
			download(){
				if(this.icon)
					if(this.path)
						if(this.downloads[this.type])
							page.download(this.downloads[this.type],`${this.name}.${this.type}`);
						else page.alert`Unknown file type.`;
					else page.alert`Download not available.`;
				else page.alert`Unknown icon.`;
			},
			toggle(){
				this.aside.dataset.show=(this.show=!this.show).toString();
				this.color.content=`#${this.show?`ff5722`:`2196f3`}`;
				if(this.show)
					b.addEventListener(`keydown`,this.close=event=>{
						if(event.keyCode===27)
							this.toggle();
					},0);
				else{
					let current=page.main.querySelector`article.active`;
					if(current)
						current.classList.remove`active`;
					b.removeEventListener(`keydown`,this.close);
				}
			}
		},
	/** CATEGORIES **/
		categories={
			section:d.createElement`section`,
			heading:d.createElement`h2`,
			item:d.createElement`li`,
			init(){
				this.section.classList.add(`df`,`pr`);
				this.heading.classList.add(`oh`,`ps`);
				this.heading.append(d.createTextNode``);
				this.item.classList.add`cp`;
				this.item.tabIndex=-1;
				this.item.append(d.createTextNode``);
				if(!page.storage)
					delete this.list.favourites;
				if(page.light){
					delete this.list.new;
					delete this.list.updated;
					delete this.list.soon;
					delete this.list.retired;
				}
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))
						this.add(key);
			},
			add(key){
				let 	category=this.list[key],
					section=this.section.cloneNode(0),
					heading=this.heading.cloneNode(1),
					item=this.item.cloneNode(1),
					name=category.name.replace(`{v}`,version);
				if(category.section){
					section.dataset.name=key;
					heading.firstChild.nodeValue=name;
					section.append(heading);
					page.section.before(category.section=section);
				}else category.count=icons.array.filter(item=>
					item.path[page.font]&&item.categories&&item.categories.includes(key)
				).length;
				if(category.section||category.count){
					item.firstChild.nodeValue=name;
					if(category.count)
						item.firstChild.nodeValue+=` (${category.count})`;
					item.dataset.category=key;
					item.dataset.icon=String.fromCharCode(`0x${category.codepoint}`);
					menu[category.section?`sections`:`categories`].append(category.item=item);
					if(key===`favourites`){
						item=item.cloneNode(1);
						delete item.dataset.category;
						item.dataset.icon=`\uf220`;
						item.firstChild.nodeValue=`Import Favourites`;
						menu.sections.append(menu.import=item);
						item=item.cloneNode(1);
						item.dataset.icon=`\uf21d`;
						item.firstChild.nodeValue=`Export Favourites`;
						menu.sections.append(menu.export=item);
					}
				}else delete category;
			}
		},
	/** CONTRIBUTORS **/
		contributors={
			item:d.createElement`li`,
			img:d.createElement`img`,
			init(){
				this.item.classList.add`cp`;
				this.item.tabIndex=-1;
				this.item.append(d.createTextNode``);
				this.img.classList.add(`pen`,`vam`);
				this.img.height=this.img.width=24;
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))
						this.add(key);
			},
			add(key){
				let 	contributor=this.list[key],
					image=contributor.image,
					img=this.img.cloneNode(1),
					item=this.item.cloneNode(1);
				contributor.count=icons.array.filter(item=>
					item.path[page.font]&&item.contributor&&item.contributor[page.font]===key
				).length;
				if(contributor.count){
					item.dataset.contributor=key;
					if(image){
						img.src=`data:image/png;base64,${image}`;
						item.prepend(img);
					}else item.dataset.icon=`\uf004`;
					item.lastChild.nodeValue=`${contributor.name} (${contributor.count})`;
					menu.contributors.append(contributor.item=item);
				}else delete contributor
			}
		},
	/** ICONS **/
		icons={
			article:d.createElement`article`,
			span:d.createElement`span`,
			img:d.createElement`img`,
			svgheader:`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="`,
			init(){
				delete this.array;
				this.article.classList.add(`cp`,page.light?`fwl`:`fwm`,`oh`,`pr`,`toe`,`wsnw`);
				this.article.append(d.createTextNode``);
				this.span.classList.add(`ripple`,`db`,`pa`,`pen`);
				this.img.classList.add(`pen`,`vam`);
				this.img.height=this.img.width=24;
				for(let key in this.list)
					if(this.list.hasOwnProperty(key)&&this.list[key].path[page.font])
						this.add(key);
			},
			add(key){
				let 	icon=this.list[key],
					article=this.article.cloneNode(1),
					img=this.img.cloneNode(1),
					codepoint=icon.codepoint,
					keywords=new Set(key.split`-`),
					category;
				if(icon.path[page.font]){
					if(icon.aliases)
						icon.aliases.forEach(alias=>
							alias.split`-`.forEach(word=>
								keywords.add(word)
							)
						);
					if(icon.keywords)
						icon.keywords.forEach(word=>
							keywords.add(word)
						);
					icon.keywords=[...keywords].sort();
					if(codepoint)
						article.dataset.icon=String.fromCharCode(`0x${codepoint}`);
					else{
						img.src=`data:image/svg+xml;utf8,${this.svgheader+icon.path[page.font]}"/></svg>`;
						article.prepend(img);
					}
					article.lastChild.nodeValue=key;
					if((category=categories.list.favourites)&&page.storage[`mdi-${key}`])
						category.section.append(icon.favourite=article.cloneNode(1));
					if((category=categories.list.new)&&icon.added&&icon.added[page.font]===version)
						category.section.append(article.cloneNode(1));
					if((category=categories.list.updated)&&icon.updated&&icon.updated[page.font]===version)
						category.section.append(article.cloneNode(1));
					if((category=categories.list.soon)&&icon.added&&icon.added[page.font]===`{next}`)
						category.section.append(article.cloneNode(1));
					if((category=categories.list.retired)&&icon.retired)
						category.section.append(article.cloneNode(1));
					page.section.append(icon.article=article);
				}else delete icon;
			},
			ripple(target,x,y){
				let span=this.span.cloneNode(0);
				target.prepend(span);
				span.style.height=span.style.width=`${Math.min(target.offsetHeight,target.offsetWidth)}px`;
				span.style.left=`${x-target.getBoundingClientRect().left}px`;
				span.style.top=`${y-target.offsetTop}px`;
				setTimeout(_=>
					span.remove()
				,875);
			}
		};
	/** INITIATE **/
	page.getjson(`categories`,`category data`).then(json=>{
		categories.list=json;
		page.getjson(`contributors`,`contributor data`).then(json=>{
			contributors.list=json;
			page.getjson(`icons`,`icon data`).then(json=>{
				icons.array=Object.values(icons.list=json);
				page.init();
			});
		});
	});
}