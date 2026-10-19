$(document).ready(function () {
    //Display the inventory view off start
    displayInventory();

    //Functions -----------------------------------------
    //Displays the entire inventory 
    function displayInventory() {

    }

    //Displays the favorites 
    function displayFavorites() {

    }

    //Displays the in-stock yarn
    function displayInStock() {

    }

    //Displays the out of stock yarn
    function displayOutOfStock() {

    }


    //Buttons -----------------------------------------
    //Close button for modal
    $('#close-btn').on('click', function () {
        $('#addYarnModal').modal('hide');
    });

    //Color category buttons
    $('#brown').on('click', function () {
        $('#brown').trigger('focus');
    });

    $('#pink').on('click', function () {
        $('#pink').trigger('focus');
    });

    $('#red').on('click', function () {
        $('#red').trigger('focus');
    });

    $('#orange').on('click', function () {
        $('#orange').trigger('focus');
    });

    $('#yellow').on('click', function () {
        $('#yellow').trigger('focus');
    });

    $('#green').on('click', function () {
        $('#green').trigger('focus');
    });

    $('#blue').on('click', function () {
        $('#blue').trigger('focus');
    });

    $('#purple').on('click', function () {
        $('#purple').trigger('focus');
    });

    $('#black').on('click', function () {
        $('#black').trigger('focus');
    });

    $('#white').on('click', function () {
        $('#white').trigger('focus');
    });

    $('#multi').on('click', function () {
        $('#multi').trigger('focus');
    });

    //Add button (need server call or function?)
    $('#addBtn').on('click', function () {
        
    });


    //Side bar buttons
    $('#inventory').on('click', function () {
        displayInventory();
    });

    $('#favs').on('click', function () {
        displayFavorites();
    });

    $('#in-stock').on('click', function () {
        displayInStock();
    });

    $('#out-of-stock').on('click', function () {
        displayOutOfStock();
    });
});