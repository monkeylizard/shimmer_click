require 'spec_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

describe QuotesController do

  # This should return the minimal set of attributes required to create a valid
  # Quote. As you add validations to Quote, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) { { "content" => "MyString" } }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # QuotesController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET index" do
    it "assigns all quotes as @quotes" do
      quote = Quote.create! valid_attributes
      get :index, {}, valid_session
      assigns(:quotes).should eq([quote])
    end
  end

  describe "GET show" do
    it "assigns the requested quote as @quote" do
      quote = Quote.create! valid_attributes
      get :show, {:id => quote.to_param}, valid_session
      assigns(:quote).should eq(quote)
    end
  end

  describe "GET new" do
    it "assigns a new quote as @quote" do
      get :new, {}, valid_session
      assigns(:quote).should be_a_new(Quote)
    end
  end

  describe "GET edit" do
    it "assigns the requested quote as @quote" do
      quote = Quote.create! valid_attributes
      get :edit, {:id => quote.to_param}, valid_session
      assigns(:quote).should eq(quote)
    end
  end

  describe "POST create" do
    describe "with valid params" do
      it "creates a new Quote" do
        expect {
          post :create, {:quote => valid_attributes}, valid_session
        }.to change(Quote, :count).by(1)
      end

      it "assigns a newly created quote as @quote" do
        post :create, {:quote => valid_attributes}, valid_session
        assigns(:quote).should be_a(Quote)
        assigns(:quote).should be_persisted
      end

      it "redirects to the created quote" do
        post :create, {:quote => valid_attributes}, valid_session
        response.should redirect_to(Quote.last)
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved quote as @quote" do
        # Trigger the behavior that occurs when invalid params are submitted
        Quote.any_instance.stub(:save).and_return(false)
        post :create, {:quote => { "content" => "invalid value" }}, valid_session
        assigns(:quote).should be_a_new(Quote)
      end

      it "re-renders the 'new' template" do
        # Trigger the behavior that occurs when invalid params are submitted
        Quote.any_instance.stub(:save).and_return(false)
        post :create, {:quote => { "content" => "invalid value" }}, valid_session
        response.should render_template("new")
      end
    end
  end

  describe "PUT update" do
    describe "with valid params" do
      it "updates the requested quote" do
        quote = Quote.create! valid_attributes
        # Assuming there are no other quotes in the database, this
        # specifies that the Quote created on the previous line
        # receives the :update_attributes message with whatever params are
        # submitted in the request.
        Quote.any_instance.should_receive(:update).with({ "content" => "MyString" })
        put :update, {:id => quote.to_param, :quote => { "content" => "MyString" }}, valid_session
      end

      it "assigns the requested quote as @quote" do
        quote = Quote.create! valid_attributes
        put :update, {:id => quote.to_param, :quote => valid_attributes}, valid_session
        assigns(:quote).should eq(quote)
      end

      it "redirects to the quote" do
        quote = Quote.create! valid_attributes
        put :update, {:id => quote.to_param, :quote => valid_attributes}, valid_session
        response.should redirect_to(quote)
      end
    end

    describe "with invalid params" do
      it "assigns the quote as @quote" do
        quote = Quote.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        Quote.any_instance.stub(:save).and_return(false)
        put :update, {:id => quote.to_param, :quote => { "content" => "invalid value" }}, valid_session
        assigns(:quote).should eq(quote)
      end

      it "re-renders the 'edit' template" do
        quote = Quote.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        Quote.any_instance.stub(:save).and_return(false)
        put :update, {:id => quote.to_param, :quote => { "content" => "invalid value" }}, valid_session
        response.should render_template("edit")
      end
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested quote" do
      quote = Quote.create! valid_attributes
      expect {
        delete :destroy, {:id => quote.to_param}, valid_session
      }.to change(Quote, :count).by(-1)
    end

    it "redirects to the quotes list" do
      quote = Quote.create! valid_attributes
      delete :destroy, {:id => quote.to_param}, valid_session
      response.should redirect_to(quotes_url)
    end
  end

end
