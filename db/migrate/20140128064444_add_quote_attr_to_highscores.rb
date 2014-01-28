class AddQuoteAttrToHighscores < ActiveRecord::Migration
  def change
  	add_column :highscores, :quote_attr, :string
  end
end
