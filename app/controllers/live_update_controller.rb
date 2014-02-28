class LiveUpdateController < WebsocketRails::BaseController

	def initialize_session
		puts "Initializing LiveUpdateController"
		controller_store[:users_online] = []
		# application setup?
	end

	def echo
		puts "echo! #{message[:text]}"
		reply = {:message => message[:text]}
		send_message :update, reply
	end

	def client_connected
		puts "#{current_user.name} connected!"
		controller_store[:users_online].push(current_user.name)
		update_users
	end

	def client_disconnected
		puts "#{current_user.name} disconnected!"
		controller_store[:users_online].delete(current_user.name)
		update_users
	end

	def update_users
		update = {:user_list => controller_store[:users_online]}
		broadcast_message :update_users, update
	end

	def single_update_users
		update = {:user_list => controller_store[:users_online]}
		send_message :update_users, update
	end

	def post_to_log
		puts "#{current_user.name}: #{message[:post]}"
	end

	def quotenum_request
		numquotes = Quote.count
		quotenum = rand(1...numquotes)
		if quotenum
			quotenum_message = { :quotenum => quotenum }
			puts quotenum_message
			trigger_success quotenum_message
		else
			quotenum_message = { :quotenum => false }
			trigger_failure { quotenum_message }
		end
	end
end







