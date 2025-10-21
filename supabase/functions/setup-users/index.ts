import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get all users to find existing ones
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    let anasUser = users?.users.find(u => u.email === 'anas@meem.com');
    let meemUser = users?.users.find(u => u.email === 'meem@anas.com');

    // Create or update Anas user
    if (!anasUser) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: 'anas@meem.com',
        password: 'maheenanas1928',
        email_confirm: true,
      });
      if (error) throw error;
      anasUser = data.user;
    } else {
      // Update password for existing user
      await supabaseAdmin.auth.admin.updateUserById(anasUser.id, {
        password: 'maheenanas1928',
      });
    }

    // Create or update Meem user
    if (!meemUser) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: 'meem@anas.com',
        password: 'maheenanas1928',
        email_confirm: true,
      });
      if (error) throw error;
      meemUser = data.user;
    } else {
      // Update password for existing user
      await supabaseAdmin.auth.admin.updateUserById(meemUser.id, {
        password: 'maheenanas1928',
      });
    }

    const anasId = anasUser.id;
    const meemId = meemUser.id;

    // Create profiles without partner_id first
    await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: anasId,
          name: 'Anas',
        },
      ], { onConflict: 'id' });

    await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: meemId,
          name: 'Meem',
        },
      ], { onConflict: 'id' });

    // Now update with partner_id
    await supabaseAdmin
      .from('profiles')
      .update({ partner_id: meemId })
      .eq('id', anasId);

    await supabaseAdmin
      .from('profiles')
      .update({ partner_id: anasId })
      .eq('id', meemId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Users setup complete. Both users can now login with password: maheenanas1928',
        users: [
          { email: 'anas@meem.com', name: 'Anas' },
          { email: 'meem@anas.com', name: 'Meem' }
        ]
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});