import { Handler } from "@netlify/functions";
import * as cheerio from "cheerio";

export const handler: Handler = async (event) => {
	const path = event.path.replace("/.netlify/functions/api/", "");
	console.log("Processing request for path:", path);

	try {
		let rate = 0;
		let response;
		let $;
		let html;

		switch (path) {
			case "usd-rate":
				console.log("Fetching USD rate from dolaronline.cl");
				response = await fetch("https://www.dolaronline.cl/");
				html = await response.text();
				console.log("USD HTML content length:", html.length);
				$ = cheerio.load(html);
				const usdValue = $("#vlr-cambios div span:nth-child(4)").text();
				console.log("Raw USD value:", usdValue);
				console.log("USD value length:", usdValue.length);
				rate = usdValue
					? parseFloat(
							usdValue.replace("$", "").replace(".", "").replace(",", ".")
					  )
					: 0;
				console.log("Cleaned USD value:", rate);
				break;

			case "ars-rate":
				console.log("Fetching ARS rate from cronista.com");
				response = await fetch(
					"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSMEP"
				);
				html = await response.text();
				console.log("ARS HTML content length:", html.length);
				$ = cheerio.load(html);
				const arsValue = $(
					"#market-scrll-1 li a span:nth-child(4) div:nth-child(2)"
				).text();
				console.log("Raw ARS value:", arsValue);
				console.log("ARS value length:", arsValue.length);
				rate = arsValue
					? parseFloat(
							arsValue.replace("$", "").replace(".", "").replace(",", ".")
					  )
					: 0;
				console.log("Cleaned ARS value:", rate);
				break;

			case "ars-tarjeta-rate":
				console.log("Fetching ARS Tarjeta rate from cronista.com");
				response = await fetch(
					"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSTAR"
				);
				html = await response.text();
				console.log("ARS Tarjeta HTML content length:", html.length);
				$ = cheerio.load(html);
				const arsTarjetaValue = $(
					"#market-scrll-1 li a span:nth-child(5) div:nth-child(2)"
				).text();
				console.log("Raw ARS Tarjeta value:", arsTarjetaValue);
				console.log("ARS Tarjeta value length:", arsTarjetaValue.length);
				rate = arsTarjetaValue
					? parseFloat(
							arsTarjetaValue
								.replace("$", "")
								.replace(".", "")
								.replace(",", ".")
					  )
					: 0;
				console.log("Cleaned ARS Tarjeta value:", rate);
				break;
		}

		return {
			statusCode: 200,
			body: JSON.stringify({ rate }),
		};
	} catch (error) {
		console.error(`Error fetching ${path}:`, error);
		if (error instanceof Error) {
			console.error("Error details:", {
				name: error.name,
				message: error.message,
				stack: error.stack,
			});
		}
		return {
			statusCode: 200,
			body: JSON.stringify({ rate: 0 }),
		};
	}
};
