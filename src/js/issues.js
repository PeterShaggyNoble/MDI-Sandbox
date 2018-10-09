(async()=>{
/*	let 	response=await fetch`http://dev.materialdesignicons.com/api/github/issues`.catch(async()=>await fetch`../json/issues.json`),*/
	let 	response=await fetch`../json/issues.json`,
		issues=await response.json(),
		tables={
			icons:document.getElementById(`icons`),
			stock:document.getElementById(`stock`),
			home:document.getElementById(`home`),
			brands:document.getElementById(`brands`)
		},
		bodies={
			icons:tables.icons.querySelector(`tbody`),
			stock:tables.stock.querySelector(`tbody`),
			home:tables.home.querySelector(`tbody`),
			brands:tables.brands.querySelector(`tbody`)
		},
		svg=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),
		path=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),
		tabs=document.getElementById(`tabs`),
		current=document.querySelector(`p.current`),
		table=tables.icons,
		tr,td,a,x;
	issues=issues.filter(issue=>issue.labels.every(label=>!label.startsWith(`Consider Closing`)&&!label.startsWith(`Needs More Information`)));
	issues[0].hasOwnProperty(`reactions`)?
		issues.sort((x,y)=>x.reactions>y.reactions?-1:x.reactions<y.reactions?1:x.comments>y.comments?-1:x.comments<y.comments?1:Date.parse(x.updated)>Date.parse(y.updated)?-1:1):
		issues.sort((x,y)=>x.plus>y.plus?-1:x.plus<y.plus?1:x.comments>y.comments?-1:x.comments<y.comments?1:Date.parse(x.updated)>Date.parse(y.updated)?-1:1);
	svg.classList.add(`vam`);
	svg.setAttribute(`viewBox`,`0 0 24 24`);
	path.setAttribute(`d`,`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`);
	svg.append(path);
	tabs.addEventListener(`click`,event=>{
		let target=event.target;
		if(target.nodeName.toLowerCase()==="p"&&current!==target){
			current.classList.remove(`current`);
			current=target;
			current.classList.add(`current`);
			table.classList.add(`dn`);
			table=tables[target.dataset.table];
			table.classList.remove(`dn`);
		}
	},0);
	issues.forEach(issue=>{
/*		issue.brand=issue.brand||issue.labels.some(label=>label.startsWith(`Brand Icon`));
		issue.home=issue.home||issue.labels.some(label=>label.startsWith(`Home Assistant`));
		issue.id=issue.id||issue.number;
		issue.status=issue.status||(issue.labels.some(label=>label.startsWith(`Rejected`))?`Rejected`:issue.labels.some(label=>label.startsWith(`Low Priority`))?`Low Priority`:issue.labels.some(label=>label.startsWith(`Contribution`))?`Coming Soon`:issue.labels.some(label=>label.startsWith(`High Priority`))?`High Priority`:`Pending`);
		issue.stock=issue.stock||issue.labels.some(label=>label.startsWith(`Stock Google Icon`));
		issue.reactions=issue.reactions||issue.plus||0;*/
		tr=tr?tr.cloneNode(0):document.createElement(`tr`);
		if(td)
			td=td.cloneNode(0);
		else{
			td=document.createElement(`td`);
			td.classList.add(`oh`,`toe`,`wsnw`);
		}
		tr.append(td);
		td=td.cloneNode(0);
		if(a)
			a=a.cloneNode(1);
		else{
			a=document.createElement(`a`);
			a.classList.add(`db`,`tac`);
			a.append(svg.cloneNode(1));
			a.firstElementChild.firstElementChild.setAttribute(`d`,`M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z`);
		}
		a.href=`https://github.com/Templarian/MaterialDesign/issues/`+issue.id;
		td.append(a);
		tr.append(td);
		td=td.cloneNode(0);
		td.append(document.createTextNode(issue.title));
		tr.append(td);
		td=td.cloneNode(0);
		td.classList.toggle(`fwm`,issue.status===`Coming Soon`);
		td.append(document.createTextNode(issue.status));
		tr.append(td);
		td=td.cloneNode(0);
		td.classList.remove(`fwm`);
		issue.stock&&td.append(svg.cloneNode(1));
		tr.append(td);
		td=td.cloneNode(0);
		td.append(document.createTextNode(issue.reactions));
		tr.append(td);
		td=td.cloneNode(0);
		td.append(document.createTextNode(issue.comments));
		tr.append(td);
		bodies.icons.append(tr);
		issue.stock&&bodies.stock.append(tr.cloneNode(1));
		issue.home&&bodies.home.append(tr.cloneNode(1));
		issue.brand&&bodies.brands.append(tr.cloneNode(1));
	});
})();