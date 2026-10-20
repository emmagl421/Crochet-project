$(document).ready(function () {
    //Set up supabase 
    const SUPABASE_URL = 'https://ohcluiybdrddnwauhhwl.supabase.co/rest/v1/';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oY2x1aXliZHJkZG53YXVoaHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mjk3MzIsImV4cCI6MjEwODAwNTczMn0.nkh7C5YqXO85jOhMP_MPyqGDir9aJ1uzQ-nDzA_0a0s';

    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    //Favorite button
    $('#favBtn').on('click', function () {
        $('#star').toggleClass('bi-star bi-star-fill');
    });

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