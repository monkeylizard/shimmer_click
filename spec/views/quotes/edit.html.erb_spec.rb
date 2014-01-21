require 'spec_helper'

describe "quotes/edit" do
  before(:each) do
    @quote = assign(:quote, stub_model(Quote,
      :content => "MyString",
      :attribution => "MyString"
    ))
  end

  it "renders the edit quote form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", quote_path(@quote), "post" do
      assert_select "input#quote_content[name=?]", "quote[content]"
      assert_select "input#quote_attribution[name=?]", "quote[attribution]"
    end
  end
end
