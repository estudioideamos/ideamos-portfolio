const {card}=require('../project-card.js');
module.exports=function renderHTML(html,projects){return html.replace('<!-- PROJECT_CARDS -->',projects.map(card).join('\n')).replace('<!-- PROJECT_COUNT -->',projects.length+' proyectos para descubrir');};
