//Set up server 


//Load environment variables from .env
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

//Init supabase client
const supaURL = process.env.SUPABASE_URL;
const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supaURL, supaKey);
