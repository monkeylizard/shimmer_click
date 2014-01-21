require 'spec_helper'

describe "highscores/show" do
  before(:each) do
    @highscore = assign(:highscore, stub_model(Highscore,
      :name => "Name",
      :score => 1.5
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/1.5/)
  end
end
