$(document).ready(function () {
    //Set up supabase 
    const SUPABASE_URL = 'https://ohcluiybdrddnwauhhwl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oY2x1aXliZHJkZG53YXVoaHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mjk3MzIsImV4cCI6MjEwODAwNTczMn0.nkh7C5YqXO85jOhMP_MPyqGDir9aJ1uzQ-nDzA_0a0s';

    const { createClient } = supabase;
    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    //Show a message to the user in the boc above the form
    function showMessage(text, type) {
        $('#signup-message')
            .text(text)
            .removeClass("d-none is-error is-success")
            .addClass(type === "error" ? "is-error" : "is-success");   
    }

    //--------Handles sign up from signup.html-------
    //Checks for the signup form 
    if ($("#signup-form").length) {
        $("#signup-form").on("submit", async function (event) {
            event.preventDefault(); //Stops reloading 

            //Get user values
            const name = $("#signup-name").val().trim();
            const email = $("#signup-email").val().trim();
            const password = $("#signup-password").val();
            const confirm = $("#signup-confirm").val();

            //Check for valid formats 
            if (!email || !password) {
                showMessage("Enter your email and a password.", "error");
                return;
            }
            if (password.length < 8) {
                showMessage("Your password must be at least 8 characters.", "error");
                return;
            }
            if (password !== confirm) {
                showMessage("Passwords don't match.", "error");
                $("#signup-confirm").addClass("is-invalid");
                return;
            }
            $("#signup-confirm").removeClass("is-invalid");

            $("#signup-btn").prop("disabled", true).text("Creating account...");

            //Creates account in supabase
            const { data, error } = await db.auth.signUp({
                email: email,
                password: password,
                options: { data: { name: name } }
            });

            $("#signup-btn").prop("disabled", false).text("Create account");

            if (error) {
                showMessage(error.message, "error");
                return;
            }

            if (data.session) {
                //Confirm email is OFF if they are already logged in
                window.location.href = "index.html";
            }
            else {
                 showMessage("Account created! Check your email to confirm it, then log in.", "success");
            }   
        });
    }

    //--------Checks if a user is logged in-------
    async function getCurrentUser() {
        const { data: { user } } = await db.auth.getUser();
        return user; //Returns null if no one is logged in
    }

    async function checkLogin() {
        const user = await getCurrentUser();
        const onAuthPage = $("#signup-form").length || $("#login-form").length;

        if (user && onAuthPage) {
            //Already logged in but is on the signup/login page, send to stash
            window.location.href = "index.html";
        }

        if (user && !onAuthPage) {
            //Logged in and on main page, load the yarn
            displayInventory();
        }
    }

    //Run login check apon page loading 
    checkLogin();
    

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
    //Takes user to the signup.html
    $('#sign-up-login').on('click', function() {
        window.location.href = 'signup.html';
    });

    //Favorite button
    $('#favBtn').on('click', function () {
        $('#star').toggleClass('bi-star bi-star-fill');
    });

    $('#addYarn').on('click', async function() {
        const user = await getCurrentUser();
        
        if (user) {
            $('#addYarnModal').modal('show'); //Logged in
        }
        else {
            $('#login-modal').modal('show'); //Not logged in 
        }
        
        
    });

    //Color category buttons

    let selectedCategory = null;
    $('.color-btn').on('click', function () {
        $('.color-btn').removeClass('selected');
        $(this).addClass('selected');
        selectedCategory = this.id;
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