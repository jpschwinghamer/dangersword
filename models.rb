class Score < ActiveRecord::Base
  belongs_to :player
end

class Player < ActiveRecord::Base
  validates :name, uniqueness: true
  has_many :scores
end
