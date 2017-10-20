{
	/** VERSION **/
	let 	v={
			light:`0.2.63`,
			regular:`2.0.46`
		};
	/** FUNCTIONS **/
	const 	$=i=>d.getElementById(i),
		Q=s=>d.querySelector(s),
	/** CONSTANTS **/
		w=window,
		d=document,
		u=new URL(w.location),
		a=`${u.protocol}\/\/${u.host+u.pathname}`,
		s=`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="`,
	/** ELEMENTS **/
		h=d.documentElement,
		b=d.body,
		c=Q`meta[name=theme-color]`,
		f=$`filter`,
		i=$`icons`,
		m=$`content`,
		o=$`load`,
	/** PAGE **/
		page={
			params:u.searchParams,
			header:$`header`,
			heading:i.querySelector`h2`,
			message:$`message`,
			textarea:d.createElement`textarea`,
		/** SET UP **/
			init(){
				this.light=this.params.get`font`===`light`;
				this.font=this.light?`light`:`regular`;
				b.classList.add(this.prefix=this.light?`mdil`:`mdi`);
				v=v[this.font];
				try{
					this.storage=localStorage;
				}catch(e){
					console.log(`localStorage not available. Favourites disabled`);
					page.alert`Favourites not available.`;
					delete categories.list.favourites;
					for(let x in favourites)
						if(x!==`actions`)
							delete favourites[x];
					info.actions.favourite.remove();
					delete info.actions.favourite;
				}
				if(this.light)
					$`fab`.remove();
				this.textarea.classList.add(`ln`,`pa`);
				categories.init();
				v=+v.replace(/\./g,``);
				contributors.init();
				if(this.storage)
					favourites.init();
				icons.init();
				menu.init();
				filter.init();
				info.init();
				m.addEventListener(`click`,event=>{
					let 	target=event.target,
						parent=target.parentNode,
						current=m.querySelector`article.active`;
					switch(target.nodeName.toLowerCase()){
						case`h2`:
							if(parent!==i)
								page.copy(`${a}?${page.light?`font=light&`:``}section=${parent.dataset.name}${u.hash}`,`Link`);
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
					o.classList.add`oz`;
					o.classList.add`pen`;
					m.classList.remove`oz`;
					setTimeout(_=>
						o.remove()
					,375);
				},10);
			},
		/** TOAST NOTIFICATIONS **/
			alert(msg){
				if(this.timer)
					clearTimeout(this.timer);
				this.message.firstChild.nodeValue=msg;
				this.message.classList.remove`oz`;
				this.timer=setTimeout(_=>
					this.message.classList.add`oz`
				,5000);
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
			get:(file,data)=>fetch(`json/${file}.json`).then(resp=>
						resp.json()
					).catch(err=>{
						console.log(err);
						page.alert(`Failed to load ${data}.`);
					})
		},
	/** MENU **/
		menu={
			show:0,
			fns:{},
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
				this.sections.before(this.switch);
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
						case favourites.actions.import:
							favourites.import();
							break;
						case favourites.actions.export:
							favourites.export();
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
					this.cx=event.touches[0].clientX;
					if(([m,b].includes(event.target)&&!this.show&&this.cx<=50)||(this.show&&this.cx>this.width)){
						this.touchstart();
						d.addEventListener(`touchmove`,this.fns.move=event=>{
							let cx=event.touches[0].clientX-this.cx;
							this.nav.style.background=`rgba(0,0,0,${Math.min((cx+(this.show?285.185:0))/285.185*.54,.54)})`;
							this.menu.style.left=`${this.show?Math.min(Math.max(cx,-this.width),0):Math.min(Math.max(cx,this.width-this.width)-this.width,0)}px`;
							this.menu.style.boxShadow=`0 14px 28px rgba(0,0,0,${Math.min((cx+(this.show?500:0))/500*.25,.25)}),0 10px 10px rgba(0,0,0,${Math.min((cx+(this.show?545.545:0))/545.545*.22,.22)})`;
							event.stopPropagation();
						},0);
						d.addEventListener(`touchend`,this.fns.end=event=>
							this.touchend(this.show?this.cx-event.changedTouches[0].clientX:event.changedTouches[0].clientX-this.cx),0
						);
						event.stopPropagation();
					}
				},0);
			},
			toggle(){
				this.nav.dataset.show=(this.show=!this.show).toString();
				this.show?b.addEventListener(`keydown`,this.fns.close=event=>{
					if(event.keyCode===27)
						this.toggle();
				},0):b.removeEventListener(`keydown`,this.fns.close);
			},
			goto(section){
				if(this.timer)
					clearInterval(this.timer);
				let 	to=section.offsetTop-page.header.offsetHeight,
					top=m.scrollTop,
					step=(to-top)/20;
				this.timer=setInterval(_=>
					Math.round(top)===Math.round(to)?clearInterval(this.timer):m.scrollTop=(top+=step)
				,10);
			},
			touchstart(){
				b.classList.add`dragging`;
				this.nav.style.transition=this.menu.style.transition=`none`;
			},
			touchend(cx){
				d.removeEventListener(`touchmove`,this.fns.move);
				d.removeEventListener(`touchend`,this.fns.end);
				this.nav.removeAttribute`style`;
				this.menu.removeAttribute`style`;
				if(cx>=this.width/2)
					this.toggle();
				b.classList.remove`dragging`;
			}
		},
	/** FILTERS **/
		filter={
			categories:page.params.get`categories`,
			contributors:page.params.get`contributors`,
			text:page.params.get`filter`||``,
			button:f.nextElementSibling,
			link:i.firstElementChild,
			error:i.querySelector`p`,
			init(){
				this.categories=new Set(this.categories?this.categories.split`,`:[]);
				if(this.categories.size){
					menu.categories.previousElementSibling.classList.add`open`;
					for(let x of this.categories)
						categories.list[x].item.classList.add`active`;
				}
				this.contributors=new Set(this.contributors?this.contributors.split`,`:[]);
				if(this.contributors.size){
					menu.contributors.previousElementSibling.classList.add`open`;
					for(let x of this.contributors)
						contributors.list[x].item.classList.add`active`;
				}
				if(this.text)
					this.text=(f.value=this.text.toLowerCase()).replace(/\+/g,`%2b`);
				if(this.categories.size+this.contributors.size+this.text.length)
					filter.apply();
				f.addEventListener(`input`,_=>{
					if(this.timer)
						clearTimeout(this.timer);
					this.timer=setTimeout(_=>{
						this.text=f.value.toLowerCase().replace(/\+/g,`%2b`);
						this.apply();
					},50);
				},0);
				this.button.addEventListener(`click`,_=>{
					f.focus();
					if(this.text){
						f.value=``;
						f.dispatchEvent(new Event(`input`));
					}
				},0);
				this.link.addEventListener(`click`,_=>
					page.copy(this.url,`Link`)
				,0);
			},
			apply(){
				if(m.scrollTop<i.offsetTop-page.header.offsetHeight)
					menu.goto(i);
				i.dataset.filtered=(this.filtered=!!this.text||!!this.categories.size||!!this.contributors.size).toString();
				this.link.firstChild.nodeValue=this.filtered?`Search Results`:`All Icons`;
				let 	words=this.text&&this.text.split(/[\s\-]/),
					match=0,
					check,icon,article;
				for(let key in icons.list)
					if(icons.list.hasOwnProperty(key)&&(article=(icon=icons.list[key]).article)){
						check=true;
						if(this.categories.size)
							check=icon.categories&&icon.categories.some(x=>
								this.categories.has(x)
							);
						if(this.contributors.size)
							check=check&&icon.contributor&&this.contributors.has(icon.contributor[page.font]);
						if(this.text)
							check=check&&words.every(word=>
								icon.keywords.some(item=>
									item.startsWith(word)
								)
							);
						article.classList.toggle(`dn`,!check);
						match=match||check;
					}
				this.error.classList.toggle(`dn`,match);
				this.link.classList.toggle(`pen`,!this.filtered||!match);
				if(this.filtered){
					this.url=`${a}?`;
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
					if(m.scrollTop<i.offsetTop-page.header.offsetHeight)
						m.scrollTop=i.offsetTop-page.header.offsetHeight
				}
			}
		},
	/** FAVOURITES **/
		favourites={
			actions:{},
			anchor:d.createElement`a`,
			input:d.createElement`input`,
			favourite:0,
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
				this.favourite=!this.favourite;
				info.actions.favourite.dataset.icon=String.fromCharCode(`0x${this.favourite?`f0c6`:`f0c5`}`);
				info.actions.favourite.firstChild.nodeValue=`${this.favourite?`Remove from`:`Add to`} Favourites`;
				let msg=`added to`;
				if(this.favourite){
					page.storage.setItem(`mdi-${name}`,1);
					this.section.append(this.icon.favourite=this.icon.article.cloneNode(1));
					this.icon.favourite.classList.remove`active`;
					if(this.array)
						this.array.push(`mdi-${name}`);
					if(this.articles.length>1)
						this.sort();
				}else{
					page.storage.removeItem(`mdi-${name}`);
					this.icon.favourite.remove();
					delete this.icon.favourite;
					if(this.array)
						this.array=this.array.filter(item=>
							item!==`mdi-${name}`
						);
					msg=`removed from`;
				}
				page.alert(`${name} ${msg} favourites.`);
			},
			sort(){
				let articles=[...this.articles];
				articles.sort((a,b)=>
					a.lastChild.nodeValue<b.lastChild.nodeValue?1:-1
				);
				while(this.heading.nextElementSibling)
					this.section.lastChild.remove();
				articles.forEach(item=>
					this.section.insertBefore(item,this.heading.nextElementSibling)
				);
			},
			import(){
				b.append(this.input);
				this.input.click();
			},
			load(event){
				let msg=`complete`;
				try{
					(this.array=atob(event.target.result).split`,`).forEach(item=>{
						let name=item.substr(4);
						this.icon=icons.list[name];
						if(this.icon){
							if(this.icon.article&&!this.icon.favourite){
								page.storage.setItem(item,1);
								this.section.append(this.icon.favourite=this.icon.article.cloneNode(1));
								if(info.current===name){
									this.favourite=1;
									info.actions.favourite.dataset.icon=`\uf0c6`;
									info.actions.favourite.firstChild.nodeValue=`Remove from Favourites`;
								}
							}
						}else page.storage.removeItem(item);
					});
					if(this.articles.length>1)
						this.sort();
				}catch(err){
					console.log(err);
					msg=`failed`;
				}
				page.alert(`Import ${msg}.`);
				this.input.value=``;
				this.input.remove();
			},
			export(){
				this.anchor.href=`data:text/plain;base64,${btoa(btoa(this.array?this.array.join`,`:Object.keys(page.storage).join`,`))}`;
				this.anchor.download=`mdi-favourites.txt`;
				this.anchor.click();
			}
		},
	/** SIDEBAR **/
		info={
			aside:$`info`,
			heading:$`name`,
			figure:$`preview`,
			img:d.createElement`img`,
			input:$`slider`,
			copy:1,
			actions:{
				favourite:Q`#actions>:first-child`,
				downloads:{
					svg:Q`#actions>[data-type=svg]`,
					xaml:Q`#actions>[data-type=xaml]`,
					xml:Q`#actions>[data-type=xml]`
				},
				path:Q`#actions>[data-confirm=Path]`,
				icon:Q`#actions>[data-confirm=Icon]`,
				hex:Q`#actions>[data-confirm="Code point"]`,
				entity:Q`#actions>[data-confirm=Entity]`,
				css:Q`#actions>[data-confirm=CSS]`,
				js:Q`#actions>[data-confirm=JavaScript]`,
				html:Q`#actions>[data-confirm=HTML]`,
				url:Q`#actions>[data-confirm=Link]`,
				link:Q`#actions>:last-child`
			},
			anchor:d.createElement`a`,
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
						case this.actions.downloads.svg:
							this.type=`svg`;
							this.download();
							break;
						case this.actions.downloads.xaml:
							this.type=`xaml`;
							this.download();
							break;
						case this.actions.downloads.xml:
							this.type=`xml`;
							this.download();
							break;
						case this.actions.path:
							if(this.path[page.font])
								page.copy(target.dataset.copy,target.dataset.confirm);
							else page.alert`Not yet available.`;
							break;
						case this.actions.link:
							if(this.aside.dataset.retired===`false`)
								w.location.href=target.dataset.url;
							else page.alert`No longer available.`;
							break;
						default:
							if(target.parentNode===this.actions.link.parentNode)
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
				favourites.favourite=this.icon.favourite;
				let hex=this.icon.hex;
				this.name=this.heading.firstChild.nodeValue=name;
				this.path=this.icon.path[page.font];
				if(page.storage){
					this.actions.favourite.dataset.icon=String.fromCharCode(`0x${favourites.favourite?`f0c6`:`f0c5`}`);
					this.actions.favourite.firstChild.nodeValue=`${favourites.favourite?`Remove from`:`Add to`} Favourites`;
				}
				this.actions.url.dataset.copy=`${a}?icon=${name}${u.hash}`;
				this.actions.html.dataset.copy=`<span class="${page.prefix}-${name}"></span>`;
				this.actions.link.dataset.url=`https://materialdesignicons.com/icon/${name}/`;
				if(page.light)
					this.actions.link.dataset.url+=`light/`;
				this.img.src=`data:image/svg+xml;utf8,${s+this.path}"/></svg>`;
				this.aside.dataset.nocopy=(!(this.copy=!!hex)).toString();
				this.aside.dataset.nodownload=(!this.path).toString();
				this.aside.dataset.retired=(!!this.icon.retired).toString();
				this.actions.path.dataset.copy=this.path;
				this.actions.icon.dataset.copy=hex?String.fromCharCode(`0x${hex}`):`\xa0`;
				this.actions.hex.dataset.copy=hex;
				this.actions.entity.dataset.copy=`&#x${hex};`;
				this.actions.css.dataset.copy=`\\${hex}`;
				this.actions.js.dataset.copy=`\\u${hex}`;
			},
			download(){
				if(icons.list[this.name]){
					if(this.path){
						switch(this.type){
							case`svg`:
								this.anchor.href=`data:text/svg+xml;utf8,${s+this.path}"/></svg>`;
								break;
							case`xaml`:
								this.anchor.href=`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="24" Height="24"><Path Data="${this.path}"/></Canvas>`;
								break;
							case`xml`:
								this.anchor.href=`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="24dp" android:width="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#000" android:pathData="${this.path}"/></vector>`;
								break;
							default:
								page.alert`Unknown file type.`;
								break;
						}
						this.anchor.download=`${this.name}.${this.type}`;
						this.anchor.click();
					}else page.alert`Download not available.`;
				}else page.alert`Icon not found.`;
			},
			toggle(){
				this.aside.dataset.show=(this.show=!this.show).toString();
				c.content=`#${this.show?`ff5722`:`2196f3`}`;
				if(this.show)
					b.addEventListener(`keydown`,this.close=event=>{
						if(event.keyCode===27)
							this.toggle();
					},0);
				else{
					let current=m.querySelector`article.active`;
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
				for(let key in this.list)
					if(this.list.hasOwnProperty(key)){
						if(!this.list[key].section)
							this.list[key].count=icons.array.filter(x=>
								x.path[page.font]&&x.categories&&x.categories.includes(key)
							).length;
						this.add(key);
					}
			},
			add(key){
				let 	category=this.list[key],
					section=this.section.cloneNode(0),
					heading=this.heading.cloneNode(1),
					item=this.item.cloneNode(1),
					name=category.name.replace(`{v}`,v);
				if(!page.light||!category.section||key===`favourites`){
					if(category.section){
						section.dataset.name=key;
						heading.firstChild.nodeValue=name;
						section.append(heading);
						i.before(category.section=section);
					}
					if(category.section||category.count){
						item.firstChild.nodeValue=name;
						if(category.count)
							item.firstChild.nodeValue+=` (${category.count})`;
						item.dataset.category=key;
						item.dataset.icon=String.fromCharCode(`0x${category.hex}`);
						menu[category.section?`sections`:`categories`].append(category.item=item);
						if(key===`favourites`){
							item=item.cloneNode(1);
							delete item.dataset.category;
							item.dataset.action=`import`;
							item.dataset.icon=`\uf220`;
							item.firstChild.nodeValue=`Import Favourites`;
							menu.sections.append(favourites.actions.import=item);
							item=item.cloneNode(1);
							item.dataset.action=`export`;
							item.dataset.icon=`\uf21d`;
							item.firstChild.nodeValue=`Export Favourites`;
							menu.sections.append(favourites.actions.export=item);
						}
					}
				}else delete category.section;
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
					if(this.list.hasOwnProperty(key)){
						this.list[key].count=icons.array.filter(x=>
							x.path[page.font]&&x.contributor&&x.contributor[page.font]&&x.contributor[page.font]===key
						).length;
						this.add(key);
					}
			},
			add(key){
				let 	contributor=this.list[key],
					image=contributor.image,
					img=this.img.cloneNode(1),
					item=this.item.cloneNode(1);
				if(contributor.count){
					item.dataset.contributor=key;
					item.dataset.icon=image?``:`\uf004`;
					if(image){
						delete item.dataset.icon;
						img.src=`data:image/png;base64,${image}`;
						item.prepend(img);
					}else img.remove();
					item.lastChild.nodeValue=`${contributor.name} (${contributor.count})`;
					menu.contributors.append(contributor.item=item);
				}
			}
		},
	/** ICONS **/
		icons={
			article:d.createElement`article`,
			span:d.createElement`span`,
			img:d.createElement`img`,
			init(){
				delete this.array;
				this.article.classList.add(`cp`,page.light?`fwl`:`fwm`,`oh`,`pr`,`toe`,`wsnw`);
				this.article.append(d.createTextNode``);
				this.span.classList.add(`ripple`,`db`,`pa`,`pen`);
				this.img.classList.add(`pa`,`pen`);
				this.img.height=this.img.width=24;
				for(let key in this.list)
					if(this.list.hasOwnProperty(key)&&this.list[key].path[page.font])
						this.add(key);
			},
			add(key){
				let 	icon=this.list[key],
					article=this.article,
					img=this.img,
					hex=icon.hex,
					sections=categories.list,
					keywords=new Set(key.split`-`),
					section;
				if(icon.aliases)
					icon.aliases.forEach(x=>
						x.split`-`.forEach(x=>
							keywords.add(x)
						)
					);
				if(icon.keywords)
					icon.keywords.forEach(x=>
						keywords.add(x)
					);
				icon.keywords=[...keywords].sort();
				article.dataset.icon=hex?String.fromCharCode(`0x${hex}`):``;
				if(!hex){
					img.src=`data:image/svg+xml;utf8,${s+icon.path[page.font]}"/></svg>`;
					article.prepend(img);
				}else img.remove();
				article.lastChild.nodeValue=key;
				if((section=favourites.section)&&page.storage[`mdi-${key}`])
					section.append(icon.favourite=article.cloneNode(1));
				if((section=sections.new.section)&&icon.added&&icon.added[page.font]===v)
					section.append(article.cloneNode(1));
				if((section=sections.updates.section)&&icon.updated&&icon.updated[page.font]===v)
					section.append(article.cloneNode(1));
				if((section=sections.soon.section)&&icon.added&&icon.added[page.font]===`{next}`)
					section.append(article.cloneNode(1));
				if((section=sections.retired.section)&&icon.retired)
					section.append(article.cloneNode(1));
				i.append(icon.article=article.cloneNode(1));
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
	page.get(`categories`,`category data`).then(json=>{
		categories.list=json;
		page.get(`contributors`,`contributor data`).then(json=>{
			contributors.list=json;
			page.get(`icons`,`icon data`).then(json=>{
				icons.array=Object.values(icons.list=json);
				page.init();
			});
		});
	});
}