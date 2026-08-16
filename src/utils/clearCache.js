const CACHE_CLEAR_KEY = "__last_cache_clear__";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export async function clearProjectCache() {
  try {
    // Limpa localStorage
    localStorage.clear();

    // Limpa sessionStorage
    sessionStorage.clear();

    // Limpa Cache Storage
    if ("caches" in window) {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }

    console.log("Cache do projeto limpo.");
  } catch (error) {
    console.error("Erro ao limpar cache:", error);
  }
}

export async function clearCacheEvery24Hours() {
  try {
    const lastClear = localStorage.getItem(CACHE_CLEAR_KEY);
    const now = Date.now();

    // Primeira execução
    if (!lastClear) {
      localStorage.setItem(CACHE_CLEAR_KEY, String(now));
      return;
    }

    const elapsed = now - Number(lastClear);

    // Ainda não completou 24 horas
    if (elapsed < TWENTY_FOUR_HOURS) {
      return;
    }

    // Limpa tudo
    await clearProjectCache();

    // Como o localStorage foi apagado,
    // precisamos recriar o controle da próxima limpeza
    localStorage.setItem(CACHE_CLEAR_KEY, String(now));
  } catch (error) {
    console.error("Erro ao verificar limpeza de cache:", error);
  }
}