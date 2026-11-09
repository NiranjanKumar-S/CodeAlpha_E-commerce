const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'database', 'data.json');

// Default Seed Data
const defaultSeedData = {
  users: [
    {
      user_id: 1,
      name: 'Admin User',
      email: 'admin@luxe.com',
      phone: '+1-555-0199',
      password: '$2b$10$9VRNEz5UimeRe4G7uNyeHe.KEaNkM6mExFWjTDrcB3mHlaS3emHNe', // Admin@123
      role: 'admin',
      reset_token: null,
      reset_token_expiry: null,
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      user_id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      password: '$2b$10$Int6M6l36YkIN.NK8nQiJ.1N90D4OufxWBHqwcZqGWHX/s84a7MPO', // Customer@123
      role: 'customer',
      reset_token: null,
      reset_token_expiry: null,
      created_at: new Date('2026-01-02').toISOString()
    },
    {
      user_id: 3,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1-555-0145',
      password: '$2b$10$Int6M6l36YkIN.NK8nQiJ.1N90D4OufxWBHqwcZqGWHX/s84a7MPO', // Customer@123
      role: 'customer',
      reset_token: null,
      reset_token_expiry: null,
      created_at: new Date('2026-01-03').toISOString()
    }
  ],

  categories: [
    {
      category_id: 1,
      category_name: 'Audio & Sound',
      slug: 'audio-sound',
      description: 'Premium wireless headphones, studio earbuds, and high-fidelity sound systems.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      category_id: 2,
      category_name: 'Watches & Wearables',
      slug: 'watches-wearables',
      description: 'Luxury timepieces, modern smartwatches, and minimalist fitness bands.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      category_id: 3,
      category_name: 'Computing & Tech',
      slug: 'computing-tech',
      description: 'Pro laptops, ultra-slim mechanical keyboards, and precision optical mice.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      category_id: 4,
      category_name: 'Footwear & Style',
      slug: 'footwear-style',
      description: 'Engineered running sneakers, premium leather boots, and urban lifestyle footwear.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      category_id: 5,
      category_name: 'Home & Living',
      slug: 'home-living',
      description: 'Artisan ceramic tableware, minimalist desk lamps, and acoustic living decor.',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      category_id: 6,
      category_name: 'Apparel & Accessories',
      slug: 'apparel-accessories',
      description: 'Designer minimalist jackets, genuine leather backpacks, and organic cotton essentials.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      created_at: new Date('2026-01-01').toISOString()
    }
  ],

  products: [
    {
      product_id: 1,
      category_id: 1,
      product_name: 'Luxe Sonic Studio Wireless Headphones',
      slug: 'luxe-sonic-studio-wireless-headphones',
      description: 'Engineered with 40mm beryllium drivers, active noise cancellation with transparency mode, 45-hour battery life, and buttery soft memory foam ear cushions.',
      price: 299.00,
      discount_price: 249.00,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      status: 'active',
      is_featured: 1,
      is_trending: 1,
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      product_id: 2,
      category_id: 2,
      product_name: 'Chronos Horizon Minimalist Smartwatch',
      slug: 'chronos-horizon-minimalist-smartwatch',
      description: 'Forged aerospace titanium case with AMOLED retina display, 7-day battery life, continuous heart and SpO2 tracking, and waterproof to 50 meters.',
      price: 349.00,
      discount_price: 299.00,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      status: 'active',
      is_featured: 1,
      is_trending: 1,
      created_at: new Date('2026-01-02').toISOString()
    },
    {
      product_id: 3,
      category_id: 4,
      product_name: 'AeroGlide Carbon Pro Running Shoes',
      slug: 'aeroglide-carbon-pro-running-shoes',
      description: 'Ultra-responsive nitrogen-infused foam midsole with embedded curved carbon fiber plate. Featherweight breathable knit upper designed for record-breaking marathons.',
      price: 189.00,
      discount_price: 159.00,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      status: 'active',
      is_featured: 1,
      is_trending: 1,
      created_at: new Date('2026-01-03').toISOString()
    },
    {
      product_id: 4,
      category_id: 3,
      product_name: 'Apex Mechanical Keypad & Wrist Rest',
      slug: 'apex-mechanical-keypad-wrist-rest',
      description: 'CNC machined anodized aluminum body, hot-swappable lubricated linear switches, per-key RGB backlighting, and magnetic walnut wrist rest.',
      price: 169.00,
      discount_price: 139.00,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      status: 'active',
      is_featured: 1,
      is_trending: 0,
      created_at: new Date('2026-01-04').toISOString()
    },
    {
      product_id: 5,
      category_id: 6,
      product_name: 'Vanguard Full-Grain Leather Backpack',
      slug: 'vanguard-full-grain-leather-backpack',
      description: 'Handcrafted from vegetable-tanned full-grain leather with dedicated 16-inch padded laptop compartment, waterproof YKK zippers, and ergonomic shoulder straps.',
      price: 220.00,
      discount_price: 189.00,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      status: 'active',
      is_featured: 0,
      is_trending: 1,
      created_at: new Date('2026-01-05').toISOString()
    },
    {
      product_id: 6,
      category_id: 1,
      product_name: 'Pulse Pods Pro Spatial Audio Earbuds',
      slug: 'pulse-pods-pro-spatial-audio-earbuds',
      description: 'Next-generation true wireless earbuds featuring dynamic head tracking, adaptive EQ, wind-noise reduction microphones, and Qi wireless charging case.',
      price: 179.00,
      discount_price: 149.00,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      status: 'active',
      is_featured: 0,
      is_trending: 1,
      created_at: new Date('2026-01-06').toISOString()
    },
    {
      product_id: 7,
      category_id: 5,
      product_name: 'Lumina Nordic Warm LED Ambient Lamp',
      slug: 'lumina-nordic-warm-led-ambient-lamp',
      description: 'Minimalist architectural table lamp crafted from solid brushed brass with touch-dimming sensor, 2700K warm diffuse lighting, and USB-C power delivery.',
      price: 119.00,
      discount_price: 99.00,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      status: 'active',
      is_featured: 1,
      is_trending: 0,
      created_at: new Date('2026-01-07').toISOString()
    },
    {
      product_id: 8,
      category_id: 2,
      product_name: 'Monolith Automatic Steel Field Watch',
      slug: 'monolith-automatic-steel-field-watch',
      description: 'Swiss automatic movement with 38-hour reserve, sapphire crystal with anti-reflective coating, 316L stainless steel bracelet, and Super-LumiNova markers.',
      price: 499.00,
      discount_price: 449.00,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
      status: 'active',
      is_featured: 0,
      is_trending: 1,
      created_at: new Date('2026-01-08').toISOString()
    },
    {
      product_id: 9,
      category_id: 3,
      product_name: 'Precision Darkfield Wireless Laser Mouse',
      slug: 'precision-darkfield-wireless-laser-mouse',
      description: 'Ergonomic electromagnetic scroll wheel, 8000 DPI sensor tracking on glass, multi-device fast pairing, and silent tactile click buttons.',
      price: 99.00,
      discount_price: 85.00,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      status: 'active',
      is_featured: 0,
      is_trending: 0,
      created_at: new Date('2026-01-09').toISOString()
    },
    {
      product_id: 10,
      category_id: 4,
      product_name: 'Urban Nomad Minimalist Canvas Sneakers',
      slug: 'urban-nomad-minimalist-canvas-sneakers',
      description: 'Sustainable organic cotton canvas with natural vulcanized rubber sole, cushioned cork insoles, and timeless low-top street silhouette.',
      price: 89.00,
      discount_price: 69.00,
      stock: 55,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
      status: 'active',
      is_featured: 0,
      is_trending: 0,
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      product_id: 11,
      category_id: 5,
      product_name: 'Komorebi Handcrafted Ceramic Pour-Over Set',
      slug: 'komorebi-handcrafted-ceramic-pour-over-set',
      description: 'Artisan glazed stoneware dripper and serving carafe for barista-level specialty coffee brewing at home. Heat-retentive and dishwasher safe.',
      price: 75.00,
      discount_price: 59.00,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      status: 'active',
      is_featured: 0,
      is_trending: 0,
      created_at: new Date('2026-01-11').toISOString()
    },
    {
      product_id: 12,
      category_id: 6,
      product_name: 'Solstice Polarized Acetate Sunglasses',
      slug: 'solstice-polarized-acetate-sunglasses',
      description: 'Italian Mazzucchelli hand-polished acetate frame with Category 3 polarized UV400 lenses and 5-barrel German hinges for all-day glare protection.',
      price: 145.00,
      discount_price: 119.00,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      status: 'active',
      is_featured: 1,
      is_trending: 0,
      created_at: new Date('2026-01-12').toISOString()
    }
  ],

  carts: [],
  cart_items: [],
  addresses: [
    {
      address_id: 1,
      user_id: 2,
      full_name: 'John Doe',
      phone: '+1-555-0123',
      address_line: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postal_code: '97477',
      created_at: new Date('2026-01-02').toISOString()
    },
    {
      address_id: 2,
      user_id: 3,
      full_name: 'Emily Davis',
      phone: '+1-555-0145',
      address_line: '1000 Broadway Ave, Apt 4B',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      created_at: new Date('2026-01-03').toISOString()
    }
  ],

  orders: [
    {
      order_id: 1,
      order_number: 'ORD-20261101-1001',
      user_id: 2,
      address_id: 1,
      subtotal: 249.00,
      shipping_fee: 0.00,
      discount_amount: 24.90,
      total_amount: 224.10,
      coupon_code: 'WELCOME10',
      payment_method: 'cod',
      payment_status: 'paid',
      order_status: 'Delivered',
      created_at: '2026-11-04T12:00:00.000Z'
    },
    {
      order_id: 2,
      order_number: 'ORD-20261105-1002',
      user_id: 3,
      address_id: 2,
      subtotal: 299.00,
      shipping_fee: 0.00,
      discount_amount: 0.00,
      total_amount: 299.00,
      coupon_code: null,
      payment_method: 'online',
      payment_status: 'paid',
      order_status: 'Processing',
      created_at: '2026-11-07T12:00:00.000Z'
    },
    {
      order_id: 3,
      order_number: 'ORD-20261108-1003',
      user_id: 2,
      address_id: 1,
      subtotal: 159.00,
      shipping_fee: 10.00,
      discount_amount: 0.00,
      total_amount: 169.00,
      coupon_code: null,
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'Pending',
      created_at: '2026-11-09T12:00:00.000Z'
    }
  ],

  order_items: [
    {
      order_item_id: 1,
      order_id: 1,
      product_id: 1,
      product_name: 'Luxe Sonic Studio Wireless Headphones',
      product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      quantity: 1,
      price: 249.00,
      subtotal: 249.00
    },
    {
      order_item_id: 2,
      order_id: 2,
      product_id: 2,
      product_name: 'Chronos Horizon Minimalist Smartwatch',
      product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      quantity: 1,
      price: 299.00,
      subtotal: 299.00
    },
    {
      order_item_id: 3,
      order_id: 3,
      product_id: 3,
      product_name: 'AeroGlide Carbon Pro Running Shoes',
      product_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      quantity: 1,
      price: 159.00,
      subtotal: 159.00
    }
  ],

  reviews: [
    {
      review_id: 1,
      user_id: 2,
      product_id: 1,
      rating: 5,
      comment: 'The sound quality and active noise cancellation are simply extraordinary. Super comfortable for long travel and work sessions!',
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      review_id: 2,
      user_id: 3,
      product_id: 1,
      rating: 5,
      comment: 'Best headphones I have ever owned. The matte finish and packaging felt like Apple-tier luxury.',
      created_at: new Date('2026-01-12').toISOString()
    },
    {
      review_id: 3,
      user_id: 2,
      product_id: 2,
      rating: 4,
      comment: 'Battery easily lasts me a full week with daily workouts. The titanium chassis feels exceptionally premium.',
      created_at: new Date('2026-01-15').toISOString()
    },
    {
      review_id: 4,
      user_id: 3,
      product_id: 3,
      rating: 5,
      comment: 'Shaved 40 seconds off my 10k time! Insanely springy energy return and fit like a glove.',
      created_at: new Date('2026-01-18').toISOString()
    },
    {
      review_id: 5,
      user_id: 2,
      product_id: 5,
      rating: 5,
      comment: 'The leather aroma and stitching craftsmanship are top notch. Worth every single penny.',
      created_at: new Date('2026-01-20').toISOString()
    }
  ],

  coupons: [
    {
      coupon_id: 1,
      coupon_code: 'WELCOME10',
      discount_type: 'percentage',
      discount_value: 10.00,
      min_spend: 50.00,
      expiry_date: '2028-12-31',
      status: 'active'
    },
    {
      coupon_id: 2,
      coupon_code: 'SAVE20',
      discount_type: 'percentage',
      discount_value: 20.00,
      min_spend: 100.00,
      expiry_date: '2028-12-31',
      status: 'active'
    },
    {
      coupon_id: 3,
      coupon_code: 'FLAT50',
      discount_type: 'fixed',
      discount_value: 50.00,
      min_spend: 200.00,
      expiry_date: '2028-12-31',
      status: 'active'
    }
  ],

  newsletter_subscribers: [
    { subscriber_id: 1, email: 'vip.customer@example.com', created_at: '2026-01-01T12:00:00.000Z' },
    { subscriber_id: 2, email: 'tech.insider@example.com', created_at: '2026-01-02T12:00:00.000Z' }
  ],

  wishlists: [
    { wishlist_id: 1, user_id: 2, product_id: 2, created_at: '2026-01-02T12:00:00.000Z' }
  ]
};

// Load or Initialize Store
function loadStore() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[Database] Could not load data.json, initializing from default:', err.message);
  }
  saveStore(defaultSeedData);
  return JSON.parse(JSON.stringify(defaultSeedData));
}

function saveStore(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[Database Save Error]:', err.message);
  }
}

let store = loadStore();

function computeNextIds() {
  const ids = {};
  for (const table of Object.keys(store)) {
    const list = store[table] || [];
    const pkKey = table === 'cart_items' ? 'cart_item_id' : table === 'order_items' ? 'order_item_id' : table.replace(/s$/, '') + '_id';
    const max = list.reduce((m, item) => Math.max(m, Number(item[pkKey] || item.id || 0)), 0);
    ids[table] = max + 1;
  }
  return ids;
}

let nextIds = computeNextIds();

function persist() {
  saveStore(store);
}

const localDb = {
  resetDatabase() {
    store = JSON.parse(JSON.stringify(defaultSeedData));
    nextIds = computeNextIds();
    persist();
    return true;
  },

  getStore() {
    return store;
  },

  async query(sql, params = []) {
    return this.execute(sql, params);
  },

  async execute(sql, params = []) {
    const s = sql.trim().replace(/\s+/g, ' ');
    const lower = s.toLowerCase();

    // 1. SELECT COUNT / STATS for Admin Dashboard
    if (lower.includes('sum(total_amount)') && lower.includes('orders')) {
      const totalSales = store.orders
        .filter(o => o.order_status !== 'Cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);
      const totalOrders = store.orders.length;
      const pendingOrders = store.orders.filter(o => o.order_status === 'Pending').length;
      return [[{ total_sales: totalSales, total_orders: totalOrders, pending_orders: pendingOrders }], []];
    }

    if (lower.startsWith('select count') || lower.startsWith('select coalesce(sum')) {
      if (lower.includes('users')) {
        const count = store.users.filter(u => u.role === 'customer').length;
        return [[{ count, total: count }], []];
      }
      if (lower.includes('products')) {
        let list = store.products;
        if (lower.includes("status = 'active'")) list = list.filter(p => p.status === 'active');
        if (lower.includes('stock <= 5') || lower.includes('stock <= ?')) {
          const threshold = params[0] !== undefined ? params[0] : 5;
          const lowStock = store.products.filter(p => p.stock <= threshold).length;
          return [[{ count: lowStock, total: lowStock }], []];
        }
        return [[{ count: list.length, total: list.length }], []];
      }
      if (lower.includes('orders')) {
        if (lower.includes("order_status = 'pending'")) {
          const count = store.orders.filter(o => o.order_status === 'Pending').length;
          return [[{ pending_orders: count, count, total: count }], []];
        }
        const count = store.orders.length;
        return [[{ count, total: count, total_orders: count }], []];
      }
    }

    // 2. USERS QUERIES
    if (lower.startsWith('select') && lower.includes('from users') || (lower.startsWith('select') && lower.includes('from `users`'))) {
      if (lower.includes('email` = ?') || lower.includes('email = ?')) {
        const email = String(params[0]).toLowerCase();
        const found = store.users.find(u => u.email.toLowerCase() === email);
        return [found ? [{ ...found }] : [], []];
      }
      if (lower.includes('user_id` = ?') || lower.includes('user_id = ?')) {
        const id = Number(params[0]);
        const found = store.users.find(u => u.user_id === id);
        return [found ? [{ ...found }] : [], []];
      }
      if (lower.includes('reset_token` = ?') || lower.includes('reset_token = ?')) {
        const token = String(params[0]);
        const found = store.users.find(u => u.reset_token === token && (!u.reset_token_expiry || new Date(u.reset_token_expiry) > new Date()));
        return [found ? [{ ...found }] : [], []];
      }
      let res = store.users;
      if (lower.includes("role` = 'customer'") || lower.includes("role = 'customer'")) {
        res = res.filter(u => u.role === 'customer');
      }
      return [res.map(u => ({ ...u })), []];
    }

    if (lower.startsWith('insert into users') || lower.startsWith('insert into `users`')) {
      const newUser = {
        user_id: nextIds.users++,
        name: params[0],
        email: params[1],
        phone: params[2] || null,
        password: params[3],
        role: params[4] || 'customer',
        reset_token: null,
        reset_token_expiry: null,
        created_at: new Date().toISOString()
      };
      store.users.push(newUser);
      persist();
      return [{ insertId: newUser.user_id, affectedRows: 1 }, []];
    }

    if (lower.startsWith('update users') || lower.startsWith('update `users`')) {
      if (lower.includes('reset_token = ?') && lower.includes('reset_token_expiry = ?')) {
        const token = params[0];
        const expiry = params[1];
        const email = String(params[2]).toLowerCase();
        const user = store.users.find(u => u.email.toLowerCase() === email);
        if (user) {
          user.reset_token = token;
          user.reset_token_expiry = expiry;
          persist();
          return [{ affectedRows: 1 }, []];
        }
      }
      if (lower.includes('password = ?') && lower.includes('user_id = ?')) {
        const password = params[0];
        const userId = Number(params[1]);
        const user = store.users.find(u => u.user_id === userId);
        if (user) {
          user.password = password;
          user.reset_token = null;
          user.reset_token_expiry = null;
          persist();
          return [{ affectedRows: 1 }, []];
        }
      }
      if (lower.includes('name = ?') && lower.includes('phone = ?')) {
        const name = params[0];
        const phone = params[1];
        const userId = Number(params[2]);
        const user = store.users.find(u => u.user_id === userId);
        if (user) {
          user.name = name;
          user.phone = phone;
          persist();
          return [{ affectedRows: 1 }, []];
        }
      }
      return [{ affectedRows: 1 }, []];
    }

    // 3. CATEGORIES QUERIES
    if (lower.startsWith('select') && (lower.includes('from categories') || lower.includes('from `categories`'))) {
      if (lower.includes('category_id = ?') || lower.includes('category_id` = ?')) {
        const id = Number(params[0]);
        const found = store.categories.find(c => c.category_id === id);
        return [found ? [{ ...found }] : [], []];
      }
      if (lower.includes('slug = ?') || lower.includes('slug` = ?')) {
        const slug = String(params[0]);
        const found = store.categories.find(c => c.slug === slug);
        return [found ? [{ ...found }] : [], []];
      }
      return [store.categories.map(c => ({ ...c })), []];
    }

    if (lower.startsWith('insert into categories') || lower.startsWith('insert into `categories`')) {
      const newCat = {
        category_id: nextIds.categories++,
        category_name: params[0],
        slug: params[1],
        description: params[2] || '',
        image: params[3] || '',
        created_at: new Date().toISOString()
      };
      store.categories.push(newCat);
      persist();
      return [{ insertId: newCat.category_id, affectedRows: 1 }, []];
    }

    if (lower.startsWith('update categories') || lower.startsWith('update `categories`')) {
      const id = Number(params[params.length - 1]);
      const cat = store.categories.find(c => c.category_id === id);
      if (cat) {
        cat.category_name = params[0];
        cat.slug = params[1];
        cat.description = params[2];
        if (params.length > 4) cat.image = params[3];
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    if (lower.startsWith('delete from categories') || lower.startsWith('delete from `categories`')) {
      const id = Number(params[0]);
      store.categories = store.categories.filter(c => c.category_id !== id);
      persist();
      return [{ affectedRows: 1 }, []];
    }

    // 4. PRODUCTS QUERIES
    if (lower.startsWith('select') && (lower.includes('from products') || lower.includes('from `products`'))) {
      if (lower.includes('product_id = ?') || lower.includes('product_id` = ?')) {
        const id = Number(params[0]);
        const p = store.products.find(item => item.product_id === id);
        if (!p) return [[], []];
        const cat = store.categories.find(c => c.category_id === p.category_id);
        const item = { ...p, category_name: cat ? cat.category_name : '', category_slug: cat ? cat.slug : '' };
        return [[item], []];
      }
      if (lower.includes('slug = ?') || lower.includes('slug` = ?')) {
        const slug = String(params[0]);
        const p = store.products.find(item => item.slug === slug);
        if (!p) return [[], []];
        const cat = store.categories.find(c => c.category_id === p.category_id);
        const item = { ...p, category_name: cat ? cat.category_name : '', category_slug: cat ? cat.slug : '' };
        return [[item], []];
      }

      let list = store.products.map(p => {
        const cat = store.categories.find(c => c.category_id === p.category_id);
        return { ...p, category_name: cat ? cat.category_name : '', category_slug: cat ? cat.slug : '' };
      });

      if (!lower.includes('admin') && lower.includes("status = 'active'")) {
        list = list.filter(p => p.status === 'active');
      }

      if (lower.includes('is_featured = 1')) {
        list = list.filter(p => p.is_featured === 1);
      }
      if (lower.includes('is_trending = 1')) {
        list = list.filter(p => p.is_trending === 1);
      }
      if (lower.includes('category_id = ?')) {
        const catId = Number(params[0]);
        list = list.filter(p => p.category_id === catId);
      }
      if (lower.includes('like ?')) {
        const term = String(params[0]).replace(/%/g, '').toLowerCase();
        list = list.filter(p => p.product_name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)));
      }

      // Check sorting
      if (lower.includes('order by') && lower.includes('asc') && lower.includes('price')) {
        list.sort((a, b) => {
          const priceA = a.discount_price !== null && a.discount_price !== undefined ? Number(a.discount_price) : Number(a.price);
          const priceB = b.discount_price !== null && b.discount_price !== undefined ? Number(b.discount_price) : Number(b.price);
          return priceA - priceB;
        });
      } else if (lower.includes('order by') && lower.includes('desc') && lower.includes('price')) {
        list.sort((a, b) => {
          const priceA = a.discount_price !== null && a.discount_price !== undefined ? Number(a.discount_price) : Number(a.price);
          const priceB = b.discount_price !== null && b.discount_price !== undefined ? Number(b.discount_price) : Number(b.price);
          return priceB - priceA;
        });
      } else {
        list.sort((a, b) => b.product_id - a.product_id);
      }

      if (lower.includes('limit ? offset ?')) {
        const limit = Number(params[params.length - 2]);
        const offset = Number(params[params.length - 1]);
        list = list.slice(offset, offset + limit);
      } else if (lower.includes('limit ?')) {
        const limit = Number(params[params.length - 1]);
        if (!isNaN(limit)) list = list.slice(0, limit);
      }

      return [list, []];
    }

    if (lower.startsWith('insert into products') || lower.startsWith('insert into `products`')) {
      const newProd = {
        product_id: nextIds.products++,
        category_id: Number(params[0]),
        product_name: params[1],
        slug: params[2],
        description: params[3] || '',
        price: parseFloat(params[4]),
        discount_price: params[5] ? parseFloat(params[5]) : null,
        stock: parseInt(params[6] || 0, 10),
        image: params[7] || '',
        status: params[8] || 'active',
        is_featured: params[9] ? 1 : 0,
        is_trending: params[10] ? 1 : 0,
        created_at: new Date().toISOString()
      };
      store.products.push(newProd);
      persist();
      return [{ insertId: newProd.product_id, affectedRows: 1 }, []];
    }

    if (lower.startsWith('update products') || lower.startsWith('update `products`')) {
      const id = Number(params[params.length - 1]);
      const p = store.products.find(item => item.product_id === id);
      if (p) {
        if (lower.includes('stock = stock - ?')) {
          p.stock = Math.max(0, p.stock - Number(params[0]));
        } else if (lower.includes('stock = ?') && params.length === 2) {
          p.stock = parseInt(params[0], 10);
        } else {
          p.category_id = Number(params[0]);
          p.product_name = params[1];
          p.slug = params[2];
          p.description = params[3];
          p.price = parseFloat(params[4]);
          p.discount_price = params[5] ? parseFloat(params[5]) : null;
          p.stock = parseInt(params[6], 10);
          p.status = params[7];
          p.is_featured = params[8] ? 1 : 0;
          p.is_trending = params[9] ? 1 : 0;
          if (params.length > 11) p.image = params[10];
        }
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    if (lower.startsWith('delete from products') || lower.startsWith('delete from `products`')) {
      const id = Number(params[0]);
      store.products = store.products.filter(p => p.product_id !== id);
      persist();
      return [{ affectedRows: 1 }, []];
    }

    // 5. CARTS & CART ITEMS
    if (lower.startsWith('select') && (lower.includes('from carts') || lower.includes('from `carts`'))) {
      if (lower.includes('user_id = ?') || lower.includes('user_id` = ?')) {
        const uid = Number(params[0]);
        const cart = store.carts.find(c => c.user_id === uid);
        return [cart ? [{ ...cart }] : [], []];
      }
      if (lower.includes('session_id = ?') || lower.includes('session_id` = ?')) {
        const sid = String(params[0]);
        const cart = store.carts.find(c => c.session_id === sid);
        return [cart ? [{ ...cart }] : [], []];
      }
      return [store.carts.map(c => ({ ...c })), []];
    }

    if (lower.startsWith('insert into carts') || lower.startsWith('insert into `carts`')) {
      const newCart = {
        cart_id: nextIds.carts++,
        user_id: params[0] ? Number(params[0]) : null,
        session_id: params[1] || null,
        created_at: new Date().toISOString()
      };
      store.carts.push(newCart);
      persist();
      return [{ insertId: newCart.cart_id, affectedRows: 1 }, []];
    }

    if (lower.startsWith('update carts') || lower.startsWith('update `carts`')) {
      if (lower.includes('user_id = ?') && lower.includes('cart_id = ?')) {
        const uid = Number(params[0]);
        const cid = Number(params[1]);
        const cart = store.carts.find(c => c.cart_id === cid);
        if (cart) cart.user_id = uid;
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    if (lower.startsWith('select') && (lower.includes('from cart_items') || lower.includes('from `cart_items`'))) {
      if (lower.includes('cart_id = ?') || lower.includes('cart_id` = ?')) {
        const cartId = Number(params[0]);
        let items = store.cart_items.filter(ci => ci.cart_id === cartId);
        if (lower.includes('product_id = ?') || lower.includes('product_id` = ?')) {
          const prodId = Number(params[1]);
          items = items.filter(ci => ci.product_id === prodId);
        }
        const enriched = items.map(ci => {
          const p = store.products.find(prod => prod.product_id === ci.product_id) || {};
          return {
            ...ci,
            product_name: p.product_name || 'Product',
            price: p.price || 0,
            discount_price: p.discount_price,
            image: p.image || '',
            stock: p.stock || 0,
            status: p.status || 'active',
            slug: p.slug || ''
          };
        });
        return [enriched, []];
      }
    }

    if (lower.startsWith('insert into cart_items') || lower.startsWith('insert into `cart_items`')) {
      const cartId = Number(params[0]);
      const productId = Number(params[1]);
      const qty = Number(params[2]);

      let item = store.cart_items.find(ci => ci.cart_id === cartId && ci.product_id === productId);
      if (item) {
        item.quantity += qty;
        persist();
        return [{ insertId: item.cart_item_id, affectedRows: 1 }, []];
      } else {
        const newItem = {
          cart_item_id: nextIds.cart_items++,
          cart_id: cartId,
          product_id: productId,
          quantity: qty,
          created_at: new Date().toISOString()
        };
        store.cart_items.push(newItem);
        persist();
        return [{ insertId: newItem.cart_item_id, affectedRows: 1 }, []];
      }
    }

    if (lower.startsWith('update cart_items') || lower.startsWith('update `cart_items`')) {
      const qty = Number(params[0]);
      const cartItemId = Number(params[1]);
      const item = store.cart_items.find(ci => ci.cart_item_id === cartItemId);
      if (item) {
        item.quantity = qty;
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    if (lower.startsWith('delete from cart_items') || lower.startsWith('delete from `cart_items`')) {
      if (lower.includes('cart_id = ?') || lower.includes('cart_id` = ?')) {
        const cid = Number(params[0]);
        store.cart_items = store.cart_items.filter(ci => ci.cart_id !== cid);
        persist();
        return [{ affectedRows: 1 }, []];
      }
      if (lower.includes('cart_item_id = ?') || lower.includes('cart_item_id` = ?')) {
        const id = Number(params[0]);
        store.cart_items = store.cart_items.filter(ci => ci.cart_item_id !== id);
        persist();
        return [{ affectedRows: 1 }, []];
      }
      return [{ affectedRows: 1 }, []];
    }

    // 6. ADDRESSES
    if (lower.startsWith('select') && (lower.includes('from addresses') || lower.includes('from `addresses`'))) {
      if (lower.includes('address_id = ?') || lower.includes('address_id` = ?')) {
        const id = Number(params[0]);
        const addr = store.addresses.find(a => a.address_id === id);
        return [addr ? [{ ...addr }] : [], []];
      }
      if (lower.includes('user_id = ?') || lower.includes('user_id` = ?')) {
        const uid = Number(params[0]);
        const list = store.addresses.filter(a => a.user_id === uid);
        return [list.map(a => ({ ...a })), []];
      }
      return [store.addresses.map(a => ({ ...a })), []];
    }

    if (lower.startsWith('insert into addresses') || lower.startsWith('insert into `addresses`')) {
      const newAddr = {
        address_id: nextIds.addresses++,
        user_id: params[0] ? Number(params[0]) : null,
        full_name: params[1],
        phone: params[2],
        address_line: params[3],
        city: params[4],
        state: params[5],
        postal_code: params[6],
        created_at: new Date().toISOString()
      };
      store.addresses.push(newAddr);
      persist();
      return [{ insertId: newAddr.address_id, affectedRows: 1 }, []];
    }

    // 7. ORDERS & ORDER ITEMS
    if (lower.startsWith('select') && (lower.includes('from orders') || lower.includes('from `orders`'))) {
      if (lower.includes('order_number = ?') || lower.includes('order_number` = ?')) {
        const num = String(params[0]);
        const order = store.orders.find(o => o.order_number === num);
        if (!order) return [[], []];
        const addr = store.addresses.find(a => a.address_id === order.address_id) || {};
        const u = store.users.find(user => user.user_id === order.user_id) || {};
        return [[{ ...order, customer_name: u.name, customer_email: u.email, ...addr }], []];
      }
      if (lower.includes('order_id = ?') || lower.includes('order_id` = ?')) {
        const id = Number(params[0]);
        const order = store.orders.find(o => o.order_id === id);
        if (!order) return [[], []];
        const addr = store.addresses.find(a => a.address_id === order.address_id) || {};
        const u = store.users.find(user => user.user_id === order.user_id) || {};
        return [[{ ...order, customer_name: u.name, customer_email: u.email, ...addr }], []];
      }
      if (lower.includes('user_id = ?') || lower.includes('user_id` = ?')) {
        const uid = Number(params[0]);
        const list = store.orders
          .filter(o => o.user_id === uid)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return [list.map(o => ({ ...o })), []];
      }

      // All orders (Admin)
      const list = store.orders.map(o => {
        const u = store.users.find(user => user.user_id === o.user_id) || {};
        return {
          ...o,
          customer_name: u.name || 'Guest',
          customer_email: u.email || 'N/A'
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [list, []];
    }

    if (lower.startsWith('insert into orders') || lower.startsWith('insert into `orders`')) {
      const newOrder = {
        order_id: nextIds.orders++,
        order_number: params[0],
        user_id: params[1] ? Number(params[1]) : null,
        address_id: params[2] ? Number(params[2]) : null,
        subtotal: parseFloat(params[3]),
        shipping_fee: parseFloat(params[4]),
        discount_amount: parseFloat(params[5]),
        total_amount: parseFloat(params[6]),
        coupon_code: params[7] || null,
        payment_method: params[8] || 'cod',
        payment_status: params[9] || 'pending',
        order_status: params[10] || 'Pending',
        created_at: new Date().toISOString()
      };
      store.orders.push(newOrder);
      persist();
      return [{ insertId: newOrder.order_id, affectedRows: 1 }, []];
    }

    if (lower.startsWith('update orders') || lower.startsWith('update `orders`')) {
      const orderId = Number(params[params.length - 1]);
      const order = store.orders.find(o => o.order_id === orderId);
      if (order) {
        if (lower.includes('order_status = ?') && lower.includes('payment_status = ?')) {
          order.order_status = params[0];
          order.payment_status = params[1];
        } else if (lower.includes('order_status = ?')) {
          order.order_status = params[0];
        }
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    if (lower.startsWith('select') && (lower.includes('from order_items') || lower.includes('from `order_items`'))) {
      const orderId = Number(params[0]);
      const items = store.order_items.filter(oi => oi.order_id === orderId);
      return [items.map(oi => ({ ...oi })), []];
    }

    if (lower.startsWith('insert into order_items') || lower.startsWith('insert into `order_items`')) {
      const newItem = {
        order_item_id: nextIds.order_items++,
        order_id: Number(params[0]),
        product_id: params[1] ? Number(params[1]) : null,
        product_name: params[2],
        product_image: params[3],
        quantity: Number(params[4]),
        price: parseFloat(params[5]),
        subtotal: parseFloat(params[6])
      };
      store.order_items.push(newItem);
      persist();
      return [{ insertId: newItem.order_item_id, affectedRows: 1 }, []];
    }

    // 8. REVIEWS
    if (lower.startsWith('select') && (lower.includes('from reviews') || lower.includes('from `reviews`'))) {
      if (lower.includes('avg(rating)')) {
        const prodId = Number(params[0]);
        const list = store.reviews.filter(r => r.product_id === prodId);
        const avg = list.length > 0 ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : '5.0';
        return [[{ avg_rating: avg, review_count: list.length }], []];
      }
      const prodId = Number(params[0]);
      const list = store.reviews
        .filter(r => r.product_id === prodId)
        .map(r => {
          const u = store.users.find(user => user.user_id === r.user_id);
          return { ...r, user_name: u ? u.name : 'Verified Customer' };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [list, []];
    }

    if (lower.startsWith('insert into reviews') || lower.startsWith('insert into `reviews`')) {
      const newRev = {
        review_id: nextIds.reviews++,
        user_id: Number(params[0]),
        product_id: Number(params[1]),
        rating: Number(params[2]),
        comment: params[3],
        created_at: new Date().toISOString()
      };
      store.reviews.push(newRev);
      persist();
      return [{ insertId: newRev.review_id, affectedRows: 1 }, []];
    }

    // 9. COUPONS
    if (lower.startsWith('select') && (lower.includes('from coupons') || lower.includes('from `coupons`'))) {
      if (lower.includes('coupon_code = ?') || lower.includes('coupon_code` = ?')) {
        const code = String(params[0]).toUpperCase();
        const found = store.coupons.find(c => c.coupon_code.toUpperCase() === code && c.status === 'active' && new Date(c.expiry_date) >= new Date());
        return [found ? [{ ...found }] : [], []];
      }
      return [store.coupons.map(c => ({ ...c })), []];
    }

    // 10. NEWSLETTER
    if (lower.startsWith('insert into newsletter_subscribers') || lower.startsWith('insert into `newsletter_subscribers`')) {
      const email = String(params[0]).toLowerCase();
      if (!store.newsletter_subscribers.find(s => s.email.toLowerCase() === email)) {
        store.newsletter_subscribers.push({
          subscriber_id: nextIds.newsletter_subscribers++,
          email,
          created_at: new Date().toISOString()
        });
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    // 11. WISHLISTS
    if (lower.startsWith('select') && (lower.includes('from wishlists') || lower.includes('from `wishlists`'))) {
      const uid = Number(params[0]);
      if (lower.includes('product_id = ?') || lower.includes('product_id` = ?')) {
        const pid = Number(params[1]);
        const found = store.wishlists.filter(w => w.user_id === uid && w.product_id === pid);
        return [found.map(w => ({ ...w })), []];
      }
      const list = store.wishlists
        .filter(w => w.user_id === uid)
        .map(w => {
          const p = store.products.find(prod => prod.product_id === w.product_id) || {};
          return { ...w, ...p };
        });
      return [list, []];
    }

    if (lower.startsWith('insert into wishlists') || lower.startsWith('insert into `wishlists`')) {
      const uid = Number(params[0]);
      const pid = Number(params[1]);
      if (!store.wishlists.find(w => w.user_id === uid && w.product_id === pid)) {
        store.wishlists.push({
          wishlist_id: nextIds.wishlists++,
          user_id: uid,
          product_id: pid,
          created_at: new Date().toISOString()
        });
        persist();
      }
      return [{ affectedRows: 1 }, []];
    }

    if (lower.startsWith('delete from wishlists') || lower.startsWith('delete from `wishlists`')) {
      const uid = Number(params[0]);
      const pid = Number(params[1]);
      store.wishlists = store.wishlists.filter(w => !(w.user_id === uid && w.product_id === pid));
      persist();
      return [{ affectedRows: 1 }, []];
    }

    // Default return
    return [[], []];
  },

  async getConnection() {
    return {
      query: (sql, params) => localDb.query(sql, params),
      execute: (sql, params) => localDb.execute(sql, params),
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {}
    };
  }
};

module.exports = localDb;
