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
                passwordProb = 'Please use at least 8 characters.';
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
    //Sample yarn so the demo isn't empty 
    const sampleYarn = [
        { colorname: 'Lavender Mist', brand: 'Malabrigo', color_rgb: '#7D80DA', weight: '4-Medium', skeins: 3, category: 'purple', favorite: true },
        { colorname: 'Dusty Rose', brand: 'Lion Brand', color_rgb: '#C98B95', weight: '3-Light', skeins: 2, category: 'pink', favorite: false },
        { colorname: 'Sage', brand: 'Cascade', color_rgb: '#9DB59A', weight: '5-Bulky', skeins: 0, category: 'green', favorite: false },
        { colorname: 'Marigold', brand: 'Knit Picks', color_rgb: '#E9A93B', weight: '1-Superfine', skeins: 5, category: 'yellow', favorite: true }
    ];

    $('.demo-btn').on('click', async function() {
        const boxId = $('#login-form').length ? 'login-message' : 'login-modal-message';
        $('#' + boxId).addClass('d-none');

        const $btn = $(this).prop('disabled', true).text('Setting up demo...');

        const { error } = await db.auth.signInAnonymously({
            options: { data: { name: 'Demo user' } }
        });

        if (error) {
            $btn.prop('disabled', false).text('Try the demo');
            showMessage(boxId, `Couldn't start the demo. Please try again.`, 'error');
            return;
        }

        const { error: yarnErr } = await db.from(table).insert(sampleYarn);
        if (yarnErr) {
            console.error(yarnErr);
        }

        window.location.href = 'index.html';
    });


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
        let currentCategory = null;

        //Saves the values for when yarn is added
        let selectedWeight = null;
        let selectedCategory = null;
        let editingId = null;
        let afterLogin = null;

        //What to put if there is no yarn for a view
        const emptyStash = {
            'all': 'Your stash is empty. Click "Add yarn" to add your first skein!',
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

        //Clicking a card opens the yarn for editing 
        $('.yarn-cards').on('click', '.yarn-card', function () {
            //Get the card that was clicked 
            const yarn = $(this).data('yarn');
            editingId = yarn.id;

            //Fill in the modal text boxs with the yarn's current data 
            $('#color-input').val(yarn.colorname);
            $('#brands-input').val(yarn.brand || '');
            $('#skeins-input').val(yarn.skeins ?? 0);
            $('#color-picker').val(yarn.color_rgb || '#B580D4');

            selectedWeight = yarn.weight;
            $('#weight-drop-down').text(yarn.weight).css('color', 'var(--ink)');

            selectedCategory = yarn.category;
            $('.color-btn').removeClass('selected');
            if (yarn.category) {
                $('#addYarnModal #' + yarn.category).addClass('selected');
            }

            //Switch model title and open it 
            $('#addYarnTitle').text('Edit yarn');
            $('#addYarnModal #addBtn').text('Save changes');
            $('#addYarnModal').modal('show');
        });

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
            $card.data('yarn', yarn); //Keeps track of the database row for editing later 

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

            //Gets the yarn based on the color category 
            if (currentCategory) {
                query = query.eq('category', currentCategory);
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
                showEmpty(`Couldn't load your yarn. Try refreshing the page.`);
                return;
            }

            //No matching yarn
            if (data.length === 0) {
                if (term) {
                    showEmpty('No yarn matches your search.');
                }
                else if (currentCategory) {
                    showEmpty('No yarn in this category has been added yet.');
                }
                else {
                    showEmpty(emptyStash[currentFilter]);
                }
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

            editingId = null;
            $('#addYarnTitle').text('Add new yarn');
            $('#addYarnModal #addBtn').text('Add yarn');

            $('#yarn-message').addClass('d-none');
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
                afterLogin = () => $('#addYarnModal').modal('show');
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

        //Color category filters (handles selecting a category view)
        $('.colorFilterBtn').on('click', function () {
            const category = $(this).data('category');

            //If you are clicking on the already selected category then, unselect it 
            if (currentCategory === category) {
                currentCategory = null;
                $(this).removeClass('active');
            }
            else { //Otherwise, select the category
                $('.colorFilterBtn').removeClass('active');
                $(this).addClass('active');
                currentCategory = category;
            }

            //Reload the yarn based on the category 
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
                if ($('.yarn-cards .yarn-card').length === 0) showEmpty(emptyStash.favs);
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
            resetYarnForm();
        });

        $('#login-modal').on('hidden.bs.modal', function () {
            $('#login-modal .is-invalid').removeClass('is-invalid');
            $('#login-modal-message').addClass('d-none');
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

            //Hide old errors before new attempt
            $('#yarn-message').addClass('d-none'); 

            //Check for required fields 
            $('#color-input').toggleClass('is-invalid', !colorname);
            $('#weight-drop-down').toggleClass('is-invalid', !selectedWeight);
            $('#skeins-input').toggleClass('is-invalid', skeins === null || skeins < 0);

            const $firstProblem = $('#addYarnModal .is-invalid').first();
            if($firstProblem.length) {
                $firstProblem.trigger('focus');
                return;
            }

            //Disable the btn
            const $btn = $(this).prop('disabled', true).text(editingId ? 'Saving...' : 'Adding...');

            //Get the values to save for both adding and editing 
            const yarnData = {
                brand: brand || null,
                colorname: colorname,
                color_rgb: $('#color-picker').val(),
                weight: selectedWeight,
                skeins: skeins,
                category: selectedCategory
            };

            //Either edit or insert 
            const request = editingId ? db.from(table).update(yarnData).eq('id', editingId) : db.from(table).insert(yarnData);

            const { error } = await request;

            //Re-enable the btn 
            $btn.prop('disabled', false).text(editingId ? 'Save changes' : 'Add yarn');

            if (error) {
                showMessage('yarn-message', `Couldn't save yarn: ` + error.message, 'error');
                return;
            }

            $('#addYarnModal').modal('hide');
            loadYarn();
        });

        //-------- Login modal --------
        $('#loginModalBtn').on('click', async function () {
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
                if (afterLogin) {
                    afterLogin();
                }
                afterLogin = null;
            });

            $('#login-modal').modal('hide');
        });

        //-------- Account modal --------
        //Fill in modal with user info and stash totals 
        async function fillAccount(user) {
            //Get the users name if there is one 
            const name = user.user_metadata?.name || '';

            $('#account-name').text(name || 'No name added');
            $('#account-email').text(user.email || 'Demo account');
            $('#account-initial').text((name || user.email).charAt(0).toUpperCase());
            $('#account-since').text(new Date(user.created_at).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}));

            //Show dashes while totals load 
            $('#account-yarn-count, #account-skein-count').text('-');

            //Get skeins column for the stash totals 
            const { data, error } = await db.from(table).select('skeins').eq('user_id', user.id);

            //Leaves the dashes if the total can't load 
            if (error) {
                console.error(error);
                return; 
            }

            const totalSkeins = data.reduce((sum, yarn) => sum + (yarn.skeins ?? 0), 0);
            $('#account-yarn-count').text(data.length);
            $('#account-skein-count').text(totalSkeins);

            $('#editAccountBtn').toggleClass('d-none', !!user.is_anonymous);
        }

        //Opens the account modal
        async function openAccount() {
            const user = await getCurrentUser();
            if (!user) {
                afterLogin = openAccount; //Come here after logging in
                $('#login-modal').modal('show');
                return;
            }

            //Open modal without await and load info in with await
            fillAccount(user); 
            $('#account-modal').modal('show');
        }

        //Switch between viewing and editing 
        function setAccountEditing(on) {
            $('#account-modal').toggleClass('is-editing', on);
            $('#accountTitle').text(on ? 'Edit account' : 'Your account');
            $('#account-message').addClass('d-none');
            $('#account-modal .is-invalid').removeClass('is-invalid');
        }

        //Edit account info
        $('#editAccountBtn').on('click', async function () {
            //Get the user 
            const user = await getCurrentUser();
            if (!user) {
                return;
            }

            //Fill in account info
            $('#account-name-input').val(user.user_metadata?.name || '');
            $('#account-email-input').val(user.email);
            $('#account-password-input').val(''); //Don't prefill passwords

            //Put in editing mode 
            setAccountEditing(true);
            $('#account-name-input').trigger('focus');
        });

        //Cancel without saving
        $('#cancelAccountBtn').on('click', function () {
            setAccountEditing(false);
        });

        //Changing and saving user account info
        $('#saveAccountBtn').on('click', async function () {
            const user = await getCurrentUser();
            if (!user) {
                return;
            }

            //Get the info from the user 
            const name = $('#account-name-input').val().trim();
            const email = $('#account-email-input').val().trim();
            const password = $('#account-password-input').val();

            //Check the new input to make sure it is valid
            setFieldError($('#account-email-input'), emailCheck(email));
            setFieldError($('#account-password-input'),
                password && password.length < 8 ? 'Please use at least 8 characters.' : '');
            
            if (focusFirstError('#account-modal')) {
                return;
            }

            //Build object with the changed info
            const changes = {};
            if (name !== (user.user_metadata?.name || '')) {
                changes.data = { name: name };
            }
            if (email !== user.email) {
                changes.email = email;
            }
            if (password) {
                changes.password = password;
            }

            //If nothing changed, go back to normal view 
            if (Object.keys(changes).length === 0) {
                setAccountEditing(false);
                return;
            }

            //Change the button and save the info
            const $btn = $(this).prop('disabled', true).text('Saving...');
            const { data, error } = await db.auth.updateUser(changes);
            $btn.prop('disabled', false).text('Save changes');

            if (error) {
                showMessage('account-message', `Couldn't save changes: ` + error.message, 'error');
                return;
            }

            //Show the updated info 
            setAccountEditing(false);
            fillAccount(data.user);

            if (changes.email) {
                showMessage('account-message', `Check your email to confirm the change to ${email}. Your email will update after you click the link.`, 'success');
            }
            else {
                showMessage('account-message', 'Your account has been updated.', 'success');
            }
        });

        $('#accountBtn').on('click', openAccount);

        //Log out 
        $('#logoutBtn').on('click', async function () {
            const $btn = $(this).prop('disabled', true).text('Logging out...');
            const { error } = await db.auth.signOut();
            $btn.prop('disabled', false).text('Log out');

            if (error) {
                showMessage('account-message', `Couldn't log out: ` + error.message, 'error');
                return;
            }

            $('#account-modal').modal('hide');
            loadYarn();
        });

        $('#account-modal').on('hidden.bs.modal', function () {
            setAccountEditing(false);
            $('#account-password-input').val('');
        });
    }   
});