class SessionsController < ApplicationController
	def  new
	end

	def create
		user = User.find_by(name: params[:session][:name])
		if user && user.authenticate(params[:session][:password])
			sign_in user
			redirect_to user
		else
			flash.now[:danger] = 'Invalid username/password combination'
			render 'new'
			# Create error and rerender signin form
		end
	end

	def destroy
		sign_out
		redirect_to root_url
	end

end
