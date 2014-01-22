class Quote < ActiveRecord::Base
	validates :content, presence: true, length: { minimum: 150, maximum: 450 }
	validates :attribution, presence: true, length: { maximum: 75 }
end
