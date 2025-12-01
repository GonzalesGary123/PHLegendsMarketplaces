import type { H3Event } from 'h3'
import bcrypt from 'bcrypt'  // ← ADD THIS LINE
import type { Listing } from "./listingsStore";
import type { User } from "./usersStore";
import type { Notification } from "./notificationsStore";

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
      status: input.status || 'pending',
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
    status: data.status || 'pending',
    approvedBy: data.approved_by || undefined,
    approvedAt: data.approved_at || undefined,
    createdAt: data.created_at,
  };
}

export async function getListingsFromDB(event: H3Event, status?: 'pending' | 'approved' | 'rejected' | 'sold'): Promise<Listing[]> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  console.log('📖 Fetching listings from Supabase...', status ? `(status: ${status})` : '');

  let query = supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  // Filter by status if provided
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

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
    status: item.status || 'pending',
    approvedBy: item.approved_by || undefined,
    approvedAt: item.approved_at || undefined,
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
    isAdmin: data.is_admin || false,
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
    isAdmin: data.is_admin || false,
    createdAt: data.created_at,
  };
}

export async function getUserFromDB(
  event: H3Event,
  userId: string
): Promise<Omit<User, "password"> | null> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.log('❌ User not found:', error);
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    isAdmin: data.is_admin || false,
    createdAt: data.created_at,
  };
}

export async function isAdminUser(event: H3Event, userId: string): Promise<boolean> {
  const user = await getUserFromDB(event, userId);
  return user?.isAdmin || false;
}

export async function updateListingStatus(
  event: H3Event,
  listingId: string,
  status: 'approved' | 'rejected' | 'sold',
  approvedBy: string
): Promise<Listing> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  const updateData: any = {
    status,
    approved_by: approvedBy,
    approved_at: new Date().toISOString(),
  };

  // Update the listing and return the updated data
  const { data: updatedData, error: updateError } = await supabase
    .from("listings")
    .update(updateData)
    .eq("id", listingId)
    .select();

  if (updateError) {
    console.error('❌ Error updating listing status:', updateError);
    throw new Error(`Failed to update listing status: ${updateError.message}`);
  }

  if (!updatedData || updatedData.length === 0) {
    throw new Error(`Listing not found or update failed: ${listingId}`);
  }

  if (updatedData.length > 1) {
    console.warn(`⚠️ Multiple listings found for ID ${listingId}, using first one`);
  }

  const data = updatedData[0];

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
    status: data.status || 'pending',
    approvedBy: data.approved_by || undefined,
    approvedAt: data.approved_at || undefined,
    createdAt: data.created_at,
  };
}

export async function createNotification(
  event: H3Event,
  userId: string,
  listingId: string | undefined,
  type: 'pending_review' | 'approved' | 'rejected' | 'sold',
  title: string,
  message: string
): Promise<Notification> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      listing_id: listingId || null,
      type,
      title,
      message,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating notification:', error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }

  return {
    id: data.id,
    userId: data.user_id,
    listingId: data.listing_id || undefined,
    type: data.type,
    title: data.title,
    message: data.message,
    isRead: data.is_read || false,
    createdAt: data.created_at,
  };
}

export async function getNotificationsForUser(
  event: H3Event,
  userId: string
): Promise<Notification[]> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error('❌ Error fetching notifications:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return (data || []).map((item) => ({
    id: item.id,
    userId: item.user_id,
    listingId: item.listing_id || undefined,
    type: item.type,
    title: item.title,
    message: item.message,
    isRead: item.is_read || false,
    createdAt: item.created_at,
  }));
}

export async function markNotificationAsRead(
  event: H3Event,
  notificationId: string
): Promise<Notification> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error || !data) {
    console.error('❌ Error marking notification as read:', error);
    throw new Error(`Failed to mark notification as read: ${error?.message || 'Unknown error'}`);
  }

  return {
    id: data.id,
    userId: data.user_id,
    listingId: data.listing_id || undefined,
    type: data.type,
    title: data.title,
    message: data.message,
    isRead: data.is_read || false,
    createdAt: data.created_at,
  };
}

export async function markAllNotificationsAsRead(
  event: H3Event,
  userId: string
): Promise<void> {
  const { getSupabaseServer } = await import('./supabase')
  const supabase = await getSupabaseServer(event)

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error('❌ Error marking all notifications as read:', error);
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
}