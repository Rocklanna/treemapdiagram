const w =960; // the width of d.X0 of data
const h =570; //the height of d.X0 of data
const padding =50;
const legendWidth =200;

const MOVIE_FILE ="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

d3.select("#header")
  .append("text")
  .attr("id","title")
  .text("Top Grossing Movies for 2020");

d3.select("#header")
  .append("text")
  .attr("id","description")
  .text("Movies are arranged by genre and show the value when hovered")

const svg = d3.select("#main")
              .append("svg")
              .attr("width",w)
              .attr("height",h);

var tooltip = d3.select("#main")
                    .append("div")
                    .attr("id","tooltip");

var legend =d3.select("#footer")
             .append("svg")
              .attr("width",w)
              .attr("height",h/2)
              .attr("id","legend");

const rectColor = d3.scaleOrdinal()
                    .range(d3.schemeCategory10);

var treemap = d3.treemap()
                  .size([w,h])
                  .padding(2);

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json").then(function(data) {

  
 
var root = d3.hierarchy(data)
              .sum(function(d){
                      return d.value
               })
               .sort(function(a,b){ b.value - a.value })

var tree = treemap(root)

// All categories
var legendKeys =  root.leaves().map((item)=>item.data.category);
  
  legendKeys = [...new Set(legendKeys)]; // distinct categories
  
  const legendColor = d3.scaleOrdinal()
                        .domain(legendKeys)
                    .range(d3.schemeCategory10);
  
   

 var boxOffice = svg.selectAll("g")
                      .data(tree.leaves())
                      .enter()
                      .append("g")
                      .attr("transform",function(d){return "translate("+ d.x0+","+d.y0+")";});
                

boxOffice.append("rect")
          .attr("class","tile")
          .attr("data-name",(d)=>d.data.name)
          .attr("data-category",(d)=>d.data.category)
          .attr("data-value",(d)=>d.data.value)
          .attr("width",(d)=>d.x1-d.x0)
          .attr("height",(d)=>d.y1-d.y0)
          .style("stroke","black")
      .style("fill", (d) => rectColor(d.parent.data.name))
      .on("mouseover",function(event,d){
    tooltip.style("visibility","visible")
            .attr("data-value",d.data.value)
      .html("Movie: "+ d.data.name+"<br>"+
                "Genre: "+d.data.category+"<br>"+
                "Gross: "+d.data.value)
           .style("left",(event.pageX)+"px")
           .style("top",(event.pageY)+"px")
  })
  .on("mouseout",function(){
    tooltip.style("visibility","hidden")
  });


  boxOffice.append("text")
            .selectAll("tspan")
     .data(function(d) { return d.data.name.split(" "); })
     .enter()
     .append("tspan")
     .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; })
      .style("fill","white")
  
  legend.selectAll("rect")
        .data(legendKeys)
        .enter()
        .append("rect")
        .attr("class","legend-item")
        .attr("x",w/2)
         .attr("y",(d,i)=>i*30+15)
        .attr("width","15")
          .attr("height","15")
          .attr("fill",(d)=>legendColor(d))
  
    legend.selectAll("text")
        .data(legendKeys)
        .enter()
        .append("text")
        .attr("x","520")
         .attr("y",(d,i)=>i*30+30)
         .text((d)=>d)
  
  
console.log(tree);
  console.log("yes ma sir");
  console.log(legendKeys);
  
   });