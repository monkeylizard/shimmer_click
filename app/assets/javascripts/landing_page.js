

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


////////////////////////////////////////////////////////////
///		 ////		/////		  /////	    ///	  ///	////
////  ///  ////  ///  /////  //////////  //   ///  //  /////
////  ///  ////  ///  /////  /////////  ////  ///  /  //////
////  /  //////  /   //////  	//////        ///     //////
////  ///  ////  ///   ////  /////////  ////  ///  /  //////
////  ///  ////  ////   ///  /////////  ////  ///  //   ////
///		 ///	 ////    //		   //   ////   //  ///   ///
////////////////////////////////////////////////////////////



var highscore_script = function() {	

	$("#running").html("true");

	// generates a random number in an inclusive range
	
	var rand_int = function(low, high) {
	    base = Math.random();
	    return Math.floor( base * (high + 1 - low) ) + low;
	}

	// get url parameters

	function get_URL_parameter(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (i = 0; i < sURLVariables.length; i++ ) {
			var sParameterName = sURLVariables[i].split('=');
			if ( sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}
	
	// get the quote and attribution

	var numquotes = parseInt($("#numquotes").html());
	var quotenum = get_URL_parameter("quote") - 1;
	if (!(quotenum+1)) {
		quotenum = rand_int(0,numquotes-1);		
	}

	var quote = $("#quote" + quotenum).html();
	var attr = $("#attr" + quotenum).html();
	$("#highscore_quote_attr").val(attr);
	$("#highscore_quote_id").val(quotenum+1);
	console.log(quote, attr);
	
	$("#typing-box").bind('keyup', function() {
	    typing_check();
	});

	// determine whether this is a multiplayer game and make sure clients agree

	var multiplayer = false;
	var opponent = get_URL_parameter("challengee");
	challenger = true;
	if (!opponent) {
		opponent = get_URL_parameter("challenger");
		challenger = false;
	}
	if (opponent) {
		multiplayer = true;
		opponent_channel = dispatcher.subscribe(opponent);
	}

	console.log("multiplayer debug", multiplayer, opponent);

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
	var cursor; // assigned to make_cursor(0) after make_cursor is defined.
	var max = 0; // used by box_stats
	var last_length = 0; // used by box_stats
	var numrows; // used by recalculate_hight
	var spacing = 17;
	var logged_in = false;
	if ( $("#user_name").html() != "" ) {
		logged_in = $("#user_name").html();
	}
	console.log("Logged in:", logged_in)
	if ( logged_in ) {
		$("#highscore_name").val(logged_in);
		$("#name").addClass("hidden");
	}


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
	    if ( multiplayer ) {
	    	send_game_complete();
	    	if ( !winner ) {
	    		winner = user_name;
	    		display_complete();
	    	} else {
	    		display_complete();
	    		setTimeout(function() {
	    			console.log("winner is", winner);
	    			display_winner( winner );
	    		}, 3000);
	    	}
	    } else {
		    display_complete()
		}
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
	dbl_space = false;
	var typing_check = function() {
	    var timer = $("#timer");
	    var box = $("#typing-box");
	    var box_str = box.val();
	    var box_len = box_str.length
	    if ( dbl_space ) {
	    	box_str = sanitize(box_str);
	    }
		cursor = cursor_update(cursor, box_len);
		if ( multiplayer ) {
			send_game_update(wpm().toFixed(1), box_len);
		}
		update_progress_bar("self-progress-bar", box_len);
	    if ( timer.html() == "" ) {
			timer.html(time());
	    }
	    
	    if ( box_len < last_length && !is_complete() ) {
			clear_extra();
	    }
	    if ( box_len - last_length > 10 ) {
	    	box.val(last_typed);
	    }
	    if ( !is_complete() ) {
			box_stats();
			if ( typed_matches() ) {
				colorify(box_str);
				match_function(box_str);
				//cursor = cursor_update(cursor, box.val().length);
			} else {
				if ( !dbl_space ) {
					box_str = sanitize(box_str);
					if ( typed_matches(box_str) ) {
						console.log("match with double space");
						colorify(box_str);
						match_function(box_str);
						dbl_space = true;
						return;
					}
				}

				colorify(box_str);
				match_function(box_str);
				//console.log("no match");
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
		console.log("WRONG: ", letter);
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
		.duration(0)
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
	    ht = buf * 2 + (num_rows + 6) * spacing * 1.3;
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

	var display_text = function(text, id, x, y, font, weight, size, color, align_right) {
		if (typeof align_right === 'undefined') { 
			anchor = "start";
		} else if ( typeof align_right === 'boolean' ) {
			if ( align_right ) {
				anchor = "end";
			} else {
				anchor = "start";
			}
		} else {
			anchor = align_right;
		}

	    label = ".C" + rand_int(0, 8000);
		txt = svg.selectAll(label)
			.data([text])
			.enter()
			.append("text")
			.attr("id", id)
			.attr("x", x)
			.attr("y", y)
			.text(text)
			.attr("font-family", font)
			.attr("font-weight", weight)
			.attr("font-size", size)
			.attr("fill", color)
			.attr("text-anchor", anchor);

		return txt
	}

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

	    lett = display_text(text, id, x, y, "Calibri", "bold", size, attr_color);
	    
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

	var make_cursor = function( position ) {
		// text, id, x, y, font, weight, size, color
		cursor_id = "cursor";
		cursor_coord = coords(position);
		font = "Courier New";
		weight = "bold";
	    cursor_label = ".C" + rand_int(0, 8000);
	    if ( isMobile ) {
		var cursor_size = "1em";
	    } else {
		var cursor_size = "1.5em";
	    }
		color = "#FFAE00";
		cursor_new = display_text( "_", cursor_id, cursor_coord[0], cursor_coord[1], font, weight, cursor_size, color );
		return cursor_new;
	}

	var cursor_update = function ( cursor, position ) {
		coord = coords(position);
		cursor.transition()
			.duration(0)
			.attr("x", coord[0])
			.attr("y", coord[1]);
		return cursor;
	}
	    
	var send_game_update = function(wpm, position) {
		game_update = {'wpm': wpm, 'position': position }
		opponent_channel.trigger('game_update', game_update);
	}

	var send_game_complete = function() {
		game_complete = { 'game_complete': true }
		opponent_channel.trigger('game_complete', game_complete);
	}

	// Signal that the game is complete

	var display_complete = function() {
		opponent_info_fields();
	    flash_color = "#00FBFF";
	    complete_color = "#67008A"

	    // remove stray red letters and recolor main text
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

	   	// move and recolor attribution
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

		if ( multiplayer ) {
			if ( winner === user_name ) {
				win_name = get_let("self_wpm_name");
				win_spd = get_let("wpm-display");
			} else {
				win_name = get_let("opponent_wpm_name");
				win_spd = get_let("opponent-wpm-display");
			}
			win_name.transition()
			    .delay(1700)
			    .duration(1000)
			    .attr("x", w/2)
			    .attr("text-anchor", "end")
			    .attr("fill", "#FFAE00");

			win_spd.transition()
			    .delay(1700)
			    .duration(1000)
			    .attr("x", w/2 + 15)
			    .attr("text-anchor", "start")
			    .attr("fill", "#FFAE00");
		} else {

			// move and recolor wpm display
			spd = get_let("wpm-display");
			spd.transition()
			    .delay(1700)
			    .duration(1000)
			    .attr("x", w/2)
			    .attr("text-anchor", "middle")
			    .attr("fill", "#FFAE00");
		}

	    setTimeout(function() {
	    	$("#typing-box").hide("slow"); 
	    	cursor.remove();
	    }, 500);
	    setTimeout(function() { ready_submit(); }, 1750);
	}

	var ready_submit = function() {
	    spd = $("#speed").html() * 1;
	    $("#highscore_score").val(spd);
	    $(".showable").show("slow");
	}

	// functions for multiplayer handshake //


	var display_waiting = function() {
		str = "Waiting for opponent . . .";
		id = "waiting_text"
		x = w/2.1
		y = h / 3;
		font = "Courier New";
		weight = "bold";
		size = "2em";
		color = "#968775";
		wait = display_text(str, id, x, y, font, weight, size, color, "middle");
		return wait;
	}

	var countdown_number = function( number ) {
		id = "countdown" + number;
		x = w/2 + 15
		y = ( h / 3 );
		font = "Courier New";
		weight = "bold";
		size = "1.7em";
		color = "#FFAE00";
		num = display_text(number, id, x, y, font, weight, size, color, "start");
		setTimeout(function() { kill_let(num); }, 900);
	}

	var start_countdown = function( start_time ) {
		countdown_text = display_text("Starting in . . . ", "countdown_text", w/2, h / 3, "Courier New", "bold", "2em", "#968775", "end");
		time_now = new Date().getTime();
		console.log("now: " + time_now);
		console.log("start: " + start_time);
		time_3 = start_time - 3000;
		time_2 = start_time - 2000;
		time_1 = start_time - 1000;
		times = [time_3, time_2, time_1];
		k = 0;
		for ( i = 0; i < times.length; i++ ) {
			if ( times[i] - time_now > 0 ) {
				setTimeout(function() { countdown_number(k); k -= 1; }, times[i] - time_now)
				console.log(i + ": ", times[i] - time_now)
				k += 1;
			}
		}
		setTimeout( function() {  kill_let(countdown_text); game_start(); }, start_time - time_now );
		console.log("start at: ", start_time - time_now)
	}

	var game_start = function() {
		start = { 'start': true }
		self_channel.trigger('start', start);
	}

	var display_opponent_wpm = function( opponent_wpm ) {
		x = w - buf * 4;
		id = "opponent-wpm-display";
		size = "2.5em";
		color = "#E38DA1";
	    y = buf + (numrows + 3) * spacing * 1.5;
	    opponent_wpm_display = display_text(opponent_wpm + " WPM", id, x, y, "Calibri", "bold", size, color);
	    return opponent_wpm_display
	}

	var update_opponent_wpm = function( opponent_wpm ) {
		opponent_wpm_display.transition()
			.text(opponent_wpm);
	}

	var display_wpm_names = function() {
		x = w - buf * 4 - 15;
		id1 = "self_wpm_name";
		id2 = "opponent_wpm_name";
		size = "2.5em";
		color = "#E38DA1";
		y1 = buf + (numrows + 2) * spacing * 1.3;
		y2 = buf + (numrows + 3) * spacing * 1.5;
		self_wpm_name = display_text(user_name, id1, x, y1, "Calibri", "bold", size, color, true);
		opponent_wpm_name = display_text(opponent, id2, x, y2, "Calibri", "bold", size, color, true);
	}

	var opponent_complete = function(lost) {
		oppo_name = get_let("opponent_wpm_name");
		oppo_spd = get_let("opponent-wpm-display");
		
		if ( lost ) {
			oppo_color = "#67008A";
		} else {
			oppo_color = "#FFAE00";
		}
		
		oppo_name.transition()
			.attr("fill", oppo_color);
		oppo_spd.transition()
			.attr("fill", oppo_color);
	}

	var display_winner = function() {
		text = winner
		id = "win_banner"
		x = w / 2
		y = buf + (numrows + 5) * spacing * 1.5;
		font = "Calibri";
		weight = "bold";
		size = "2.5em";
		color = "#FFAE00";
		anchor = "middle";
		win_banner1 = display_text(winner, id, x, y, font, weight, size, color, "end");
		win_banner2 = display_text("wins!", id, x + 15, y, font, weight, size, color, "start");
		return [win_banner1, win_banner2];
	}

	var opponent_info_fields = function() {
		if ( multiplayer ) {
			$("#highscore_opponent_name").val(opponent);
			if ( winner === user_name ) {
				$("#highscore_victory").val(1);
			} else {
				$("#highscore_victory").val(2);
			}
		} else {
			$("#highscore_opponent_name").val("Solo game");
			$("#highscore_victory").val(0);
		}
	}

	var opponent_progress_bar = function() {
	    label = ".C" + rand_int(0, 8000);
	    label2 = ".C" + rand_int(0, 8000);
	    label3 = ".C" + rand_int(0, 8000);
	    bar = svg.selectAll(label)
	    		.data([1])
	    		.enter()
	    		.append('rect')
	    		.attr("id", "opponent-progress-bar")
	    		.attr("height", 5)
	    		.attr("width", buf)
	    		.attr("x", 0)
	    		.attr("y", buf/4)
	    		.attr("fill", "#C2FFE6")
	    bar_label = svg.selectAll(label2)
	    		.data([1])
	    		.enter()
	    		.append("text")
	    		.text(opponent)
	    		.attr("height", 5)
	    		.attr("x", 0)
	    		.attr("y", buf/4 + 10)
	    		.attr("font-family", "Courier New")
	    		.attr("fill", "#FFC2DB")
	    bar_end = svg.selectAll(label3)
	    		.data([1])
	    		.enter()
	    		.append("rect")
	    		.attr("height", 5)
	    		.attr("width", buf)
	    		.attr("x", w-buf)
	    		.attr("y", buf/4)
	    		.attr("fill", "#FFC2DB")
	    return bar;
	}

	var self_progress_bar = function() {
	    label = ".C" + rand_int(0, 8000);
	    label2 = ".C" + rand_int(0, 8000);
	    label3 = ".C" + rand_int(0, 8000);
	    bar = svg.selectAll(label)
	    		.data([1])
	    		.enter()
	    		.append('rect')
	    		.attr("id", "self-progress-bar")
	    		.attr("height", 5)
	    		.attr("width", buf)
	    		.attr("x", 0)
	    		.attr("y", buf/4 - 5)
	    		.attr("fill", "#FFC2DB")
	    bar_label = svg.selectAll(label2)
	    		.data([1])
	    		.enter()
	    		.append("text")
	    		.text(user_name)
	    		.attr("height", 5)
	    		.attr("width", buf)
	    		.attr("x", 0)
	    		.attr("y", buf/4 - 5)
	    		.attr("font-family", "Courier New")
	    		.attr("fill", "#C2FFE6")
	    bar_end = svg.selectAll(label3)
	    		.data([1])
	    		.enter()
	    		.append("rect")
	    		.attr("height", 5)
	    		.attr("width", buf)
	    		.attr("x", w-buf)
	    		.attr("y", buf/4 - 5)
	    		.attr("fill", "#C2FFE6")
	    return bar;
	}

	var update_progress_bar = function(bar, position) {
		prog_bar = get_let(bar);
		percent = position / quote.length;
		new_width = (w - (2 * buf)) * percent + buf;
		prog_bar.transition()
			.duration(1)
			.attr("width", new_width);
	}

	if ( multiplayer ) {
		waiting_text = display_waiting();
		// handshake stuff

		var stage = 0;
		// at stage 0, send presence check, and
		// listen for presence check and game stats.
		// If you receive a presence check, send game stats
		// then go to stage 1 and listen for
		// confirmation. 
		// 		If you receive game stats:
		// if they match, send confirmation success, 
		// start the game, and go to stage 2, where you stop
		// listening for handshake info. If they don't,
		// send confirmation failure and redirect yourself
		// to the correct game page.
		//
		// At stage 1, if you receive confirmation success,
		// go to stage 2 andstart the game. If you receive
		// confirmation failure, return to stage 0 and wait
		// for a presence check while your opponent reloads.
		//
		// At stage 2, the game is on, and you're not listening
		// for handshake info anymore.

		if ( challenger ) {
			var p1 = user_name;
			var p2 = opponent;
		} else {
			var p1 = opponent;
			var p2 = user_name;
		}
		game_stats = {
			'challenger': p1,
			'challengee': p2,
			'quote': quotenum					
		}

		presence_check = { 'presence': true }
		opponent_channel.trigger('presence_check', presence_check); // I'm here!

		self_channel.bind('presence_check', function(data) {
			if ( stage === 0 ) {
				// as soon as the opponent is here, send game stats and stop listening for their game stats
				opponent_channel.trigger('game_stats', game_stats);
			}
			stage = 1
		});

		self_channel.bind('game_stats', function(data) {
			if ( stage === 0 ) {
				if ( data.challenger === p1 && data.challengee === p2 && data.quote === quotenum ) {
					// say 'all checks out', and start the game
					var time_now = new Date();
					var start_time = time_now.getTime() + 5000;
					confirmation = { 'success': true, 'start_time': start_time }
					opponent_channel.trigger('confirmation', confirmation);
					stage = 2;
					// start game
					kill_let(waiting_text);
					start_countdown(start_time);
				} else {
					// say 'oops, not quite', and redirect to the proper game page
					if ( data.challenger !== p1 || data.challengee !== p2 ) {
						challenger = !challenger;
					}
					confirmation = { 'success': false }
					opponent_channel.trigger('confirmation', confirmation);
					if ( challenger ) {
						var ch_string = "challengee";
					} else {
						var ch_string = "challenger";
					}
					window.location.href = '/game?quote=' + data.quote + '&' + ch_string + '=' + opponent;
				}
			}
		});

		self_channel.bind('confirmation', function(data) {
			if ( stage === 1 ) {
				if ( data.success ) {
					stage = 2;
					kill_let(waiting_text);
					start_countdown(data.start_time);
					// start game
				} else {
					// go back to listening for presence while the other person reloads
					stage = 0;
				}
			}
		});

		// Display opponent's wpm and add names to wpm displays //

		

		opponent_wpm_display = false;
		self_channel.bind('game_update', function(data) {
			opponent_wpm = data.wpm;
			if ( opponent_wpm_display ) {
				update_opponent_wpm(opponent_wpm);
			} else {
				opponent_wpm_display = display_opponent_wpm(opponent_wpm);
			}
			update_progress_bar("opponent-progress-bar", data.position);
		});
		var winner = false;

		self_channel.bind('game_complete', function(data) {
			if ( !winner ) {
				opponent_complete(false);
				winner = opponent;
			} else {
				opponent_complete(true);
				setTimeout(function() {
					display_winner(winner);
				}, 1000);
			}
		});

	} else {
		console.log('single player start');
		start_cycle = setInterval(function() {
			start_game = { 'start': true }
			self_channel.trigger('start', start_game);
			update_to(self_channel, "trying to start");
		}, 500);
		self_channel.bind('started', function(data) {
			clearInterval(start_cycle);
		})
	}
	    


	// Doing stuff
	var started = false;
	self_channel.bind('start', function(data) {
		if ( !started ) {
			started = {'started': true};
			self_channel.trigger('started', started);
			coords = coord_maker(quote); //declared above
			cursor = make_cursor(0); //declared above
			draw_sentence(quote);
			if ( multiplayer ) {
				display_wpm_names();
				oppo_progress_bar = opponent_progress_bar();
				progress_bar = self_progress_bar();
			}
			place_supplement(attr, "attribution");
			if ( $("#reload").html() == "true" ) {
				$(".showable").show();
				$("#typing-box").hide();
			}
			$("#users-header").trigger('click');
		}
	});
}

//// Trigger everything ////

var start = function() {
	console.log( $("#page_name").html() );
	if ( $("#page_name").html() == "Game" ) {
		highscore_script();
	} else if ( $("#page_name").html() == "Home" ) {
		landing_script();
	}
}

//// WEBSOCKETY STUFF FOR LIVE UPDATING ////
var anonymous = false;
if ( typeof user_name !== 'string' ) {
	console.log("anon");
	user_name = "anonymous";
	var anonymous = true;
}

console.log(user_name);
var dispatcher = new WebSocketRails('shimmer-click.herokuapp.com/websocket');
var self_channel = dispatcher.subscribe(user_name);
var user_list = [];

dispatcher.on_open = function(data) {
	console.log('Connection open!');
}

dispatcher.bind('update', function(data) {
	console.log(data.message);
});

// receive updates on personal channel
self_channel.bind('update', function(data) {
	console.log(data.sent_by + ": " + data.update);
});

var update_to = function(channel, message) {
	update = {'sent_by': user_name, 'update': message}
	channel.trigger('update', update);
}


var post = function(message) {
	console.log("posting " + message);
	post_send = {'post': message};
	dispatcher.trigger('post_to_log', post_send);
}

// DISPLAYING USERS //

if ( !anonymous ) {
	dispatcher.bind('update_users', function(data) {
		user_list = data.user_list;
		console.log(user_list);
		if (user_list[0]) {
			display_users();
		}
	});

	var display_users = function() {
		display_str = "";
		self_pos = 0;
		for ( i = 0; i < user_list.length; i++ ) {
			console.log("clearing user list", i);
			if ( user_list[i] === user_name ) {
				user_list.splice(i, 1);
				break;
			} else {
				console.log(user_list[i], user_name);
			}
		}
		for (i = 0; i < user_list.length - 1; i++ ) {
			console.log("Online user: ", user_list[i]);
			display_str += '<div class="user">' + user_list[i] + '</div><hr>';
		}
		if ( user_list[0] ) {
			display_str += '<div class="user">' + user_list[user_list.length-1] + '</div>';
		}
		if ( display_str === "" ) {
			display_str += '<div>Nobody :(</div>';
		}
		$("#user-list").html(display_str);
		$(".user").on('click', function(){
			console.log("click!");
			name = $(this).html();
			console.log(name);
			challenge_start(name);
		});
	}

	$("#users-header").on('click', function() {
		$("#users-header").toggle();
		$("#user-list").toggle();
		$("#users-hidden").toggle();
	});

	$("#users-hidden").on('click', function() {
		$("#users-header").toggle();
		$("#user-list").toggle();
		$("#users-hidden").toggle();
	});



	//// CHALLENGE ANOTHER USER ////

	if (typeof opponent === 'undefined') {
		var opponent = false;
	}

	var challenge_user = function(response) {
		quotenum = response.quotenum
		console.log("Challenging " + opponent + " on quote " + quotenum);
		var opponent_channel = dispatcher.subscribe(opponent);
		var challenge = { 'challenger': user_name, 'quotenum': quotenum }
		opponent_channel.trigger('challenge', challenge);
		show_issued_challenge(opponent, quotenum);
	}

	var quotenum_failure = function(response) {
		console.log("Something went wrong; no quotenum could be found.");
	}

	var challenge_start = function(user) {
		opponent = user;
		quotenum_request = {'request': true}
		dispatcher.trigger('request_quotenum', quotenum_request, challenge_user, quotenum_failure);
	}

		// challenge response //

	var challenge_accepted = function(respondant, challenge_num) {
		console.log("challenge accepted!", challenge_num);
		div = $("#challenge-" + challenge_num);
		div.html(respondant + " accepts!<br><div id='go-" + challenge_num + "' class='go-challenge text-center'>go!</div>");
		$("#go-" + challenge_num).on('click', function() {
			window.location.href = "/game?challengee=" + respondant + "&quote=" + challenges[challenge_num][1];
		});
	}

	var challenge_declined = function(respondant, challenge_num) {
		console.log("challenge declined", challenge_num);
		div = $("#challenge-" + challenge_num);
		div.html(respondant + " declines.<br><div id='close-" + challenge_num + "' class='close-challenge text-center'>close</div>");
		$("#close-" + challenge_num).on('click', function() {
			$("#challenge-" + challenge_num).hide();
			$("#challenge-" + challenge_num).html("");
			challenges[challenge_num] = -1;
		});
	}

	self_channel.bind('challenge_response', function(data) {
		if ( data.accept ) {
			respondant_name = data.self;
			console.log(respondant_name + " accepted your challenge!");
			for ( i = 0; i < challenges.length; i++ ) {
				if ( challenges[i][0] === respondant_name ) {
					challenge_accepted(respondant_name, i);
				}
			}

		} else {
			respondant_name = data.self;
			console.log(respondant_name + " declined your challenge.");
			for ( i = 0; i < challenges.length; i++ ) {
				if ( challenges[i][0] === respondant_name ) {
					challenge_declined(respondant_name, i);
				}
			}
		}
	})


		// receive a challenge //

	challenges = [-1, -1, -1];

	var show_challenge = function(challenger, quotenum) {
		for ( i = 0; i < challenges.length; i++ ) {
			if ( challenges[i] === -1 ) { 
				console.log("Showing challenge received on block " + i);
				var challenge_num = i;
				challenges[i] = [challenger, quotenum];
				break;
			}
		}
		if ( !( challenge_num + 1 ) ) { return }
		challenge_div = $("#challenge-" + challenge_num);
		challenge_div.html("Challenge from " + challenger + "<br><div id='accept-" + challenge_num + "' class='accept'>accept</div><div id='decline-" + challenge_num + "' class='decline'>decline</div>");
		challenge_div.show();
		$("#decline-" + challenge_num).on('click', function() {
			decline_challenge(challenger, challenge_num)
		});
		$("#accept-" + challenge_num).on('click', function() {
			accept_challenge(challenger, challenge_num)
		});
	}

	var show_issued_challenge = function(challengee, quotenum) {
		for ( i = 0; i < challenges.length; i++ ) {
			if ( challenges[i] === -1 ) { 
				console.log("Showing challenge issued on block " + i);
				var challenge_num = i;
				challenges[i] = [challengee, quotenum];
				break;
			}
		}
		if ( !( challenge_num + 1 ) ) { return }
		challenge_div = $("#challenge-" + challenge_num);
		challenge_div.html("You challenged " + challengee + "<br>waiting for response...");
		challenge_div.show();
	}

	var decline_challenge = function(challenger, challenge_num) {
		challenger_channel = dispatcher.subscribe(challenger);
		decline = { 'self': user_name, 'accept': false }
		challenger_channel.trigger('challenge_response', decline);
		div = $("#challenge-" + challenge_num);
		div.hide();
		div.html("");
		challenges[challenge_num] = -1;
	}

	var accept_challenge = function(challenger, challenge_num) {
		challenger_channel = dispatcher.subscribe(challenger);
		accept = { 'self': user_name, 'accept': true }
		challenger_channel.trigger('challenge_response', accept);
		window.location.href="/game?challenger=" + challenger + "&quote=" + challenges[challenge_num][1];
	}

	self_channel.bind('challenge', function(data) {
		console.log("Challenge from " + data.challenger + " on quote number " + data.quotenum);
		show_challenge(data.challenger, data.quotenum);
	})
}
//////


//// PRESS PLAY ////

$(document).ready(function() {
	start();
});






















