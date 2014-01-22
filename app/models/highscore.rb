class Highscore < ActiveRecord::Base
	validates :name, presence: true, length: { maximum: 40 }
end
