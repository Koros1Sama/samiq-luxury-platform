import { handleCustomerGet, handleCustomerPost } from '@/core/store/customerApiHandlers';

export async function GET(req: Request) {
  return handleCustomerGet(req);
}

export async function POST(req: Request) {
  return handleCustomerPost(req, { rateKeyPrefix: 'customers', allowAdminLogin: true });
}
