package models

type CategoryAssignment struct {
	Id         int    `db:"id" gorm:"primary_key" json:"id,int"`
	CategoryId int    `db:"category_id"`
	PostId     int    `db:"post_id" json:"post_id,int,omitempty"`
	Table      string `db:"table"`
}

func (Category) TableName() string {
	return "category_assignment"
}
