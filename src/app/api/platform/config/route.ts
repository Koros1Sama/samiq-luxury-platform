import { NextResponse } from 'next/server';
import { getDb, saveDb, SamiqProjectRecord, DEFAULT_PRICING_CONFIG } from '@/core/db/store';
import { ThemeId, isValidThemeId, FeatureFlags, PlatformMeta } from '@/themes/contract';
import { MOCK_PLATFORM_META } from '@/core/store/mockData';
import {
  verifyAdminAuth,
  maskSensitiveTenantSecrets,
  maskSensitiveProjectSecrets,
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeNumber,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    const db = getDb();

    return NextResponse.json({
      success: true,
      tenant: maskSensitiveTenantSecrets(db.tenant, auth.authorized),
      features: db.features,
      projects: maskSensitiveProjectSecrets(db.projects || [], auth.authorized),
      platformMeta: db.platformMeta || MOCK_PLATFORM_META,
      pricingConfig: db.pricingConfig || DEFAULT_PRICING_CONFIG,
      themeId: db.tenant.themeId || 'luxury-noir',
      productsCount: db.products ? db.products.length : 0,
      ordersCount: db.orders ? db.orders.length : 0,
      bookingsCount: db.bookings ? db.bookings.length : 0,
      customersCount: db.customers ? db.customers.length : 0,
      isAdmin: auth.authorized,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل استرجاع تكوين المنصة' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`platform_config:${ip}`, 45, 60_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من الطلبات، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتعديل تكوين المنصة أو أسطول المشاريع' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const db = getDb();

    // 0. Handle Create Project Action
    if (body.action === 'create_project') {
      const slug = sanitizeText(body.slug || `store-${Date.now()}`, 50).toLowerCase().replace(/\s+/g, '-');
      const themeId = (isValidThemeId(body.themeId) ? body.themeId : 'luxury-noir') as ThemeId;
      const domainType = body.domainType || 'subdomain_free';
      const annualDomainUsd =
        typeof body.annualDomainUsd === 'number'
          ? sanitizeNumber(body.annualDomainUsd, 0, 0, 10_000)
          : domainType === 'custom_com'
          ? 20
          : domainType === 'custom_ye'
          ? 35
          : 0;

      const newProject: SamiqProjectRecord = {
        id: sanitizeText(body.id, 50) || `proj-${Date.now()}`,
        slug,
        name: sanitizeText(body.name || 'متجر جديد', 100),
        legalName: sanitizeText(body.legalName || body.name || 'متجر تجاري جديد', 150),
        industryAr: sanitizeText(body.industryAr || 'العناية بالبشرة والمكياج', 100),
        domain: sanitizeText(body.domain || `${slug}.samiq.app`, 100),
        domainType,
        annualDomainUsd,
        annualHostingMaintenanceUsd: sanitizeNumber(body.annualHostingMaintenanceUsd, 45, 0, 10_000),
        aiPlanType: body.aiPlanType || 'none',
        themeId: themeId as 'luxury-noir' | 'ivory-journal' | 'clinic-lab',
        whatsapp: sanitizeText(body.whatsapp || '967770000000', 30),
        city: sanitizeText(body.city || 'صنعاء', 50),
        adminPasscode: sanitizeText(body.adminPasscode || 'samiq2026', 50),
        status: body.status || 'staging',
        setupPriceUsd: sanitizeNumber(body.setupPriceUsd, 450, 0, 100_000),
        enabledFeatures: Array.isArray(body.enabledFeatures) && body.enabledFeatures.length > 0
          ? body.enabledFeatures
          : ['tier_1_static', 'tier_2_editable', 'tier_3_catalog', 'cart_whatsapp'],
        productsCount: sanitizeNumber(body.productsCount, 6, 0, 100_000),
        ordersCount: sanitizeNumber(body.ordersCount, 0, 0, 100_000),
        previewUrl: `/?demo=1&tenant=${slug}&theme=${themeId}`,
        adminUrl: `/admin?tenant=${slug}`,
      };

      if (!db.projects) db.projects = [];
      db.projects.push(newProject);
      saveDb(db);

      return NextResponse.json({
        success: true,
        message: 'تم تدشين المشروع الجديد بنجاح في أسطول مشاريع سَامِق',
        projects: maskSensitiveProjectSecrets(db.projects, true),
        project: newProject,
      });
    }

    // 0.1 Handle Delete Project Action
    if (body.action === 'delete_project') {
      const projId = sanitizeText(body.projectId, 50);
      if (projId && projId !== 'proj-miftah') {
        db.projects = (db.projects || []).filter((p) => p.id !== projId);
        saveDb(db);
        return NextResponse.json({
          success: true,
          message: 'تم حذف المشروع من الأسطول بنجاح',
          projects: maskSensitiveProjectSecrets(db.projects, true),
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
      const projId = sanitizeText(body.projectId, 50);
      const projIdx = db.projects.findIndex((p) => p.id === projId);
      if (projIdx >= 0) {
        const curProj = db.projects[projIdx];
        const nextTheme = (body.themeId && isValidThemeId(body.themeId) ? body.themeId : curProj.themeId) as 'luxury-noir' | 'ivory-journal' | 'clinic-lab';

        let nextFeatures = curProj.enabledFeatures;
        if (body.features && Array.isArray(body.features)) {
          nextFeatures = body.features;
        }

        db.projects[projIdx] = {
          ...curProj,
          name: body.name ? sanitizeText(body.name, 100) : curProj.name,
          legalName: body.legalName ? sanitizeText(body.legalName, 150) : curProj.legalName,
          industryAr: body.industryAr ? sanitizeText(body.industryAr, 100) : curProj.industryAr,
          domain: body.domain ? sanitizeText(body.domain, 100) : curProj.domain,
          domainType: body.domainType ?? curProj.domainType,
          annualDomainUsd: typeof body.annualDomainUsd === 'number' ? sanitizeNumber(body.annualDomainUsd, 20, 0, 10_000) : curProj.annualDomainUsd,
          annualHostingMaintenanceUsd: typeof body.annualHostingMaintenanceUsd === 'number' ? sanitizeNumber(body.annualHostingMaintenanceUsd, 45, 0, 10_000) : curProj.annualHostingMaintenanceUsd,
          aiPlanType: body.aiPlanType ?? curProj.aiPlanType,
          status: body.status ?? curProj.status,
          themeId: nextTheme,
          enabledFeatures: nextFeatures,
          setupPriceUsd: typeof body.setupPriceUsd === 'number' ? sanitizeNumber(body.setupPriceUsd, curProj.setupPriceUsd, 0, 100_000) : curProj.setupPriceUsd,
          whatsapp: body.whatsapp ? sanitizeText(body.whatsapp, 30) : curProj.whatsapp,
          city: body.city ? sanitizeText(body.city, 50) : curProj.city,
          previewUrl: curProj.slug === 'miftah' ? `/?demo=1&theme=${nextTheme}` : `/?demo=1&tenant=${curProj.slug}&theme=${nextTheme}`,
        };

        if (projId === 'proj-miftah') {
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
      delete body.tenant.passcode;
      delete body.tenant.adminPasscode;
      db.tenant = {
        ...db.tenant,
        ...body.tenant,
      };
      if (body.tenant.name) db.tenant.name = sanitizeText(body.tenant.name, 100);
      if (body.tenant.tagline) db.tenant.tagline = sanitizeText(body.tenant.tagline, 200);
      if (body.tenant.whatsapp) {
        const safeWa = sanitizeText(body.tenant.whatsapp, 30);
        db.tenant.whatsapp = safeWa;
        if (db.tenant.contact) db.tenant.contact.whatsapp = safeWa;
      }
      if (body.tenant.city) db.tenant.city = sanitizeText(body.tenant.city, 50);
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

    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'تم حفظ تكوين المنصة والقالب وقاعدة البيانات بنجاح',
      tenant: maskSensitiveTenantSecrets(db.tenant, true),
      features: db.features,
      projects: maskSensitiveProjectSecrets(db.projects || [], true),
      themeId: db.tenant.themeId,
      platformMeta: db.platformMeta || MOCK_PLATFORM_META,
      pricingConfig: db.pricingConfig || DEFAULT_PRICING_CONFIG,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ تكوين المنصة' }, { status: 500 });
  }
}
