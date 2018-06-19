var svgWidth = 1000;
var svgHeight = 400;

const margin = {top: 20, right: 20, bottom: 50, left: 40};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const color = d3.scaleOrdinal(d3.schemeCategory10);

const svgViewport = d3.select('body')
	.append('svg')
	.attr('width', svgWidth)
	.attr('height', svgHeight)
	.style("background", "lightgrey");


// d3.json('3486351895_player_raw_100.json').then(function(data) {
d3.json('3304976347_player_raw_100.json').then(function(data) {

	//Helper functions
	const findTimestamp = function(d) {
		return data.nodes[d].details.timestamp
		}
	const setHeight = function(i) {
		return yScale(i)-11;
		}

	const timestamp = [];
	for (x in data.nodes) {
		timestamp.push(data.nodes[x].details.timestamp);
	}

	const timeMax = d3.max(timestamp);

	const xScale = d3.scaleLinear()
		.domain([600, timeMax])
		.range([0, width])

	const yScale = d3.scaleLinear()
		.domain([0, 10])
		.range([height, 0]);

	// function onlyUnique(value, index, self) { return self.indexOf(value) === index; }

	const xAxis = d3.axisBottom(xScale).ticks(30)
	const yAxis = d3.axisLeft(yScale)
		.tickFormat(d3.format('d'))

	//zoom function
	const zoom = d3.zoom()
    	.on("zoom", zoomFunction);

	//append group
	const innerSpace = svgViewport.append("g")
    	.attr("class", "inner_space")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    	.call(zoom);

	//call x axis
	const gX = innerSpace.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	//call y axis
	const gY = innerSpace.append("g")
	    .attr("class", "axis axis--y")
	    .call(yAxis);

	//add labels to x
	svgViewport.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin.bottom + 8) + ")")
        .style("text-anchor", "middle")
        .text("Gameplay Timestamp");

		svgViewport.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 0 - margin)
	        .attr("x",0 - (height / 2))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Players");

	const view = innerSpace.append("rect")
		.attr("class", "zoom")
		.attr("width", width)
		.attr("height", height)
		.call(zoom)

	function zoomFunction(){
		// create new scale ojects based on event
		const new_xScale = d3.event.transform.rescaleX(xScale)
		const new_yScale = d3.event.transform.rescaleY(yScale)

		// update axes
		gX.call(xAxis.scale(new_xScale));
		gY.call(yAxis.scale(new_yScale));

		updateCircle()

	};

	function sendData(data) {
		d3.select('.box')
			.text(`Node: ${data}`);
	}


	svgViewport.append('defs')
	  .append('clipPath')
	  .attr('id', 'clip')
	  .append('rect')
		  .attr('x', margin.left)
		  .attr('y', margin.top)
		  .attr('width', width-margin.right)
		  .attr('height', height);

	const main = svgViewport.append('g')
	  .attr('class', 'main')
	  .attr('clip-path', 'url(#clip)');


	for (x in data.trajectories) {

		let traj = data.trajectories[x].trajectory;
		const fill = color(x);

		const circles = main.selectAll('circle')
			.data(traj, function(d) {
				return d;
			})
			.enter()

		circles
			.append('circle')
			.attr('r', 1)
			.attr('fill', function(d, i) {
				return fill;
			})
			.attr('cx', function(d, i) {
				if (findTimestamp(d) == undefined) {
					d3.select(this).remove()
				}
				return xScale(findTimestamp(d));
			})
			.attr('cy', setHeight(x))
			.on('mouseover', function() {
				d3.select(this)
				.transition()
				.duration(100)
				.attr('r', 2)
				.call(sendData(this.__data__))
			})
			.on('mouseout', function() {
				d3.select(this)
				.transition()
				.duration(100)
				.attr('r', 1)
			})
			.on('click', function() {
				sendData(this.__data__)
			})



		function updateCircle() {
			svgViewport.selectAll('circle')
				.attr("transform", d3.event.transform)
		}

}



})
