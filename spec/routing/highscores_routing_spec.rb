require "spec_helper"

describe HighscoresController do
  describe "routing" do

    it "routes to #index" do
      get("/highscores").should route_to("highscores#index")
    end

    it "routes to #new" do
      get("/highscores/new").should route_to("highscores#new")
    end

    it "routes to #show" do
      get("/highscores/1").should route_to("highscores#show", :id => "1")
    end

    it "routes to #edit" do
      get("/highscores/1/edit").should route_to("highscores#edit", :id => "1")
    end

    it "routes to #create" do
      post("/highscores").should route_to("highscores#create")
    end

    it "routes to #update" do
      put("/highscores/1").should route_to("highscores#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/highscores/1").should route_to("highscores#destroy", :id => "1")
    end

  end
end
