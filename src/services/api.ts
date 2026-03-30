const API_BASE_URL = "/api";

export type User = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  user_id: number;
  seller_name?: string;
  created_at?: string;
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  title: string;
};

export type Order = {
  id: number;
  total: number;
  created_at: string;
  items: OrderItem[];
};

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders(isFormData = false): HeadersInit {
  const token = getToken();

  if (isFormData) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : "Erro na requisição.";
    throw new Error(message);
  }

  return data as T;
}

export function clearAuthSession() {
  localStorage.removeItem("token");
}

export function getAuthSession() {
  return {
    token: getToken(),
  };
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ token: string; user: User }>(response);
}

export async function login(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ token: string; user: User }>(response);
}

export async function me() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<{ user: User }>(response);
}

export async function getProducts(params?: {
  search?: string;
  category?: string;
  sellerId?: number;
}) {
  const query = new URLSearchParams();

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.category) {
    query.set("category", params.category);
  }

  if (params?.sellerId) {
    query.set("sellerId", String(params.sellerId));
  }

  const queryString = query.toString();
  const url = queryString
    ? `${API_BASE_URL}/products?${queryString}`
    : `${API_BASE_URL}/products`;

  const response = await fetch(url, {
    method: "GET",
  });

  return handleResponse<Product[]>(response);
}

export async function getProductById(id: number | string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "GET",
  });

  return handleResponse<Product>(response);
}

export async function getMyProducts() {
  const response = await fetch(`${API_BASE_URL}/products/mine`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<Product[]>(response);
}

export async function createProduct(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: formData,
  });

  return handleResponse<Product>(response);
}

export async function updateProduct(id: number, formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: formData,
  });

  return handleResponse<Product>(response);
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse<{ message: string }>(response);
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao buscar pedidos");
  }

  return data;
}

export async function createOrder(data: { items: OrderItemInput[] }) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string; orderId: number }>(response);
}