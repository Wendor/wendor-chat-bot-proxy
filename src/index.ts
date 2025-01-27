export default {
	async fetch(request: Request) {
		// URL внешнего сервера
		const externalUrl = "https://generativelanguage.googleapis.com";

		// Формирование полного URL для запроса
		const url = new URL(request.url);
		const proxiedUrl = externalUrl + url.pathname + url.search;

		try {
			// Проксирование запроса
			const proxiedRequest = new Request(proxiedUrl, {
				method: request.method,
				headers: request.headers,
				body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
			});

			// Выполнение запроса к внешнему API
			const response = await fetch(proxiedRequest);

			// Возврат ответа клиенту
			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			});
		} catch (error: unknown) {
			if (!(error instanceof Error)) {
				return;
			}
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { "Content-Type": "application/json" },
			});
		}
	},
};
