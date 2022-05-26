package model

type Report struct {
	ID            int               `json:"id"`
	AccountID     int               `json:"accountId"`
	AccountUserID int               `json:"accountUserId"`
	ObjectID      int               `json:"objectId"`
	Number        string            `json:"number"`
	Title         string            `json:"title"`
	Description   *string           `json:"description"`
	WhereQueries  []*WhereQuery     `gorm:"many2many:report_where_queries; json:"whereQueries"`
	RowQueries    []*ReportRowQuery `json:"rowQueries"`
	ColQueries    []*ReportColQuery `json:"colQueries"`
}
