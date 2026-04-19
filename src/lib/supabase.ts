import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both URL and key are valid
const isValidUrl = (url: string | undefined): url is string => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const supabase: SupabaseClient | null = 
  isValidUrl(supabaseUrl) && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  model_url: string
  category?: string
  created_at?: string
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!supabase) {
    return mockMenuItems
  }
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return mockMenuItems
    }
    
    return data || mockMenuItems
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return mockMenuItems
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  if (!supabase) {
    return mockMenuItems.find(item => item.id === id) || null
  }
  
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return mockMenuItems.find(item => item.id === id) || null
    }
    
    return data
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return mockMenuItems.find(item => item.id === id) || null
  }
}

// Upload 3D model to Supabase Storage
export async function uploadModel(file: File, itemId: string): Promise<string | null> {
  console.log('uploadModel called:', { fileName: file.name, fileSize: file.size, fileType: file.type, itemId })
  
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileName = `models/${itemId}.${fileExt}`
    console.log('Uploading to path:', fileName)

    const { error: uploadError } = await supabase.storage
      .from('menu-assets')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream',
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('menu-assets')
      .getPublicUrl(fileName)
    
    console.log('Model uploaded successfully:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Exception uploading model:', error)
    return null
  }
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, itemId: string): Promise<string | null> {
  console.log('uploadImage called:', { fileName: file.name, fileSize: file.size, fileType: file.type, itemId })
  
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const fileName = `images/${itemId}.${fileExt}`
    console.log('Uploading to path:', fileName)

    const { error: uploadError } = await supabase.storage
      .from('menu-assets')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg',
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('menu-assets')
      .getPublicUrl(fileName)
    
    console.log('Image uploaded successfully:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Exception uploading image:', error)
    return null
  }
}

// Create new menu item with uploaded files
export async function createMenuItem(
  item: Omit<MenuItem, 'id' | 'created_at'>,
  modelFile?: File,
  imageFile?: File
): Promise<MenuItem | null> {
  console.log('createMenuItem called:', { item, hasModelFile: !!modelFile, hasImageFile: !!imageFile })
  
  if (!supabase) {
    console.error('Supabase not configured - check .env.local')
    return null
  }

  try {
    const id = crypto.randomUUID()
    console.log('Generated ID:', id)
    
    let modelUrl = item.model_url
    let imageUrl = item.image_url

    if (modelFile) {
      console.log('Uploading model file:', modelFile.name, modelFile.size)
      const uploadedUrl = await uploadModel(modelFile, id)
      console.log('Model upload result:', uploadedUrl)
      if (uploadedUrl) modelUrl = uploadedUrl
    }

    if (imageFile) {
      console.log('Uploading image file:', imageFile.name, imageFile.size)
      const uploadedUrl = await uploadImage(imageFile, id)
      console.log('Image upload result:', uploadedUrl)
      if (uploadedUrl) imageUrl = uploadedUrl
    }

    const newItem = {
      ...item,
      id,
      model_url: modelUrl,
      image_url: imageUrl,
    }
    
    console.log('Inserting to Supabase:', newItem)

    const { data, error } = await supabase
      .from('menu_items')
      .insert(newItem)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return null
    }

    console.log('Menu item created successfully:', data)
    return data
  } catch (error) {
    console.error('Exception in createMenuItem:', error)
    return null
  }
}

// Mock data for demo purposes
// model_url is empty to use procedural 3D shapes
// Upload real .glb/.gltf/.obj files via /admin page for real 3D models
export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Wagyu Beef Steak',
    description: 'Premium A5 Japanese wagyu, seared to perfection with truffle butter',
    price: 89,
    image_url: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?w=800&q=80',
    model_url: '',
    category: 'Mains',
  },
  {
    id: '2',
    name: 'Truffle Lobster',
    description: 'Fresh Atlantic lobster with black truffle cream sauce',
    price: 65,
    image_url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
    model_url: '',
    category: 'Seafood',
  },
  {
    id: '3',
    name: 'Golden Sushi Platter',
    description: 'Assorted premium sushi with 24k gold leaf accents',
    price: 45,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    model_url: '',
    category: 'Japanese',
  },
  {
    id: '4',
    name: 'Molten Chocolate Cake',
    description: 'Decadent dark chocolate with vanilla bean ice cream',
    price: 18,
    image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80',
    model_url: '',
    category: 'Desserts',
  },
  {
    id: '5',
    name: 'Artisan Burger',
    description: 'Wagyu beef patty, brioche bun, aged cheddar, truffle mayo',
    price: 28,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    model_url: '',
    category: 'Mains',
  },
  {
    id: '6',
    name: 'Tiramisu Classic',
    description: 'Traditional Italian layers with mascarpone and espresso',
    price: 14,
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    model_url: '',
    category: 'Desserts',
  },
]
