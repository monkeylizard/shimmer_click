require 'spec_helper'

describe "highscores/edit" do
  before(:each) do
    @highscore = assign(:highscore, stub_model(Highscore,
      :name => "MyString",
      :score => 1.5
    ))
  end

  it "renders the edit highscore form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", highscore_path(@highscore), "post" do
      assert_select "input#highscore_name[name=?]", "highscore[name]"
      assert_select "input#highscore_score[name=?]", "highscore[score]"
    end
  end
end
