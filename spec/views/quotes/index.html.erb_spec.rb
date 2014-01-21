require 'spec_helper'

describe "quotes/index" do
  before(:each) do
    assign(:quotes, [
      stub_model(Quote,
        :content => "Content",
        :attribution => "Attribution"
      ),
      stub_model(Quote,
        :content => "Content",
        :attribution => "Attribution"
      )
    ])
  end

  it "renders a list of quotes" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Content".to_s, :count => 2
    assert_select "tr>td", :text => "Attribution".to_s, :count => 2
  end
end
