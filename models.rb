class Score < ActiveRecord::Base
  belongs_to :player
end

class Player < ActiveRecord::Base
  has_many :scores
end
