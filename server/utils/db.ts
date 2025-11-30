import type { H3Event } from 'h3'
import bcrypt from 'bcrypt'  // ← ADD THIS LINE
import type { Listing } from "./listingsStore";
import type { User } from "./usersStore";

export async function addListingToDB(
  event: H3Event,
  input: Omit<Listing, "id" | "createdAt">
): Promise<Listing> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  console.log('💾 Saving listing to Supabase...');
  
  const { data, error } = await supabase
    .from("listings")
    .insert({
      user_id: input.userId ?? null,
      nickname: input.nickname,
      server: input.server,
      growth_power: input.growthPower,
      classes_list: input.classesList,
      asking_price: input.askingPrice,
      contact_link: input.contactLink || null,
      contact_number: input.contactNumber,
      images: input.images,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error saving listing:', error);
    throw new Error(`Failed to save listing: ${error.message}`);
  }

  console.log('✅ Listing saved:', data.id);

  return {
    id: data.id,
    userId: data.user_id || undefined,
    nickname: data.nickname,
    server: data.server,
    growthPower: data.growth_power,
    classesList: data.classes_list || [],
    askingPrice: data.asking_price,
    contactLink: data.contact_link || "",
    contactNumber: data.contact_number,
    images: data.images || [],
    createdAt: data.created_at,
  };
}

export async function getListingsFromDB(event: H3Event): Promise<Listing[]> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  console.log('📖 Fetching listings from Supabase...');

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error('❌ Error fetching listings:', error);
    throw new Error(`Failed to fetch listings: ${error.message}`);
  }

  console.log(`✅ Fetched ${data?.length || 0} listings`);

  return (data || []).map((item) => ({
    id: item.id,
    userId: item.user_id || undefined,
    nickname: item.nickname,
    server: item.server,
    growthPower: item.growth_power,
    classesList: item.classes_list || [],
    askingPrice: item.asking_price,
    contactLink: item.contact_link || "",
    contactNumber: item.contact_number,
    images: item.images || [],
    createdAt: item.created_at,
  }));
}

export async function createUserInDB(
  event: H3Event,
  email: string,
  password: string,
  fullName: string
): Promise<Omit<User, "password">> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  console.log('👤 Creating user in Supabase:', email);
  console.log('🔍 Original password:', password);

  // Hash the password with bcrypt - ADD THIS SECTION
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  
  console.log('🔐 Password hashed successfully');
  console.log('🔐 Hash:', hashedPassword.substring(0, 20) + '...');

  const { data, error } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      full_name: fullName,
      password_hash: hashedPassword,  // ← USE hashedPassword instead of password
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating user:', error);
    
    if (error.code === '23505') {
      throw new Error("Email is already registered.");
    }
    
    throw new Error(`Failed to create user: ${error.message}`);
  }

  console.log('✅ User created successfully:', data.id);

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    createdAt: data.created_at,
  };
}

export async function validateUserInDB(
  event: H3Event,
  email: string,
  password: string
): Promise<Omit<User, "password"> | null> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  console.log('🔐 Validating user:', email);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !data) {
    console.log('❌ User not found or error:', error);
    return null;
  }

  // Use bcrypt.compare instead of direct comparison - REPLACE THIS SECTION
  const passwordMatch = await bcrypt.compare(password, data.password_hash)
  
  if (!passwordMatch) {
    console.log('❌ Invalid password');
    return null;
  }

  console.log('✅ User validated:', data.email);

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    createdAt: data.created_at,
  };
}