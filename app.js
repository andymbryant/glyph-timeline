const svg = d3.select("svg");
const margin = {top: 20, right: 20, bottom: 110, left: 40};
const margin2 = {top: 430, right: 20, bottom: 30, left: 40};
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;
const height2 = +svg.attr("height") - margin2.top - margin2.bottom;

const color = d3.scaleOrdinal(d3.schemeCategory10);
const xAxisTranslate = 450;

// d3.json('3486351895_player_raw_100.json').then(function(data) {
d3.json('3304976347_player_raw_100.json').then(function(data) {

	const findTimestamp = function(d) {
		return data.nodes[d].details.timestamp
	}
	const setHeight = function(i) {
		return (i*20) + 100;
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

	const xAxis = d3.axisBottom(xScale).ticks(30)
	const yAxis = d3.axisLeft(yScale)

	for (x in data.trajectories) {
		let traj = data.trajectories[x].trajectory;
		const max = d3.max(traj);
		const fill = color(x);

		svg.selectAll('circle')
			.data(traj, function(d) {
				return d;
			})
			.enter()
			.append('circle')
			.attr('r', 3)
			.attr('fill', function(d, i) {
				return fill;
			})
			.attr('cx', function(d, i) {
				if (findTimestamp(i) == undefined) {
					d3.select(this).remove()
				}
				return xScale(findTimestamp(i));
			})
			.attr('cy', setHeight(x))
}

svg
	.call(
		d3.zoom()
		.on("zoom", function () {
    		svg.attr("transform", d3.event.transform)
		})
		// .xAxis(xScale)
	)

svg.append("g")
	.attr("transform", `translate(20, ${xAxisTranslate})`)
	.call(xAxis)
})
