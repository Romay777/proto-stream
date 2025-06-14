package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
	//"time"
)

type Users interface {
	GetUserByUsername(username, password string) (domain.User, error)
	GetUserByEmail(email, password string) (domain.User, error)
	CreateUser(user domain.User) (int64, error)
	GetUserByIDRequest(id int64) (domain.User, error)
}

type RefreshSession interface {
	CreateRefreshSession(session domain.RefreshSession) (domain.RefreshSession, error)
	DeleteRefreshSession(token domain.RefreshToken) (domain.RefreshSession, error)
}

type WebSocket interface {
	CreateMessage(message domain.Message) error
}

type Repositories struct {
	Users          Users
	RefreshSession RefreshSession
	WebSocket      WebSocket
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		Users:          NewUsersRepo(db),
		RefreshSession: NewRefreshSessionRepo(db),
		WebSocket:      NewWebSocketRepo(db),
	}
}

//func getPaginationOpts(pagination *domain.PaginationQuery) *options.FindOptions {
//	var opts *options.FindOptions
//	if pagination != nil {
//		opts = &options.FindOptions{
//			Skip:  pagination.GetSkip(),
//			Limit: pagination.GetLimit(),
//		}
//	}
//
//	return opts
//}

//func filterDateQueries(dateFrom, dateTo, fieldName string, filter bson.M) error {
//	if dateFrom != "" && dateTo != "" {
//		dateFrom, err := time.Parse(time.RFC3339, dateFrom)
//		if err != nil {
//			return err
//		}
//
//		dateTo, err := time.Parse(time.RFC3339, dateTo)
//		if err != nil {
//			return err
//		}
//
//		filter["$and"] = append(filter["$and"].([]bson.M), bson.M{
//			"$and": []bson.M{
//				{fieldName: bson.M{"$gte": dateFrom}},
//				{fieldName: bson.M{"$lte": dateTo}},
//			},
//		})
//	}
//
//	if dateFrom != "" && dateTo == "" {
//		dateFrom, err := time.Parse(time.RFC3339, dateFrom)
//		if err != nil {
//			return err
//		}
//
//		filter["$and"] = append(filter["$and"].([]bson.M), bson.M{
//			fieldName: bson.M{"$gte": dateFrom},
//		})
//	}
//
//	if dateFrom == "" && dateTo != "" {
//		dateTo, err := time.Parse(time.RFC3339, dateTo)
//		if err != nil {
//			return err
//		}
//
//		filter["$and"] = append(filter["$and"].([]bson.M), bson.M{
//			fieldName: bson.M{"$lte": dateTo},
//		})
//	}
//
//	return nil
//}
