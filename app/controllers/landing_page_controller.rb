class LandingPageController < ApplicationController
  def home
  	@quotes = Quote.all
  	@highscores = Highscore.order(score: :desc).limit(10)
  end
end
