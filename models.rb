class Score < ActiveRecord::Base
  belongs_to :player
  validates :points, presence: true
end

class Player < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  has_many :scores, dependent: :destroy
end
