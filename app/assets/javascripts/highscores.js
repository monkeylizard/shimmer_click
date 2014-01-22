var highscore_script = function() {

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
	    console.log(typed);
	    var words = typed.split(" ").length;
	    var wpm = (words * 60) / (elapsed / 1000);
	    return wpm;
	}
	
	var typed_matches = function() {
	    var typed = $("#typing-box").val();
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

	var colorify = function() {
	    var typed = $("#typing-box").val();
	    if ( typed_matches() ) {
		for ( i = 0; i < typed.length; i++ ) {
		    fill_let("A" + i.toString());
		}
	    } else {
		err = first_error(typed);
		for ( i = err; i < typed.length; i++ ) {
		    if ( !(get_let("W" + i.toString())) ) {
			console.log("BAD", i, typed[i], coords(i), "W" + i.toString() );
			wrong_let(typed[i], coords(i), "W" + i.toString() );
		    }
		}
	    }
	}
	

	var box_stats = function() {
	    var typed = $("#typing-box").val();
	    if ( typed.length > max ) {
		max = typed.length;
	    }
	    last_length = typed.length;
	}

	var clear_extra = function() {
	    var typed = $("#typing-box").val();
	    if ( typed.length > max ) {
		max = typed.length;
	    }
	    for ( i = typed.length; i < max; i++ ) {
		aa = get_let("A" + i.toString());
		ww = get_let("W" + i.toString());
		if ( aa ) { unfill_let("A" + i.toString()); }
		if ( ww ) { kill_let(ww); }
	    }
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
	    if ( !is_complete() ) {
		box_stats();
		colorify();
		if ( typed_matches() ) {
		    console.log("match!");
		    $("#wpm").html( "<span id='speed'>" + wpm().toFixed(1) +  "</span> wpm." );
		    display_wpm();
		    if ( box.val() === quote ) {
			complete();
		    }
		} else {
		    console.log("no match.");
		}
	    }
	}


	

	//////// stuff to draw the quote on the svg ////////
	
	

	
	// CRUD functions for letters
	
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
		.attr("x", coord[0] + 5)
		.attr("y", coord[1] + 5)
		.text(letter)
		.attr("font-family", "serif")
		.attr("font-weight", "bold")
		.attr("font-size", size)
		.attr("fill", "red");
	    
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
		.duration(75)
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
	    complete_color = "#67008A" //"#0E9E9B";
	    complete_attr = "#67008A" //"#E67E80";
	    for ( i = 0; i < quote.length; i++ ) {
		bad = get_let("W" + i);
		if ( bad ) {
		    kill_let(bad);
		}
		lett = get_let("A" + i);
		lett.transition()
		    .delay(500)
		    .duration(350)
		    .attr("fill", flash_color);
		lett.transition()
		    .delay(850)
		    .duration(2200)
		    .attr("fill", complete_color);
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
		.attr("fill", complete_attr);
	    spd = get_let("wpm-display")
    	spd_place = Math.floor(w/2 - buf * 1.5);
    	console.log("WIDTH", w, spd_place);
	    if ( spd ) {
		spd.transition()
		    .delay(1700)
		    .duration(1000)
		    .attr("x", spd_place)
		    .attr("fill", "white");
	    }
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
	$("#quote-display").bind('click', function() {
	    complete();
	});
}
