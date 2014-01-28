class AddQuoteIdToHighscores < ActiveRecord::Migration
  def change
  	add_column :highscores, :quote_id, :integer
  end
end
