//---------------------------------------------------------
// Declare a class to represent a food
//---------------------------------------------------------
class Food {

    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}


//-----------------------------------------------------------
// Declare a FoodService class to provide services for food.
//-----------------------------------------------------------
class FoodService {

    // URL to the  API on the server
    static url = 'https://64f11f0a0e1e60602d239d44.mockapi.io/food';


    //---------------------------------------------------------
    //      Method:  getAllFood
    // Description:  Get all listing of foods from the server
    //               Set the type to GET
    //--------------------------------------------------------- 
    static getAllFood() {
        return $.get(this.url);
    }


    //---------------------------------------------------------
    //      Method:  getFood
    // Description:  Get a single specific food from the server
    //               Set the type to GET
    //--------------------------------------------------------- 
    static getFood( id ) {
        return $.get(this.url + '/' + id );
    }


    //---------------------------------------------------------
    //      Method:  createFood
    // Description:  Create a new food using the API
    //               Set the type to POST
    //---------------------------------------------------------    
    static createFood( food ) {
        return $.post(this.url, food);
    }


    //---------------------------------------------------------
    //      Method:  updateFood
    // Description:  Update a food using the API 
    //               Set the type to PUT
    //---------------------------------------------------------
    static updateFood(id, name, price ) {

        let setName = "";
        let setPrice = "";

        let inputUpdateName = $('#update-food-name').val();
        let inputUpdatePrice = $('#update-food-price').val();      
        
        // Check if the update value for the name is empty or not.
        if ( inputUpdateName.length == 0 ) {
            setName = name;
        } else {
            setName = inputUpdateName;
        }

        // Check if the update value for the price is empty or not
        if ( inputUpdatePrice.length == 0 ) {
            setPrice = price;
        } else {
            setPrice = inputUpdatePrice;
        }       
        

        return $.ajax({
            url: this.url + '/' + id,
            type: 'PUT',
            dataType: 'json',
            data: { name: setName, price: setPrice } 
         });



    }


    //---------------------------------------------------------
    //      Method: deleteFood
    // Description:  Delete a food using the API on the server
    //               Set the type to DELETE
    //---------------------------------------------------------
    static deleteFood(id) {
        return $.ajax({
            url: this.url + '/' + id,
            type: 'DELETE'
        });
    }

}



//-----------------------------------------------------------
// Declare a DOMManager class to accept action from the
//    front end and call the FoodService class to 
//    the requested action. 
//-----------------------------------------------------------
class DOMManager {

    // Declare global varible to hold all foods.
    static foods;


    // Call API to get all foods.
    static getAllFoods() {
        FoodService.getAllFood().then(foods => this.render(foods));
    }


    // Request from the front end to create a new food
    static createFood(name, price) {

        FoodService.createFood( new Food(name,price))
            .then(() => {
                return FoodService.getAllFood();
            })
            .then((foods) => this.render(foods) );
    }


    // Request from the front end to delete a food
    static deleteFood(id) {

        FoodService.deleteFood(id)
            .then(() => {
                return FoodService.getAllFood();
            })
            .then((foods) => this.render(foods) );

    }

    
    // Request from the front end to update a food
    static updateFood(id, name, price ) {

        // Call an updateFood method in the FoodService to update 
        //     the selected food.
        FoodService.updateFood(id, name, price)
            .then(() => {
                return FoodService.getAllFood();
            })
            .then((foods) => this.render(foods) );


        // Clear the input boxes to update food
        $('#update-food-name').val('');
        $('#update-food-price').val('');

    }    


    // Display the list of foods to the front end.
    static render(foods) {
        this.foods = foods;

        // Clear display area
        $('#app').empty();

        // Loop through each food 
        // Create HTML representation
        // Add each food to the top of the list of food in the front end.
        for (let food of foods) {
            $('#app').prepend(
                `
                <div class="card">
                    <div class="card-header">
                        <table>
                            <tr>
                                <td >${food.name}</td>
                                <td >${food.price}</td>
                                <td >
                                    <button class="btn btn-danger" onclick="DOMManager.deleteFood('${food.id}')" >Delete</button>
                                </td>
                                <td >
                                    <button class="btn btn-danger" onclick="DOMManager.updateFood('${food.id}','${food.name}','${food.price}' )" >Update</button>
                                </td>
                            </tr>
                        </table>
                     
                    </div>
                 </div>   
                `
            );
        }


    }



} //end DOMManager


$('#create-food').click(() => {

    // Call a method to create a new food
    DOMManager.createFood( $('#new-food-name').val(), $('#new-food-price').val()  );

    // Clear the input boxes for new food
    $('#new-food-name').val('');
    $('#new-food-price').val('');

});


DOMManager.getAllFoods();

