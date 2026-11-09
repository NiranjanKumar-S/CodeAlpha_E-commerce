-- ===================================================
-- E-Commerce Database Seed Data
-- Database: ecommerce_db
-- ===================================================

USE `ecommerce_db`;

-- 1. USERS
-- Admin: admin@luxe.com / Admin@123
-- Customer: john@example.com / Customer@123
-- Customer: emily@example.com / Customer@123
INSERT INTO `users` (`user_id`, `name`, `email`, `phone`, `password`, `role`, `created_at`) VALUES
(1, 'Admin User', 'admin@luxe.com', '+1-555-0199', '$2b$10$9VRNEz5UimeRe4G7uNyeHe.KEaNkM6mExFWjTDrcB3mHlaS3emHNe', 'admin', NOW()),
(2, 'John Doe', 'john@example.com', '+1-555-0123', '$2b$10$Int6M6l36YkIN.NK8nQiJ.1N90D4OufxWBHqwcZqGWHX/s84a7MPO', 'customer', NOW()),
(3, 'Emily Davis', 'emily@example.com', '+1-555-0145', '$2b$10$Int6M6l36YkIN.NK8nQiJ.1N90D4OufxWBHqwcZqGWHX/s84a7MPO', 'customer', NOW())
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 2. CATEGORIES
INSERT INTO `categories` (`category_id`, `category_name`, `slug`, `description`, `image`) VALUES
(1, 'Audio & Sound', 'audio-sound', 'Premium wireless headphones, studio earbuds, and high-fidelity sound systems.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
(2, 'Watches & Wearables', 'watches-wearables', 'Luxury timepieces, modern smartwatches, and minimalist fitness bands.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
(3, 'Computing & Tech', 'computing-tech', 'Pro laptops, ultra-slim mechanical keyboards, and precision optical mice.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'),
(4, 'Footwear & Style', 'footwear-style', 'Engineered running sneakers, premium leather boots, and urban lifestyle footwear.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'),
(5, 'Home & Living', 'home-living', 'Artisan ceramic tableware, minimalist desk lamps, and acoustic living decor.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80'),
(6, 'Apparel & Accessories', 'apparel-accessories', 'Designer minimalist jackets, genuine leather backpacks, and organic cotton essentials.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80')
ON DUPLICATE KEY UPDATE `category_name` = VALUES(`category_name`);

-- 3. PRODUCTS
INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `slug`, `description`, `price`, `discount_price`, `stock`, `image`, `status`, `is_featured`, `is_trending`) VALUES
(1, 1, 'Luxe Sonic Studio Wireless Headphones', 'luxe-sonic-studio-wireless-headphones', 'Engineered with 40mm beryllium drivers, active noise cancellation with transparency mode, 45-hour battery life, and buttery soft memory foam ear cushions.', 299.00, 249.00, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'active', 1, 1),
(2, 2, 'Chronos Horizon Minimalist Smartwatch', 'chronos-horizon-minimalist-smartwatch', 'Forged aerospace titanium case with AMOLED retina display, 7-day battery life, continuous heart and SpO2 tracking, and waterproof to 50 meters.', 349.00, 299.00, 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'active', 1, 1),
(3, 4, 'AeroGlide Carbon Pro Running Shoes', 'aeroglide-carbon-pro-running-shoes', 'Ultra-responsive nitrogen-infused foam midsole with embedded curved carbon fiber plate. Featherweight breathable knit upper designed for record-breaking marathons.', 189.00, 159.00, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'active', 1, 1),
(4, 3, 'Apex Mechanical Keypad & Wrist Rest', 'apex-mechanical-keypad-wrist-rest', 'CNC machined anodized aluminum body, hot-swappable lubricated linear switches, per-key RGB backlighting, and magnetic walnut wrist rest.', 169.00, 139.00, 25, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 'active', 1, 0),
(5, 6, 'Vanguard Full-Grain Leather Backpack', 'vanguard-full-grain-leather-backpack', 'Handcrafted from vegetable-tanned full-grain leather with dedicated 16-inch padded laptop compartment, waterproof YKK zippers, and ergonomic shoulder straps.', 220.00, 189.00, 18, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'active', 0, 1),
(6, 1, 'Pulse Pods Pro Spatial Audio Earbuds', 'pulse-pods-pro-spatial-audio-earbuds', 'Next-generation true wireless earbuds featuring dynamic head tracking, adaptive EQ, wind-noise reduction microphones, and Qi wireless charging case.', 179.00, 149.00, 50, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', 'active', 0, 1),
(7, 5, 'Lumina Nordic Warm LED Ambient Lamp', 'lumina-nordic-warm-led-ambient-lamp', 'Minimalist architectural table lamp crafted from solid brushed brass with touch-dimming sensor, 2700K warm diffuse lighting, and USB-C power delivery.', 119.00, 99.00, 35, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'active', 1, 0),
(8, 2, 'Monolith Automatic Steel Field Watch', 'monolith-automatic-steel-field-watch', 'Swiss automatic movement with 38-hour reserve, sapphire crystal with anti-reflective coating, 316L stainless steel bracelet, and Super-LumiNova markers.', 499.00, 449.00, 12, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80', 'active', 0, 1),
(9, 3, 'Precision Darkfield Wireless Laser Mouse', 'precision-darkfield-wireless-laser-mouse', 'Ergonomic electromagnetic scroll wheel, 8000 DPI sensor tracking on glass, multi-device fast pairing, and silent tactile click buttons.', 99.00, 85.00, 40, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', 'active', 0, 0),
(10, 4, 'Urban Nomad Minimalist Canvas Sneakers', 'urban-nomad-minimalist-canvas-sneakers', 'Sustainable organic cotton canvas with natural vulcanized rubber sole, cushioned cork insoles, and timeless low-top street silhouette.', 89.00, 69.00, 55, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', 'active', 0, 0),
(11, 5, 'Komorebi Handcrafted Ceramic Pour-Over Set', 'komorebi-handcrafted-ceramic-pour-over-set', 'Artisan glazed stoneware dripper and serving carafe for barista-level specialty coffee brewing at home. Heat-retentive and dishwasher safe.', 75.00, 59.00, 4, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80', 'active', 0, 0),
(12, 6, 'Solstice Polarized Acetate Sunglasses', 'solstice-polarized-acetate-sunglasses', 'Italian Mazzucchelli hand-polished acetate frame with Category 3 polarized UV400 lenses and 5-barrel German hinges for all-day glare protection.', 145.00, 119.00, 3, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', 'active', 1, 0)
ON DUPLICATE KEY UPDATE `product_name` = VALUES(`product_name`);

-- 4. ADDRESSES
INSERT INTO `addresses` (`address_id`, `user_id`, `full_name`, `phone`, `address_line`, `city`, `state`, `postal_code`) VALUES
(1, 2, 'John Doe', '+1-555-0123', '742 Evergreen Terrace', 'Springfield', 'OR', '97477'),
(2, 3, 'Emily Davis', '+1-555-0145', '1000 Broadway Ave, Apt 4B', 'New York', 'NY', '10001')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- 5. COUPONS
INSERT INTO `coupons` (`coupon_id`, `coupon_code`, `discount_type`, `discount_value`, `min_spend`, `expiry_date`, `status`) VALUES
(1, 'WELCOME10', 'percentage', 10.00, 50.00, '2028-12-31', 'active'),
(2, 'SAVE20', 'percentage', 20.00, 100.00, '2028-12-31', 'active'),
(3, 'FLAT50', 'fixed', 50.00, 200.00, '2028-12-31', 'active')
ON DUPLICATE KEY UPDATE `coupon_code` = VALUES(`coupon_code`);

-- 6. REVIEWS
INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `rating`, `comment`, `created_at`) VALUES
(1, 2, 1, 5, 'The sound quality and active noise cancellation are simply extraordinary. Super comfortable for long travel and work sessions!', NOW()),
(2, 3, 1, 5, 'Best headphones I have ever owned. The matte finish and packaging felt like Apple-tier luxury.', NOW()),
(3, 2, 2, 4, 'Battery easily lasts me a full week with daily workouts. The titanium chassis feels exceptionally premium.', NOW()),
(4, 3, 3, 5, 'Shaved 40 seconds off my 10k time! Insanely springy energy return and fit like a glove.', NOW()),
(5, 2, 5, 5, 'The leather aroma and stitching craftsmanship are top notch. Worth every single penny.', NOW())
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`);

-- 7. NEWSLETTER
INSERT INTO `newsletter_subscribers` (`subscriber_id`, `email`, `created_at`) VALUES
(1, 'vip.customer@example.com', NOW()),
(2, 'tech.insider@example.com', NOW())
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 8. SAMPLE ORDERS FOR REPORTING AND TESTING
INSERT INTO `orders` (`order_id`, `order_number`, `user_id`, `address_id`, `subtotal`, `shipping_fee`, `discount_amount`, `total_amount`, `payment_method`, `payment_status`, `order_status`, `created_at`) VALUES
(1, 'ORD-20261101-1001', 2, 1, 249.00, 0.00, 24.90, 224.10, 'cod', 'paid', 'Delivered', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 'ORD-20261105-1002', 3, 2, 299.00, 0.00, 0.00, 299.00, 'online', 'paid', 'Processing', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 'ORD-20261108-1003', 2, 1, 159.00, 10.00, 0.00, 169.00, 'cod', 'pending', 'Pending', NOW())
ON DUPLICATE KEY UPDATE `order_number` = VALUES(`order_number`);

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `product_name`, `product_image`, `quantity`, `price`, `subtotal`) VALUES
(1, 1, 1, 'Luxe Sonic Studio Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 1, 249.00, 249.00),
(2, 2, 2, 'Chronos Horizon Minimalist Smartwatch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 1, 299.00, 299.00),
(3, 3, 3, 'AeroGlide Carbon Pro Running Shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 1, 159.00, 159.00)
ON DUPLICATE KEY UPDATE `order_item_id` = VALUES(`order_item_id`);
