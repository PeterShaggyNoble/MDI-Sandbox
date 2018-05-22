{
	let version={
		str:`2.3.54`,
		int:2354
	};
	const 	$=i=>d.getElementById(i),
		Q=s=>d.querySelector(s),
		C=e=>d.createElement(e),
		N=e=>d.createElementNS(`http://www.w3.org/2000/svg`,e),
		T=t=>d.createTextNode(t),
		d=document,
		h=d.documentElement,
		b=d.body,
		page={
			offline:navigator.onLine===false,
			packages:{},
			url:new URL(location),
			size:(b.offsetWidth>1199)+(b.offsetWidth>1499),
			anchor:C`a`,
			header:$`header`,
			main:$`content`,
			message:$`message`,
			section:$`icons`,
			textarea:C`textarea`,
			async init(){
				this.address=`${this.url.protocol}\/\/${this.url.host+this.url.pathname}`;
				this.params=this.url.searchParams;
				this.message.append(T``);
				try{
					this.storage=localStorage;
				}catch(_){
					this.alert`Your library is not available.`;
					for(let key in favourites)
						delete favourites[key];
					info.actions.library.remove();
					delete info.actions.library;
					Q`#content>aside`.remove();
				}
				this.textarea.classList.add(`ln`,`pf`);
				categories.init();
				contributors.init();
				icons.init();
				if(this.storage)
					favourites.init();
				menu.init();
				info.init();
				svgs.init();
				editor.init();
				if(this.size<2)
					this.load();
				else menu.menu.addEventListener(`transitionend`,this.fn=event=>{
					if(event.target===menu.menu){
						this.load();
						menu.menu.removeEventListener(event.type,this.fn);
					}
				},1);
				this.options=this.section.querySelector`ul`,
				this.actions={
					link:this.options.firstElementChild,
					php:this.options.lastElementChild
				};
				this.actions.json=this.actions.link.nextElementSibling;
				this.actions.svg=this.actions.json.nextElementSibling;
				this.actions.polymer=this.actions.php.previousElementSibling;
				this.actions.angular=this.actions.polymer.previousElementSibling;
				this.header.addEventListener(`click`,event=>{
					if(event.target.nodeName.toLowerCase()===`a`&&this.offline){
						this.alert`Could not connect.`;
						event.preventDefault();
					}
				},0);
				this.main.addEventListener(`click`,async event=>{
					let 	target=event.target,
						parent=target.parentNode,
						current=this.main.querySelector`article.active`;
					switch(target){
						case this.actions.angular:
							this.download(`data:text/svg+xml;utf8,<svg><defs>${filter.filtered?this.build(`angular`):this.packages.xml||(this.packages.xml=this.build(`angular`))}</defs></svg>`,`${filter.filtered?`mdi-custom`:`mdi`}.svg`);
							break;
						case this.actions.link:
							this.copy(filter.filtered&&filter.url?filter.url:`${this.address}?section=icons`,`Link`);
							break;
						case this.actions.json:
							this.download(`data:text/json;utf8,{${filter.filtered?this.build(`jsono`):this.packages.json||(this.packages.jsono=this.build(`jsono`))}}`,`${filter.filtered?`mdi-custom`:`mdi`}.json`);
							break;
						case this.actions.php:
							this.download(`data:text/php;utf8,`+(await this.getphp()).replace(/const library=\[\]/,`const library=[${filter.filtered?this.build(`php`):this.packages.php||(this.packages.php=this.build(`php`))}]`),`${filter.filtered?`mdi-custom`:`mdi`}.php`);
							break;
						case this.actions.polymer:
							this.download(`data:text/html;utf8,<link rel="import" href="../bower_components/iron-iconset-svg/iron-iconset-svg.html"><iron-iconset-svg name="mdi" size="24"><svg><defs>${filter.filtered?this.build(`polymer`):this.packages.xml||(this.packages.xml=this.build(`polymer`))}</defs></svg></iron-iconset-svg>`,`${filter.filtered?`mdi-custom`:`mdi`}.html`);
						case this.actions.svg:
							this.download(`data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs>${filter.filtered?this.build(`svg`):this.packages.xml||(this.packages.xml=this.build(`svg`))}</defs></svg>`,`${filter.filtered?`mdi-custom`:`mdi`}.svg`);
							break;
						default:
							switch(target.nodeName.toLowerCase()){
								case`svg`:
									if(parent.nodeName.toLowerCase()===`header`&&!target.classList.contains`trigger`)
										this.copy(`${this.address}?section=${parent.parentNode.id}`,`Link`);
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
					}
				},0);
			},
			load(){
				let 	loader=$`load`,
					section=this.params.get`section`,
					icon=this.params.get`edit`;
				if(section)
					if(section=$(section))
						menu.goto(section);
				filter.init();
				this.interval=setInterval(()=>{
					if(!menu.scroll){
						clearInterval(this.interval);
						loader.classList.add(`oz`,`pen`);
						loader.addEventListener(`transitionend`,this.fn=event=>{
							loader.remove();
							loader.removeEventListener(event.type,this.fn);
							if(!this.size)
								info.load();
							if(icon)
								if(icons.list[icon]||favourites.list[icon])
									editor.open(icon);
						},0);
					}
				},50);
			},
			alert(message){
				clearTimeout(this.timer);
				this.message.firstChild.nodeValue=message;
				this.message.classList.remove`oz`;
				this.timer=setTimeout(()=>
					this.message.classList.add`oz`
				,5000);
			},
			build:type=>Object.entries(icons.list).filter(([key,icon])=>
					icon.articles.main&&!icon.articles.main.classList.contains`dn`
			).map(([key,icon])=>
				type===`svg`?
					`<path id="mdi-${key}" d="${icon.data}"/>`:
					type===`angular`?
						`<g id="${key}"><path d="${icon.data}"/></g>`:
						`"${key}"${type===`php`?`=>`:`:`}"${icon.data}"`
			).join(type===`php`||type===`json`?`,`:`:`),
			async copy(string,message){
				try{
					await navigator.clipboard.writeText(string);
				}catch(_){
					editor.dialog.append(this.textarea);
					this.textarea.value=string;
					this.textarea.select();
					d.execCommand`cut`;
					this.textarea.remove();
				}
				if(message)
					this.alert(`${message} copied to clipboard.`);
			},
			download(data,name){
				this.anchor.href=data;
				this.anchor.download=name;
				b.append(this.anchor);
				this.anchor.click();
				this.anchor.remove();
				URL.revokeObjectURL(this.anchor.href);
			},
			getphp:async()=>page.php=page.php||(await(await fetch(`${page.address}libraries/mdi-php/mdi.php`)).text()).replace(/\n\/\* DELETE BELOW \*\/\n[\s\S]+?\n\/\* DELETE ABOVE \*\/\n\n|\/\*[\s\S]+?\*\/\n/g,``).replace(/const library=\[[\s\S]+?\]/,`const library=[]`)
		},
		svgs={
			path:N`path`,
			init(){
				this.nodes=d.querySelectorAll`svg[data-icons]`;
				this.nodes.forEach(svg=>{
					svg.setAttribute(`viewBox`,`0 0 24 24`);
					svg.dataset.icons.split`,`.forEach(path=>{
						svg.append(this.path=this.path.cloneNode(1));
						this.path.setAttribute(`d`,icons.list[path]?icons.list[path].data:icons.list["help-circle-outline"].data);
					});
					svg.removeAttribute`data-icons`;
				});
			}
		},
		menu={
			functions:{},
			scroll:0,
			show:0,
			categories:$`categories`,
			contributors:$`contributors`,
			highlight:$`highlight`,
			menu:$`menu`,
			nav:$`nav`,
			navicon:$`navicon`,
			sections:$`sections`,
			init(){
				this.nav.addEventListener(`click`,event=>{
					let 	target=event.target,
						articles,icon,key;
					target.blur();
					switch(target){
						case this.nav:
							if(page.size<2)
								this.toggle();
							break;
						case this.navicon:
							this.toggle();
							break;
						case this.highlight:
							b.classList.toggle`highlight`;
							if(page.size<2)
								this.toggle();
							break;
						case filter.clearall:
							filter.clear();
							if(page.size<2)
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
											if(page.size<2)
												this.toggle();
										}
										break;
									case this.categories:
										if(categories.list[category]){
											target.classList.toggle`active`;
											filter.categories[filter.categories.has(category)?`delete`:`add`](category);
											filter.apply(1);
										}
										break;
									case this.contributors:
										if(contributors.list[contributor]){
											target.classList.toggle`active`;
											filter.contributors[filter.contributors.has(contributor)?`delete`:`add`](contributor);
											filter.apply(1);
										}
										break;
								}
							}
					}
				},0);
				if(page.size===2)
					this.toggle();
				else d.addEventListener(`touchstart`,event=>
					this.touchstart(event)
				,0);
			},
			goto(section){
				this.scroll=1;
				clearInterval(this.timer);
				let 	to=section.offsetTop-(page.size?16:8)-page.header.offsetHeight,
					top=h.scrollTop,
					step=(to-top)/10;
				this.timer=setInterval(()=>
					Math.round(top)===Math.round(to)?clearInterval(this.timer,this.scroll=0):h.scrollTop=(top+=step)
				,10);
			},
			toggle(){
				b.classList.toggle(`menu`,this.show=!this.show);
				if(page.size<2)
					if(this.show)
						b.addEventListener(`keydown`,this.functions.close=event=>
							event.keyCode===27&&this.toggle()
						,0);
					else b.removeEventListener(`keydown`,this.functions.close);
			},
			touchend(clientx){
				d.removeEventListener(`touchmove`,this.functions.move);
				d.removeEventListener(`touchend`,this.functions.end);
				this.nav.removeAttribute`style`;
				this.menu.removeAttribute`style`;
				if(clientx>=this.width/2)
					this.toggle();
			},
			touchstart(event){
				this.width=this.menu.offsetWidth;
				this.clientx=event.touches[0].clientX;
				if(((event.target===page.main||event.target===b)&&!this.show&&this.clientx<=50)||(this.show&&this.clientx>this.width)){
					this.nav.style.transition=this.menu.style.transition=`none`;
					d.addEventListener(`touchmove`,this.functions.move=event=>{
					let clientx=event.touches[0].clientX-this.clientx;
					this.nav.style.background=`rgba(0,0,0,${Math.min((clientx+(this.show?285.185:0))/285.185*.54,.54)})`;
						this.menu.style.left=`${this.show?Math.min(Math.max(clientx,-this.width),0):Math.min(Math.max(clientx,0)-this.width,0)}px`;
						this.menu.style.boxShadow=`0 14px 28px rgba(0,0,0,${Math.min((clientx+(this.show?500:0))/500*.25,.25)}),0 10px 10px rgba(0,0,0,${Math.min((clientx+(this.show?545.545:0))/545.545*.22,.22)})`;
						event.stopPropagation();
					},0);
					d.addEventListener(`touchend`,this.functions.end=event=>
						this.touchend(this.show?this.clientx-event.changedTouches[0].clientX:event.changedTouches[0].clientX-this.clientx)
					,0);
					event.stopPropagation();
				}
			}
		},
		filter={
			clearall:menu.sections.lastElementChild,
			error:page.section.querySelector`p`,
			input:$`filter`,
			heading:page.section.querySelector`h2`,
			init(){
				this.button=this.input.nextElementSibling;
				this.counter=this.heading.dataset;
				this.heading=this.heading.firstChild;
				if(this.categories=page.params.get`categories`){
					menu.categories.previousElementSibling.classList.add`open`;
					for(let key of this.categories=new Set(this.categories.split`,`))
						categories.list[key].item.classList.add`active`;
				}else this.categories=new Set;
				if(this.contributors=page.params.get`contributors`){
					menu.contributors.previousElementSibling.classList.add`open`;
					for(let key of this.contributors=new Set(this.contributors.split`,`))
						contributors.list[key].item.classList.add`active`;
				}else this.contributors=new Set;
				if(this.text=page.params.get`filter`)
					this.text=(this.input.value=this.text.toLowerCase()).replace(/\+/g,`%2b`);
				if(this.categories.size||this.contributors.size||this.text)
					this.apply(1);
				this.clearall.dataset.count=icons.total;
				this.input.addEventListener(`input`,()=>{
					clearTimeout(this.timer);
					this.timer=setTimeout(()=>{
						this.text=this.input.value.toLowerCase().replace(/\+/g,`%2b`);
						this.apply(1);
					},50);
				},0);
				this.button.addEventListener(`click`,()=>{
					this.input.focus();
					if(this.text){
						this.text=this.input.value=``;
						this.apply(0);
					}
				},0);
			},
			apply(scroll){
				page.section.classList.toggle(`filtered`,this.filtered=!!this.text||!!this.categories.size||!!this.contributors.size);
				this.heading.nodeValue=this.filtered?`Search Results`:`All Icons`;
				let 	words=this.text&&this.text.split(/[\s\-]/),
					matches=this.filtered?0:icons.total,
					article,check,icon,key;
				for(key in icons.list)
					if(icons.list.hasOwnProperty(key)){
						icon=icons.list[key];
						if(icon.articles.main){
							check=1;
							if(this.filtered){
								if(this.categories.size)
									check=icon.categories.some(category=>
										this.categories.has(category)
									);
								if(this.contributors.size)
									check=check&&this.contributors.has(icon.contributor);
								if(words)
									check=check&&words.every(word=>
										icon.keywords.some(item=>
											item.startsWith(word)
										)
									);
								matches+=check;
							}
							icon.articles.main.classList.toggle(`dn`,!check);
						}
					}
				this.counter.count=matches+`/`+icons.total;
				this.error.classList.toggle(`dn`,!this.filtered||matches);
				this.clearall.classList.toggle(`clear`,this.filtered);
				if(this.filtered){
					this.url=`${page.address}?`;
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
					if(scroll&&h.scrollTop<page.section.offsetTop-page.header.offsetHeight)
						menu.goto(page.section);
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
					this.apply(0);
				}
				menu.goto(page.section);
			}
		},
		favourites={
			articles:{},
			reader:new FileReader,
			article:C`article`,
			data:$`upload-data`,
			dialog:$`upload`,
			input:C`input`,
			name:$`upload-name`,
			menu:C`ul`,
			item:C`li`,
			path:N`path`,
			svg:N`svg`,
			title:N`title`,
			init(){
				this.list=page.storage[`favourites`]||`{}`;
				for(let key in page.storage)page.storage.hasOwnProperty(key)&&key.startsWith`mdi-`&&page.storage.removeItem(key);
				this.list=JSON.parse(this.list);
				this.article.classList.add(`cp`,`oh`,`pr`,`tac`,`toe`,`wsnw`);
				this.section=categories.list.library.section;
				this.article.append(T``);
				this.svg.classList.add(`db`,`pen`);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))
						this.add(key);
				this.write();
				this.sort();
				this.menu.classList.add(`options`,`oh`,`pa`);
				this.section.firstElementChild.append(this.svg=this.svg.cloneNode(0),this.menu);
				this.svg.classList.remove(`db`,`pen`);
				this.svg.classList.add(`trigger`,`cp`,`pa`);
				this.svg.dataset.icons=`dots-vertical`;
				this.menu.tabIndex=this.svg.tabIndex=-1;
				this.svg.appendChild(this.title).append(T`Options`);
				this.item.classList.add(`cp`,`fwm`,`pr`,`wsnw`);
				this.item.append(this.svg=this.svg.cloneNode(0),T``);
				this.svg.classList.remove(`trigger`,`cp`,`pa`);
				this.svg.classList.add(`dib`,`pen`,`vam`);
				this.svg.removeAttribute`tabindex`;
				this.actions={
					add:new this.Item(`plus-circle`,`Add Icon`),
					json:new this.Item(`json`,`JSON Object`),
					svg:new this.Item(`svg`,`SVG Sprite`),
					angular:new this.Item(`angular`,`SVG for Angular`),
					polymer:new this.Item(`polymer`,`HTML for Polymer`),
					php:new this.Item(`language-php`,`PHP Library (WIP)`),
					import:new this.Item(`file-import`,`Import Library`),
					export:new this.Item(`file-export`,`Export Library`),
					clear:new this.Item(`delete`,`Clear Library`)
				};
				this.svg.classList.remove(`dib`,`vam`);
				this.svg.classList.add(`db`);
				this.input.accept=`.txt,text/plain`;
				this.input.classList.add(`ln`,`pa`);
				this.input.type=`file`;
				this.input.addEventListener(`change`,()=>{
					if(this.input.files[0].type===`text/plain`)
						this.reader.readAsText(this.input.files[0]);
					this.input.remove();
				},0);
				this.reader.addEventListener(`load`,event=>
					this.load(event)
				,0);
				this.menu.addEventListener(`click`,async event=>{
					let target=event.target;
					switch(target){
						case this.actions.add:
							this.open();
							break;
						case this.actions.angular:
							page.download(`data:text/svg+xml;utf8<svg><defs>${this.build(`angular`)}</defs></svg>`,`mdi-library.svg`);
							break;
						case this.actions.json:
							page.download(`data:text/json;utf8,{${this.build(`jsono`)}}`,`mdi-library.json`);
							break;
						case this.actions.polymer:
							page.download(`data:text/html;utf8,<link rel="import" href="../bower_components/iron-iconset-svg/iron-iconset-svg.html"><iron-iconset-svg name="mdi" size="24"><svg><defs>${this.build(`polymer`)}</defs></svg></iron-iconset-svg>`,`mdi-library.html`);
							break;
						case this.actions.php:
							page.download(`data:text/php;utf8,`+(await page.getphp()).replace(/const library=\[\]/,`const library=[${this.build`php`}]`),`mdi-library.php`);
							break;
						case this.actions.svg:
							page.download(`data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs>${this.build(`svg`)}</defs></svg>`,`mdi-library.svg`);
							break;
						case this.actions.import:
							b.append(this.input);
							this.input.click();
							break;
						case this.actions.export:
							page.download(`data:text/plain;base64,${btoa(btoa(JSON.stringify(this.list)))}`,`mdi-library.txt`);
							break;
						case this.actions.clear:
							page.storage.removeItem`favourites`;
							for(let key in this.list)
								if(this.list.hasOwnProperty(key)&&parseInt(this.list[key]))
									delete this.list[key];
							for(let key in this.articles)
								if(this.articles.hasOwnProperty(key)&&!this.list[key]){
									this.articles[key].remove();
									delete this.articles[key];
								}
							page.alert`Library cleared.`;
							break;
					}
				},0);
				this.save=this.dialog.lastElementChild;
				this.cancel=this.save.previousElementSibling;
				this.dialog.addEventListener(`input`,event=>{
					let target=event.target;
					if(this.timer)
						clearTimeout(this.timer);
					this.timer=setTimeout(()=>{
						target.classList.toggle(`error`,!target.validity.valid);
						if(target===this.data)
							target.nextElementSibling.firstChild.nodeValue=target.validity.valid?`Path data must fit within a 24*24 viewbox.`:`Invalid path data.`;
					},250);
				},1);
				this.dialog.addEventListener(`click`,event=>{
					switch(event.target){
						case this.cancel:
						case this.dialog:
							this.close(0);
							break;
						case this.save:
							this.upload();
							break;
					}
				},0);
				this.dialog.addEventListener(`keydown`,event=>{
					if(this.dialog.open){
						switch(event.keyCode){
							case 13:
								this.upload();
								break;
							case 27:
								this.close(0);
								event.preventDefault();
								event.stopPropagation();
								break;
						}
					}
				},0);
			},
			Item:class{
				constructor(icons,text){
					favourites.menu.append(favourites.item=favourites.item.cloneNode(1));
					favourites.item.firstElementChild.dataset.icons=icons;
					favourites.item.lastChild.nodeValue=text;
					return favourites.item;
				}
			},
			add(key){
				if(icons.list[key]&&icons.list[key].data){
					this.path=this.path.cloneNode(1);
					this.path.setAttribute(`d`,icons.list[key].data);
				}else if(!parseInt(this.list[key])){
					this.path=this.path.cloneNode(1);
					this.path.setAttribute(`d`,this.list[key]);
				}else delete this.list[key];
				if(this.list[key]){
					this.articles[key]=this.article.cloneNode(1);
					if(icons.list[key]&&icons.list[key].contributor!==`google`)
						this.articles[key].classList.add(`community`);
					else if(!parseInt(this.list[key]))
						this.articles[key].classList.add(`custom`);
					this.svg=this.svg.cloneNode(0);
					this.svg.append(this.path);
					this.articles[key].prepend(this.svg);
					this.articles[key].lastChild.nodeValue=key;
					this.section.append(this.articles[key]);
				}
			},
			build:type=>Object.keys(favourites.list).sort().map(key=>
				type===`svg`?
					`<path id="mdi-${key}" d="${parseInt(favourites.list[key])?icons.list[key].data:favourites.list[key]}"/>`:
					type===`angular`?
						`<g id="${key}"><path d="${parseInt(favourites.list[key])?icons.list[key].data:favourites.list[key]}"/></g>`:
						`"${key}"${type===`php`?`=>`:`:`}"${parseInt(favourites.list[key])?icons.list[key].data:favourites.list[key]}"`
			).join(type===`php`||type===`json`?`,`:`:`),
			close(value){
				b.removeEventListener(`keydown`,this.fn);
				this.dialog.classList.add(`oz`,`pen`);
				this.timer=setTimeout(()=>{
					this.dialog.close(value);
					this.name.value=this.data.value=``;
					this.name.classList.remove`error`;
					this.name.nextElementSibling.firstChild.nodeValue=`The icon name may consist of lowercase letters, numbers &amp; hyphens only, must begin with a letter and must end with a letter or number.`;
					this.data.classList.remove`error`;
					this.data.nextElementSibling.firstChild.nodeValue=`Path data must fit within a 24*24 viewbox.`;
				},225);
			},
			load(event){
				let msg=`complete`,list;
				try{
					list=JSON.parse(atob(event.target.result));
				}catch(err){
					console.log(err);
					try{
						list=JSON.parse(`{${atob(event.target.result).split`,`.map(key=>
							`"${key.substr(4)}":1`
						).join`,`}}`);
					}catch(err){
						console.log(err);
						msg=`failed`;
					}
				}
				if(msg===`complete`){
					for(let key in list)
						if(list.hasOwnProperty(key)&&!this.list[key]){
							this.list[key]=list[key];
							this.add(key);
							if(info.name===key&&parseInt(list[key])){
								info.actions.library.classList.add`remove`;
								info.actions.library.firstChild.nodeValue=`Remove from Library`;
							}
						}
					this.write();
					this.sort();
				}
				page.alert(`Import ${msg}.`);
				this.input.value=``;
			},
			open(name){
				clearTimeout(this.timer);
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
			sort(){
				let keys=Object.keys(this.articles);
				if(keys.length>1)
					keys.sort((first,second)=>
						first.replace(/^my-/,``)>second.replace(/^my-/,``)?1:-1
					).forEach(key=>
						this.section.append(this.section.removeChild(this.articles[key]))
					);
				categories.list.library.heading.dataset.count=categories.list.library.item.dataset.count=keys.length;
			},
			toggle(name){
				let article=this.articles[name],msg;
				if(icons.list[name]){
					info.actions.library.classList.toggle(`remove`,!article);
					info.actions.library.lastChild.nodeValue=`${article?`Add to`:`Remove from`} Library`;
					if(article){
						this.articles[name].remove();
						delete this.articles[name];
						delete this.list[name];
						msg=`removed from`;
					}else{
						this.list[name]=1;
						this.add(name);
						msg=`added to`;
					}
				}else{
					info.actions.library.classList.toggle(`delete`,!article);
					info.actions.library.lastChild.nodeValue=`${article?`Add to`:`Delete from`} Library`;
					if(article){
						article.remove();
						delete this.articles[name];
						delete this.list[name];
						msg=`deleted from`;
					}else{
						this.list[name]=info.data;
						this.add(name);
						this.articles[name].classList.add`active`;
						msg=`restored to`;
					}
				}
				page.alert(`${name} ${msg} library.`);
				this.sort();
				this.write();
			},
			upload(){
				let 	valid=true,
					data,match,name;
				this.name.classList.toggle(`error`,!this.name.validity.valid);
				this.data.classList.toggle(`error`,!this.data.validity.valid);
				if(this.name.validity.valid&&this.data.validity.valid){
					name=`my-`+this.name.value.trim().toLowerCase();
					data=this.data.value.trim();
					if(icons.list[name]||this.list[name]){
						valid=false;
						this.name.classList.add`error`;
						this.name.nextElementSibling.firstChild.nodeValue=`This name is already in use.`;
					}
					if(valid&&Math.max(...match=data.match(/(\d|\.)+/g).map(x=>parseFloat(x)))>24||Math.min(...match)<0){
						valid=false;
						this.data.classList.add`error`;
						this.data.nextElementSibling.firstChild.nodeValue=`Path data must fit within a 24*24 viewbox.`;
					}
					if(valid){
						this.list[name]=data;
						this.add(name);
						this.sort();
						this.write();
						this.close();
						page.alert(`${name} added to library.`);
						if(page.size)
							this.articles[name].click();
					}
				}
			},
			write(){
				page.storage.setItem(`favourites`,JSON.stringify(this.list));
			}
		},
		info={
			actions:{
				library:Q`#actions>:first-child`,
				export:Q`#actions>:nth-child(2)`,
				markup:Q`#actions>[data-confirm="Markup"]`,
				uri:Q`#actions>[data-confirm="URI"]`,
				data:Q`#actions>[data-confirm="Path data"]`,
				icon:Q`#actions>[data-confirm=Icon]`,
				codepoint:Q`#actions>[data-confirm="Code point"]`,
				html:Q`#actions>[data-confirm=HTML]`,
				url:Q`#actions>[data-confirm=Link]`,
				link:Q`#actions>:last-child`
			},
			downloads:{},
			show:0,
			xml:new XMLSerializer,
			aside:$`info`,
			figure:$`preview`,
			heading:$`name`,
			init(){
				if(page.size)
					this.aside.classList.remove`oz`;
				if(page.size)
					this.heading.firstElementChild.remove();
				this.heading.append(T``);
				this.svg=this.figure.firstElementChild;
				this.path=this.svg.firstElementChild;
				if(page.size)
					this.load();
				this.aside.addEventListener(`click`,event=>{
					let target=event.target;
					switch(target){
						case this.aside:
						case this.heading.firstElementChild:
							if(!page.size)
								this.toggle();
							break;
						case this.actions.library:
							favourites.toggle(this.name);
							break;
						case this.actions.export:
							if(this.data)
								editor.open(this.name);
							else page.alert`Not yet available.`;
							break;
						case this.actions.markup:
						case this.actions.uri:
						case this.actions.data:
							if(this.data)
								page.copy(target.dataset.copy,target.dataset.confirm);
							else page.alert`Not yet available.`;
							break;
						case this.actions.link:
							if(this.custom||this.rejected)
								page.alert`Not available.`;
							else if(this.retired)
								page.alert`No longer available.`;
							else if(!page.offline)
								location.href=`https://materialdesignicons.com/icon/${this.name}`;
							else page.alert`Could not connect.`;
							break;
						default:
							if(this.type=target.dataset.type)
								this.download();
							else if(target.parentNode===this.actions.link.parentNode)
								if(this.copy||target===this.actions.url)
									page.copy(target.dataset.copy,target.dataset.confirm);
								else if(this.retired)
									page.alert`No longer available.`;
								else if(this.custom||this.rejected)
									page.alert`Not available.`;
								else page.alert(`Not yet available.`);
					}
				},0);
			},
			load(){
				let icon=page.params.get`edit`||page.params.get`icon`;
				if(icon){
					if(page.storage&&favourites.list[icon]){
						this.open(icon);
						favourites.articles[icon].classList.add`active`;
					}else if(icons.list[icon]){
						this.open(icon);
						Object.values(icons.list[icon].articles)[0].classList.add`active`;
					}
				}else if(page.size){
					this.open(icon=((page.storage&&Object.keys(favourites.list).sort()[0])||Object.keys(icons.list).find(key=>icons.list[key].data)));
					if(page.storage&&favourites.list[icon])
						favourites.articles[icon].classList.add`active`;
					else if(icons.list[icon])
						Object.values(icons.list[icon].articles)[0].classList.add`active`;
				}
			},
			download(){
				if(this.icon)
					if(this.data)
						if(this.downloads[this.type])
							page.download(this.downloads[this.type],`${this.name}.${this.type}`);
						else page.alert`Unknown file type.`;
					else page.alert`Download not available.`;
				else page.alert`Unknown icon.`;
			},
			open(name){
				let custom,library;
				this.icon=icons.list[this.name=name];
				if(this.icon){
					this.custom=0;
					this.data=this.actions.data.dataset.copy=this.icon.data;
					this.codepoint=this.actions.codepoint.dataset.copy=this.icon.codepoint;
					this.retired=!!this.icon.retired&&this.icon.retired!==`{soon}`;
					this.rejected=!!this.icon.rejected;
					this.aside.classList.toggle(`nocopy`,!(this.copy=!!this.codepoint));
					this.aside.classList.toggle(`retired`,this.retired||this.rejected);
				}else if(page.storage){
					this.custom=1;
					this.icon=this.data=this.actions.data.dataset.copy=favourites.list[name];
					this.codepoint=this.copy=this.rejected=0;
					this.aside.classList.add(`nocopy`,`retired`);
				}
				this.actions.markup.dataset.copy=`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${this.data}"/></svg>`;
				this.actions.uri.dataset.copy=`data:image/svg+xml;base64,${btoa(this.actions.markup.dataset.copy)}`;
				this.downloads={
					svg:`data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="${this.data}"/></svg>`,
					xaml:`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="24" Height="24"><Path Data="${this.data}"/></Canvas>`,
					xml:`data:text/xml;utf8,<vector xmlns:android="http://schemas.android.com/apk/res/android" android:height="24dp" android:width="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#000" android:pathData="${this.data}"/></vector>`
				};
				if(page.storage){
					this.actions.library.classList.toggle(`remove`,library=!!favourites.articles[this.name]&&!!parseInt(favourites.list[this.name]));
					this.actions.library.classList.toggle(`delete`,custom=!!favourites.articles[this.name]&&!parseInt(favourites.list[this.name]));
					this.actions.library.lastChild.nodeValue=`${custom?`Delete from`:library?`Remove from`:`Add to`} Library`;
				}
				if(this.codepoint){
					this.actions.icon.dataset.copy=String.fromCharCode(`0x${this.codepoint}`);
					this.actions.html.dataset.copy=`<span class="mdi mdi-${name}"></span>`;
				}
				this.actions.url.dataset.copy=`${page.address}?icon=${name}`;
				if(page.size){
					this.heading.classList.add`oz`;
					this.svg.classList.add`oz`;
				}else this.toggle();
				setTimeout(()=>{
					this.heading.lastChild.nodeValue=this.name;
					this.path.setAttribute(`d`,this.data);
					if(page.size){
						this.heading.classList.remove`oz`;
						this.svg.classList.remove`oz`;
					}
				},page.size&&195);
			},
			toggle(){
				this.aside.classList.toggle(`oz`,!(this.show=!this.show));
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
		categories={
			header:C`header`,
			heading:C`h2`,
			error:C`p`,
			item:C`li`,
			link:N`svg`,
			section:C`section`,
			svg:N`svg`,
			title:N`title`,
			init(){
				this.section.classList.add(`dg`,`pr`);
				this.header.classList.add`ps`;
				this.heading.classList.add(`oh`,`toe`,`wsnw`);
				this.heading.append(T``);
				this.link.classList.add(`cp`,`pa`);
				this.link.dataset.icons=`link`;
				this.title.append(T`Copy Link`);
				this.link.append(this.title);
				this.error.classList.add`fwm`;
				this.error.append(T`No icons available in this section.`);
				this.item.classList.add(`cp`,`oh`);
				this.item.tabIndex=-1;
				this.svg.classList.add(`dib`,`pen`,`vam`);
				this.item.append(this.svg,T``);
				if(!page.storage)
					delete this.list.library;
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))
						this.add(key);
			},
			add(key){
				let 	category=this.list[key],
					section=this.section.cloneNode(0),
					header=this.header.cloneNode(1),
					heading=this.heading.cloneNode(1),
					item=this.item.cloneNode(1),
					name=category.name.replace(`{v}`,version.str),
					fn;
				if(category.section){
					section.id=key;
					heading.firstChild.nodeValue=name;
					header.append(category.heading=heading);
					switch(key){
						case`library`:
							section.append(this.error);
							break;
						default:
							header.append(this.link.cloneNode(1));
							switch(key){
								case`new`:
									fn=icon=>icon.added===version.int;
									break;
								case`soon`:
									fn=icon=>icon.added===`{next}`;
									break;
								case`retired`:
									fn=icon=>parseInt(icon.retired);
									break;
								case`rejected`:
									fn=icon=>icon.rejected;
									break;
								default:
									fn=icon=>icon[key]===version.int;
							}
							category.count=icons.array.filter(fn).length;
					}
					section.prepend(header);
					if(key===`library`||category.count)
						page.section.before(category.section=section);
				}else category.count=icons.array.filter(icon=>
					icon.categories&&icon.data&&!parseInt(icon.retired)&&icon.categories.includes(key)
				).length;
				if(key===`library`||category.count){
					item.lastChild.nodeValue=name;
					item.dataset.category=key;
					if(category.hasOwnProperty`count`)
						heading.dataset.count=item.dataset.count=category.count;
					if(!category.section){
						item.lastChild.before(this.svg=this.svg.cloneNode(1));
						this.svg.dataset.icons=`check`;
					}
					item.firstElementChild.dataset.icons=category.icon;
					if(category.section)
						filter.clearall.before(category.item=item);
					else menu.categories.append(category.item=item);
				}else delete this.list[key];
			}
		},
		contributors={
			img:C`img`,
			item:C`li`,
			svg:N`svg`,
			init(){
				this.item.classList.add(`cp`,`oh`);
				this.item.tabIndex=-1;
				this.item.append(T``);
				this.img.classList.add(`pen`,`vam`);
				this.img.height=this.img.width=24;
				this.svg.classList.add(`dib`,`pen`,`vam`);
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))
						this.add(key);
			},
			add(key){
				let 	contributor=this.list[key],
					image=contributor.image,
					img=this.img.cloneNode(1),
					item=this.item.cloneNode(1),
					svg;
				contributor.count=icons.array.filter(icon=>
					icon.contributor&&icon.data&&!parseInt(icon.retired)&&!icon.rejected&&icon.contributor===key
				).length;
				if(contributor.count){
					item.dataset.contributor=key;
					item.dataset.count=contributor.count;
					if(image){
						img.src=`data:image/png;base64,${image}`;
						item.prepend(img);
						img.after(svg=this.svg.cloneNode(1));
					}else{
						item.prepend(svg=this.svg.cloneNode(1));
						svg.dataset.icons=`account`;
						svg.after(svg=this.svg.cloneNode(1));
					}
					item.lastChild.nodeValue=contributor.name;
					svg.dataset.icons=`check`;
					menu.contributors.append(contributor.item=item);
				}else delete this.list[key];
			}
		},
		icons={
			article:C`article`,
			path:N`path`,
			svg:N`svg`,
			total:0,
			init(){
				delete this.array;
				this.article.classList.add(`cp`,`oh`,`pr`,`tac`,`toe`,`wsnw`);
				this.article.append(T``);
				this.svg.classList.add(`db`,`pen`);
				this.svg.setAttribute(`viewBox`,`0 0 24 24`);
				for(let key in this.list)
					if(this.list.hasOwnProperty(key))this.add(key);
			},
			add(key){
				let 	icon=this.list[key],
					article=this.article.cloneNode(1),
					svg=this.svg.cloneNode(0),
					keywords=new Set(key.split`-`),
					category,data,path;
				if(data=icon.data){
					svg.append(path=this.path.cloneNode(1));
					path.setAttribute(`d`,data);
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
					article.prepend(svg);
					article.classList.toggle(`community`,icon.contributor!=="google");
					article.lastChild.nodeValue=key;
					icon.articles={};
					if((category=categories.list.new)&&icon.added&&icon.added===version.int)
						category.section.append(icon.articles.new=article.cloneNode(1));
					if((category=categories.list.updated)&&icon.updated&&icon.updated===version.int)
						category.section.append(icon.articles.updated=article.cloneNode(1));
					if((category=categories.list.renamed)&&icon.renamed&&icon.renamed===version.int)
						category.section.append(icon.articles.renamed=article.cloneNode(1));
					if((category=categories.list.removed)&&icon.retired===version.int)
						category.section.append(icon.articles.removed=article.cloneNode(1));
					if((category=categories.list.soon)&&icon.added&&icon.added===`{next}`)
						category.section.append(icon.articles.soon=article.cloneNode(1));
					if((category=categories.list.retired)&&parseInt(icon.retired))
						category.section.append(icon.articles.retired=article.cloneNode(1));
					if((category=categories.list.rejected)&&parseInt(icon.rejected))
						category.section.append(icon.articles.rejected=article.cloneNode(1));
					if(!parseInt(icon.retired)&&!icon.rejected){
						++this.total;
						page.section.append(icon.articles.main=article);
					}
				}else delete this.list[key];
			}
		},
		editor={
			inputs:{
				fill:$`png-fill`,
				opacity:$`png-opacity`,
				padding:$`png-padding`,
				colour:$`png-colour`,
				alpha:$`png-alpha`,
				radius:$`png-radius`,
				format:$`png-format`,
				size:$`png-size`
			},
			settings:{},
			event:new Event(`input`),
			image:new Image,
			xml:new XMLSerializer,
			background:C`span`,
			canvas:Q`#editor>figure>canvas`,
			dialog:$`editor`,
			init(){
				this.menu=this.dialog.querySelector`ul`;
				if(page.storage){
					this.input=C`input`;
					this.reader=new FileReader;
					this.link=this.menu.firstElementChild;
					this.import=this.link.nextElementSibling;
					this.export=this.import.nextElementSibling;
					this.clear=this.export.nextElementSibling;
					this.input.accept=`.txt,text/plain`;
					this.input.classList.add(`ln`,`pa`);
					this.input.type=`file`;
					this.input.addEventListener(`change`,()=>{
						if(this.input.files[0].type===`text/plain`)
							this.reader.readAsText(this.input.files[0]);
						this.input.remove();
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
						this.load();
					},0);
				}else this.menu.remove();
				this.context=this.canvas.getContext`2d`;
				this.save=this.dialog.lastElementChild;
				this.cancel=this.save.previousElementSibling;
				this.figure=this.dialog.querySelector`figure`;
				this.background.classList.add(`pa`,`pen`);
				this.svg=this.figure.firstElementChild;
				this.path=this.svg.firstElementChild;
				this.figure.prepend(this.background,this.horizontal=this.background.cloneNode(1),this.vertical=this.background.cloneNode(1));
				this.image.addEventListener(`load`,()=>{
					this.context.drawImage(this.image,this.settings.padding,this.settings.padding);
					URL.revokeObjectURL(this.image.src);
				},0);
				this.dialog.addEventListener(`click`,event=>{
					let 	target=event.target,
						key;
					switch(target){
						case this.dialog:
							this.close(0);
							break;
						case this.link:
							let url=`${page.address}?edit=${this.name}`;
							for(key in this.settings)
								if(this.settings.hasOwnProperty(key))
									url+=`&${key}=${this.settings[key]}`;
							page.copy(url,`Link`);
							break;
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
							for(key in page.storage)
								if(page.storage.hasOwnProperty(key)&&key.startsWith`png-`)
									page.storage.removeItem(key);
							this.menu.blur();
							this.load();
							page.alert`Settings cleared.`;
							break;
						case this.cancel:
							this.close(0);
							break;
						case this.save:
							switch(this.settings.format=this.inputs.format.value){
								case`png`:
									this.downloadpng();
									break;
								default:
									this.downloadxml();
							}
							break;
					}
				},0);
				this.dialog.addEventListener(`keydown`,event=>{
					if(this.dialog.open){
						switch(event.keyCode){
							case 13:
								switch(this.settings.format=this.inputs.format.value){
									case`png`:
										this.downloadpng();
										break;
									default:
										this.downloadxml();
								}
								break;
							case 27:
								this.close(0);
								event.preventDefault();
								event.stopPropagation();
								break;
						}
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
								if(this.settings.radius>(this.inputs.radius.max=Math.floor(this.dimensions/2)))
									this.background.style.borderRadius=`${this.settings.radius=this.inputs.radius.value=parseInt(this.inputs.radius.max)}px`;
								break;
							case this.inputs.fill:
								this.path.setAttribute(`fill`,`#${this.settings.fill=value.toLowerCase()}`);
								this.figure.classList.toggle(`light`,(this.luminance=this.test(this.convert(value)))>=128&&this.settings.alpha<31);
								break;
							case this.inputs.opacity:
								this.path.setAttribute(`fill-opacity`,(this.settings.opacity=parseInt(value))/100);
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
								this.background.style.opacity=(this.settings.alpha=parseInt(value))/100;
								this.figure.classList.toggle(`light`,this.luminance>=128&&value<31);
								break;
							case this.inputs.radius:
								this.background.style.borderRadius=`${this.settings.radius=parseInt(value)}px`;
								break;
						}
						clearTimeout(this.timer);
						this.timer=setTimeout(()=>this.draw(),200);
						if(page.storage)
							page.storage.setItem(target.id,value);
					}
				},1);
				this.load();
			},
			close(value){
				b.removeEventListener(`keydown`,this.fn);
				this.dialog.classList.add(`oz`,`pen`);
				this.timer=setTimeout(()=>this.dialog.close(value),225);
			},
			convert:hex=>[((hex=parseInt(hex.length===3?hex.replace(/./g,c=>c+c):hex,16))>>16)&255,(hex>>8)&255,hex&255],
			downloadpng(){
				this.canvas.toBlob(blob=>
					page.download(URL.createObjectURL(blob),`${this.name}.png`)
				);
			},
			downloadxml(){
				let 	padding=this.settings.padding/this.settings.size*24,
					dimensions=24+2*padding,
					opacity=this.settings.opacity/100,
					alpha=this.settings.alpha/100,
					xml,data,arc,radius,iscircle;
				if(alpha){
					radius=this.settings.radius/this.dimensions*dimensions;
					iscircle=radius===dimensions/2;
					data=`M${radius},0`;
					if(!iscircle)
						data+=`H${dimensions-radius}`;
					if(radius)
						data+=`${arc=`A${radius},${radius} 0 0 1 `}${dimensions},${radius}`;
					if(!iscircle)
						data+=`V${dimensions-radius}`;
					if(radius)
						data+=`${arc}${dimensions-radius},${dimensions}`;
					if(!iscircle)
						data+=`H${radius}`;
					if(radius)
						data+=`${arc}0,${dimensions-radius}`;
					if(!iscircle)
						data+=`V${radius}`;
					if(radius)
						data+=`${arc+radius},0`;
					data+=`Z`;
				}
				switch(this.inputs.format.value){
					case`svg`:
						xml=`data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="${this.dimensions}" viewBox="0 0 ${dimensions} ${dimensions}" width="${this.dimensions}" xmlns="http://www.w3.org/2000/svg">`;
						if(alpha){
							xml+=`<path fill="#${this.settings.colour}" `;
							if(alpha<1)
								xml+=`fill-opacity="${alpha}" `;
							xml+=`d="${data}"/>`;
						}
						xml+=`<path fill="#${this.settings.fill}" `;
						if(opacity<1)
							xml+=`fill-opacity="${opacity}" `;
						if(padding)
							xml+=`transform="translate(${padding},${padding})" `;
						xml+=`d="${this.data}"/></svg>`;
						break;
					case`xaml`:
						xml=`data:text/xaml+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><Canvas xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Width="${this.dimensions}" Height="${this.dimensions}">`;
						if(alpha){
							xml+=`<Path Fill="#${this.settings.fill}" `;
							if(opacity<1)
								xml+=`Opacity="${opacity}" `;
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
						if(alpha){
							xml+=`<path android:fillColor="#${this.settings.colour}" `;
							if(alpha<1)
								xml+=`android:fillOpacity="${alpha}" `;
							xml+=`android:pathData="${data}"/>`;
						}
						xml+=`<path android:fillColor="#${this.settings.fill}" `;
						if(opacity<1)
							xml+=`android:fillOpacity="${opacity}" `;
						if(padding)
							xml+=`android:translateX="${padding}" android:translateY="${padding}" `;
						xml+=`android:pathData="${this.data}"/></vector>`;
						break;
				}
				page.download(xml,`${this.name}.${this.inputs.format.value}`);
			},
			draw(){
				this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
				this.canvas.height=this.canvas.width=this.dimensions;
				if(this.settings.alpha){
					this.context.fillStyle=`rgba(${this.convert(this.settings.colour)},${this.settings.alpha/100})`;
					this.context.beginPath();
					this.context.moveTo(this.settings.radius,0);
					this.context.arcTo(this.dimensions,0,this.dimensions,this.dimensions,this.settings.radius);
					this.context.arcTo(this.dimensions,this.dimensions,0,this.dimensions,this.settings.radius);
					this.context.arcTo(0,this.dimensions,0,0,this.settings.radius);
					this.context.arcTo(0,0,this.dimensions,0,this.settings.radius);
					this.context.closePath();
					this.context.fill();
				}
				this.image.src=URL.createObjectURL(new Blob([this.xml.serializeToString(this.svg)],{type:`image/svg+xml;charset=utf-8`}));
			},
			load(){
				for(let key in this.inputs)
					if(this.inputs.hasOwnProperty(key)){
						this.inputs[key].value=page.params.get(key)||page.storage&&page.storage[`png-${key}`]||this.inputs[key].getAttribute`value`||this.inputs[key].firstElementChild.getAttribute`value`;
						this.inputs[key].dispatchEvent(this.event);
					}
			},
			open(name){
				clearTimeout(this.timer);
				this.name=name;
				if(icons.list[name])
					this.path.setAttribute(`d`,this.data=icons.list[name].data);
				else if(favourites.list[name])
					this.path.setAttribute(`d`,this.data=favourites.list[name]);
				this.dialog.showModal();
				this.dialog.classList.remove(`oz`,`pen`);
				b.addEventListener(`keydown`,this.fn=event=>{
					if(event.keyCode===27){
						this.close(0);
						event.preventDefault();
						event.stopPropagation();
					}
				},0);
				this.draw();
			},
			test:([r,g,b])=>(r*299+g*587+b*114)/1000
		};
	(async()=>{
		categories.list=await(await fetch`json/categories.json`).json();
		contributors.list=await(await fetch`json/contributors.json`).json();
		icons.array=Object.values(icons.list=await(await fetch`json/icons.json`).json());
		page.init();
		await new Promise(resolve=>{
			let ga=C`script`;
			ga.async=1;
			ga.src=`https://www.googletagmanager.com/gtag/js?id=UA-109147935-1`;
			b.append(ga);
			ga.addEventListener(`load`,resolve,0);
		});
		let 	date=new Date,
			month=date.getMonth(),
			day=date.getDate();
		if(month===11&&day>12||month===0&&day<6)
			page.header.classList.add("snow");
		window.dataLayer=window.dataLayer||[];
		let gtag=function(){window.dataLayer.push(arguments);};
		gtag(`js`,date);
		gtag(`config`,`UA-109147935-1`);
	})();
}