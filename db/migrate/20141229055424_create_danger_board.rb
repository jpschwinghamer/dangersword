class CreateDangerBoard < ActiveRecord::Migration
  def self.up
    create_table :scores do |t|
      t.integer :player_id
      t.integer :points
      t.timestamps null: false
    end

    create_table :players do |t|
      t.string :name
      t.timestamps null: false
    end
  end

  def self.down
    drop_table :scores
  end
end
