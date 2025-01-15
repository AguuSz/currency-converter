import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
	try {
		console.log("Fetching ARS Tarjeta rate from cronista.com");
		const response = await fetch(
			"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSTAR"
		);
		const html = await response.text();
		console.log("HTML content length:", html.length);

		const $ = cheerio.load(html);
		const arsValue = $(
			"#market-scrll-1 li a span:nth-child(5) div:nth-child(2)"
		).text();
		console.log("Raw ARS Tarjeta value:", arsValue);
		console.log("ARS Tarjeta value length:", arsValue.length);

		const cleanValue = arsValue
			? parseFloat(arsValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;
		console.log("Cleaned ARS Tarjeta value:", cleanValue);

		return NextResponse.json({ rate: cleanValue });
	} catch (error: any) {
		console.error("Error fetching ARS Tarjeta rate:", error);
		console.error("Error details:", {
			name: error.name,
			message: error.message,
			stack: error.stack,
		});
		return NextResponse.json({ rate: 0 });
	}
}
