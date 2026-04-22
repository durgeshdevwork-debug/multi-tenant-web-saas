import { Template } from "../templates/models/Template";
import { Tenant } from "../tenants/models/Tenant";
import { SiteSettings } from "../content/models/SiteSettings";
import { Page } from "../content/models/Page";
import { buildInitialPages } from "../content/page.defaults";
import { generateApiKey } from "../../shared/utils/apiKey";
import { hashPassword } from "../../shared/utils/auth";
import { User } from "../auth/models/user.model";
import { Account } from "../auth/models/account.model";
import mongoose from "mongoose";
import { env } from "@configs/env";
import { renderWelcomeEmail } from "@shared/email/renderEmail";
import { sendEmail } from "@shared/email/mailer";

export class AdminService {
  static async listTemplates() {
    return await Template.find();
  }

  static async seedTemplate(data: {
    name: string;
    identifier: string;
    modules: string[];
  }) {
    return await Template.create(data);
  }

  static async createClient(data: any) {
    const {
      clientName,
      slug,
      primaryDomain,
      templateId,
      businessDetails,
      email,
      password,
    } = data;

    const template = await Template.findById(templateId);
    if (!template) throw new Error("Template not found");

    const { apiKey, apiKeyHash, truncatedApiKey } = generateApiKey();

    const tenant = await Tenant.create({
      name: clientName,
      slug,
      primaryDomain,
      templateId,
      apiKeyHash,
      truncatedApiKey,
      status: "active",
      businessDetails,
    });

    const userId = new mongoose.Types.ObjectId();
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      _id: userId,
      email,
      name: clientName,
      tenantId: String(tenant._id),
      role: "user",
      emailVerified: true
    });

    await Account.create({
      userId,
      accountId: email,
      providerId: "credential",
      password: hashedPassword
    });

    const loginUrl = `${env.ADMIN_BASE_URL.replace(/\/$/, "")}/login`;
    const resetRedirectTo = `${env.ADMIN_BASE_URL.replace(/\/$/, "")}/reset-password`;

    const welcomeHtml = await renderWelcomeEmail({
      name: clientName,
      businessName: clientName,
      appName: "Admin Panel",
      email,
      password,
      loginUrl,
      resetUrl: resetRedirectTo,
    });

    await sendEmail({
      to: email,
      subject: `Welcome to ${clientName}`,
      html: welcomeHtml,
    });

    await SiteSettings.create({
      tenantId: tenant._id,
      siteName: clientName,
      domain: primaryDomain,
      business: {
        email,
        phone: businessDetails?.phone,
        address: businessDetails?.address,
      },
      seo: {
        defaultTitle: clientName,
        defaultDescription: `Welcome to ${clientName}`,
      },
    });

    const starterPages = buildInitialPages(clientName, template.modules || []);
    await Page.insertMany(
      starterPages.map((page) => ({
        ...page,
        tenantId: tenant._id,
        parentId: null,
        showHeader: true,
        showFooter: true,
        isPublished: true,
        navigationLabel: page.navigationLabel || page.title,
        showInHeader: page.showInHeader ?? true,
        showInFooter: page.showInFooter ?? true,
      })),
    );

    return { tenant, user, apiKey };
  }

  static async listClients() {
    return await Tenant.find().populate("templateId", "name identifier");
  }

  static async getClient(id: string) {
    const tenant = await Tenant.findById(id).populate("templateId");
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
  }

  static async updateClient(id: string, updates: any) {
    delete updates.apiKeyHash;
    delete updates.truncatedApiKey;
    return await Tenant.findByIdAndUpdate(id, updates, { new: true });
  }

  static async regenerateApiKey(id: string) {
    const { apiKey, apiKeyHash, truncatedApiKey } = generateApiKey();
    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { apiKeyHash, truncatedApiKey },
      { new: true },
    );
    if (!tenant) throw new Error("Tenant not found");
    return { tenant, apiKey };
  }
}
