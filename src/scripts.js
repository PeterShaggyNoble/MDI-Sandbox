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
				this.light=this.params.get`font`===`light`;
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
				editor.init();
				this.main.addEventListener(`click`,event=>{
					let 	target=event.target,
						parent=target.parentNode,
						current=this.main.querySelector`article.active`;
					switch(target.nodeName.toLowerCase()){
						case`h2`:
							if(!page.storage||parent!==categories.list.favourites.section)
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
				w.URL.revokeObjectURL(this.anchor.href);
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
			}),
			loadjs:url=>{
				let script=C`script`;
				script.async=1;
				script.src=url;
				b.append(script);
				return new Promise((resolve,reject)=>{
					script.addEventListener(`load`,resolve,0);
					script.addEventListener(`error`,reject,0);
				});
			}
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
						setTimeout(_=>
							this.goto(section)
						,225);
				}
				this.nav.addEventListener(`click`,event=>{
					let target=event.target;
					target.blur();
					switch(target){
						case this.nav:
							if(!page.wide)
								this.toggle();
							break;
						case this.header:
							this.toggle();
							break;
						case this.switch:
							w.location.href=page.light?`./`:`?font=light`;
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
				if(!page.wide)
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
			heading:page.section.firstElementChild.firstChild,
			error:page.section.querySelector`p`,
			init(){
				this.button=this.input.nextElementSibling;
				menu.sections.append(this.clearall=C`li`);
				this.clearall.classList.add`cp`;
				this.clearall.dataset.icon=`\uf03b`;
				this.clearall.tabIndex=-1;
				this.clearall.append(T`All Icons`);
				if(this.categories=page.params.get`categories`){
					menu.categories.previousElementSibling.classList.add`open`;
					for(let key of this.categories=new Set(this.categories.split`,`))
						categories.list[key].item.classList.add`active`;
				}else this.categories=new Set();
				if(this.contributors=page.params.get`contributors`){
					menu.contributors.previousElementSibling.classList.add`open`;
					for(let key of this.contributors=new Set(this.contributors.split`,`))
						contributors.list[key].item.classList.add`active`;
				}else this.contributors=new Set();
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
			menu:C`ul`,
			item:C`li`,
			actions:{},
			input:C`input`,
			reader:new FileReader(),
			init(){
				this.menu.classList.add(`export`,`oh`,`pa`);
				this.menu.tabIndex=-1;
				this.item.classList.add(`cp`,`fwm`,`pr`,`wsnw`);
				this.item.append(T``);
				this.additem(`svg`,`\uf6b1`,`Download SVG`);
				this.additem(`html`,`\uf421`,`Download HTML`);
				this.additem(`import`,`\uf220`,`Import Favourites`);
				this.additem(`export`,`\uf21d`,`Export Favourites`);
				this.additem(`clear`,`\uf1c0`,`Clear Favourites`);
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
				this.heading.nextElementSibling.before(this.menu);
				this.articles=this.section.getElementsByTagName`article`;
				this.menu.addEventListener(`click`,event=>{
					switch(event.target){
						case this.actions.svg:
							this.menu.blur();
							page.download(`data:text/svg+xml;utf8,<svg><defs>${this.build()}</defs></svg>`,`mdi-favourites.svg`);
							break;
						case this.actions.html:
							this.menu.blur();
							page.download(`data:text/html;utf8,<link rel="import" href="../bower_components/iron-iconset-svg/iron-iconset-svg.html"><iron-iconset-svg name="mdi" iconSize="24"><svg><defs>${this.build()}</defs></svg></iron-iconset-svg>`,`mdi-favourites.html`);
							break;
						case this.actions.import:
							b.append(this.input);
							this.menu.blur();
							this.input.click();
							break;
						case this.actions.export:
							this.menu.blur();
							page.download(`data:text/plain;base64,${btoa(btoa(Object.keys(page.storage).filter(key=>key.startsWith`mdi-`).join`,`))}`,`mdi-favourites.txt`);
							break;
						case this.actions.clear:
							let icon;
							for(let key in page.storage)
								if(page.storage.hasOwnProperty(key))
									if(key.startsWith`mdi-`){
										page.storage.removeItem(key);
										if((icon=icons.list[key.substr(4)])&&icon.articles.favourite){
											icon.articles.favourite.remove();
											delete icon.articles.favourite;
										}
									}
							this.menu.blur();
							page.alert`Favourites cleared.`;
							break;
					}
				},0);
			},
			additem(key,codepoint,text){
				this.menu.append(this.actions[key]=this.item.cloneNode(1));
				this.actions[key].dataset.icon=codepoint;
				this.actions[key].firstChild.nodeValue=text;
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
				[...this.articles].sort((first,second)=>
					first.lastChild.nodeValue>second.lastChild.nodeValue?1:-1
				).forEach(article=>
					this.section.append(this.section.removeChild(article))
				);
			},
			build:_=>Object.keys(page.storage).map((key,path)=>
				key.startsWith`mdi-`&&icons.list[key=key.substr(4)]&&(path=icons.list[key].path[page.font])?`<g id="${key}"><path d="${path}"/></g>`:``
			).join``,
			load(event){
				let msg=`complete`;
				try{
					atob(event.target.result).split`,`.forEach(item=>{
						let name=item.substr(4);
						this.icon=icons.list[name];
						if(this.icon){
							if(this.icon.articles.main&&!this.icon.articles.favourite){
								page.storage.setItem(item,1);
								this.section.append(this.icon.articles.favourite=this.icon.articles.main.cloneNode(1));
								if(info.name===name){
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
			xml:new XMLSerializer(),
			actions:{
				favourite:Q`#actions>:first-child`,
				export:Q`#actions>:nth-child(2)`,
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
				this.figure.append(this.svg=N`svg`);
				this.svg.classList.add`pa`;
				this.svg.setAttribute(`height`,112);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,112);
				this.svg.append(this.path=N`path`);
				let icon=page.params.get`icon`||page.params.get`edit`;
				if(icon){
					if(icons.list[icon]){
						this.open(icon);
						Object.values(icons.list[icon].articles)[0].classList.add`active`;
					}
				}else if(page.wide)
					this.open(Object.keys(icons.list)[0]);
				this.aside.addEventListener(`click`,event=>{
					let target=event.target;
					switch(target){
						case this.aside:
						case this.heading:
							if(!page.wide)
								this.toggle();
							break;
						case this.actions.favourite:
							favourites.set(this.name);
							break;
						case this.actions.export:
							this.data?editor.open(this.name):page.alert`Not yet available.`;
							break;
						case this.actions.path:
							this.data?page.copy(target.dataset.copy,target.dataset.confirm):page.alert`Not yet available.`;
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
			},
			open(name){
				this.icon=icons.list[this.name=this.heading.firstChild.nodeValue=name];
				this.data=this.actions.path.dataset.copy=this.icon.path[page.font];
				let codepoint=this.actions.codepoint.dataset.copy=this.icon.codepoint;
				this.aside.dataset.nocopy=(!(this.copy=!!codepoint)).toString();
				this.aside.dataset.retired=(!!this.icon.retired&&this.icon.retired!==`{soon}`).toString();
				this.downloads={
					svg:`data:text/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="${this.data}"/></svg>`,
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
				page.wide?this.path.classList.add`oz`:this.toggle();
				setTimeout(_=>{
					this.path.setAttribute(`d`,this.data);
					if(page.wide)
						this.path.classList.remove`oz`;
				},page.wide&&195);
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
						if(event.keyCode===27&&!editor.dialog.open){
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
			paragraph:C`p`,
			item:C`li`,
			init(){
				this.section.classList.add(`dg`,`pr`);
				this.heading.classList.add(`oh`,`ps`);
				this.heading.append(T``);
				this.paragraph.classList.add`fwm`;
				this.paragraph.append(T`No icons available in this section.`);
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
					if(key===`favourites`)
						section.id=`favourites`;
					heading.firstChild.nodeValue=name;
					section.append(heading);
					section.append(this.paragraph.cloneNode(1));
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
				}else delete this.list[key];
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
				}else delete this.list[key];
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
				this.svg.classList.add(`db`,`pen`);
				this.svg.setAttribute(`height`,24);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,24);
				this.svg.append(N`path`);
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))
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
				}else delete this.list[key];
			}
		},
	/** EDITOR **/
		editor={
			dialog:Q`dialog`,
			background:C`span`,
			canvas:C`canvas`,
			xml:new XMLSerializer(),
			settings:{},
			inputs:{
				fill:$`png-fill`,
				opacity:$`png-opacity`,
				padding:$`png-padding`,
				colour:$`png-colour`,
				alpha:$`png-alpha`,
				radius:$`png-radius`,
				format:$`png-format`,
				name:$`png-name`,
				size:$`png-size`
			},
			init(){
				this.menu=this.dialog.querySelector`ul`;
				if(page.storage){
					this.input=C`input`;
					this.reader=new FileReader();
					this.import=this.menu.firstElementChild;
					this.export=this.menu.querySelector`li+li`;
					this.clear=this.menu.lastElementChild;
					this.input.accept=`.txt,text/plain`;
					this.input.classList.add(`ln`,`pa`);
					this.input.type=`file`;
					this.input.addEventListener(`change`,_=>{
						if(this.input.files[0].type===`text/plain`)
							this.reader.readAsText(this.input.files[0]);
					},0);
					this.reader.addEventListener(`load`,event=>{
						let msg=`complete`;
						try{
							atob(event.target.result).split`,`.forEach(entry=>{
								entry=entry.split`:`;
								let key=entry[0];
								if(this.inputs[key.substr(4)])
									page.storage.setItem(key,entry[1]);
							});
						}catch(error){
							console.log(error);
							msg=`failed`;
						}
						page.alert(`Import ${msg}.`);
						this.input.value=``;
						this.input.remove();
						this.set();
					},0);
				}else this.menu.remove();
				this.context=this.canvas.getContext`2d`;
				this.save=this.dialog.lastElementChild;
				this.cancel=this.save.previousElementSibling;
				this.figure=this.dialog.querySelector`figure`;
				this.background.classList.add(`pa`,`pen`);
				this.figure.append(this.background,this.horizontal=this.background.cloneNode(1),this.vertical=this.background.cloneNode(1),this.svg=N`svg`);
				this.svg.classList.add`pa`;
				this.svg.setAttribute(`height`,24);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				this.svg.setAttribute(`width`,24);
				this.svg.append(this.path=N`path`);
				this.dialog.addEventListener(`click`,event=>{
					let target=event.target;
					switch(target){
						case this.import:
							b.append(this.input);
							this.menu.blur();
							this.input.click();
							break;
						case this.export:
							this.menu.blur();
							page.download(`data:text/plain;base64,${btoa(btoa(Object.entries(page.storage).filter(entry=>entry[0].startsWith`png-`).map(item=>item.join`:`).join`,`))}`,`mdi-settings.txt`);
							break;
						case this.clear:
							for(let key in page.storage)
								if(page.storage.hasOwnProperty(key))
									if(key.startsWith`png-`)
										page.storage.removeItem(key);
							this.menu.blur();
							this.set();
							this.inputs.name.value=this.name;
							page.alert`Settings cleared.`;
							break;
						case this.cancel:
							this.close(0);
							break;
						case this.save:
							(this.settings.format=this.inputs.format.value)!==`png`?this.downloadxml():this.downloadpng();
							break;
					}
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
								this.svg.setAttribute(`height`,this.settings.size=parseInt(value));
								this.svg.setAttribute(`width`,this.settings.size);
								if(this.settings.padding>(this.inputs.padding.max=(256-this.settings.size)/2))
									this.settings.padding=this.inputs.padding.value=parseInt(this.inputs.padding.max);
								this.background.style.height=this.background.style.width=this.horizontal.style.height=this.vertical.style.width=`${this.dimensions=this.settings.size+2*this.settings.padding}px`;
								if(this.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.settings.radius=this.inputs.radius.value=parseInt(this.inputs.radius.max)}px`;
								break;
							case this.inputs.fill:
								this.path.setAttribute(`fill`,`#${this.settings.fill=value.toLowerCase()}`);
								this.figure.classList.toggle(`light`,(this.luminance=this.test(this.convert(value)))>=128&&this.settings.alpha<.31);
								break;
							case this.inputs.opacity:
								this.path.setAttribute(`fill-opacity`,this.settings.opacity=value/100);
								break;
							case this.inputs.padding:
								this.background.style.height=this.background.style.width=this.horizontal.style.height=this.vertical.style.width=`${this.dimensions=this.settings.size+2*(this.settings.padding=parseInt(value))}px`;
								if(this.settings.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.settings.radius=this.inputs.radius.value=this.inputs.radius.max}px`;
								break;
							case this.inputs.colour:
								this.background.style.backgroundColor=`#${this.settings.colour=value}`;
								break;
							case this.inputs.alpha:
								this.background.style.opacity=this.settings.alpha=value/100;
								this.figure.classList.toggle(`light`,this.luminance>=128&&value<31);
								break;
							case this.inputs.radius:
								this.background.style.borderRadius=`${this.settings.radius=parseInt(value)}px`;
								break;
						}
						if(page.storage&&target!==this.inputs.name)
							page.storage.setItem(target.id,value);
					}
				},1);
				this.set();
				let name=page.params.get`edit`;
				if(name&&icons.list[name])
					this.open(name);
			},
			set(){
				for(let key in this.inputs)
					if(this.inputs.hasOwnProperty(key)&&key!=="name"){
						if(page.storage){
							this.inputs[key].value=page.storage[`png-${key}`]||this.inputs[key].getAttribute`value`||this.inputs[key].firstElementChild.getAttribute`value`;
							this.inputs[key].dispatchEvent(new Event(`input`));
						}else this.settings[key]=this.inputs[key].getAttribute`value`||this.inputs[key].firstElementChild.getAttribute`value`;
					}
			},
			open(name){
				clearTimeout(this.timer);
				this.name=this.inputs.name.value=name;
				this.path.setAttribute(`d`,this.data=icons.list[name].path[page.font]);
				this.dialog.showModal();
				this.dialog.classList.remove(`oz`,`pen`);
				b.addEventListener(`keydown`,this.fn=event=>{
					if(event.keyCode===27){
						this.close(0);
						event.preventDefault();
						event.stopPropagation();
					}
				},0);
			},
			close(value){
				b.removeEventListener(`keydown`,this.fn);
				this.dialog.classList.add(`oz`,`pen`);
				this.timer=setTimeout(_=>this.dialog.close(value),225);
			},
			downloadpng(){
				this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
				this.canvas.height=this.canvas.width=this.dimensions;
				if(this.settings.alpha){
					this.context.fillStyle=`rgba(${this.convert(this.settings.colour)},${this.settings.alpha})`;
					this.context.beginPath();
					this.context.moveTo(this.settings.radius,0);
					this.context.arcTo(this.dimensions,0,this.dimensions,this.dimensions,this.settings.radius);
					this.context.arcTo(this.dimensions,this.dimensions,0,this.dimensions,this.settings.radius);
					this.context.arcTo(0,this.dimensions,0,0,this.settings.radius);
					this.context.arcTo(0,0,this.dimensions,0,this.settings.radius);
					this.context.closePath();
					this.context.fill();
				}
				let image=new Image();
				image.src=w.URL.createObjectURL(new Blob([this.xml.serializeToString(this.svg)],{type:`image/svg+xml;charset=utf-8`}));
				image.addEventListener(`load`,_=>{
					this.context.drawImage(image,this.settings.padding,this.settings.padding);
					w.URL.revokeObjectURL(image.src);
					this.canvas.toBlob(blob=>
						page.download(w.URL.createObjectURL(blob),`${this.inputs.name.value}.png`)
					);
				},0);
			},
			downloadxml(){
				let 	padding=this.settings.padding/this.settings.size*24,
					dimensions=24+2*padding,
					xml,data,arc,radius,issquare,iscircle;
				if(this.settings.alpha){
					radius=this.settings.radius/this.dimensions*dimensions;
					issquare=!radius;
					iscircle=radius===dimensions/2;
					data=`M${radius},0`;
					!iscircle&&(data+=`H${dimensions-radius}`);
					!issquare&&(data+=`${arc=`A${radius},${radius} 0 0 1 `}${dimensions},${radius}`);
					!iscircle&&(data+=`V${dimensions-radius}`);
					!issquare&&(data+=`${arc}${dimensions-radius},${dimensions}`);
					!iscircle&&(data+=`H${radius}`);
					!issquare&&(data+=`${arc}0,${dimensions-radius}`);
					!iscircle&&(data+=`V${radius}`);
					!issquare&&(data+=`${arc+radius},0`);
					data+=`Z`;
				}
				switch(this.inputs.format.value){
					case`svg`:
						xml=`data:text/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="${this.dimensions}" viewBox="0 0 ${dimensions} ${dimensions}" width="${this.dimensions}" xmlns="http://www.w3.org/2000/svg">`;
						if(this.settings.alpha){
							xml+=`<path fill="#${this.settings.colour}" `;
							if(this.settings.alpha<1)
								xml+=`fill-opacity="${this.settings.alpha}" `;
							xml+=`d="${data}"/>`;
						}
						xml+=`<path fill="#${this.settings.fill}" `;
						if(this.settings.opacity<1)
							xml+=`fill-opacity="${this.settings.opacity}" `;
						if(padding)
							xml+=`transform="translate(${padding},${padding})" `;
						xml+=`d="${this.data}"/></svg>`;
						break;
					case`xaml`:
						xml=`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="${this.dimensions}" Height="${this.dimensions}">`;
						if(this.settings.alpha){
							xml+=`<Path Fill="#${this.settings.fill}" `;
							if(this.settings.opacity<1)
								xml+=`Opacity="${this.settings.opacity}" `;
							if(this.dimensions>dimensions)
								xml+=`ScaleX="${this.dimensions/dimensions}" ScaleY="${this.dimensions/dimensions}" `;
							xml+=`Data="${data}"/>`;
						}
						xml+=`<Path `;
						if(this.settings.size>24)
							xml+=`ScaleX="${this.settings.size/24}" ScaleY="${this.settings.size/24}" `;
						if(this.settings.padding)
							xml+=`TranslateX="${this.settings.padding}" TranslateY="${this.settings.padding}" `;
						xml+=`Data="${this.data}"/></Canvas>`;
						break;
					case`xml`:
						xml=`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="${this.dimensions}dp" android:width="${this.dimensions}dp" android:viewportWidth="24" android:viewportHeight="24">`;
						if(this.settings.alpha){
							xml+=`<path android:fillColor="#${this.settings.colour}" `;
							if(this.settings.alpha<1)
								xml+=`android:fillOpacity="${this.settings.alpha}" `;
							xml+=`android:pathData="${data}"/>`;
						}
						xml+=`<path android:fillColor="#${this.settings.fill}" `;
						if(this.settings.opacity<1)
							xml+=`android:fillOpacity="${this.settings.opacity}" `;
						if(padding)
							xml+=`android:translateX="${padding}" android:translateY="${padding}" `;
						xml+=`android:pathData="${this.data}"/></vector>`;
						break;
				}
				page.download(xml,`${this.inputs.name.value}.${this.inputs.format.value}`);
			},
			convert:hex=>[((hex=parseInt(hex.length===3?hex.replace(/./g,c=>c+c):hex,16))>>16)&255,(hex>>8)&255,hex&255],
			test:([r,g,b])=>(r*299+g*587+b*114)/1000
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
	/** LOAD ANALYTICS **/
	page.loadjs`https://www.googletagmanager.com/gtag/js?id=UA-109147935-1`.catch(_=>
		console.log(`Failed to load Google Tag Manager.`)
	).then(_=>{
		w.dataLayer=w.dataLayer||[];
		let gtag=function(){w.dataLayer.push(arguments);};
		gtag(`js`,new Date());
		gtag(`config`,`UA-109147935-1`);
	});
}