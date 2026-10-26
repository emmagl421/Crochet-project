$(document).ready(function () {
    //Set up supabase 
    const SUPABASE_URL = 'https://ohcluiybdrddnwauhhwl.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oY2x1aXliZHJkZG53YXVoaHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mjk3MzIsImV4cCI6MjEwODAwNTczMn0.nkh7C5YqXO85jOhMP_MPyqGDir9aJ1uzQ-nDzA_0a0s';

    const { createClient } = supabase;
    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const table = 'yarndb';

    //Show a message to the user in the boc above the form
    function showMessage(boxId, text, type) {
        $('#' + boxId)
            .text(text)
            .removeClass("d-none is-error is-success")
            .addClass(type === "error" ? "is-error" : "is-success");  
    }

    //Checks the email is valid
    function emailCheck(email) {
        if (!email) {
            return 'Enter your email.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return 'Please enter a valid email address';
        }
        return '';
    }

    //Handles the required fields function
    function setFieldError($input, message) {
        const $note = $input.closest('.field').find('.field-error');
        $input.toggleClass('is-invalid', !!message); //Clears when message is ''
        $note.text(message);
    }

    //Moves cursor to first red field to start typing
    function focusFirstError (container) {
        const $first = $(container).find('.is-invalid').first();
        $first.trigger('focus');
        return $first.length > 0;
    };

    //Clear the red field when user starts typing
    $('.ys-input').on('input', function () {
        $(this).removeClass('is-invalid');
    });


    //--------Checks if a user is logged in-------
    async function getCurrentUser() {
        const { data: { user } } = await db.auth.getUser();
        return user; //Returns null if no one is logged in
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
            $('#signup-message').addClass('d-none');

            //Check password
            let passwordProb = '';
            if (!password) {
                passwordProb = 'Enter a password';
            }
            else if (password.length < 8) {
                passwordProb = 'Please use at lest 8 characters.'
            }

            //Check confirm password
            let confirmProb = '';
            if (!confirm) {
                confirmProb = 'Please confirm your password';
            }
            else if (confirm !== password) {
                confirmProb = `Passwords don't match.`;
            }

            //Mark all the fields at once 
            setFieldError($('#signup-email'), emailCheck(email));
            setFieldError($('#signup-password'), passwordProb);
            setFieldError($('#signup-confirm'), confirmProb);

            if (focusFirstError('#signup-form')) {
                return;
            }

            $("#signup-btn").prop("disabled", true).text("Creating account...");

            //Creates account in supabase
            const { data, error } = await db.auth.signUp({
                email: email,
                password: password,
                options: { data: { name: name } }
            });

            $("#signup-btn").prop("disabled", false).text("Create account");

            if (error) {
                showMessage("signup-message", error.message, "error");
                return;
            }

            if (data.session) {
                //Confirm email is OFF if they are already logged in
                window.location.href = "index.html";
            }
            else {
                 showMessage("signup-message", "Account created! Check your email to confirm it, then log in.", "success");
                 $('#signup-password, #signup-confirm').val('');
            }   
        });
    }

    //Handles logging in
    if ($('#login-form').length) {
        $('#login-form').on('submit', async function (event) {
            event.preventDefault(); //Stop page reloading

            const email = $('#login-email').val().trim();
            const password = $('#login-password').val();

            //Check user data
            $('#login-message').addClass('d-none');

            setFieldError($('#login-email'), emailCheck(email));
            setFieldError($('#login-password'), password ? '' : 'Enter your password.');

            if (focusFirstError('#login-form')) {
                return;
            }

            //Attempt to log in
            $('#login-btn').prop('disabled', true).text('Logging in...');
            const { error } = await db.auth.signInWithPassword({ email, password });

            //Reset the button
            $('#login-btn').prop('disabled', false).text('Log in');

            //Handle failed attempts
            if (error) {
                showMessage('login-message', error.message, 'error');
                return;
            }

            //Handle successful login (send to main page)
            window.location.href = 'index.html';
        });
    }


    async function checkLogin() {
        //If the user is not on the signup/login pages 
        const onAuthPage = $("#signup-form").length || $("#login-form").length;
        if (!onAuthPage) {
            return;
        }

        //If there is a user send them to the main page
        const user = await getCurrentUser();
        if (user) {
            window.location.href = 'index.html';
        }
    }

    //Toggle the password visability 
    $('.toggle-visibility').on('click', function() {
        const $input = $(this).siblings('input'); //finds input next ot the button
        const show = $input.attr('type') === 'password';
        $input.attr('type', show ? 'text' : 'password'); //Changes it from hidden to not hidden
        $(this).find('i').toggleClass('bi-eye bi-eye-slash'); //Changes the eye icon
    });

    //Run login check apon page loading 
    checkLogin();
    

    //-------------------------- Main Page --------------------------
    //Handles the displaying of yarn
    if ($('.yarn-cards').length) {
        //Starts with full inventory showing 
        let currentFilter = 'all';

        //Saves the values for when yarn is added
        let selectedWeight = null;
        let selectedCategory = null;

        //What to put if there is no yarn for a view
        const emtpyStash = {
            'all': 'Your stash is empty, Click "Add yarn" to add your fisrt skein!',
            'favs': 'No favorites yet. Click the star on a yarn to add it here!',
            'in-stock': 'Nothing in stock right now.',
            'out-of-stock': 'Nothing is out of stock.'
        }

        //Shows a the emptyStash messages 
        function showEmpty(text) {
            $('.yarn-cards').empty().append(
                $('<p class="text-muted"></p>').css('grid-column', '1/ -1').text(text)
            );
        }

        //Handles the favorite star 
        function setFavStar($btn, isFav) {
            $btn.attr('data-fav', isFav ? 'true' : 'false') //Sets the value of isFav
                .attr('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites'); //Allows for the screen reader to ssee if favorite

            //Fills the star if isFav is true and clears it if false
            $btn.find('i').toggleClass('bi-star-fill', isFav).toggleClass('bi-star', !isFav);
        }

        //Builds a yarn card from a database row 
        function buildCard(yarn) {
            const $card = $(`
                <article class="yarn-card">
                    <div class="color-box"></div>
                    <button type="button" class="fav-btn"><i class="bi"></i></button>
                    <div class="yarn-attributes">
                        <div class="yarn-title">
                            <div class="yarn-color-name"></div>
                            <div class="yarn-brand"></div>
                        </div>
                        <dl class="yarn-meta">
                            <div><dt>Weight</dt><dd class="yarn-weight"></dd></div>
                            <div><dt>Skeins</dt><dd class="yarn-skeins"></dd></div>
                        </dl>
                    </div>
                </article>
            `);
            
            //Fill in the card 
            $card.attr('data-id', yarn.id);
            $card.find('.color-box').css('background-color', yarn.color_rgb || '#B580D4');
            $card.find('.yarn-color-name').text(yarn.colorname);
            $card.find('.yarn-brand').text(yarn.brand || '');
            $card.find('.yarn-weight').text(yarn.weight || '-');
            $card.find('.yarn-skeins').text(yarn.skeins ?? 0); //If the value of the skeins is null/undefined then put 0
            setFavStar($card.find('.fav-btn'), yarn.favorite);

            return $card;
        }

        //Loads user's yarn based on the current view and search text
        async function loadYarn() {
            const user = await getCurrentUser();

            //If user is not logged in
            if (!user) {
                showEmpty('Log in to see your stash');
                return;
            }

            //Get the yarn from the database 
            let query = db
                .from(table)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            //Get yarn based on the current view
            if (currentFilter === 'favs') {
                query = query.eq('favorite', true);
            }

            if (currentFilter === 'in-stock') {
                query = query.gt('skeins', 0);
            }

            if (currentFilter === 'out-of-stock') {
                query = query.eq('skeins', 0);
            }

            //Search feature 
            //Removes any characters that will mess up the search
            const term = $('#yarn-search').val().replace(/[,(%*)]/g,' ').trim(); 
            
            //If there is a search term then search for it 
            //% matches the term to anything with the term in it 
            //ilike ignores capitals
            if (term) {
                query = query.or(`brand.ilike.%${term}%,colorname.ilike.%${term}%,weight.ilike.%${term}%,category.ilike.%${term}%`);
            }

            const { data, error } = await query;

            //Error while searching
            if(error) {
                console.error(error);
                showEmpty(`Couldn't load your yarn. Try refresheing the page.`);
                return;
            }

            //No matching yarn
            if (data.length === 0) {
                showEmpty(term ? 'No yarn matches your search.' : emtpyStash[currentFilter]);
                return;
            }

            //Create the yarn cards for the yarn matching the search
            const $cards = $('.yarn-cards').empty();
            data.forEach(yarn => $cards.append(buildCard(yarn)));
        }

        //Clears the yarn form
        function resetYarnForm() {
            $('#brands-input, #color-input, #skeins-input').val('');
            $('#color-picker').val('#B580D4');
            selectedWeight = null;
            $('#weight-drop-down').text('Select a weight').css('color', '');
            selectedCategory = null;
            $('.color-btn').removeClass('selected');
        }

        //Load stash 
        loadYarn();

        //---------------- Buttons ----------------
        //Add yarn button
        $('#addYarn').on('click', async function() {
            //Not logined in -> ask to login
            //else -> show the yarn modal
            const user = await getCurrentUser();
            if (user) {
                $('#addYarnModal').modal('show');
            } 
            else { 
                $('#login-modal').modal('show');
            }
        });

        //Sidebard filters 
        $('.sidebarBtn').on('click', function () {
            $('.sidebarBtn').removeClass('active');
            $(this).addClass('active');
            currentFilter = this.id === 'inventory' ? 'all' : this.id;
            loadYarn();
        });

        //Search timer: Wait for 300ms then load whats in the bar
        //Activates on every input of the search bar 
        let searchTimer;
        $('#yarn-search').on('input', function () {
            //Reset the timer 
            clearTimeout(searchTimer);

            //Set the timer
            searchTimer = setTimeout(loadYarn, 300);
        });

        //Activates on the submit of the search bar 
        $('#search-bar').on('submit', function (event) {
            event.preventDefault();
            loadYarn();
        });


        //Handles the favorite star 
        $('.yarn-cards').on('click', '.fav-btn', async function (event) {
            //Stop this from messing with other card 
            event.stopPropagation();
            const $btn = $(this); //The star that was clicked 
            const $card = $btn.closest('.yarn-card'); //Gets the card the star is on
            const newValue = $btn.attr('data-fav') !== 'true'; //Flips the value of the star 

            //Update star 
            setFavStar($btn, newValue);

            //Update the database
            const { error } = await db
                .from(table)
                .update({ favorite: newValue })
                .eq('id', $card.data('id'));
            
            //If it doesn't work
            if (error) {
                setFavStar($btn, !newValue); //Cheange it back on error
                alert( `Couldn't update favorites. Try again.`);
                return;
            }

            //If it is unfavorited while looking at the favorites then remove it
            if (currentFilter === 'favs' && !newValue) {
                $card.remove();
                
                //If the favorites is empty after you remove this card then display empty
                if ($('.yarn-cards .yarn-card').length === 0) showEmpty(emtpyStash.favs);
            }
        });

        //-------- Add yarn Modal --------
        //Weight dropdown
        $('.ys-dropdown .dropdown-item').on('click', function () {
            selectedWeight = $(this).text().trim(); //Get the selected weight
            $('#weight-drop-down').text(selectedWeight).css('color', 'var(--ink)'); //Changes the text to the selectedWeight
            $('#weight-drop-down').removeClass('is-invalid'); //Resets the required settings after being chosen
        });

        //If you close the modal, clear the red field
        $('#addYarnModal').on('hidden.bs.modal', function () {
            $('#addYarnModal .is-invalid').removeClass('is-invalid');
        });

        $('#login-modal').on('hidden.bs.modal', function () {
            $('#login-modal .is-invalid').removeClass('is-invalid');
        });


        //Color category
        $('.color-btn').on('click', function () {
            $('.color-btn').removeClass('selected'); //Removes the select from all buttons
            $(this).addClass('selected'); //Add the select to the clicked button
            selectedCategory = this.id;
        });

        //Saving a new yarn
        $('#addYarnModal #addBtn').on('click', async function () {
            //Get the info from the modal
            const colorname = $('#color-input').val().trim();
            const brand = $('#brands-input').val().trim();
            const skeinsRaw = $('#skeins-input').val();
            const skeins = skeinsRaw === '' ? null : Number(skeinsRaw); 

            //Check for required fields 
            $('#color-input').toggleClass('is-invalid', !colorname);
            $('#weight-drop-down').toggleClass('is-invalid', !selectedWeight);
            $('#skeins-input').toggleClass('is-invalid', skeins === null || skeins < 0);

            const $firstProblem = $('#addYarnModal .is-invalid').first();
            if($firstProblem.length) {
                $firstProblem.trigger('focus');
                return;
            }

            const $btn = $(this).prop('disabled', true).text('Adding...');

            //Try to insert the yarn 
            const { error } = await db.from(table).insert({
                brand: brand || null,
                colorname: colorname,
                color_rgb: $('#color-picker').val(),
                weight: selectedWeight,
                skeins: skeins,
                category: selectedCategory
            });

            $btn.prop('disabled', false).text('Add yarn');

            if (error) {
                alert (`Couldn't add yarn: ` + error.message);
                return;
            }

            //Reset the form and load yarn
            resetYarnForm();
            $('#addYarnModal').modal('hide');
            loadYarn();
        });

        //-------- Login modal --------
        $('#sign-up-login').on('click', function () {
            window.location.href = 'signup.html';
        });

        $('#login-modal #addBtn').on('click', async function () {
            const email = $('#email-input').val().trim();
            const password = $('#password-input').val();

            //Check for login in info
            setFieldError($('#email-input'), emailCheck(email));
            setFieldError($('#password-input'), password ? '' : 'Enter your password.');

            if (focusFirstError('#login-modal')) {
                return;
            }

            const $btn = $(this).prop('disabled', true).text('Logging in...');
            const { error } = await db.auth.signInWithPassword({ email, password });

            $btn.prop('disabled', false).text('Log in');

            if (error) {
                setFieldError($('#password-input'), error.message);
                $('#password-input').trigger('focus');
                return;
            }

            $('#password-input').val('');
            loadYarn();

            //Close box, open add yarn
            $('#login-modal').one('hidden.bs.modal', function () {
                $('#addYarnModal').modal('show');
            });
            $('#login-modal').modal('hide');
        });
    }   
});