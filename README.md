Main Information ------------------------------
Project: Yarn stash 
Author: Emma Leonard 
Description: A website that allows storage of different types of yarn 

Development Plan --
- Create the web site layout
- Add functionality with JavaScript
- Implement a server with JavaScript and Node.js
- Hook up a database (Supabase)

Functionality --
- Users should be able to log in and out of their account 
- Users should be able to add and delete yarn from their storage
- Users should be able to sort their yarn based on color they believe it is 
- Users should be able to filter their yarn based on color, in stock, out of stock, and favorites
- Users should be able to search for specific yarn based on color, color category, brand and weight


Diary ------------------------------
10/20/2026 --------
I know READMEs don't normally have this but because this is a personal project I thought it would be useful to share my thinking. I started this project trying not to use AI much. I figured out that that is not really useful. However, I don't just want to vibe code my way through this. I love backend so I will most likey do more work there and leave the front end to AI from now on. 

So what is this project? A little background, I love to crochet but, I buy a LOT of yarn. The problem is I have so much that I buy the same yarn I already have without knowing. The goal of this site is to fix that. 

What am I doing now? I am letting Claude (my beloved) work on the front end and make it look more professional. The goal is to take that, tailor it if needed, attach a script to it for functionality, set up the server side, and set up the Supabase connection. 



10/21/2026 --------
Ok so, I have used AI to help me set up the sign in/login process. I had to make sure passwords were being safely stored and (lucky) Supabase already does that. 

I just finished the sign up/login part and can now start on the functionality of the page. I actaully enjoyed the process and found it interesting. I didn't know of all the cases that go into this process. 

I will need more help from AI for how to do calls to the database to get, update, delete, and post data. I will also need to hook up email confirmation but that is a later task, after I am ready to launch it. 

Current To-do -
- functionality for adding yarn to the db (need a service call)
- functionality for the different views (might need to add table row for that)
- functionality for editing yarn via clicking the card (need service call)