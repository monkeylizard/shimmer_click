class ChangeContentFormatInQuotes < ActiveRecord::Migration
  def change
    change_column :quotes, :content, :text
  end
end
