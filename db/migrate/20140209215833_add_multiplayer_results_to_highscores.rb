class AddMultiplayerResultsToHighscores < ActiveRecord::Migration
  def change
  	add_column :highscores, :opponent_name, :string
  	add_column :highscores, :victory, :integer
  end
end
