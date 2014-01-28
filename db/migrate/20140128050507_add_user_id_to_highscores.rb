class AddUserIdToHighscores < ActiveRecord::Migration
  def change
  	add_column :highscores, :user_id, :integer
  	add_index :highscores, :user_id
  end
end
