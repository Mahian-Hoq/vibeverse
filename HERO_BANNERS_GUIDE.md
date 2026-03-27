# Hero Banner Slider - Full Setup Guide

## Overview
This guide walks you through the complete implementation of a dynamic hero banner slider system with admin management for VibeVerse.

## Features Implemented

✅ **Database Schema**: Hero banners table with RLS policies
✅ **Admin Panel**: `/admin/banners` page for uploading and managing banners
✅ **Image Storage**: Cloudinary integration for image hosting
✅ **Frontend Slider**: Auto-playing slider with fade transitions
✅ **Fallback**: Gradient background when no banners exist
✅ **Dark Overlay**: Ensures text readability over images

---

## Step-by-Step Implementation

### Step 1: Create Database Table and RLS Policies

Run the SQL commands from `HERO_BANNERS_SETUP.sql` in your Supabase SQL Editor:

**Key Points:**
- Creates `hero_banners` table with `id`, `image_url`, `is_active`, `created_at` columns
- Enables Row Level Security (RLS)
- Creates policies for:
  - **Public read**: Anyone can view active banners
  - **Admin full access**: Only admins can create, read, update, delete (email-based)

**To Execute:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `HERO_BANNERS_SETUP.sql`
3. Run the query
4. Verify the table exists: `SELECT * FROM hero_banners;`

⚠️ **Important**: Update the admin email in the RLS policy if yours is different from `mrdot1429@gmail.com`

---

### Step 2: Admin Banner Management Page

**Location**: `/admin/banners`

**Features:**
- **Upload New Banner**: Drag-and-drop or click to select images
  - Auto-uploads to Cloudinary
  - Displays preview
  - Auto-activates on creation
  
- **Banner List**: Shows all uploaded banners with:
  - Thumbnail preview
  - Upload date
  - Active/Inactive status
  - Toggle button to activate/deactivate
  - Delete button

**How to Use:**
1. Log in as admin
2. Navigate to Admin Dashboard → Hero Banners
3. Click upload area and select image (recommended: 1920x600px)
4. Click "Upload Banner"
5. Banners appear in list below with toggle/delete controls

**Image Recommendations:**
- Dimensions: 1920x600px (or any 16:9 aspect ratio)
- Format: PNG, JPG, or GIF
- Max size: 10MB
- Ensure image quality for full-screen display

---

### Step 3: Frontend Hero Slider

**Location**: `src/components/HeroSlider.tsx` (Server Component)
**Client Component**: `src/components/HeroSliderClient.tsx`

**How It Works:**
1. Fetches active hero banners from database on page load
2. If banners exist:
   - Displays dynamic slider with fade transitions
   - Auto-plays slides every 6 seconds
   - Shows indicator dots for manual navigation
   - Displays dark overlay (bg-black/50) for text readability
3. If no banners exist:
   - Falls back to original gradient background

**Landing Page Integration**: 
- Updated `src/app/(store)/page.tsx` to import and use HeroSlider
- The slider replaces the static gradient hero section

**Slider Features:**
- ✅ Auto-play with 6-second intervals
- ✅ Smooth 1-second fade transitions
- ✅ Clickable indicator dots for manual navigation
- ✅ Full-screen background images with object-cover
- ✅ Click indicators to jump to specific slide
- ✅ Text remains readable with dark overlay

---

### Step 4: Admin Navigation Update

**File**: `src/app/admin/layout.tsx`

**Changes Made:**
- Added `Image` icon import from lucide-react
- Added "Hero Banners" link to admin sidebar navigation
- Positioned after Dashboard, before Categories

**Admin Menu Order:**
1. Dashboard
2. **Hero Banners** ← NEW
3. Categories
4. Subcategories
5. Products
6. Orders

---

## File Structure

```
src/
├── app/
│   ├── (store)/
│   │   └── page.tsx                    # Landing page (updated)
│   └── admin/
│       ├── banners/
│       │   └── page.tsx                # Banner management page (NEW)
│       └── layout.tsx                  # Admin layout (updated)
├── components/
│   ├── HeroSlider.tsx                  # Server component (NEW)
│   └── HeroSliderClient.tsx            # Client slider logic (NEW)
└── ...

HERO_BANNERS_SETUP.sql                  # Database setup (NEW)
```

---

## Configuration Checklist

- [ ] Supabase SQL: Created hero_banners table with RLS
- [ ] RLS Policies: Updated admin email if different from mrdot1429@gmail.com
- [ ] Cloudinary: Credentials already configured in `.env.local`
- [ ] Admin Access: Can access `/admin/banners` page
- [ ] Landing Page: Shows slider or fallback gradient

---

## Testing the Feature

### Test 1: Admin Panel Access
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Hero Banners" in sidebar
4. Should see upload form and empty banners list

### Test 2: Upload Banner
1. Click upload area
2. Select an image (1920x600px recommended)
3. Click "Upload Banner"
4. Should see success message and image in list
5. Verify image appears on landing page `/` homepage

### Test 3: Slider Functionality
1. Upload 2+ different banners
2. Visit homepage (/)
3. Should see slider rotating every 6 seconds
4. Verify fade transitions between images
5. Verify dark overlay allows text to be readable
6. Click indicator dots to manually navigate

### Test 4: Toggle Active Status
1. In admin panel, toggle a banner's status
2. Deactivated banners should not appear on homepage
3. Reactivate and verify it reappears
4. Only active banners should display in slider

### Test 5: Delete Banner
1. In admin panel, click delete on a banner
2. Confirm deletion
3. Banner should disappear from list and homepage
4. If all banners deleted, homepage should show gradient fallback

### Test 6: Fallback Gradient
1. Delete all banners or deactivate all
2. Refresh homepage
3. Should display original gradient background
4. Text should be readable without overlay

---

## Customization Guide

### Change Slider Speed
File: `src/components/HeroSliderClient.tsx`, line ~17

```typescript
setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % initialBanners.length);
}, 6000);  // Change 6000 to milliseconds (e.g., 5000 for 5 seconds)
```

### Change Fade Duration
File: `src/components/HeroSliderClient.tsx`, line ~40

```typescript
className="... transition-opacity duration-1000"
          // Change 1000 to milliseconds (e.g., 500 for faster fade)
```

### Change Overlay Opacity
File: `src/components/HeroSliderClient.tsx`, line ~47

```typescript
<div className="absolute inset-0 bg-black/50 z-20"></div>
    // Change bg-black/50 to bg-black/[0.3] or higher (e.g., /70 for darker)
```

### Change Text Colors
File: `src/components/HeroSliderClient.tsx`, lines ~52-54

Update the gradient colors in the headline to match your brand:
```typescript
className="... bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 ..."
```

---

## Troubleshooting

### Problem: Admin page shows loading spinner forever
- **Cause**: Supabase client initialization issue or RLS policy blocking
- **Solution**: 
  - Check browser console for errors
  - Verify you're logged in as admin
  - Check admin email in RLS policy matches your email

### Problem: Images not uploading to Cloudinary
- **Cause**: Missing environment variables or invalid credentials
- **Solution**:
  - Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`
  - Verify `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`
  - Check Cloudinary dashboard for upload quota

### Problem: Slider not appearing on homepage
- **Cause**: No active banners in database
- **Solution**:
  - Upload at least one banner via admin panel
  - Ensure banner has `is_active = true`
  - Clear browser cache/refresh page

### Problem: Text not readable over images
- **Cause**: Overlay opacity too low
- **Solution**: Increase overlay opacity (bg-black/70 or higher)

### Problem: Compilation error about HeroSliderClient
- **Cause**: TypeScript cache not updated
- **Solution**: 
  - Run `npm run build` to force rebuild
  - Delete `.next` folder and restart dev server

---

## Performance Notes

- **Image Optimization**: Cloudinary automatically optimizes images
- **Lazy Loading**: Hero images load immediately (critical above fold)
- **Caching**: Browser caches slider images during session
- **Database Queries**: Slider data fetched server-side on page render

---

## Security Notes

- **RLS Policies**: Prevents unauthorized access to admin functions
- **File Upload**: Only image files accepted (server-side validation)
- **Admin Email**: Update RLS policies to your admin email
- **Data Privacy**: Images stored on Cloudinary (external service)

---

## Next Steps

1. ✅ Create hero_banners table
2. ✅ Access admin panel at `/admin/banners`
3. ✅ Upload first banner image
4. ✅ Verify slider on homepage
5. ✅ Customize colors, timing, and overlay opacity as needed

---

## Support

For issues or questions:
1. Check browser console for JavaScript errors
2. Check Supabase logs for database errors
3. Verify all environment variables are set
4. Review this guide's troubleshooting section

---

**Last Updated**: March 2026
**Version**: 1.0
