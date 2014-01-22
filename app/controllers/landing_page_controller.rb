class LandingPageController < ApplicationController
  def home
  	@quote = Quote.all
  	@highscores = Highscore.order(score: :desc).limit(10)
  end
end
