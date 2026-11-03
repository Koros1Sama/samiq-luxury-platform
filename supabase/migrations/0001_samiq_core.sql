-- ==============================================================================
-- SAMIQ MULTI-TENANT ARCHITECTURE SCHEMA (0001_samiq_core.sql)
-- Strict Tenant Isolation with Row Level Security (RLS)
-- Platform: SAMIQ (سَامِق) | First Pilot: مفتاح الجمال (miftah)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TENANT CONTEXT HELPER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS uuid AS $$
BEGIN
  -- 1. Try application config parameter (set by middleware / connection pool)
  BEGIN
    RETURN current_setting('app.current_tenant_id', true)::uuid;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore error and fallback to JWT
  END;

  -- 2. Try Supabase auth JWT claim
  BEGIN
    RETURN NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id', '')::uuid;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. CORE PLATFORM TABLES
-- ------------------------------------------------------------------------------

-- Tenants (Stores / Merchants)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  legal_name TEXT,
  phone TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT,
  logo_url TEXT,
  noindex BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'pending')),
  tenant_mode TEXT NOT NULL DEFAULT 'shared' CHECK (tenant_mode IN ('shared', 'single')),
  default_currency TEXT NOT NULL DEFAULT 'YER' CHECK (default_currency IN ('YER', 'SAR', 'USD')),
  theme_id TEXT NOT NULL DEFAULT 'luxury-noir',
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  ssl_status TEXT DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Features Catalog (Modular Engine & Addons)
CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY, -- e.g. 'tier_1_static', 'cart_whatsapp', 'authenticity_guide'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tier', 'addon', 'channel', 'integration')),
  base_price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  requires TEXT[] DEFAULT ARRAY[]::TEXT[], -- Feature dependencies that must be enabled
  min_tier TEXT DEFAULT 'tier_1_static',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant Activated Features
CREATE TABLE IF NOT EXISTS tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT TRUE,
  custom_config JSONB DEFAULT '{}'::jsonb,
  enabled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  CONSTRAINT tenant_feature_unique UNIQUE (tenant_id, feature_id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'tier_1_static',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime', 'custom')),
  current_price_usd NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Branches / Locations
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  coordinates JSONB,
  is_main BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Storefront Sections
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT section_tenant_slug UNIQUE (tenant_id, slug)
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT category_tenant_slug UNIQUE (tenant_id, slug)
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT DEFAULT '#C9A84C',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tag_tenant_slug UNIQUE (tenant_id, slug)
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_authentic_guaranteed BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'pre_order')),
  sku TEXT,
  meta_tags JSONB DEFAULT '{}'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT product_tenant_slug UNIQUE (tenant_id, slug)
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- e.g. '30ml', '50ml', 'درجة 01 - طبيعي'
  sku TEXT,
  shade_code TEXT,
  stock_quantity INT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Prices (Multi-Currency Support: YER, SAR, USD)
CREATE TABLE IF NOT EXISTS product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  currency TEXT NOT NULL CHECK (currency IN ('YER', 'SAR', 'USD')),
  amount NUMERIC(12, 2) NOT NULL,
  compare_at_amount NUMERIC(12, 2),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT price_variant_currency UNIQUE (tenant_id, product_id, variant_id, currency)
);

-- Authenticity Guides (Interactive Original vs Fake Comparator)
CREATE TABLE IF NOT EXISTS authenticity_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  original_title TEXT NOT NULL DEFAULT 'الأصلي المضمون',
  original_image TEXT NOT NULL,
  original_batch_example TEXT,
  original_texture_notes TEXT,
  original_barcode_notes TEXT,
  fake_title TEXT NOT NULL DEFAULT 'التقليد المغشوش',
  fake_image TEXT NOT NULL,
  fake_batch_example TEXT,
  fake_texture_notes TEXT,
  fake_barcode_notes TEXT,
  inspection_checklist JSONB DEFAULT '[]'::jsonb,
  comparison_video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT authenticity_guide_unique UNIQUE (tenant_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  city TEXT DEFAULT 'صنعاء',
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) DEFAULT 0.00,
  total NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'YER',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'canceled')),
  payment_method TEXT NOT NULL DEFAULT 'whatsapp_cod' CHECK (payment_method IN ('whatsapp_cod', 'kuraimi', 'jawali', 'floosak', 'cash_on_delivery')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT order_tenant_number UNIQUE (tenant_id, order_number)
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  variant_title TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  default_address TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT customer_tenant_phone UNIQUE (tenant_id, phone)
);

-- AI Usage Tracking & Audit
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('web_chat', 'whatsapp', 'telegram')),
  prompt_tokens INT NOT NULL DEFAULT 0,
  completion_tokens INT NOT NULL DEFAULT 0,
  total_tokens INT NOT NULL DEFAULT 0,
  cost_estimated NUMERIC(10, 4) DEFAULT 0.0000,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all multi-tenant tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE authenticity_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Tenants policies
CREATE POLICY "Tenants: Public storefront can read active tenant by slug or domain"
  ON tenants FOR SELECT
  USING (status = 'active');

CREATE POLICY "Tenants: Tenant owner can update own tenant"
  ON tenants FOR ALL
  USING (id = current_tenant_id());

-- Storefront Public Read for Active Tenant's Catalog
CREATE POLICY "Branches: Storefront read" ON branches FOR SELECT USING (tenant_id = current_tenant_id() AND is_active = true);
CREATE POLICY "Sections: Storefront read" ON sections FOR SELECT USING (tenant_id = current_tenant_id() AND is_active = true);
CREATE POLICY "Categories: Storefront read" ON categories FOR SELECT USING (tenant_id = current_tenant_id() AND is_active = true);
CREATE POLICY "Tags: Storefront read" ON tags FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY "Products: Storefront read" ON products FOR SELECT USING (tenant_id = current_tenant_id() AND is_active = true);
CREATE POLICY "Product Variants: Storefront read" ON product_variants FOR SELECT USING (tenant_id = current_tenant_id() AND is_active = true);
CREATE POLICY "Product Prices: Storefront read" ON product_prices FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY "Authenticity Guides: Storefront read" ON authenticity_guides FOR SELECT USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant Features: Storefront read" ON tenant_features FOR SELECT USING (tenant_id = current_tenant_id() AND is_enabled = true);

-- Orders: Storefront insert
CREATE POLICY "Orders: Storefront create order" ON orders FOR INSERT WITH CHECK (tenant_id = current_tenant_id());
CREATE POLICY "Order Items: Storefront create items" ON order_items FOR INSERT WITH CHECK (tenant_id = current_tenant_id());

-- Admin Isolation Policies (Full Access for Authenticated Tenant Admin)
CREATE POLICY "Tenant admin branches" ON branches FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin sections" ON sections FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin categories" ON categories FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin tags" ON tags FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin products" ON products FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin variants" ON product_variants FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin prices" ON product_prices FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin guides" ON authenticity_guides FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin orders" ON orders FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin order items" ON order_items FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin customers" ON customers FOR ALL USING (tenant_id = current_tenant_id());
CREATE POLICY "Tenant admin ai usage" ON ai_usage FOR ALL USING (tenant_id = current_tenant_id());

-- ------------------------------------------------------------------------------
-- 4. SEED DATA (FEATURES CATALOG & PILOT TENANT: MIFTAH)
-- ------------------------------------------------------------------------------

-- Seed Features Catalog
INSERT INTO features (id, name, description, category, base_price_usd, requires, min_tier) VALUES
('tier_1_static', 'باقة الحضور الرقمي الفاخر (Static Core)', 'صفحة هبوط فاخرة وسريعة + طلب عبر واتساب مباشر + هوية مخصصة', 'tier', 100.00, ARRAY[]::TEXT[], 'tier_1_static'),
('tier_2_editable', 'باقة المتجر المرن (Editable Store)', 'لوحة تحكم لإدارة المنتجات والأسعار والمخزون مع إحصائيات مبسطة', 'tier', 250.00, ARRAY['tier_1_static']::TEXT[], 'tier_2_editable'),
('tier_3_catalog', 'باقة الكتالوج الديناميكي الشامل (Full Catalog)', 'كتالوج متعدد الأقسام مع فلترة متقدمة وبحث سريع ودرجات وتنوع للمنتجات', 'tier', 450.00, ARRAY['tier_2_editable']::TEXT[], 'tier_3_catalog'),
('cart_whatsapp', 'سلة الشراء الموجهة لواتساب (Smart WhatsApp Cart)', 'سلة تسوق فاخرة تحسب الإجمالي وتنشئ رسالة واتساب منسقة ومفصلة بالطلب', 'addon', 40.00, ARRAY['tier_1_static']::TEXT[], 'tier_1_static'),
('authenticity_guide', 'مقارن الأصلي والتقليد التفاعلي (Authenticity Slider)', 'أداة سحب ومقارنة بصرية بين المنتج الأصلي والتقليد المغشوش مع قائمة فحص', 'addon', 75.00, ARRAY['tier_1_static']::TEXT[], 'tier_1_static'),
('skin_routine_advisor', 'مستشار روتين البشرة التفاعلي (Routine Advisor)', 'اختيار نوع البشرة مع عرض روتين متكامل ومخطط المكونات الفعالة المضيء', 'addon', 60.00, ARRAY['tier_1_static']::TEXT[], 'tier_1_static'),
('customer_accounts', 'حسابات العملاء وسجل الطلبات (Customer Hub)', 'تسجيل دخول العملاء برقم الهاتف والاطلاع على الطلبات السابقة', 'addon', 80.00, ARRAY['tier_2_editable']::TEXT[], 'tier_2_editable'),
('payment_gateways', 'بوابات الدفع الإلكتروني المحلية (Yemeni Wallets)', 'ربط محافظ الكريمي، جوالي، فلوسك، ون كاش لإتمام الدفع الفوري', 'integration', 120.00, ARRAY['tier_3_catalog']::TEXT[], 'tier_3_catalog'),
('ai_chatbot', 'المستشار الذكي: اسأل خبير لكشف المقلد (AI Beauty Bot)', 'شات بوت ذكي يقترح المنتجات ويفحص الأصالة ويجيب العملاء 24/7 بلهجة يمنية راقية', 'addon', 150.00, ARRAY['tier_2_editable']::TEXT[], 'tier_2_editable'),
('whatsapp_channel', 'قناة بوت الواتساب التفاعلية (WhatsApp Bot)', 'الرد الآلي على استفسارات الأسعار والأصالة عبر تطبيق واتساب مباشرة', 'channel', 90.00, ARRAY['ai_chatbot']::TEXT[], 'tier_2_editable'),
('telegram_channel', 'قناة بوت التيليجرام المتكاملة (Telegram Bot)', 'متجر متكامل بكتالوج وسلة داخل بوت التيليجرام', 'channel', 50.00, ARRAY['tier_2_editable']::TEXT[], 'tier_2_editable')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price_usd = EXCLUDED.base_price_usd,
  requires = EXCLUDED.requires,
  min_tier = EXCLUDED.min_tier;

-- Seed Pilot Tenant: "مفتاح الجمال — لكشف المقلد"
INSERT INTO tenants (id, slug, name, legal_name, phone, whatsapp, email, noindex, status, tenant_mode, default_currency, theme_id, settings)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'miftah',
  'مفتاح الجمال',
  'مفتاح الجمال — لكشف المقلد',
  '967775234989',
  '967775234989',
  'contact@miftah-beauty.ye',
  TRUE, -- Pilot rule: noindex = true to avoid search crawler exposure before official launch
  'active',
  'shared',
  'YER',
  'luxury-noir',
  '{
    "tagline": "بوابتك الموثوقة لعالم الجمال",
    "instagram": "miftah_beauty",
    "hero_badge": "مضمون أصلي 100%",
    "city": "صنعاء",
    "delivery_coverage": "كافة محافظات الجمهورية اليمنية"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  whatsapp = EXCLUDED.whatsapp,
  noindex = EXCLUDED.noindex;

-- Link Primary Domain
INSERT INTO domains (tenant_id, domain, is_primary, verified, ssl_status)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'miftah.samiq.ye',
  TRUE,
  TRUE,
  'active'
)
ON CONFLICT (domain) DO NOTHING;

-- Enable Core Features for Miftah Pilot Store
INSERT INTO tenant_features (tenant_id, feature_id, is_enabled) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'tier_1_static', TRUE),
('11111111-1111-1111-1111-111111111111'::uuid, 'tier_2_editable', TRUE),
('11111111-1111-1111-1111-111111111111'::uuid, 'tier_3_catalog', TRUE),
('11111111-1111-1111-1111-111111111111'::uuid, 'cart_whatsapp', TRUE),
('11111111-1111-1111-1111-111111111111'::uuid, 'authenticity_guide', TRUE),
('11111111-1111-1111-1111-111111111111'::uuid, 'skin_routine_advisor', TRUE),
('11111111-1111-1111-1111-111111111111'::uuid, 'ai_chatbot', TRUE)
ON CONFLICT (tenant_id, feature_id) DO UPDATE SET is_enabled = EXCLUDED.is_enabled;
