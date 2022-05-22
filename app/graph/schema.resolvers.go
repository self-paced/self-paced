package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/super-studio/ecforce_ma/graph/generated"
	"github.com/super-studio/ecforce_ma/graph/model"
	data "github.com/super-studio/ecforce_ma/service"
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

func (r *queryResolver) GetObjectTypes(ctx context.Context, accountID int, id int) ([]*model.ObjectType, error) {
	var object_types []*model.ObjectType
	r.DB.Debug().Where("account_id = ? and id = ?", accountID, id).Find(&object_types)
	return object_types, nil
}

func (r *queryResolver) GetObjectType(ctx context.Context, accountID int) (*model.ObjectType, error) {
	var object_type *model.ObjectType
	if err := r.DB.Debug().Find(&object_type, accountID).Error; err != nil {
		return nil, err
	}
	return object_type, nil
}

func (r *queryResolver) GetObjects(ctx context.Context, accountID int) ([]*model.Object, error) {
	var object []*model.Object

	if err := r.DB.Debug().Find(&object, accountID).Error; err != nil {
		return nil, err
	}
	return object, nil
}

func (r *queryResolver) GetObject(ctx context.Context, accountID int, number string, first *int, after *string) (*model.ShopOrderData, error) {
	//  ecforce DBからaccount IDを取得してデータを取得

	var object *model.Object
	r.DB.Debug().Where(&model.Object{AccountID: accountID, Number: number}).First(&object)

	var difinitions []*model.ObjectDifinition
	r.DB.Debug().Where(&model.ObjectDifinition{AccountID: accountID, ObjectID: 1}).Find(&difinitions)

	var query string

	query = `{"query": "query { shopOrders(id: \"cosmedyjp\") {`
	for i := 0; i < len(difinitions); i++ {
		query += difinitions[i].Name + " "
	}
	query += `}}"}`

	// query = `{"query": "query { shopOrders(id: \"cosmedyjp\") { shopId times orderId orderItemId sourceId sourceId}}"}`
	var jsonData = []byte(query)
	request, error := http.NewRequest("POST", "http://ecforce_db_app:8085/query", bytes.NewBuffer(jsonData))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, error := client.Do(request)
	if error != nil {
		panic(error)
	}
	defer response.Body.Close()

	// fmt.Println("response Status:", response.Status)
	// fmt.Println("response Headers:", response.Header)
	body, _ := ioutil.ReadAll(response.Body)
	// fmt.Println("response Body:", string(body))

	var j interface{}

	if err := json.Unmarshal(body, &j); err != nil {
		fmt.Println("[!] " + err.Error())
	}

	var data = model.ShopOrderData{j}

	return &data, nil
}

func (r *queryResolver) GetObjectTmp(ctx context.Context) (*model.ShopOrderTmp, error) {
	var object *model.Object
	r.DB.Debug().Where(&model.Object{AccountID: 1, ID: 1}).First(&object)

	var jsonData = []byte(`{"query": "query { shopOrders(id:  \"cosmedyjp\") { shopId sourceId orderId subtotal }}"}`)

	request, error := http.NewRequest("POST", "http://ecforce_db_app:8085/query", bytes.NewBuffer(jsonData))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, error := client.Do(request)

	if error != nil {
		panic(error)
	}

	defer response.Body.Close()
	body, _ := ioutil.ReadAll(response.Body)

	var j interface{}

	if err := json.Unmarshal(body, &j); err != nil {
		fmt.Println("[!] " + err.Error())
	}
	var data = model.ShopOrderTmp{j}
	return &data, nil
}

func (r *queryResolver) Test(ctx context.Context) (*model.Object, error) {
	data.ListEcforce()
	panic(fmt.Errorf("not implemented"))
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
