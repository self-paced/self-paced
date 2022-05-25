package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/super-studio/ecforce_ma/graph/generated"
	"github.com/super-studio/ecforce_ma/graph/model"
	data "github.com/super-studio/ecforce_ma/service"
	gojsonq "github.com/thedevsaddam/gojsonq/v2"
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

func (r *mutationResolver) CreateReport(ctx context.Context, accountID int, accountUserID int, number string, title string, description *string, filters []*model.Filter, rowIds []*model.Group, colIds []*model.Group) (*model.Report, error) {
	var object *model.Object
	result := r.DB.Debug().Where(&model.Object{AccountID: accountID, Number: number}).First(&object)

	if result.Error != nil {
		return nil, result.Error
	}

	// Insert report
	report := model.Report{
		AccountID:     accountID,
		AccountUserID: accountUserID,
		ObjectID:      object.ID,
		Number:        RandomString(20),
		Title:         title,
		Description:   description,
	}

	result = r.DB.Debug().Create(&report)

	if result.Error != nil {
		fmt.Println(result.Error)
		return nil, result.Error
	}
	fmt.Println(report)

	// gqlgenでassociationできたら書き換える
	// insert filter
	for i := 0; i < len(filters); i++ {
		where_query := model.WhereQuery{
			AccountID:          accountID,
			ObjectDifinitionID: filters[i].ObjectDifinitionID,
			Operator:           filters[i].Operator,
			Value:              filters[i].Value,
		}
		result = r.DB.Create(&where_query)
		if result.Error != nil {
			return nil, result.Error
		}

		report_where_query := model.ReportWhereQuery{
			ReportID:     report.ID,
			WhereQueryID: *where_query.ID,
		}
		result = r.DB.Create(&report_where_query)
		if result.Error != nil {
			return nil, result.Error
		}
	}

	// insert cols

	// insert rows

	return &report, nil
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

func (r *queryResolver) GetObject(ctx context.Context, accountID int, number string, first *int, after *string, filters []*model.Filter, rowIds []*model.Group, colIds []*model.Group) (*model.ShopOrderData, error) {
	//  ecforce DBからaccount IDを取得してデータを取得
	var object *model.Object
	r.DB.Debug().Where(&model.Object{AccountID: accountID, Number: number}).Find(&object)

	var difinitions []*model.ObjectDifinition
	r.DB.Debug().Where(&model.ObjectDifinition{AccountID: accountID, ObjectID: 1}).Find(&difinitions)

	var query string
	query = `{"query": "query { shopOrders(id: \"cosmedyjp\") {`
	for i := 0; i < len(difinitions); i++ {
		query += difinitions[i].Name + " "
	}
	query += `}}"}`

	var jsonData = []byte(query)
	request, error := http.NewRequest("POST", os.Getenv("ECFORCE_DB_APP")+"/query", bytes.NewBuffer(jsonData))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, error := client.Do(request)

	if error != nil {
		panic(error)
	}
	defer response.Body.Close()

	body, _ := ioutil.ReadAll(response.Body)
	jq := gojsonq.New().FromString(string(body)).From("data.shopOrders")

	// filters
	for i := 0; i < len(filters); i++ {
		var difinition *model.ObjectDifinition
		r.DB.Debug().Where(&model.ObjectDifinition{ID: filters[i].ObjectDifinitionID}).First(&difinition)

		if *difinition.ColumnType == "String" {
			fmt.Println("columntype: string")
			jq.Where(difinition.Name, filters[i].Operator, string(filters[i].Value))
		} else {
			num, _ := strconv.Atoi(filters[i].Value)
			jq.Where(difinition.Name, filters[i].Operator, num)
		}
	}

	// rows
	for i := 0; i < len(rowIds); i++ {
		var difinition *model.ObjectDifinition
		r.DB.Debug().Where(&model.ObjectDifinition{ID: rowIds[i].ObjectDifinitionID}).First(&difinition)
		jq.GroupBy(difinition.Name)
	}

	// fmt.Println(jq.Get())

	return &model.ShopOrderData{Ecforce: jq.Get()}, nil
}

func (r *queryResolver) GetObjectDifinitions(ctx context.Context, accountID int, objectID int, ids []*int) ([]*model.ObjectDifinition, error) {
	var difinitions []*model.ObjectDifinition

	if len(ids) > 0 {
		r.DB.Debug().Where(&model.ObjectDifinition{AccountID: accountID, ObjectID: objectID}).Where("id in ?", ids).Find(&difinitions)
	} else {
		r.DB.Debug().Where(&model.ObjectDifinition{AccountID: accountID, ObjectID: objectID}).Find(&difinitions)
	}
	return difinitions, nil
}

func (r *queryResolver) GetReportData(ctx context.Context, accountID int, number string, filters []*model.Filter, rowIds []*model.Group, colIds []*model.Group) (*model.ShopOrderData, error) {
	var object *model.Object
	r.DB.Debug().Where(&model.Object{AccountID: accountID, Number: number}).Find(&object)

	var difinitions []*model.ObjectDifinition
	r.DB.Debug().Where(&model.ObjectDifinition{AccountID: accountID, ObjectID: 1}).Find(&difinitions)

	var query string
	query = `{"query": "query { shopOrders(id: \"cosmedyjp\") {`
	for i := 0; i < len(difinitions); i++ {
		query += difinitions[i].Name + " "
	}
	query += `}}"}`

	var jsonData = []byte(query)
	request, error := http.NewRequest("POST", os.Getenv("ECFORCE_DB_APP")+"/query", bytes.NewBuffer(jsonData))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, error := client.Do(request)

	if error != nil {
		panic(error)
	}
	defer response.Body.Close()

	body, _ := ioutil.ReadAll(response.Body)
	jq := gojsonq.New().FromString(string(body)).From("data.shopOrders")

	// filters
	for i := 0; i < len(filters); i++ {
		var difinition *model.ObjectDifinition
		r.DB.Debug().Where(&model.ObjectDifinition{ID: filters[i].ObjectDifinitionID}).First(&difinition)

		if *difinition.ColumnType == "String" {
			fmt.Println("columntype: string")
			jq.Where(difinition.Name, filters[i].Operator, string(filters[i].Value))
		} else {
			num, _ := strconv.Atoi(filters[i].Value)
			jq.Where(difinition.Name, filters[i].Operator, num)
		}
	}

	// rows
	for i := 0; i < len(rowIds); i++ {
		var difinition *model.ObjectDifinition
		r.DB.Debug().Where(&model.ObjectDifinition{ID: rowIds[i].ObjectDifinitionID}).First(&difinition)
		jq.GroupBy(difinition.Name)
	}

	// fmt.Println(jq.Get())

	return &model.ShopOrderData{Ecforce: jq.Get()}, nil
}

func (r *queryResolver) GetReport(ctx context.Context, accountID int, number string) (*model.Report, error) {
	var report *model.Report
	//result := r.DB.Debug().Model(&report).Association("WhereQueries")
	// result := r.DB.Debug().Association("WhereQuery").First(&report)

	result := r.DB.Debug().Preload("WhereQueries").First(&report)

	fmt.Println("result: ", report)
	if result.Error != nil {
		fmt.Println("something error")
		return nil, result.Error
	}

	return report, nil
}

func (r *queryResolver) Test(ctx context.Context) (*model.Object, error) {
	data.ListEcforce()
	panic(fmt.Errorf("not implemented"))
}

func (r *reportResolver) ColQueries(ctx context.Context, obj *model.Report) ([]*model.ReportColQuery, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Report returns generated.ReportResolver implementation.
func (r *Resolver) Report() generated.ReportResolver { return &reportResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type reportResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func RandomString(n int) string {

	dt := time.Now()
	unix := dt.Unix()
	var letter = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + string(unix))

	b := make([]rune, n)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}
