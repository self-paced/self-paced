package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"math/rand"
	"strconv"

	"github.com/super-studio/ecforce_ma/graph/generated"
	"github.com/super-studio/ecforce_ma/graph/model"
)

func (r *mutationResolver) CreateAccount(ctx context.Context, input model.NewAccount) (*model.Account, error) {
	account := model.Account{
		Number:  RandomString(20),
		Company: input.Company,
		Name:    input.Name,
		Status:  true,
	}
	r.DB.Create(&account)
	return &account, nil
	// panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) UpdateAccount(ctx context.Context, input model.EditAccount) (*model.Account, error) {
	account := model.Account{Number: input.Number}
	r.DB.First(&account)

	account.Name = input.Name
	account.Company = input.Company
	account.Status = input.Status
	r.DB.Save(&account)
	return &account, nil
}

func (r *mutationResolver) CreateAccountUser(ctx context.Context, input model.NewAccountUser) (*model.AccountUser, error) {
	account_user := model.AccountUser{
		Number:   RandomString(20),
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
		Status:   true,
		Account:  &model.Account{ID: input.AccountID},
	}

	r.DB.Create(&account_user)
	return &account_user, nil

	// panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) UpdateAccountUser(ctx context.Context, input model.EditAccountUser) (*model.AccountUser, error) {
	account_user := model.AccountUser{ID: input.ID}
	r.DB.First(&account_user)

	account_user.Email = input.Email
	account_user.Password = input.Password
	account_user.Status = true

	fmt.Println("db: ", &account_user)
	r.DB.Save(&account_user)
	return &account_user, nil
}

func (r *mutationResolver) DeleteAccountUser(ctx context.Context, input model.DeleteAccountUser) (*model.AccountUser, error) {
	account_user := model.AccountUser{ID: input.ID}
	r.DB.First(&account_user)
	r.DB.Delete(&account_user)
	return &account_user, nil
}

func (r *mutationResolver) CreateAccountMeta(ctx context.Context, input model.NewAccountMeta) (*model.AccountMeta, error) {
	account_meta := model.AccountMeta{
		Key:     input.Key,
		Value:   input.Value,
		Account: &model.Account{ID: input.AccountID},
	}

	r.DB.Debug().Create(&account_meta)
	return &account_meta, nil
}

func (r *mutationResolver) UdpateAccountMeta(ctx context.Context, input model.EditAccountMeta) (*model.AccountMeta, error) {
	account_meta := model.AccountMeta{ID: input.ID, AccountID: input.AccountID}
	r.DB.First(&account_meta)

	account_meta.Value = input.Value
	r.DB.Save(&account_meta)

	return &account_meta, nil
}

func (r *queryResolver) Accounts(ctx context.Context) ([]*model.Account, error) {
	var accounts []*model.Account
	r.DB.Debug().Preload("AccountUsers").Find(&accounts)
	return accounts, nil
}

func (r *queryResolver) Account(ctx context.Context, id string) (*model.Account, error) {
	accountID, err := strconv.Atoi(id)
	if err != nil {
		return nil, err
	}
	var account *model.Account
	if err := r.DB.Debug().Preload("AccountMeta").Preload("AccountUsers").Find(&account, accountID).Error; err != nil {
		return nil, err
	}
	return account, nil
}

func (r *queryResolver) AccountUsers(ctx context.Context) ([]*model.AccountUser, error) {
	var users []*model.AccountUser
	r.DB.Debug().Preload("Account").Find(&users)
	return users, nil
}

func (r *queryResolver) AccountUser(ctx context.Context, id string) (*model.AccountUser, error) {
	userID, err := strconv.Atoi(id)
	if err != nil {
		return nil, err
	}
	var user *model.AccountUser
	if err := r.DB.Debug().Preload("Account").Find(&user, userID).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (r *queryResolver) DataTypes(ctx context.Context) ([]*model.DataType, error) {
	var data_types []*model.DataType
	r.DB.Debug().Find(&data_types)
	return data_types, nil
}

func (r *queryResolver) DataType(ctx context.Context, id int) (*model.DataType, error) {
	var data_type *model.DataType
	if err := r.DB.Debug().Find(&data_type, id).Error; err != nil {
		return nil, err
	}
	return data_type, nil
}

func (r *queryResolver) Data(ctx context.Context, accountID int) ([]*model.Data, error) {
	var data []*model.Data

	if err := r.DB.Debug().Find(&data, accountID).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *queryResolver) Datum(ctx context.Context, accountID int, id int) (*model.Data, error) {
	var data *model.Data
  r.DB.Debug().Where(&model.Data{ AccountID: accountID, ID: id}).First(&data)
	return data, nil
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
func RandomString(n int) string {
	var letter = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	b := make([]rune, n)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}
