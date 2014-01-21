require 'spec_helper'

describe "highscores/index" do
  before(:each) do
    assign(:highscores, [
      stub_model(Highscore,
        :name => "Name",
        :score => 1.5
      ),
      stub_model(Highscore,
        :name => "Name",
        :score => 1.5
      )
    ])
  end

  it "renders a list of highscores" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
  end
end
