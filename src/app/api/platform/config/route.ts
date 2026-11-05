import { NextResponse } from 'next/server';
import { getDb, saveDb, SamiqProjectRecord, DEFAULT_PRICING_CONFIG } from '@/core/db/store';
import { ThemeId, isValidThemeId, FeatureFlags, PlatformMeta } from '@/themes/contract';
import { MOCK_PLATFORM_META } from '@/core/store/mockData';
import { FEATURES_REGISTRY } from '@/core/features/registry';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      success: true,
      tenant: db.tenant,
      features: db.features,
      projects: db.projects || [],
      platformMeta: db.platformMeta || MOCK_PLATFORM_META,
      pricingConfig: db.pricingConfig || DEFAULT_PRICING_CONFIG,
      themeId: db.tenant.themeId || 'luxury-noir',
      productsCount: db.products ? db.products.length : 0,
      ordersCount: db.orders ? db.orders.length : 0,
      bookingsCount: db.bookings ? db.bookings.length : 0,
      customersCount: db.customers ? db.customers.length : 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل استرجاع تكوين المنصة' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();

    // 0. Handle Create Project Action
    if (body.action === 'create_project') {
      const slug = (body.slug || `store-${Date.now()}`).trim().toLowerCase().replace(/\s+/g, '-');
      const themeId = (isValidThemeId(body.themeId) ? body.themeId : 'luxury-noir') as ThemeId;
      const domainType = body.domainType || 'subdomain_free';
      const annualDomainUsd =
        typeof body.annualDomainUsd === 'number'
          ? body.annualDomainUsd
          : domainType === 'custom_com'
          ? 20
          : domainType === 'custom_ye'
          ? 35
          : 0;

      const newProject: SamiqProjectRecord = {
        id: body.id || `proj-${Date.now()}`,
        slug,
        name: body.name || 'متجر جديد',
        legalName: body.legalName || body.name || 'متجر تجاري جديد',
        industryAr: body.industryAr || 'العناية بالبشرة والمكياج',
        domain: body.domain || `${slug}.samiq.app`,
        domainType,
        annualDomainUsd,
        annualHostingMaintenanceUsd: typeof body.annualHostingMaintenanceUsd === 'number' ? body.annualHostingMaintenanceUsd : 45,
        aiPlanType: body.aiPlanType || 'none',
        themeId: themeId as 'luxury-noir' | 'ivory-journal' | 'clinic-lab',
        whatsapp: body.whatsapp || '967770000000',
        city: body.city || 'صنعاء',
        adminPasscode: body.adminPasscode || 'samiq2026',
        status: body.status || 'staging',
        setupPriceUsd: typeof body.setupPriceUsd === 'number' ? body.setupPriceUsd : 450,
        enabledFeatures: Array.isArray(body.enabledFeatures) && body.enabledFeatures.length > 0
          ? body.enabledFeatures
          : ['tier_1_static', 'tier_2_editable', 'tier_3_catalog', 'cart_whatsapp'],
        productsCount: typeof body.productsCount === 'number' ? body.productsCount : 6,
        ordersCount: typeof body.ordersCount === 'number' ? body.ordersCount : 0,
        previewUrl: `/?demo=1&tenant=${slug}&theme=${themeId}`,
        adminUrl: `/admin?tenant=${slug}`,
      };

      if (!db.projects) db.projects = [];
      db.projects.push(newProject);
      saveDb(db);

      return NextResponse.json({
        success: true,
        message: 'تم تدشين المشروع الجديد بنجاح في أسطول مشاريع سَامِق',
        projects: db.projects,
        project: newProject,
      });
    }

    // 0.1 Handle Delete Project Action
    if (body.action === 'delete_project') {
      if (body.projectId && body.projectId !== 'proj-miftah') {
        db.projects = (db.projects || []).filter((p) => p.id !== body.projectId);
        saveDb(db);
        return NextResponse.json({
          success: true,
          message: 'تم حذف المشروع من الأسطول بنجاح',
          projects: db.projects,
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'لا يمكن حذف المشروع الأساسي' },
          { status: 400 }
        );
      }
    }

    // 1. Update Project in Fleet if projectId is provided
    if (body.projectId && db.projects) {
      const projIdx = db.projects.findIndex((p) => p.id === body.projectId);
      if (projIdx >= 0) {
        const curProj = db.projects[projIdx];
        const nextTheme = (body.themeId && isValidThemeId(body.themeId) ? body.themeId : curProj.themeId) as 'luxury-noir' | 'ivory-journal' | 'clinic-lab';
        
        let nextFeatures = curProj.enabledFeatures;
        if (body.features && Array.isArray(body.features)) {
          nextFeatures = body.features;
        }

        db.projects[projIdx] = {
          ...curProj,
          name: body.name ?? curProj.name,
          legalName: body.legalName ?? curProj.legalName,
          industryAr: body.industryAr ?? curProj.industryAr,
          domain: body.domain ?? curProj.domain,
          domainType: body.domainType ?? curProj.domainType,
          annualDomainUsd: typeof body.annualDomainUsd === 'number' ? body.annualDomainUsd : curProj.annualDomainUsd,
          annualHostingMaintenanceUsd: typeof body.annualHostingMaintenanceUsd === 'number' ? body.annualHostingMaintenanceUsd : curProj.annualHostingMaintenanceUsd,
          aiPlanType: body.aiPlanType ?? curProj.aiPlanType,
          status: body.status ?? curProj.status,
          themeId: nextTheme,
          enabledFeatures: nextFeatures,
          setupPriceUsd: typeof body.setupPriceUsd === 'number' ? body.setupPriceUsd : curProj.setupPriceUsd,
          whatsapp: body.whatsapp ?? curProj.whatsapp,
          city: body.city ?? curProj.city,
          previewUrl: curProj.slug === 'miftah' ? `/?demo=1&theme=${nextTheme}` : `/?demo=1&tenant=${curProj.slug}&theme=${nextTheme}`,
        };

        // If this is proj-miftah, also sync live tenant theme and features
        if (body.projectId === 'proj-miftah') {
          db.tenant.themeId = nextTheme;
          const activeSet = new Set<string>(nextFeatures);
          db.features = {
            tier_1_static: activeSet.has('tier_1_static'),
            tier_2_editable: activeSet.has('tier_2_editable'),
            tier_3_catalog: activeSet.has('tier_3_catalog'),
            cart_whatsapp: activeSet.has('cart_whatsapp'),
            customer_accounts: activeSet.has('customer_accounts'),
            payment_gateways: activeSet.has('payment_gateways'),
            ai_chatbot: activeSet.has('ai_chatbot'),
            whatsapp_channel: activeSet.has('whatsapp_channel'),
            telegram_channel: activeSet.has('telegram_channel'),
            authenticity_guide: activeSet.has('authenticity_guide'),
            skin_routine_advisor: activeSet.has('skin_routine_advisor'),
            smart_tags_ai: activeSet.has('smart_tags_ai'),
          };
        }
      }
    }

    // 2. Update active theme directly if provided
    if (body.themeId && typeof body.themeId === 'string' && isValidThemeId(body.themeId)) {
      db.tenant.themeId = body.themeId as ThemeId;
      // Also sync to proj-miftah in fleet
      if (db.projects) {
        const miftah = db.projects.find((p) => p.id === 'proj-miftah');
        if (miftah) {
          miftah.themeId = body.themeId as any;
          miftah.previewUrl = `/?demo=1&theme=${body.themeId}`;
        }
      }
    }

    // 3. Update feature flags directly if provided
    if (body.features) {
      if (Array.isArray(body.features)) {
        // If an array of active feature IDs is passed
        const activeSet = new Set<string>(body.features);
        const nextFeatures: FeatureFlags = {
          tier_1_static: activeSet.has('tier_1_static'),
          tier_2_editable: activeSet.has('tier_2_editable'),
          tier_3_catalog: activeSet.has('tier_3_catalog'),
          cart_whatsapp: activeSet.has('cart_whatsapp'),
          customer_accounts: activeSet.has('customer_accounts'),
          payment_gateways: activeSet.has('payment_gateways'),
          ai_chatbot: activeSet.has('ai_chatbot'),
          whatsapp_channel: activeSet.has('whatsapp_channel'),
          telegram_channel: activeSet.has('telegram_channel'),
          authenticity_guide: activeSet.has('authenticity_guide'),
          skin_routine_advisor: activeSet.has('skin_routine_advisor'),
          smart_tags_ai: activeSet.has('smart_tags_ai'),
        };
        db.features = nextFeatures;
      } else if (typeof body.features === 'object') {
        db.features = {
          ...db.features,
          ...body.features,
        };
      }
    }

    // 4. Update tenant metadata
    if (body.tenant && typeof body.tenant === 'object') {
      db.tenant = {
        ...db.tenant,
        ...body.tenant,
      };
      if (body.tenant.name) db.tenant.name = body.tenant.name;
      if (body.tenant.tagline) db.tenant.tagline = body.tenant.tagline;
      if (body.tenant.whatsapp) {
        db.tenant.whatsapp = body.tenant.whatsapp;
        if (db.tenant.contact) db.tenant.contact.whatsapp = body.tenant.whatsapp;
      }
      if (body.tenant.city) db.tenant.city = body.tenant.city;
      if (typeof body.tenant.noindex === 'boolean') db.tenant.noindex = body.tenant.noindex;
    }

    // 5. Update platform & developer metadata
    if (body.platformMeta && typeof body.platformMeta === 'object') {
      db.platformMeta = {
        ...(db.platformMeta || MOCK_PLATFORM_META),
        ...body.platformMeta,
      };
    }

    // 6. Update platform pricing config if provided
    if (body.pricingConfig && typeof body.pricingConfig === 'object') {
      db.pricingConfig = {
        ...DEFAULT_PRICING_CONFIG,
        ...(db.pricingConfig || {}),
        ...body.pricingConfig,
      };
    }

    // Save directly to samiq-db.json
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'تم حفظ تكوين المنصة والقالب وقاعدة البيانات بنجاح',
      tenant: db.tenant,
      features: db.features,
      projects: db.projects || [],
      themeId: db.tenant.themeId,
      platformMeta: db.platformMeta || MOCK_PLATFORM_META,
      pricingConfig: db.pricingConfig || DEFAULT_PRICING_CONFIG,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ تكوين المنصة' }, { status: 500 });
  }
}

