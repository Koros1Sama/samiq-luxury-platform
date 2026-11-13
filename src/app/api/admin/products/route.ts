import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProducts,
  handleUpdateProduct,
} from '@/core/store/productApiHandlers';

export async function GET(req: Request) {
  return handleGetProducts(req, true);
}

export async function POST(req: Request) {
  return handleCreateProduct(req, 'admin_prod');
}

export async function PUT(req: Request) {
  return handleUpdateProduct(req);
}

export async function DELETE(req: Request) {
  return handleDeleteProduct(req);
}
