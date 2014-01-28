class UsersController < ApplicationController
  def new
  	@user = User.new
  end

  def create
  	@user = User.new(user_params)
  	if @user.save
      sign_in @user
      flash[:success] = "Welcome to Shimmer & Click!"
  		redirect_to @user
  	else
  		render 'new'
  	end
  end

  def show
  	@user = User.find(params[:id])
  end

  def index
    @users = User.all
  end

  private

  	def user_params
  		params.require(:user).permit(:name, :password, :password_confirmation)
  	end
end