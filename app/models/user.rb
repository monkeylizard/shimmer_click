class User < ActiveRecord::Base
	has_many :highscores, dependent: :destroy
	before_create :create_remember_token
	validates :name, presence: true, length: { maximum: 40 },
		uniqueness: { case_sensitive: false },
		format: { without: /\s/, message: "cannot contain spaces" }
	has_secure_password
	validates :password, length: { minimum: 6 }

	def User.new_remember_token
		SecureRandom.urlsafe_base64
	end

	def User.encrypt(token)
		Digest::SHA1.hexdigest(token.to_s)
	end

	private

		def create_remember_token
			self.remember_token = User.encrypt(User.new_remember_token)
		end
end
