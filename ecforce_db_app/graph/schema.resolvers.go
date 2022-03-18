package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/super-studio/ecforce_ma/graph/generated"
	"github.com/super-studio/ecforce_ma/graph/model"
)

func (r *mutationResolver) CreateTodo(ctx context.Context, input model.NewTodo) (*model.Todo, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Orders(ctx context.Context) ([]*model.OrdersWithPayment, error) {
	var orders []*model.OrdersWithPayment
	r.DB.Limit(100).Debug().Find(&orders)
	return orders, nil
}

func (r *queryResolver) ShopOrders(ctx context.Context, id string) ([]*model.OrdersWithPayment, error) {
	var orders []*model.OrdersWithPayment
	r.DB.Debug().Where(model.OrdersWithPayment{ShopID: id}).Find(&orders)

	return orders, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *queryResolver) Order(ctx context.Context, id string) (*model.OrdersWithPayment, error) {
	var orders []*model.OrdersWithPayment
	//if err := r.DB.Debug().Find(&orders, id).Error; err != nil {
	// r.DB.Where(&model.OrdersWithPayment{ShopID: id}).Find(&orders)
	r.DB.Where(model.OrdersWithPayment{ShopID: id}).Find(&orders)

	fmt.Println("db: ", &orders)
	//return orders, nil
	panic(fmt.Errorf("not implemented"))
}
func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	panic(fmt.Errorf("not implemented"))
}
