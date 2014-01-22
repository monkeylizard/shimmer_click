var landing_script = function() {

		var numquotes = parseInt($("#numquotes").html());
		var snippets = [];
		var attributions = [];
		for ( i = 0; i < numquotes; i ++ ) {
			quote = $("#quote" + i).html();
			if ( quote.length > 140 ) {
				quote = quote.substring(0,70) + "...";
			}
			attribution = $("#attr" + i).html();

			snippets.push(quote);
			attributions.push(attribution);
		}

		var buf = 50;
		var isMobile = false;
		if ( window.innerHeight > window.innerWidth ) {
		    isMobile = true;
		}
		if ( isMobile ) { 
		    buf = 30;
		    $('body').css('padding', '45px');
		}
		
		var hold = $('#quote-snippets');
		var w = hold.innerWidth();
		var h = window.innerHeight / 3;
		var numrows; // used by recalculate_hight
		var spacing = 17;

		svg = d3.select("#quote-snippets")
	    	.append("svg")
	    	.attr("height", h)
	   		.attr("width", w)
	    	.attr("id", "svgMain");

	    var rand_int = function(low, high) {
	    	base = Math.random();
	    	return Math.floor( base * (high + 1 - low) ) + low;
		}

	var create_let = function(letter, coord, name) {
	    lett_color = "#968775";
	    console.log("making a letter...");
	    label = ".C" + rand_int(0, 8000);
	    if ( isMobile ) {
		var size = "1em";
	    } else {
		var size = "1.5em";
	    }
	    
	    lett = svg.selectAll(label)
		.data([letter])
		.enter()
		.append("text")
		.attr("id", name)
		.attr("x", coord[0])
		.attr("y", coord[1])
		.text(letter)
		.attr("font-family", "Courier New")
		.attr("font-weight", "bold")
		.attr("font-size", size)
		.attr("fill", lett_color)
		.attr("opacity", 0);

		lett.transition()
			.attr("opacity", 1)
			.duration(800)
			.delay(200);
	    
	    return lett;
	}

	var get_let = function(name) {
	    lett = svg.selectAll("#" + name);
	    if ( lett[0].length == 0 ) {
		return false;
	    }
	    return lett;
	}

	var kill_let = function(lett) {
	    lett.transition()
		.attr("opacity", 0)
		.duration(200).remove()
	}

	// Placing sentences
	
	var next_break = function(sentence, startpos, spacing, endl) {
	    var cutoff = Math.floor((endl-buf) / spacing) + startpos;
	    if ( cutoff >= sentence.length ) {
		return -1;
	    }
	    
	    for ( p = cutoff; p > startpos; p-- ) {
		if ( sentence[p] == " " ) {
		    return p;
		}
	    }
	    return cutoff;
	}
	
	
	var recalculate_height = function(num_rows, spacing) {
	    numrows = num_rows;
	    h = window.innerHeight / 3
	    ht = buf * 2 + (num_rows + 2) * spacing;
	    new_ht = Math.max(h, ht);
	    if (ht != h) {
		$("#quote-display").animate({height: new_ht.toString()}, 200);
		svg.transition().attr("height", new_ht);
	    }
	}
	
	
	var coord_maker = function(sentence) {
	    // spacing is now global
	    if ( isMobile ) { spacing = 18; }
	    
	    var endl = w - buf;
	    
	    var breaks = [0];
	    var check = true;
	    count = 0;
	    while ( check ) {
		last_brk = breaks[breaks.length - 1];
		var brk = next_break(sentence, last_brk, spacing, endl);
		if ( brk == -1 ) {
		    check = false;
		} else {
		    breaks.push(brk);
		}
		
		if ( count > 20) { check = false; }
		count += 1;
	    }
	    if ( !isMobile ) {
		recalculate_height(breaks.length, spacing);
	    }
	    
	    return function(index) {
		var base_x = buf + index * spacing;
		var row = 0;
		var cutoff = 0;
		
		for ( h = 0; h < breaks.length; h++ ) {
		    if ( index > breaks[h] ) {
			row = h;
			cutoff = breaks[h];
		    } else {
			break;
		    }
		}
		
		correct = 0;
		if ( row > 0 ) { correct = 1 }
		
		
		var x = base_x - ( cutoff + correct ) * spacing;
		var y = buf + row * spacing * 1.3;
		return [x, y];
	    }
	}

	
	var draw_sentence = function(sentence) {
	    var coords = coord_maker(sentence);
	    
	    for ( i = 0; i < sentence.length; i++ ) {
			name = "A" + i;
			create_let(sentence[i], coords(i), name);
	    }
	}

	var kill_sentence = function(sentence) {
		var numlet = sentence.length;
		for ( i = 0; i < numlet; i++ ) {
			lett = get_let("A" + i);
			kill_let(lett);
		}

	}

	var place_supplement = function(text, kind) {
	    // uses globals attr, buf, numrows, spacing
	    var attr_color = "#4B947F"
	    if ( kind == "attribution" ) {
		x = 2 * buf;
		id = "attribution";
		size = "1.5em";
	    } else {
		x = w - buf * 4;
		id = "wpm-display";
		size = "2.5em";
		attr_color = "#E38DA1"
	    }
	    y = buf + (numrows + 2) * spacing * 1.3

	    console.log("making supplement...");
	    
	    lett = svg.selectAll(label)
		.data([text])
		.enter()
		.append("text")
		.attr("id", id)
		.attr("x", x)
		.attr("y", y)
		.text(text)
		.attr("font-family", "Calibri")
		.attr("font-weight", "bold")
		.attr("font-size", size)
		.attr("fill", attr_color)
		.attr("opacity", 0);

		lett.transition()
			.attr("opacity", 1)
			.duration(800)
			.delay(200);
	    
	    return lett;
	}

	var display_bit = function(iterate) {
		draw_sentence(snippets[iterate]);
		place_supplement(attributions[iterate], "attribution");
	}

	var kill_bit = function(iterate) {
		kill_sentence(snippets[iterate]);
		kill_let(get_let("attribution"));
	}

	var show_kill = function(iterate) {
		display_bit(iterate);
		setTimeout(function() { kill_bit(iterate); }, 10000);
		return (iterate + 1) % snippets.length;
	}


	iterate = rand_int(0, snippets.length-1);
	iterate = show_kill(iterate);

	setInterval(function() {
		iterate = show_kill(iterate);
	}, 11000);
}

window.onload = function() {
	$(document).ready(function(){
		nm = $("#page_name").html();
		if (nm == "Home") {
			landing_script();
		} else if (nm == "Game") {
			highscore_script();
		}
	});
}