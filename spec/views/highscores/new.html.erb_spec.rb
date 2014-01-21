require 'spec_helper'

describe "highscores/new" do
  before(:each) do
    assign(:highscore, stub_model(Highscore,
      :name => "MyString",
      :score => 1.5
    ).as_new_record)
  end

  it "renders new highscore form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", highscores_path, "post" do
      assert_select "input#highscore_name[name=?]", "highscore[name]"
      assert_select "input#highscore_score[name=?]", "highscore[score]"
    end
  end
end
