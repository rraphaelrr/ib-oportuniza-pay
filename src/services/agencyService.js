import api from "./api";

export async function getAgencies() {
  const response = await api.get("/partner/v1/agencies", {
    headers: {
      "X-Partner-Internal-Token":
        "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185",
    },
  });

  return response.data.items;
}
