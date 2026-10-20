//Load environment variables from .env
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

//Set up server 
const app = express();
app.use(express.json());
app.use(express.static('public'));

//Init supabase client
const supaURL = process.env.SUPABASE_URL;
const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supaURL, supaKey);
