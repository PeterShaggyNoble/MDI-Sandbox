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
		C=e=>d.createElement(e),
		N=e=>d.createElementNS(`http://www.w3.org/2000/svg`,e),
		T=t=>d.createTextNode(t),
	/** CONSTANTS **/
		w=window,
		d=document,
		h=d.documentElement,
		b=d.body,
	/** PAGE **/
		page={
			url:new URL(w.location),
			wide:b.offsetWidth>1499,
			header:$`header`,
			main:$`content`,
			section:$`icons`,
			message:$`message`,
			anchor:C`a`,
			textarea:C`textarea`,
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
				setTimeout(_=>
					filter.init()
				,225);
				info.init();
				this.main.addEventListener(`click`,event=>{
					let 	target=event.target,
						parent=target.parentNode,
						current=this.main.querySelector`article.active`;
					switch(target.nodeName.toLowerCase()){
						case`h2`:
							parent!==this.section?page.copy(`${page.address}?${page.light?`font=light&`:``}section=${parent.dataset.name}`,`Link`):page.copy(filter.filtered&&filter.url?filter.url:`${page.address}?${page.light?`font=light&`:``}section=icons`,`Link`);
							break;
						case`article`:
							if(current!==target){
								if(current)
									current.classList.remove`active`;
								info.open(target.lastChild.nodeValue);
								target.classList.add`active`;
							}
							break;
					}
				},0);
				setTimeout(_=>{
					let loader=$`load`;
					loader.classList.add`oz`;
					loader.classList.add`pen`;
					setTimeout(_=>
						loader.remove()
					,375);
				},10);
				editor.init();
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
			switch:C`p`,
			sections:$`sections`,
			categories:$`categories`,
			contributors:$`contributors`,
			init(){
				this.switch.classList.add`cp`;
				this.switch.dataset.icon=page.light?`\uf335`:`\uf6e8`;
				this.switch.tabIndex=-1;
				this.switch.append(T(`View ${page.light?`Regular`:`Light`} Icons`));
				/*this.sections.before(this.switch);*/
				let section=page.params.get`section`;
				if(section){
					categories.list[section]&&categories.list[section].section?section=categories.list[section].section:section=page.main.querySelector(`#${section}`);
					if(section)
						this.goto(section);
				}
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
							page.download(`data:text/plain;base64,${btoa(btoa(Object.keys(page.storage).filter(key=>key.startsWith`mdi-`).join`,`))}`,`mdi-favourites.txt`);
							break;
						case filter.clearall:
							filter.clear();
							if(!page.wide)
								this.toggle();
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
											if(!page.wide)
												this.toggle();
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
				if(page.wide)
					this.toggle();
			},
			toggle(){
				b.classList.toggle(`menu`,this.show=!this.show);
				this.show?b.addEventListener(`keydown`,this.functions.close=event=>{
					if(event.keyCode===27)
						this.toggle();
				},0):b.removeEventListener(`keydown`,this.functions.close);
			},
			goto(section){
				clearInterval(this.timer);
				let 	to=section.offsetTop-8-page.header.offsetHeight,
					top=h.scrollTop,
					step=(to-top)/10;
				this.timer=setInterval(_=>
					Math.round(top)===Math.round(to)?clearInterval(this.timer):h.scrollTop=(top+=step)
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
			clearall:C`li`,
			heading:page.section.firstElementChild.firstChild,
			error:page.section.querySelector`p`,
			init(){
				this.button=this.input.nextElementSibling;
				this.clearall.classList.add`cp`;
				this.clearall.dataset.icon=`\uf03b`;
				this.clearall.tabIndex=-1;
				this.clearall.append(T`All Icons`);
				menu.sections.append(this.clearall);
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
				if(this.categories.size||this.contributors.size||this.text)
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
						this.text=this.input.value=``;
						this.apply();
					}
				},0);
			},
			apply(){
				if(h.scrollTop<page.section.offsetTop-page.header.offsetHeight)
					menu.goto(page.section);
				page.section.classList.toggle(`filtered`,this.filtered=!!this.text||!!this.categories.size||!!this.contributors.size);
				this.heading.nodeValue=this.filtered?`Search Results`:`All Icons`;
				let 	words=this.text&&this.text.split(/[\s\-]/),
					match=0,
					check,icon,article;
				for(let key in icons.list)
					if(icons.list.hasOwnProperty(key)){
						icon=icons.list[key];
						check=1;
						if(this.categories.size)
							check=icon.categories&&icon.categories.some(category=>
								this.categories.has(category)
							);
						if(this.contributors.size)
							check=check&&icon.contributor&&this.contributors.has(icon.contributor[page.font]);
						if(words)
							check=check&&words.every(word=>
								icon.keywords.some(item=>
									item.startsWith(word)
								)
							);
						icon.articles.main.classList.toggle(`dn`,!check);
						match=match||check;
					}
				this.error.classList.toggle(`dn`,match);
				this.clearall.classList.toggle(`clear`,this.filtered);
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
					if(h.scrollTop<page.section.offsetTop-page.header.offsetHeight)
						h.scrollTop=page.section.offsetTop-8-page.header.offsetHeight
				}
			},
			clear(){
				if(this.filtered){
					for(let key of this.categories)
						categories.list[key].item.classList.remove`active`;
					this.categories.clear();
					for(let key of this.contributors)
						contributors.list[key].item.classList.remove`active`;
					this.contributors.clear();
					this.text=this.input.value=``;
					this.apply();
				}
				menu.goto(page.section);
			}
		},
	/** FAVOURITES **/
		favourites={
			input:C`input`,
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
				info.actions.favourite.dataset.icon=this.icon.articles.favourite?`\uf0c5`:`\uf0c6`;
				info.actions.favourite.firstChild.nodeValue=`${this.icon.articles.favourite?`Add to`:`Remove from`} Favourites`;
				let msg=`added to`;
				if(this.icon.articles.favourite){
					page.storage.removeItem(`mdi-${name}`);
					this.icon.articles.favourite.remove();
					delete this.icon.articles.favourite;
					msg=`removed from`;
				}else{
					page.storage.setItem(`mdi-${name}`,1);
					this.section.append(this.icon.articles.favourite=this.icon.articles.main.cloneNode(1));
					this.icon.articles.favourite.classList.remove`active`;
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
							if(this.icon.articles.main&&!this.icon.articles.favourite){
								page.storage.setItem(item,1);
								this.section.append(this.icon.articles.favourite=this.icon.articles.main.cloneNode(1));
								if(info.current===name){
									info.actions.favourite.dataset.icon=`\uf0c6`;
									info.actions.favourite.firstChild.nodeValue=`Remove from Favourites`;
								}
							}
						}
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
			aside:$`info`,
			heading:$`name`,
			figure:$`preview`,
			svg:N`svg`,
			path:N`path`,
			input:$`slider`,
			actions:{
				favourite:Q`#actions>:first-child`,
				export:Q`#actions>[data-type=png]`,
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
				this.svg.classList.add`pa`;
				this.svg.setAttribute(`height`,56);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,56);
				this.svg.append(this.path);
				this.figure.append(this.svg);
				let icon=page.params.get`icon`||page.params.get`edit`;
				if(icon){
					if(icons.list[icon]){
						this.open(icon);
						Object.values(icons.list[icon].articles)[0].classList.add`active`;
					}
				}else this.set(Object.keys(icons.list)[0]);
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
						case this.actions.export:
							this.data?editor.open(this.name):page.alert`Not yet available.`;
							break;
						case this.actions.path:
							if(this.data)
								page.copy(target.dataset.copy,target.dataset.confirm);
							else page.alert`Not yet available.`;
							break;
						case this.actions.link:
							this.aside.dataset.retired===`false`?w.location.href=`https://materialdesignicons.com/icon/${this.name}${page.light?`/light`:``}`:page.alert`No longer available.`;
							break;
						default:
							if(this.type=target.dataset.type)
								this.download();
							else if(target.parentNode===this.actions.link.parentNode)
								this.copy||target===this.actions.url?page.copy(target.dataset.copy,target.dataset.confirm):page.alert(`No${this.aside.dataset.retired===`false`?`t yet`:` longer`} available.`);
							break;
					}
				},0);
				this.input.addEventListener(`input`,_=>{
					this.svg.setAttribute(`height`,this.input.value);
					this.svg.setAttribute(`width`,this.input.value);
				},0);
			},
			open(icon){
				this.set(icon);
				this.current=icon;
				this.figure.classList.add`oz`;
				this.toggle();
			},
			set(name){
				this.icon=icons.list[name];
				this.name=this.heading.firstChild.nodeValue=name;
				this.data=this.actions.path.dataset.copy=this.icon.path[page.font];
				let codepoint=this.actions.codepoint.dataset.copy=this.icon.codepoint;
				this.aside.dataset.nocopy=(!(this.copy=!!codepoint)).toString();
				this.aside.dataset.nodownload=(!this.data).toString();
				this.aside.dataset.retired=(!!this.icon.retired).toString();
				this.downloads={
					svg:`data:text/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${this.data}"/></svg>`,
					xaml:`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="24" Height="24"><Path Data="${this.data}"/></Canvas>`,
					xml:`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="24dp" android:width="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#000" android:pathData="${this.data}"/></vector>`
				};
				if(page.storage){
					this.actions.favourite.dataset.icon=this.icon.articles.favourite?`\uf0c6`:`\uf0c5`;
					this.actions.favourite.firstChild.nodeValue=`${this.icon.articles.favourite?`Remove from`:`Add to`} Favourites`;
				}
				if(codepoint){
					this.actions.icon.dataset.copy=String.fromCharCode(`0x${codepoint}`);
					this.actions.entity.dataset.copy=`&#x${codepoint};`;
					this.actions.css.dataset.copy=`\\${codepoint}`;
					this.actions.js.dataset.copy=`\\u${codepoint}`;
				}
				this.actions.html.dataset.copy=`<span class="${page.prefix}-${name}"></span>`;
				this.actions.url.dataset.copy=`${page.address}?`;
				if(page.light)
					this.actions.url.dataset.copy+=`font=light&`;
				this.actions.url.dataset.copy+=`icon=${name}`;
				setTimeout(_=>{
					this.path.setAttribute(`d`,this.data);
					this.figure.classList.remove`oz`;
				},195);
			},
			download(){
				this.icon?
					this.data?
						this.downloads[this.type]?
							page.download(this.downloads[this.type],`${this.name}.${this.type}`)
						:page.alert`Unknown file type.`
					:page.alert`Download not available.`
				:page.alert`Unknown icon.`;
			},
			toggle(){
				this.aside.classList.toggle(`show`,this.show=!this.show);
				if(this.show)
					b.addEventListener(`keydown`,this.close=event=>{
						if(event.keyCode===27){
							this.toggle();
							event.stopPropagation();
						}
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
			section:C`section`,
			heading:C`h2`,
			item:C`li`,
			init(){
				this.section.classList.add`dg`;
				this.heading.classList.add(`oh`);
				this.heading.append(T``);
				this.item.classList.add(`cp`,`oh`);
				this.item.tabIndex=-1;
				this.item.append(T``);
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
			item:C`li`,
			img:C`img`,
			init(){
				this.item.classList.add(`cp`,`oh`);
				this.item.tabIndex=-1;
				this.item.append(T``);
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
			article:C`article`,
			svg:N`svg`,
			init(){
				delete this.array;
				this.article.classList.add(`cp`,`oh`,`pr`,`tac`,`toe`,`wsnw`);
				this.article.append(T``);
				this.svg.classList.add(`pa`,`pen`);
				this.svg.setAttribute(`height`,48);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,48);
				this.svg.append(N`path`);
				for(let key in this.list)
					if(this.list.hasOwnProperty(key)&&this.list[key].path[page.font])
						this.add(key);
			},
			add(key){
				let 	icon=this.list[key],
					article=this.article.cloneNode(1),
					svg=this.svg.cloneNode(1),
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
						svg.firstElementChild.setAttribute(`d`,icon.path[page.font]);
						article.prepend(svg);
					}
					article.lastChild.nodeValue=key;
					icon.articles={};
					if((category=categories.list.favourites)&&page.storage[`mdi-${key}`])
						category.section.append(icon.articles.favourite=article.cloneNode(1));
					if((category=categories.list.new)&&icon.added&&icon.added[page.font]===version)
						category.section.append(icon.articles.new=article.cloneNode(1));
					if((category=categories.list.updated)&&icon.updated&&icon.updated[page.font]===version)
						category.section.append(icon.articles.updated=article.cloneNode(1));
					if((category=categories.list.soon)&&icon.added&&icon.added[page.font]===`{next}`)
						category.section.append(icon.articles.soon=article.cloneNode(1));
					if((category=categories.list.retired)&&icon.retired)
						category.section.append(icon.articles.retired=article.cloneNode(1));
					page.section.append(icon.articles.main=article);
				}else delete icon;
			}
		},
	/** PNG EDITOR **/
		editor={
			dialog:Q`dialog`,
			svg:N`svg`,
			path:N`path`,
			background:C`span`,
			canvas:C`canvas`,
			xml:new XMLSerializer(),
			dimensions:24,
			size:24,
			padding:0,
			luminance:0,
			colour:[255,255,255],
			alpha:0,
			radius:0,
			inputs:{
				size:$`png-size`,
				padding:$`png-padding`,
				fill:$`png-fill`,
				opacity:$`png-opacity`,
				colour:$`png-colour`,
				alpha:$`png-alpha`,
				radius:$`png-radius`,
				name:$`png-name`
			},
			init(){
				this.context=this.canvas.getContext`2d`;
				this.save=this.dialog.lastElementChild;
				this.cancel=this.save.previousElementSibling;
				this.figure=this.dialog.querySelector`figure`;
				this.svg.classList.add`pa`;
				this.svg.setAttribute(`height`,this.size);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,this.size);
				this.svg.append(this.path);
				this.background.classList.add(`pa`,`pen`);
				this.figure.append(this.background,this.horizontal=this.background.cloneNode(1),this.vertical=this.background.cloneNode(1),this.svg);
				this.dialog.addEventListener(`click`,event=>{
					let 	target=event.target,
						area=this.dialog.getBoundingClientRect();
					if(target===this.cancel||this.dialog.open&&!(area.top<=event.clientY&&event.clientY<=area.top+area.height&&area.left<=event.clientX&&event.clientX<=area.left+area.width))
						this.close(0);
					else if(target===this.save)
						this.download();
				},0);
				this.dialog.addEventListener(`keydown`,event=>{
					if(this.dialog.open&&event.keyCode===27){
						this.close(0);
						event.preventDefault();
						event.stopPropagation();
					}
				},0);
				this.dialog.addEventListener(`input`,event=>{
					let 	target=event.target,
						value=target.value;
					if(target.validity.valid){
						switch(target){
							case this.inputs.size:
								this.svg.setAttribute(`height`,this.size=parseInt(value));
								this.svg.setAttribute(`width`,this.size);
								if(this.padding>(this.inputs.padding.max=(256-this.size)/2))
									this.padding=this.inputs.padding.value=this.inputs.padding.max;
								this.background.style.height=this.background.style.width=this.horizontal.style.height=this.vertical.style.width=`${this.dimensions=this.size+2*this.padding}px`;
								if(this.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.radius=this.inputs.radius.value=this.inputs.radius.max}px`;
								break;
							case this.inputs.padding:
								this.background.style.height=this.background.style.width=this.horizontal.style.height=this.vertical.style.width=`${this.dimensions=this.size+2*(this.padding=parseInt(value))}px`;
								if(this.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.radius=this.inputs.radius.value=this.inputs.radius.max}px`;
								break;
							case this.inputs.fill:
								this.path.setAttribute(`fill`,`#${value.toLowerCase()}`);
								this.figure.classList.toggle(`light`,(this.luminance=this.test(this.convert(value)))>=128&&this.alpha<.31);
								break;
							case this.inputs.opacity:
								this.path.setAttribute(`fill-opacity`,value/100);
								break;
							case this.inputs.colour:
								this.background.style.background=`rgba(${this.colour=this.convert(value)},${this.alpha})`;
								break;
							case this.inputs.alpha:
								this.background.style.background=`rgba(${this.colour},${this.alpha=value/100})`;
								this.figure.classList.toggle(`light`,this.luminance>=128&&value<31);
								break;
							case this.inputs.radius:
								this.background.style.borderRadius=`${this.radius=value}px`;
								break;
						}
						if(page.storage&&target!==this.inputs.name)
							page.storage.setItem(target.id,value);
					}
				},1);
				this.load();
			},
			load(){
				if(page.storage)
					for(let key in this.inputs)
						if(this.inputs.hasOwnProperty(key))
							if(page.storage[`png-${key}`]){
								this.inputs[key].value=page.storage[`png-${key}`];
								this.inputs[key].dispatchEvent(new Event(`input`));
							}
				let name=page.params.get`edit`;
				if(name&&icons.list[name])
					this.open(name);
			},
			open(name){
				clearTimeout(this.timer);
				this.name=name;
				this.path.setAttribute(`d`,icons.list[name].path[page.font]);
				this.inputs.name.value=name;
				this.dialog.showModal();
				this.dialog.classList.remove(`oz`,`pen`);
			},
			close(value){
				this.dialog.classList.add(`oz`,`pen`);
				this.timer=setTimeout(_=>this.dialog.close(value),225);
			},
			convert:hex=>[((hex=parseInt(hex.length===3?hex.replace(/./g,c=>c+c):hex,16))>>16)&255,(hex>>8)&255,hex&255],
			test:([r,g,b])=>(r*299+g*587+b*114)/1000,
			download(){
				this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
				this.canvas.height=this.canvas.width=this.dimensions;
				if(this.alpha){
					this.context.fillStyle=`rgba(${this.colour},${this.alpha})`;
					this.context.moveTo(this.radius,0);
					this.context.arcTo(this.dimensions,0,this.dimensions,this.dimensions,this.radius);
					this.context.arcTo(this.dimensions,this.dimensions,0,this.dimensions,this.radius);
					this.context.arcTo(0,this.dimensions,0,0,this.radius);
					this.context.arcTo(0,0,this.dimensions,0,this.radius);
					this.context.fill();
				}
				let img=new Image();
				img.src=w.URL.createObjectURL(new Blob([this.xml.serializeToString(this.svg)],{type:`image/svg+xml;charset=utf-8`}));
				img.addEventListener(`load`,_=>{
					this.context.drawImage(img,this.padding,this.padding);
					w.URL.revokeObjectURL(img.src);
					this.canvas.toBlob(blob=>{
						page.download(w.URL.createObjectURL(blob),`${this.inputs.name.value}.png`);
						w.URL.revokeObjectURL(page.anchor.href);
					});
				},0);
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