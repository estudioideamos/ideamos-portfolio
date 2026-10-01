const {card}=require('../project-card.js');
module.exports=function renderHTML(html,projects){
 const url='https://ideamos.com.ar/portfolio/';
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'CollectionPage','@id':url+'#page',url,name:'Portfolio de diseño web y tiendas online | Ideamos',inLanguage:'es-AR',breadcrumb:{'@id':url+'#breadcrumb'}},
  {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Ideamos',item:'https://ideamos.com.ar/'},{'@type':'ListItem',position:2,name:'Portfolio',item:url}]}
 ]};
 return html.replace('<!-- PROJECT_CARDS -->',projects.map(card).join('\n')).replace('<!-- PROJECT_COUNT -->',projects.length+' proyectos para descubrir').replace('<!-- STRUCTURED_DATA -->','<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>');
};
