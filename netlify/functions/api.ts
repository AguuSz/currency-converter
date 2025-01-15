import { chromium } from "playwright-core";
import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
	const path = event.path.replace("/.netlify/functions/api/", "");
	let browser;

	try {
		browser = await chromium.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			headless: true,
		});

		const page = await browser.newPage();
		let rate = 0;

		switch (path) {
			case "usd-rate":
				await page.goto("https://www.dolaronline.cl/", {
					waitUntil: "networkidle",
				});
				const usdValue = await page
					.locator('//*[@id="vlr-cambios"]/div/span[4]')
					.textContent();
				rate = usdValue
					? parseFloat(
							usdValue.replace("$", "").replace(".", "").replace(",", ".")
					  )
					: 0;
				break;

			case "ars-rate":
				await page.goto(
					"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSMEP",
					{ waitUntil: "networkidle" }
				);
				const arsValue = await page
					.locator('//*[@id="market-scrll-1"]/li/a/span[4]/div[2]')
					.textContent();
				rate = arsValue
					? parseFloat(
							arsValue.replace("$", "").replace(".", "").replace(",", ".")
					  )
					: 0;
				break;

			case "ars-tarjeta-rate":
				await page.goto(
					"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSTAR",
					{ waitUntil: "networkidle" }
				);
				const arsTarjetaValue = await page
					.locator('//*[@id="market-scrll-1"]/li/a/span[5]/div[2]')
					.textContent();
				rate = arsTarjetaValue
					? parseFloat(
							arsTarjetaValue
								.replace("$", "")
								.replace(".", "")
								.replace(",", ".")
					  )
					: 0;
				break;
		}

		await browser.close();
		return {
			statusCode: 200,
			body: JSON.stringify({ rate }),
		};
	} catch (error) {
		console.error(`Error fetching ${path}:`, error);
		if (browser) await browser.close();
		return {
			statusCode: 200,
			body: JSON.stringify({ rate: 0 }),
		};
	}
};
