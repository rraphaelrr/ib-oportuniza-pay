import api from "./api";

const TOKEN =
  "5b7a8e4ffbeae77b80085436d2bde1d60b93f3dd7f876a84e0a59eeff5fe8a87dab367cd047af7ef7aaef2b15f31d185";

export async function getBalances(accountId) {
    console.log(accountId)
  const { data } = await api.get(
    `partner/v1/accounts/${accountId}/balances`,
    {
      headers: {
        "X-Partner-Internal-Token": TOKEN,
         "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
    }
  );

  return data;
}