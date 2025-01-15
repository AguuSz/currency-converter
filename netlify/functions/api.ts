import { Handler } from "@netlify/functions";
import * as cheerio from "cheerio";

export const handler: Handler = async (event) => {
	const path = event.path.replace("/.netlify/functions/api/", "");

	try {
		let rate = 0;
		let response;
		let $;

		switch (path) {
			case "usd-rate":
				response = await fetch("https://www.dolaronline.cl/");
				$ = cheerio.load(await response.text());
				const usdValue = $("#vlr-cambios div span:nth-child(4)").text();
				rate = usdValue
					? parseFloat(
							usdValue.replace("$", "").replace(".", "").replace(",", ".")
					  )
					: 0;
				break;

			case "ars-rate":
				response = await fetch(
					"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSMEP"
				);
				$ = cheerio.load(await response.text());
				const arsValue = $(
					"#market-scrll-1 li a span:nth-child(4) div:nth-child(2)"
				).text();
				rate = arsValue
					? parseFloat(
							arsValue.replace("$", "").replace(".", "").replace(",", ".")
					  )
					: 0;
				break;

			case "ars-tarjeta-rate":
				response = await fetch(
					"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSTAR"
				);
				$ = cheerio.load(await response.text());
				const arsTarjetaValue = $(
					"#market-scrll-1 li a span:nth-child(5) div:nth-child(2)"
				).text();
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

		return {
			statusCode: 200,
			body: JSON.stringify({ rate }),
		};
	} catch (error) {
		console.error(`Error fetching ${path}:`, error);
		return {
			statusCode: 200,
			body: JSON.stringify({ rate: 0 }),
		};
	}
};
