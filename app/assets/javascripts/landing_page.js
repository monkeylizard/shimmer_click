

var landing_script = function() {

		$("#running").html("true");

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
		console.log(iterate, snippets[iterate]);
		draw_sentence(snippets[iterate]);
		place_supplement(attributions[iterate], "attribution");
	}

	var kill_bit = function(iterate) {
		safe = $("#page_name").html();
		if ( safe == "Home" ) {
			kill_sentence(snippets[iterate]);
			kill_let(get_let("attribution"));
		}
	}

	var show_kill = function(iterate) {
		console.log("show_kill called");
		display_bit(iterate);
		setTimeout(function() { kill_bit(iterate); }, 10000);
		return (iterate + 1) % snippets.length;
	}

	// timekeeping

	var mark_time = function() {
	    var last_time = new Date();
	    var time_div = document.getElementById("timer");
	    time_div.innerHTML = last_time.getTime();
	    return time_div.innerHTML;
	}
	
	var get_time = function() {
	    var time_div = document.getElementById("timer");
	    return time_div.innerHTML
	}
	
	var what_time = function() {
	    var this_time = new Date();
	    return this_time.getTime();
	}	

	var show_kill_time = function(iterate) {
		console.log("show_kill_time called");
		now = what_time();
		then = get_time();
		console.log(now - then);
		if ( now - then >= 10000 ) {
			mark_time();
			return show_kill(iterate);
		}
	}

	var is_display = function() {
		aaa = get_let("A1");
		return aaa;
	}

	var iterate = rand_int(0, snippets.length-1);
	mark_time();

	var cycle = function () {
		console.log("cycling", iterate);
		safety = $("#page_name").html();
		if ( safety == "Home" ) {
			itt = show_kill(iterate)
			if  ( typeof(itt) === "number" ) {
				iterate = itt;
			}
		}
	}

	cycle();
	setInterval(function() {
		console.log("looping");
		cycle();
	}, 11000);

}

var highscore_script = function() {	

	$("#running").html("true");

	// generates a random number in an inclusive range
	
	var rand_int = function(low, high) {
	    base = Math.random();
	    return Math.floor( base * (high + 1 - low) ) + low;
	}
	
	// get the quote and attribution

	var numquotes = parseInt($("#numquotes").html());
	var quotenum = rand_int(0,numquotes-1);
	var quote = $("#quote" + quotenum).html();
	var attr = $("#attr" + quotenum).html();
	console.log(quote, attr);
	
	$("#typing-box").bind('keyup', function() {
	    typing_check();
	});

	// set up the svg

	var buf = 50;
	var isMobile = false;
	if ( window.innerHeight > window.innerWidth ) {
	    isMobile = true;
	}
	if ( isMobile ) { 
	    buf = 30;
	    $('body').css('padding', '45px');
	}
	var hold = $('#quote-display');
	var w = hold.innerWidth();
	var h = window.innerHeight / 3;
	
	svg = d3.select("#quote-display")
	    .append("svg")
	    .attr("height", h)
	    .attr("width", w)
	    .attr("id", "svgMain");
	
	$(window).resize(function() {
	    w = hold.innerWidth();
	    svg.transition().attr("width", w);
	});

	// other globals

	var coords; // assigned to coord_maker(quote) after coord_maker is defined.
	var max = 0; // used by box_stats
	var last_length = 0; // used by box_stats
	var numrows; // used by recalculate_hight
	var spacing = 17;


	// WPM recording stuff + typing check stuff
	
	var time = function() {
	    the_time = new Date();
	    return the_time.getTime();
	}
	
	var wpm = function() {
	    var start = $("#timer").html();
	    var elapsed = time() - start;
	    var typed = $("#typing-box").val();
	    var words = typed.split(" ").length;
	    var wpm = (words * 60) / (elapsed / 1000);
	    return wpm;
	}
	
	var typed_matches = function(typed) {
		if ( !typed ) {
		    var typed = $("#typing-box").val();	
		}
	    var compare_to = quote.substring(0,typed.length);
	    if (typed === compare_to) {
			return true;
	    } else {
	    	return false;
	    }
	}
	
	var complete = function() {
	    $("#complete").html("complete");
	    display_complete()
	}
	
	var is_complete = function() {
	    if ( $("#complete").html() === "complete" ) {
		return true;
	    } else {
		return false;
	    }
	}
	
	
	// find the first incorrect letter

	var first_error = function(typed) {
	    for ( i = 0; i < typed.length; i++ ) {
		if ( typed[i] != quote[i] ) {
		    return i;
		}
	    }
	}

	// function to fill in typed letters and red incorrect ones

	var filled_in = []
	for ( i = 0; i < quote.length; i++ ) {
		filled_in.push(false);
	}

	var colorify = function(typed_str) {
	    if ( typed_matches(typed_str) ) {
			for ( i = 0; i < typed_str.length; i++ ) {
				if ( !filled_in[i] ) {
			    	fill_let("A" + i.toString());
			    	filled_in[i] = true;
				}
			}
	    } else {
			err = first_error(typed_str);
			for ( i = err; i < typed_str.length; i++ ) {
		    	if ( !(get_let("W" + i.toString())) ) {
					//console.log("BAD", i, typed_str[i], coords(i), "W" + i.toString() );
					wrong_let(typed_str[i], coords(i), "W" + i.toString() );
		    	}
			}
	    }
	}

	var last_typed;	

	var box_stats = function() {
	    var typed = $("#typing-box").val();
	    if ( typed.length > max ) {
		max = typed.length;
	    }
	    last_length = typed.length;
	    last_typed = typed;
	}

	var clear_extra = function() {
		//calls global erasure_count
	    var typed = $("#typing-box").val();
	    if ( typed.length > max ) {
			max = typed.length;
	    }
	    for ( i = typed.length - erasure_count; i < max; i++ ) {
	    	filled_in[i] = false;
			aa = get_let("A" + i.toString());
			ww = get_let("W" + i.toString());
			if ( aa ) { unfill_let("A" + i.toString()); }
			if ( ww ) { kill_let(ww); }
	    }
	}

	var match_function = function(box_str) {
	    $("#wpm").html( "<span id='speed'>" + wpm().toFixed(1) +  "</span> wpm." );
	    display_wpm();
	    if ( box_str === quote ) {
			complete();
	    }
	}

	var periods = []
	for ( i = 0; i < quote.length; i++ ) {
		if ( quote[i] === "." ) {
			periods.push(i);
		}
	}
	var erasure_count = 0;

	var sanitize = function(typed_str) {
		//console.log("sanitizing ", typed_str);
		erasure_count = 0;
		for ( i = 0; i < periods.length; i++ ) {
			//console.log("snip ", typed_str.substring(periods[i]+1, periods[i]+3));
			if ( typed_str.substring(periods[i]+1, periods[i]+3) === "  " ) {
				erasure_count += 1;
				//console.log("double space at ", i);
				typed_str = typed_str.substring(0,periods[i]+1) + typed_str.substring(periods[i]+2, typed_str.length);
			}
		}
		return typed_str;
	}

	
	// function bound to keyup event

	var typing_check = function() {
	    var timer = $("#timer");
	    var box = $("#typing-box");
	    if ( timer.html() == "" ) {
		timer.html(time());
	    }
	    
	    if ( box.val().length < last_length && !is_complete() ) {
			clear_extra();
	    }
	    if ( box.val().length - last_length > 10 ) {
	    	box.val(last_typed);
	    }
	    if ( !is_complete() ) {
			box_stats();
			if ( typed_matches() ) {
				colorify(box.val());
				match_function(box.val())
			} else {
				clean_str = sanitize(box.val());
				//console.log("clean: ", clean_str);
				if ( typed_matches(clean_str) ) {
					colorify(clean_str);
					match_function(clean_str);
				} else {
					colorify(clean_str);
					//console.log("no match");
				}
			}
	    }
	}


	

	//////// stuff to draw the quote on the svg ////////
	
	

	
	// CRUD functions for letters
	
	var create_let = function(letter, coord, name) {
	    lett_color = "#968775";
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
		.attr("fill", lett_color);
	    
	    return lett;
	}
	
	var wrong_let = function(letter, coord, name) {
	    if ( letter == " " ) {
		letter = "_";
	    }
	    label = ".C" + rand_int(0, 8000);
	    if ( isMobile ) {
		var size = "1.2em";
	    } else {
		var size = "1.7em";
	    }
	    

	    lett = svg.selectAll(label)
		.data([letter])
		.enter()
		.append("text")
		.attr("id", name)
		.attr("x", coord[0] + 3)
		.attr("y", coord[1] + 3)
		.text(letter)
		.attr("font-family", "Courier New")
		.attr("font-weight", "bold")
		.attr("font-size", size)
		.attr("fill", "#C40C24");
	    
	    return lett;
	}
	    
	
	var get_let = function(name) {
	    lett = svg.selectAll("#" + name);
	    if ( lett[0].length == 0 ) {
		return false;
	    }
	    return lett;
	}
	
	var fill_let = function(name) {
	    var fill_color = "#EB0ED1"
	    lett = get_let(name);
	    lett.transition()
		.duration(0)
		.attr("fill", fill_color);
	    return lett;
	}

	var unfill_let = function(name) {
	    var deleted_color = "#8DA69F"
	    lett = get_let(name);
	    lett.transition()
		.duration(20)
		.attr("fill", deleted_color);
	    return lett;
	}
	
	var kill_let = function(lett) {
	    lett.transition()
		.attr("opacity", 0)
		.duration(20).remove()
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
	    ht = buf * 2 + (num_rows + 2) * spacing * 1.3;
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

	// Placing the attribution & wpm

	var place_supplement = function(text, kind) {
	    // uses globals attr, buf, numrows, spacing
	    var attr_color = "#4B947F";
	    if ( kind == "attribution" ) {
		x = 2 * buf;
		id = "attribution";
		size = "1.5em";
	    } else {
		x = w - buf * 4;
		id = "wpm-display";
		size = "2.5em";
		attr_color = "#E38DA1";
	    }
	    y = buf + (numrows + 2) * spacing * 1.3;
	    
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
		.attr("fill", attr_color);
	    
	    return lett;

	}

	var display_wpm = function() {
	    typing_speed = $("#speed").html() + " WPM";
	    prev_wpm = get_let("wpm-display")
	    if ( prev_wpm ) {
		prev_wpm.transition()
		    .text(typing_speed);
	    } else {
	    place_supplement(typing_speed, "wpm");
	    }
	}
	    

	// Signal that the game is complete

	var display_complete = function() {
	    flash_color = "#00FBFF";
	    complete_color = "#67008A"
	    for ( i = 0; i < quote.length; i++ ) {
			bad = get_let("W" + i);
			if ( bad ) {
			    kill_let(bad);
			}
			lett = get_let("A" + i);
			if (lett) {
				lett.transition()
				    .delay(500)
				    .duration(350)
			    	.attr("fill", flash_color);
				lett.transition()
			    	.delay(850)
			    	.duration(2200)
			    	.attr("fill", complete_color);
		    }
	   	}

	    attribution = get_let("attribution");
	    attribution.transition()
		.delay(500)
		.duration(350)
		.attr("fill", flash_color)
		.attr("x", buf);
	    attribution.transition()
		.delay(850)
		.duration(2200)
		.attr("fill", complete_color);
	    spd = get_let("wpm-display")
    	spd_place = Math.floor(w/2 - buf * 1.5);
    	console.log("WIDTH", w, spd_place);
		spd.transition()
		    .delay(1700)
		    .duration(1000)
		    .attr("x", spd_place)
		    .attr("fill", "#FFAE00");
	    setTimeout(function() {$("#typing-box").hide("slow"); }, 500);
	    setTimeout(function() {ready_submit(); }, 1750);
	}

	var ready_submit = function() {
	    spd = $("#speed").html() * 1;
	    console.log(spd);
	    $("#highscore_score").val(spd);
	    console.log("showing...");
	    $(".showable").show("slow");
	}

	    
	    


	// Doing stuff

	coords = coord_maker(quote); //declared above	
	draw_sentence(quote);
	place_supplement(attr, "attribution");
	if ( $("#reload").html() == "true" ) {
		$(".showable").show();
		$("#typing-box").hide();
	}
}



var start = function() {
	console.log( $("#page_name").html() );
	if ( $("#page_name").html() == "Game" ) {
		highscore_script();
	} else if ( $("#page_name").html() == "Home" ) {
		landing_script();
	}
}

$(document).ready(function() {
	start();
});



