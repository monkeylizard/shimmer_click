class HighscoresController < ApplicationController
  before_action :signed_in_user, only: [:destroy]
  before_action :set_highscore, only: [:show, :edit, :update, :destroy]

  # GET /highscores
  # GET /highscores.json
  def index
    @highscores = Highscore.order(score: :desc)
    @users = User.order(:id)
    @quotes = Quote.all
  end

  # GET /highscores/1
  # GET /highscores/1.json
  def show
    @users = User.order(:id)
    @quotes = Quote.all
  end

  # GET /highscores/new
  def new
    @logged_in = current_user.name if signed_in?
    if signed_in?
      puts "#{current_user.name} began a game"
    end
#    if params[:challenger] || params[:challengee]
#      puts "challenger: #{params[:challenger]}"
#      puts "challengee: #{params[:challengee]}"
 #   end
    @quotes = Quote.all
    @highscore = Highscore.new
  end


  # GET /highscores/1/edit
  def edit
  end


  # POST /highscores
  # POST /highscores.json
  def create
    @quote = Quote.all
    if signed_in?
      @highscore = current_user.highscores.build(highscore_params)
    else
      @highscore = Highscore.new(highscore_params)
      @highscore.user_id = 0
    end

    respond_to do |format|
      if @highscore.save
        format.html { redirect_to @highscore, flash: { info: 'Your score has been saved!' } }
        format.json { render action: 'show', status: :created, location: @highscore }
      else
        format.html { render action: 'new' }
        format.json { render json: @highscore.errors, status: :unprocessable_entity }
      end
    end
  end


  # PATCH/PUT /highscores/1
  # PATCH/PUT /highscores/1.json
  def update
    respond_to do |format|
      if @highscore.update(highscore_params)
        format.html { redirect_to @highscore, flash: { info: 'Highscore was successfully updated.' } }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @highscore.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /highscores/1
  # DELETE /highscores/1.json
  def destroy
    @highscore.destroy
    respond_to do |format|
      format.html { redirect_to highscores_url }
      format.json { head :no_content }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_highscore
      @highscore = Highscore.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def highscore_params
      params.require(:highscore).permit(:name, :score, :quote_attr, :quote_id, :opponent_name, :victory, :challenger, :challengee)
    end
end
